import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { MessageModule } from './message/message.module';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [PrismaModule, MessageModule, SocketModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
