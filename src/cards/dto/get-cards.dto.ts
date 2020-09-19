import { IsOptional, IsNumber, IsString, IsIn, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
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
  @IsPositive({ message: 'Healthy Dev te pide que no dejes el id del creador vacío' })
  creatorId: number;

  @IsOptional()
  @IsNumber({}, { message: 'Healthy Dev te pide que el id de la categoría sea numérico' })
  @Type(() => Number)
  @IsPositive({ message: 'Healthy Dev te pide que no dejes el id de la categoría vacío' })
  categoryId: number;
}
