import {
  Controller,
  Get,
  UseGuards,
  Put,
  Body,
  ValidationPipe
} from '@nestjs/common';
import { UsersService } from './users.service';
import { GetUser } from '../auth/get-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('v1/users/me')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@GetUser() { username }: User): Promise<{ user: {} }> {
    return this.userService.getUser(username);
  }

  @Put('v1/users/me')
  @UseGuards(AuthGuard('jwt'))
  async changePassword(
    @GetUser() { username }: User,
    @Body(
      new ValidationPipe({
        whitelist: true,
      }),
    )
    updateData: UpdateUserDto,
  ): Promise<{ message: string }> {
    return this.userService.updateUser(updateData, username);
  }
}
