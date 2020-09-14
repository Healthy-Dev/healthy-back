import { Type } from 'class-transformer';
import {
  IsOptional,
  IsNotEmpty,
  IsBase64,
  IsString,
  IsNumber,
  IsUrl,
  IsPositive,
} from 'class-validator';

export class UpdateCardDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Healthy Dev te pide que no dejes el título vacío.' })
  @IsString({ message: 'Healthy Dev te pide que ingreses texto en el título.' })
  title: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Healthy Dev te pide que no dejes la descripción vacío.' })
  @IsString({ message: 'Healthy Dev te pide que ingreses texto en la descripción.' })
  description: string;

  @IsOptional()
  @IsBase64({
    message: 'Healthy Dev te pide que la foto sea codificada en base64 como formato válido.',
  })
  photo: string;

  @IsOptional()
  @IsUrl({}, { message: 'Healthy Dev te pide que ingreses una url válida en la url externa.' })
  externalUrl: string;

  @IsOptional()
  @IsNumber({}, { message: 'Healthy Dev te pide que el id de la categoría sea numérico' })
  @Type(() => Number)
  @IsPositive({ message: 'Healthy Dev te pide que no dejes el id de la categoría vacío' })
  categoryId: number;
}
