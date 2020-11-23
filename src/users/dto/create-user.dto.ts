import { Length, IsString, Matches, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Healthy Dev te pide que ingreses un email válido' })
  email: string;

  @IsString({ message: 'Healthy Dev te pide que ingreses texto en el nombre de usuario.' })
  @Matches(/(?=^.{4,20}$)^[a-zA-Z]+[a-zA-Z\-\_0-9.]+[a-zA-Z0-9]+$/, {
    message: 'Healthy Dev te pide que comiences con una letra, puede contener letras y números, y punto, guion medio, guion bajo en medio, en el nombre de usuario. Largo de 4 a 20.',
  })
  username: string;

  @Matches(/^(?!.*\s)(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,250}$/, {
    message:
      'Healthy Dev te pide que el password contenga al menos una mayúscula, una minúscula y un número, sin espacios. Largo entre 8 y 250 caracteres',
  })
  password: string;
}
