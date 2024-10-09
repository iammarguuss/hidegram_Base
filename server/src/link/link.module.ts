import { Module } from '@nestjs/common';
import { LinkService } from './link.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [LinkService],
  exports: [LinkService],
})
export class LinkModule {}
