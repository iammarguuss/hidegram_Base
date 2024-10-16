import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLinkDto } from './dto/create-link.dto';

@Injectable()
export class LinkService {
  private readonly logger = new Logger(LinkService.name);
  constructor(private readonly prisma: PrismaService) {}

  create(createLinkDto: CreateLinkDto) {
    this.logger.log(`[create] - code: ${createLinkDto.code}`);

    return this.prisma.link.create({
      data: createLinkDto,
    });
  }
}
