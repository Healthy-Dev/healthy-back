import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayloadBase, JwtPayload } from './jwt-payload.interface';
import { User } from '../../users/user.entity';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(public usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { username, iat } = payload;
    const user = await this.usersService.getUserByUsername(username);
    const iatDate =  new Date(iat * 1000);
    if (!user) {
      throw new UnauthorizedException();
    }
    if (user.passwordChangedAt && iatDate < user.passwordChangedAt){
      throw new UnauthorizedException('Healthy le informa que se ha modificado su contraseña, por favor ingrese nuevamente');
    }
    return user;
  }
}
