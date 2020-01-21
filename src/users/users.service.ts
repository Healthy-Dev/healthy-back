import { Injectable } from '@nestjs/common';

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
    }
    async findOne(username: string): Promise<User | undefined> {
        return this.users.find(user => user.username === username);
    }
} 
