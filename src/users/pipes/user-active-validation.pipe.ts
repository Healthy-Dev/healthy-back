import { PipeTransform, BadRequestException, ForbiddenException } from '@nestjs/common';
import { UserStatus } from '../user-status.enum';
import { User } from '../../users/user.entity';

export class UserActiveValidationPipe implements PipeTransform {
  transform(user: User) {
    if (user.status === UserStatus.INACTIVO) {
      throw new ForbiddenException(
        'Healthy dev le informa que debe activar la cuenta por email primero.',
      );
    }
    if (user.status === UserStatus.BANEADO) {
      throw new ForbiddenException(
        'Healthy dev le informa que su cuenta se encuentra en revisión.',
      );
    }
    if (user.status !== UserStatus.ACTIVO) {
      throw new BadRequestException(
        `Healthy dev no reconoce el estado "${status}" como un estado del usuario no válido`,
      );
    }
    return user;
  }
}
