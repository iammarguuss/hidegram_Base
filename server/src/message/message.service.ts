import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindRoomMessagesDto } from './dto/find-room-messages-dto';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  create(createMessageDto: CreateMessageDto) {
    return this.prisma.message.create({
      data: createMessageDto,
    });
  }

  findRoomMessages(findRoomMessagesDto: FindRoomMessagesDto) {
    const { chat_id, skey } = findRoomMessagesDto;
    return this.prisma.message.findMany({
      where: { chat_id, skey },
    });
  }

  findOne(id: number) {
    return this.prisma.message.findUnique({
      where: { id },
    });
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return this.prisma.message.update({
      where: { id },
      data: updateMessageDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.message.delete({
      where: { id },
    });
  }
}
