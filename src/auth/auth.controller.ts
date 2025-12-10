// src/auth/auth.controller.ts

import { Controller, Post, Body, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { username: string; password: string }) {
    this.logger.log(`POST /auth/login - Username: ${loginDto.username}`);
    return this.authService.login(loginDto.username, loginDto.password);
  }
}