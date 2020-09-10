import {
  PipeTransform,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UserStatus } from '../user-status.enum';
import { User } from 'src/users/user.entity';

export class UserActiveValidationPipe implements PipeTransform {
  transform(user: User) {
    if (user.status === UserStatus.INACTIVO) {
      throw new UnauthorizedException(
        'Healthy dev le informa que debe activar la cuenta por email primero.',
      );
    }
    if (user.status === UserStatus.BANEADO) {
      throw new UnauthorizedException(
        'Healthy dev le informa que su cuenta se encuentra en revisión.',
      );
    }

    if (user.status !== UserStatus.ACTIVO) {
      throw new BadRequestException(
        `Healthe dev no reconoce el estado "${status}" como un estado del usuario no válido`,
      );
    }
    return user;
  }
}
