import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { strict } from 'assert';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(
    createUserDto: CreateUserDto,
    photoUrl: string,
  ): Promise<{ id: number }> {
    const { email, username, password, name } = createUserDto;
    const user = new User();
    user.email = email;
    user.username = username;
    user.password = password;
    user.name = name;
    user.profilePhoto = photoUrl;

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        if (error.detail.includes('email')) {
          throw new ConflictException(
            'HealthyDev te informa que ya hay un usuario registrado con ese email',
          );
        }
        if (error.detail.includes('username')) {
          throw new ConflictException(
            'HealthyDev te informa que ese nombre de usuario ya esta en uso.',
          );
        }
        throw new ConflictException(error.detail);
      } else {
        throw new InternalServerErrorException();
      }
    }

    return { id: user.id };
  }
}
