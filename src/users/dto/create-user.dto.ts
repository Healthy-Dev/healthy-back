import {
  Length,
  IsString,
  Matches,
  IsEmail,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Healthy Dev te pide que ingreses un email válido' })
  email: string;

  @IsString({
    message: 'Healthy Dev te pide que nombre de usuario sea alfabético',
  })
  @Length(4, 20, {
    message:
      'Healthy Dev te pide que nombre de usuario posea entre 4 y 20 caracteres',
  })
  @Matches(/^((?![\s@]).)*$/, {
    message:
      'Healthy Dev te pide que el nombre de usuario no posea "@" ni espacios',
  })
  username: string;

  @Matches(/^(?!.*\s)(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,250}$/, {
    message:
      'Healthy Dev te pide que el password contenga al menos una mayúscula, una minúscula y un número, sin espacios. Largo entre 8 y 250 caracteres',
  })
  password: string;
}
