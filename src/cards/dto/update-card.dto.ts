import { IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateCardDto {
  @IsOptional()
  @IsNotEmpty({message: 'Healthy Dev te pide que no dejes el título vacío.'})
  title: string;

  @IsOptional()
  @IsNotEmpty({message: 'Healthy Dev te pide que no dejes la descripción vacío.'})
  description: string;

  @IsOptional()
  @IsNotEmpty({message: 'Healthy Dev te pide que no dejes la foto vacía.'})
  photo: string;

  @IsOptional()
  @IsNotEmpty({message: 'Healthy Dev te pide que no dejes el link vacío.'})
  externalUrl: string;
}
