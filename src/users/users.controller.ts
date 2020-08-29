import { Controller, Get, UseGuards, Put, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class UsersController {
  constructor(private userService: UsersService) {}
  
  @Get('v1/users/me')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(
    @GetUser() { username }: User
  ): Promise<User> {
    const profile = this.userService.getUserByUsername(username);
    return profile;
  }

  @Put('v1/users')
  @UseGuards(AuthGuard('jwt'))
  async changePassword(
    @GetUser() { username }: User,
    @Body() updateData: UpdateUserDto
  ): Promise<User> {
    return this.userService.updateUser(updateData, username);
  }
}
