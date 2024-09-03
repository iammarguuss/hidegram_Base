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

@WebSocketGateway({
  // TODO cors origin
  cors: {
    origin: '*',
  },
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly connectedClients: Map<string, Socket[]> = new Map();

  constructor(
    private messageService: MessageService,
    private readonly socketService: SocketService,
  ) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('messages:send')
  async handleSendMessage(
    client: Socket,
    payload: CreateMessageDto,
  ): Promise<void> {
    await this.messageService.create(payload);
    const messages = await this.messageService.findRoomMessages(payload);
    const connected =
      this.connectedClients.get(`${payload.skey}.${payload.chat_id}`) || [];

    connected.forEach((socket) => {
      this.server.in(socket.id).emit('messages', { id: socket.id, messages });
    });
  }

  @SubscribeMessage('messages:get')
  async handleMessagesGet(
    client: Socket,
    payload: FindRoomMessagesDto,
  ): Promise<void> {
    const messages = await this.messageService.findRoomMessages(payload);
    const connected =
      this.connectedClients.get(`${payload.skey}.${payload.chat_id}`) || [];

    connected.forEach((socket) => {
      this.server.in(socket.id).emit('messages', { id: socket.id, messages });
    });
  }

  async afterInit() {
    console.log('Init');
  }

  handleDisconnect(socket: Socket) {
    this.socketService.handleDisconnect(socket);
    Object.entries(this.connectedClients).forEach(([key, value]) => {
      const result = value.filter((item) => item.id !== socket.id);
      this.connectedClients.set(key, result);
    });
  }

  async handleConnection(socket: Socket) {
    this.socketService.handleConnection(socket);

    const chat_id = socket.handshake.query.chatId;
    const skey = socket.handshake.query.skey;

    const messages = await this.messageService.findRoomMessages({
      chat_id: +chat_id,
      skey: +skey,
    });

    const connected = this.connectedClients.get(`${skey}.${chat_id}`) || [];
    this.connectedClients.set(`${skey}.${chat_id}`, [...connected, socket]);

    this.server.in(socket.id).emit('onConnect', { id: socket.id });

    connected.forEach((socket) => {
      this.server.in(socket.id).emit('messages', { id: socket.id, messages });
    });

    // this.server.on('disconnect', function () {
    //   console.log('handleDisconnect socket.id: ', socket.id);
    //   this.server.in(socket.id).emit('onDisconnect', { id: socket.id });
    // });
  }
}
