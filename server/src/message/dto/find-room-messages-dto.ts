import { IsNumber, IsString } from 'class-validator';

export class FindRoomMessagesDto {
  @IsString()
  chat_id: number;

  @IsNumber()
  skey: number;
}
