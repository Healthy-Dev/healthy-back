import { Type } from 'class-transformer';
import {
  IsBase64,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsUrl,
  IsPositive,
  MinLength,
} from 'class-validator';

export class CreateCardDto {
  @IsNotEmpty({ message: 'Healthy Dev te pide que no dejes el título vacío' })
  @IsString({ message: 'Healthy Dev te pide que ingreses texto en el título.' })
  title: string;

  @IsNotEmpty({ message: 'Healthy Dev te pide que no dejes la descripción vacía.' })
  @IsString({ message: 'Healthy Dev te pide que ingreses texto en la descripción.' })
  @MinLength(100, { message: 'Healthy Dev te pide que la descripción contenga al menos 100 caracteres.'})
  description: string;

  @IsOptional()
  @IsBase64({
    message: 'Healthy Dev te pide que la foto sea codificada en base64 como formato válido.',
  })
  photo: string;

  @IsNumber({}, { message: 'Healthy Dev te pide que el id de la categoría sea numérico' })
  @Type(() => Number)
  @IsPositive({ message: 'Healthy Dev te pide que no dejes el id de la categoría vacío' })
  categoryId: number;

  @IsOptional()
  @IsUrl({}, { message: 'Healthy Dev te pide que ingreses una url válida en la url externa.' })
  externalUrl: string;
}
