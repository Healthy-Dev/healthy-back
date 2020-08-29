import { IsNotEmpty, Length } from 'class-validator';
import { IsString, Matches } from 'class-validator';

export class AuthCredentialsDto {
  @IsNotEmpty()
  @IsString()
  @Length(4, 100)
  usernameOrEmail: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?!.*\s)(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,250}$/)
  password: string;
}
