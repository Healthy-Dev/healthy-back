import {
  Controller,
  Post,
  UseGuards,
  Body,
  ValidationPipe,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ValidationError } from 'class-validator';
import { UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { NewPasswordDto } from './dto/new-password.dto';
import { GetUser } from './get-user.decorator';
import { User } from '../users/user.entity';
import { TokenDto } from './dto/token.dto';
import { EmailDto } from './dto/resend-verification.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('v1/auth/signup')
  async singUp(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signUp(createUserDto);
  }

  @Post('v1/auth/verify/')
  async verifyAccount(@Query(ValidationPipe) tokenDto: TokenDto): Promise<{ message: string }> {
    return this.authService.verifyAccount(tokenDto);
  }

  @Get('/v1/auth/resend-verification/:email')
  async resendVerificationAccount(
    @Param(ValidationPipe) emailDto: EmailDto,
  ): Promise<{ message: string }> {
    return this.authService.resendVerificationAccount(emailDto);
  }

  @Get('/v1/auth/forgot-password/:email')
  async forgotPassword(@Param(ValidationPipe) emailDto: EmailDto): Promise<{ message: string }> {
    return this.authService.forgotPassword(emailDto);
  }

  @Post('v1/auth/reset-password')
  public async resetPassword(
    @Body(
      new ValidationPipe({
        whitelist: true,
      }),
    )
    newPassword: NewPasswordDto,
    @Query(ValidationPipe) tokenDto: TokenDto,
  ): Promise<{ message: string }> {
    return this.authService.resetPassword(newPassword, tokenDto);
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

  @Post('v1/auth/new-password')
  @UseGuards(AuthGuard('jwt'))
  public async changePassword(
    @GetUser() { username }: User,
    @Body(
      new ValidationPipe({
        whitelist: true,
      }),
    )
    newPassword: NewPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.changePassword(newPassword, username);
  }
}
