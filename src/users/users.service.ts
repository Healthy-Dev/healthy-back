import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UsersService {
    private readonly users: User[];

    constructor() {}
    async findOne(username: string): Promise<User | undefined> {
        return this.users.find(user => user.username === username);
    }
} 
