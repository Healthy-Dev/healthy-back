import { IsEmail } from 'class-validator';

export class EmailDto {
  @IsEmail({}, { message: 'Healthy Dev te pide que ingreses un email válido' })
  email: string;
}
