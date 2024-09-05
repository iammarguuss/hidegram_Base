import { Injectable, Logger } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindRoomMessagesDto } from './dto/find-room-messages-dto';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);
  constructor(private readonly prisma: PrismaService) {}

  create(createMessageDto: CreateMessageDto) {
    this.logger.log(
      `create - chat_id: ${createMessageDto.chat_id}, skey: ${createMessageDto.skey}, nickname: ${createMessageDto.nickname}, algo: ${createMessageDto.algo}`,
    );
    return this.prisma.message.create({
      data: createMessageDto,
    });
  }

  findRoomMessages(findRoomMessagesDto: FindRoomMessagesDto) {
    const { chat_id, skey } = findRoomMessagesDto;
    this.logger.log(`findRoomMessages - chat_id: ${chat_id}, skey: ${skey}`);
    return this.prisma.message.findMany({
      where: { chat_id, skey },
      orderBy: { created: 'asc' },
    });
  }

  findOne(id: number) {
    this.logger.log(`findOne - id: ${id}`);
    return this.prisma.message.findUnique({
      where: { id },
    });
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    this.logger.log(
      `update - id: ${id}, updateMessageDto: ${updateMessageDto}`,
    );
    return this.prisma.message.update({
      where: { id },
      data: updateMessageDto,
    });
  }

  async remove(id: number) {
    this.logger.log(`remove - id: ${id}`);
    return await this.prisma.message.delete({
      where: { id },
    });
  }
}
