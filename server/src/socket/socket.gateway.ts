import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

import { CreateMessageDto } from 'src/message/dto/create-message.dto';
import { MessageService } from 'src/message/message.service';
import { SocketService } from './socket.service';
import { FindRoomMessagesDto } from 'src/message/dto/find-room-messages-dto';
import { LinkService } from 'src/link/link.service';
import { CreateLinkDto } from 'src/link/dto/create-link.dto';
import { Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { generateNanoId, generateSHA256Hash } from 'utils';

const CHAT_DATA_KEY = 'chat_data_key';
const PACKAGE_KEY = 'package_key';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(SocketGateway.name);
  private readonly connectedClients: Map<string, Socket[]> = new Map();

  @WebSocketServer() server: Server;

  constructor(
    private messageService: MessageService,
    private linkService: LinkService,
    private readonly socketService: SocketService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @SubscribeMessage('messages:send')
  async handleSendMessage(
    client: Socket,
    payload: CreateMessageDto,
  ): Promise<void> {
    try {
      await this.messageService.create(payload);
      const messages = await this.messageService.findRoomMessages(payload);
      this.broadcastToRoom(payload, 'messages', { messages });
    } catch (error) {
      this.logger.error('Error sending message:', error);
    }
  }

  @SubscribeMessage('messages:get')
  async handleMessagesGet(
    client: Socket,
    payload: FindRoomMessagesDto,
  ): Promise<void> {
    try {
      const messages = await this.messageService.findRoomMessages(payload);
      this.broadcastToRoom(payload, 'messages', { messages });
    } catch (error) {
      this.logger.error('Error getting messages:', error);
    }
  }

  async afterInit() {
    this.logger.log('WebSocket server initialized');
  }

  handleDisconnect(socket: Socket) {
    this.socketService.handleDisconnect(socket);
    this.removeClient(socket);
  }

  async handleConnection(socket: Socket) {
    this.socketService.handleConnection(socket);
    this.server.in(socket.id).emit('onConnect', { id: socket.id });

    const chat_id = socket.handshake.query.chatId as string;
    const skey = socket.handshake.query.skey as string;

    if (chat_id && skey) {
      this.addClientToRoom(socket, skey, chat_id);
      const messages = await this.messageService.findRoomMessages({
        chat_id: +chat_id,
        skey: +skey,
      });
      this.broadcastToRoom({ chat_id: +chat_id, skey: +skey }, 'messages', {
        messages,
      });
    }
  }

  @SubscribeMessage('link:check')
  async handleLinkCheck(socket: Socket, payload: CreateLinkDto): Promise<void> {
    try {
      await this.linkService.create({ code: payload.code });
      const hexString = await generateNanoId();
      const hexStringSHA = await generateSHA256Hash(hexString);
      await this.cacheManager.set(
        `${CHAT_DATA_KEY}_${payload.code}`,
        { hexString, socketId: socket.id, hexStringSHA, ttl: payload.ttl },
        { ttl: payload.ttl },
      );
      this.server.in(socket.id).emit('link:result', {
        id: socket.id,
        result: { hexStringSHA },
        error: false,
      });
    } catch (error) {
      this.logger.error('Error in link check:', error);
      this.server.in(socket.id).emit('link:retry', { error });
    }
  }

  @SubscribeMessage('package:send')
  async handlePackage(socket: Socket, payload: IPackage): Promise<void> {
    try {
      await this.cacheManager.set(`${PACKAGE_KEY}_${payload.link}`, payload, {
        ttl: payload.ttl,
      });
    } catch (error) {
      this.logger.error('Error in package send:', error);
    }
  }

  @SubscribeMessage('prevalidate')
  async prevalidate(socket: Socket, payload: { link: string }): Promise<void> {
    try {
      const packageBody = await this.cacheManager.get<IPackage>(
        `${PACKAGE_KEY}_${payload.link}`,
      );
      const data = await this.cacheManager.get<IChatData>(
        `${CHAT_DATA_KEY}_${payload.link}`,
      );
      if (data) {
        await this.cacheManager.set(
          `${CHAT_DATA_KEY}_${payload.link}`,
          { ...data, getterSocketId: socket.id },
          { ttl: data.ttl },
        );

        this.server.in(socket.id).emit('prevalidate:result', {
          packageBody,
          hexString: data.hexString,
        });
      } else {
        this.server
          .in(socket.id)
          .emit('prevalidate:result', { error: 'No data found' });
      }
    } catch (error) {
      this.logger.error('Error in prevalidate:', error);
    }
  }

  @SubscribeMessage('rsa')
  async sendRsa(
    socket: Socket,
    payload: {
      rsa: { sha512: string; encryptedAesString: string };
      link: string;
    },
  ): Promise<void> {
    try {
      const data = await this.cacheManager.get<IChatData>(
        `${CHAT_DATA_KEY}_${payload.link}`,
      );
      if (data) {
        this.server.in(data.socketId).emit('to:sender', {
          rsa: payload.rsa,
          hexString: data.hexString,
          hexStringSHA: data.hexStringSHA,
        });
      }
    } catch (error) {
      this.logger.error('Error in sendRsa:', error);
    }
  }

  @SubscribeMessage('to:getter')
  async toGetter(socket: Socket, payload: IFinalAccepterProps): Promise<void> {
    try {
      const data = await this.cacheManager.get<IChatData>(
        `${CHAT_DATA_KEY}_${payload.link}`,
      );
      if (data) {
        this.server.in(data.getterSocketId).emit('final:accepter', payload);
      }
    } catch (error) {
      this.logger.error('Error in toGetter:', error);
    }
  }

  @SubscribeMessage('last:check:from')
  async lastCheck(socket: Socket, payload: ILastCheckProps): Promise<void> {
    try {
      const data = await this.cacheManager.get<IChatData>(
        `${CHAT_DATA_KEY}_${payload.link}`,
      );

      if (data) {
        this.server.in(data.socketId).emit('last:check:to', payload);
      }
    } catch (error) {
      this.logger.error('Error in toGetter:', error);
    }
  }

  private addClientToRoom(socket: Socket, skey: string, chat_id: string) {
    const roomKey = `${skey}.${chat_id}`;
    const connected = this.connectedClients.get(roomKey) || [];
    this.connectedClients.set(roomKey, [...connected, socket]);
  }

  private broadcastToRoom(
    payload: { skey: number; chat_id: number },
    event: string,
    data: any,
  ) {
    const roomKey = `${payload.skey}.${payload.chat_id}`;
    const connected = this.connectedClients.get(roomKey) || [];
    connected.forEach((socket) => {
      this.server.in(socket.id).emit(event, { id: socket.id, ...data });
    });
  }

  private removeClient(socket: Socket) {
    for (const [key, clients] of this.connectedClients.entries()) {
      const filtered = clients.filter((client) => client.id !== socket.id);
      this.connectedClients.set(key, filtered);
    }
  }
}

interface IPackage {
  publicKey: string;
  originSha: string;
  signature: string;
  hexString: string;
  link: string;
  ttl: number;
}

interface IChatData {
  hexString: string;
  hexStringSHA: string;
  socketId: string;
  getterSocketId: string;
  ttl: number;
}

interface IEncryptDataResponseBody {
  pass: string;
  salt: number;
}

interface IFinalAccepterProps {
  encryptionResult: IEncryptDataResponseBody;
  signature: string;
  publicKey: string;
  hexStringSHA: string;
  aes: string;
  link: string;
}

interface ILastCheckProps {
  signature: string;
  link: string;
}
