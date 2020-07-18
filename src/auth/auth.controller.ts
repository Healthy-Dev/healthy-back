import { Controller, Request, Post, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('v1/auth/signin')
    async login(@Request() req) {
      return this.authService.login(req.user);
    }
  
    @Get('v1/users/me')
    getProfile(@Request() req) {
      return req.user;
    }
}
