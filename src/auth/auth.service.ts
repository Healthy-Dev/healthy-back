import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './strategy/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<{ id: number }> {
    const salt = await bcrypt.genSalt();
    createUserDto.password = await this.hasPassword(
      createUserDto.password,
      salt,
    );
    return this.usersService.createUser(createUserDto);
  }

  private hasPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const username = await this.validateUserPassword(authCredentialsDto);
    if (!username) {
      throw new UnauthorizedException('Verifique los datos ingresados');
    }
    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    const { usernameOrEmail, password } = authCredentialsDto;
    let user = await this.usersService.getUserByUsername(usernameOrEmail);
    if (user && (await this.validatePassword(password, user.password))) {
      return user.username;
    }
    user = await this.usersService.getUserByEmail(usernameOrEmail);
    if (user && (await this.validatePassword(password, user.password))) {
      return user.username;
    }
    return null;
  }

  async validatePassword(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, userPassword);
  }
}
