import { Length, IsString, Matches, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Healthy Dev te pide que ingreses un email válido' })
  email: string;

  @IsString({ message: 'Healthy Dev te pide que ingreses texto en el nombre de usuario.' })
  @Matches(/^[a-z]+[a-z0-9]+([.][a-z0-9]+)?$/, {
    message: 'Healthy Dev te pide que comiences con una letra(a-z), puede contener letras, números (0-9) y un punto(.) en medio en el nombre de usuario',
  })
  @Length(4, 20, {
    message: 'Healthy Dev te pide que nombre de usuario posea entre 4 y 20 caracteres',
  })
  username: string;

  @Matches(/^(?!.*\s)(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,250}$/, {
    message:
      'Healthy Dev te pide que el password contenga al menos una mayúscula, una minúscula y un número, sin espacios. Largo entre 8 y 250 caracteres',
  })
  password: string;
}
