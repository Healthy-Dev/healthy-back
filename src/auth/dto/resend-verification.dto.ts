import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Healthy Dev te pide que ingreses un email válido' })
  email: string;
}
