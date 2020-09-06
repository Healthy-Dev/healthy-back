import { IsOptional } from 'class-validator';

export class UpdateCardDto {
  @IsOptional()
  title: string;

  @IsOptional()
  description: string;

  @IsOptional()
  photo: string;

  @IsOptional()
  externalUrl: string;
}
