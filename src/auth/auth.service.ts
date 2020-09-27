import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './strategy/jwt-payload.interface';
import { NewPasswordDto } from './dto/new-password.dto';
import { Mail } from '../mail/mail.interface';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<{ accessToken: string }> {
    const { username, password } = createUserDto;
    const salt = await bcrypt.genSalt();
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
    const userId = await this.usersService.createUser(createUserDto);
    if (!userId) {
      throw new InternalServerErrorException(
        'Healthy Dev no pudo registrar su usuario en este momento, intentelo nuevamente más tarde',
      );
    }
    const authCredentialsDto: AuthCredentialsDto = { usernameOrEmail: username, password };
    return this.signIn(authCredentialsDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const username = await this.validateUserPassword(authCredentialsDto);
    if (!username) {
      throw new UnauthorizedException('Verifique los datos ingresados');
    }
    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { usernameOrEmail, password } = authCredentialsDto;
    const user = await this.usersService.getUserByUsernameOrEmail(usernameOrEmail);
    if (user && (await await bcrypt.compare(password, user.password))) {
      return user.username;
    }
    return null;
  }

  async changePassword(
    newPassword: NewPasswordDto,
    username: string,
  ): Promise<{ message: string }> {
    const salt = await bcrypt.genSalt();
    newPassword.password = await bcrypt.hash(newPassword.password, salt);
    return this.usersService.changePassword(newPassword, username);
  }
}
