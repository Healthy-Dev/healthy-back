import { IsOptional, IsNumber, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { getAllowedCategories, CardCategories } from '../card-categories';
export class GetCardsFilterDto {
  @IsOptional()
  @IsNumber({}, { message: 'Healthy Dev te pide que el limit sea numérico' })
  @Type(() => Number)
  limit: number = 15;

  @IsOptional()
  @IsNumber({}, { message: 'Healthy Dev te pide que el offset sea numérico' })
  @Type(() => Number)
  offset: number = 0;

  @IsOptional()
  @IsString({ message: 'Healthy Dev te pide que ingreses texto en la búsqueda' })
  search: string;

  @IsOptional()
  @IsNumber({}, { message: 'Healthy Dev te pide que el id de creador sea numérico' })
  @Type(() => Number)
  creatorId: number;

  @IsOptional()
  @IsIn(getAllowedCategories(), {
    message:
      'Healthy Dev te pide que ingreses una categoría válida (' +
      getAllowedCategories().toString() +
      ')',
  })
  category: CardCategories;
}
