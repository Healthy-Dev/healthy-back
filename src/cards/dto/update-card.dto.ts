import { IsOptional, IsNotEmpty, IsIn, IsBase64, IsString } from 'class-validator';
import { CardCategories, getAllowedCategories } from '../card-categories';

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
  @IsString({ message: 'Healthy Dev te pide que ingreses texto en la url externa.' })
  externalUrl: string;

  @IsOptional()
  @IsIn(getAllowedCategories(), {
    message: 'Healthy Dev te pide una categoría válida (' + getAllowedCategories().toString() + ')',
  })
  category: CardCategories;
}
