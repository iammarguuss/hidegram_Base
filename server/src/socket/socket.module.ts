import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';
import { MessageModule } from 'src/message/message.module';
import { LinkModule } from 'src/link/link.module';

@Module({
  imports: [
    MessageModule,
    LinkModule,
    CacheModule.register({
      ttl: 1000 * 60 * 60 * 24, // 24 hours
    }),
  ],
  providers: [SocketGateway, SocketService],
})
export class SocketModule {}
