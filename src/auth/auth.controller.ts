import {
  Controller,
  Request,
  Post,
  Get,
  UseGuards,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ValidationError } from 'class-validator';
import { UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('v1/auth/signup')
  async singUp(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<{ id: number }> {
    return this.authService.signUp(createUserDto);
  }

  @Post('v1/auth/signin')
  async signIn(
    @Body(
      new ValidationPipe({
        exceptionFactory: (errors: ValidationError[]) => {
          throw new UnauthorizedException(
            'Healthy Dev te pide que verifiques los datos ingresados',
          );
        },
      }),
    )
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }
}
