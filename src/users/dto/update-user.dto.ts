import { IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty({message: 'Healthy Dev te pide que no dejes el título vacío.'})
  name: string;

  @IsOptional()
  @IsNotEmpty({message: 'Healthy Dev te pide que no dejes la foto vacía.'})
  profilePhoto: string;

  @IsOptional()
  @IsNotEmpty({message: 'Healthy Dev te pide que no dejes el link de twitter vacío.'})
  twitter: string;

  @IsOptional()
  @IsNotEmpty({message: 'Healthy Dev te pide que no dejes el link de instagram vacío.'})
  instagram: string;
}
