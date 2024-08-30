import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';
import { MessageModule } from 'src/message/message.module';

@Module({
  imports: [MessageModule],
  providers: [SocketGateway, SocketService],
})
export class SocketModule {}
