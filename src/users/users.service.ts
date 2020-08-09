import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';

const cloudinary = require('cloudinary').v2;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: UserRepository,
  ) {}

  async getUserByUsername(username: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ username });
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ email });
  }

  async createUser(createUserDto: CreateUserDto): Promise<{ id: number }> {
    const { profilePhoto } = createUserDto;
    let photoUrl =
      'http://res.cloudinary.com/du7xgj6ms/image/upload/v1589734759/tcu6xvx0hh62iyys05fs.jpg';
    if (profilePhoto) {
      await cloudinary.uploader.upload(
        `data:image/jpg;base64,${profilePhoto}`,
        {
          format: 'jpg',
          resource_type: 'image',
          width: 500,
          height: 500,
          crop: 'limit',
          background: '#03111F',
        },
        (error: any, response: any) => {
          if (error) {
            throw error;
          }
          photoUrl = response.url;
        },
      );
    }
    return this.userRepository.createUser(createUserDto, photoUrl);
  }
}
