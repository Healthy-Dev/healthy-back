import {
  Controller,
  Post,
  UseGuards,
  Body,
  ValidationPipe,
  Get,
  Req,
  Query,
  HttpStatus,
  Res,
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
import { Request, Response } from 'express';

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
  async verifyAccount(@Query(ValidationPipe) query: TokenDto): Promise<{ message: string }> {
    return this.authService.verifyAccount(query.token);
  }

  @Get('/v1/auth/resend-verification/')
  async resendVerificationAccount(
    @Body(ValidationPipe) emailDto: EmailDto,
  ): Promise<{ message: string }> {
    return this.authService.resendVerificationAccount(emailDto.email);
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

  @Get('v1/auth/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(@Req() req, @Res() res: Response): Promise<void> {
    const userData = req.user.user;
    return this.authService.socialLoginAuth(userData, res)
  }

  @Get('v1/auth/google')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response): Promise<void> {
    return this.authService.socialLoginAuth(req.user, res)
  }
}
