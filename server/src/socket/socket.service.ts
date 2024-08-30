import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class SocketService {
  private readonly connectedClients: Map<string, Socket> = new Map();

  handleConnection(socket: Socket): void {
    this.connectedClients.set(socket.id, socket);
  }

  handleDisconnect(socket: Socket): void {
    this.connectedClients.delete(socket.id);
  }
}
