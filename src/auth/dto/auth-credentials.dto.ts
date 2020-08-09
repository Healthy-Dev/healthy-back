import { IsNotEmpty, Length } from 'class-validator';
import {
  MinLength,
  IsString,
  MaxLength,
  Matches,
  IsEmail,
} from 'class-validator';

export class AuthCredentialsDto {
  @IsNotEmpty()
  @IsString()
  @Length(4, 100)
  usernameOrEmail: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  @Matches(/^(?!.*\s)(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,250}$/)
  password: string;
}
