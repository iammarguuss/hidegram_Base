import { IsString } from 'class-validator';

export class CreateLinkDto {
  @IsString()
  code: string;
  validationPhraseEnabled?: boolean;
  ttl?: number;
}
