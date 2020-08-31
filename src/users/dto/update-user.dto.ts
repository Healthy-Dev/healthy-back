import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  name: string;

  @IsOptional()
  profilePhoto: string;

  @IsOptional()
  twitter: string;

  @IsOptional()
  instagram: string;
}
