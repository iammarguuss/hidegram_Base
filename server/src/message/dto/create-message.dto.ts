import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  chat_id: number;

  @IsString()
  nickname: string;

  message: Buffer;

  @IsNumber()
  skey: number;

  @IsOptional()
  @IsNumber()
  algo?: number;
}
