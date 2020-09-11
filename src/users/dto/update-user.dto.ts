import { IsOptional, IsNotEmpty, IsBase64, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  name: string;

  @IsOptional()
  @IsBase64({
    message:
      'Healthy Dev te pide que la foto de perfil sea codificada en base64 como formato válido.',
  })
  profilePhoto: string;

  @IsOptional()
  @IsString({ message: 'Healthy Dev te pide que ingreses texto en la cuenta de twitter.' })
  twitter: string;

  @IsOptional()
  @IsString({ message: 'Healthy Dev te pide que ingreses texto en la cuenta de instagram.' })
  instagram: string;
}
