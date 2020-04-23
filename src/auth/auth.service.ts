import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const isValidUser = await this.usersService.findOne(username);
    if (
      isValidUser &&
      (await this.validatePassword(pass, isValidUser.password))
    ) {
      const { password, ...result } = isValidUser;
      return result;
    }
    return null;
  }

  async validatePassword(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, userPassword);
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
