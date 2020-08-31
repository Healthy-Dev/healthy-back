import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  name: string;

  @IsOptional()
  photo: string;

  @IsOptional()
  twitter: string;

  @IsOptional()
  instagram: string;
}
