import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { NewPasswordDto } from 'src/auth/dto/new-password.dto';

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

  async getUserByUsernameOrEmail(usernameOrEmail: string): Promise<User> {
    return await this.userRepository.getUserByUsernameOrEmail(usernameOrEmail);
  }

  async createUser(createUserDto: CreateUserDto): Promise<{ id: number }> {
    const { profilePhoto } = createUserDto;
    let photoUrl =
      'http://res.cloudinary.com/du7xgj6ms/image/upload/v1589734759/placeholder.jpg';
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

  async getUser(username: string): Promise<{user: {}}> {
    const profile = await this.getUserByUsername(username);
    if (!profile) {
      throw new UnauthorizedException('Verifique los datos ingresados');
    }
    return {
      user: {
        id: profile.id,
        email: profile.email,
        username: profile.username,
        name: profile.name,
        profilePhoto: profile.profilePhoto,
        twitter: profile.twitter,
        instagram: profile.instagram,
        status: profile.status,
        role: profile.role
      }
    }
  }

  async updateUser(
    updateData: UpdateUserDto,
    username: string,
  ): Promise<{ message: string }> {
    if (updateData.profilePhoto) {
      let { profilePhoto } = await this.userRepository.findOne({username})
      if(profilePhoto) {
        const strUrl = profilePhoto.split('/');
        let imagePublicId = '';
        strUrl.forEach(item => {
          if(item.match(/(.*)\.jpg/gm)){
            imagePublicId = item.split('.')[0];
          }
        })
        if(imagePublicId !== 'placeholder') {
          await cloudinary.uploader.destroy(imagePublicId, {resource_type: 'image'}, (res: any, error: any) => {
            if(error.result != 'ok') {
              throw new Error(error.result);
            }
          })
        }
      }
      await cloudinary.uploader.upload(
        `data:image/jpg;base64,${updateData.profilePhoto}`,
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
          updateData.profilePhoto = response.url;
        },
      );
    }
    return this.userRepository.updateUser(updateData, username);
  }

  async changePassword(
    newPassword: NewPasswordDto,
    username: string,
  ): Promise<{ message: string }> {
    return this.userRepository.changePassword(newPassword, username);
  }
}
