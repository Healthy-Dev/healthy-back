import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

export type User = any;

@Injectable()
export class UsersService {
  private readonly users: User[];

  constructor() {
    // test users, until db is connected

    this.users = [
      {
        userId: 1,
        username: 'john',
        password: 'changeme',
      },
      {
        userId: 2,
        username: 'chris',
        password: 'secret',
      },
      {
        userId: 3,
        username: 'maria',
        password: 'guess',
      },
    ];
    this.users.forEach(user => {
      this.hashPassword(user.password).then(cryptPass => {
        user.password = cryptPass;
      });
    });
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
}
