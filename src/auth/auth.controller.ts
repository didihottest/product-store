import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDTO, RegisterRequestDTO } from './dto/request.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginRequestDTO,
  ): Promise<{ access_token: string }> {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterRequestDTO,
  ): Promise<{ access_token: string }> {
    return this.authService.register(registerDto);
  }
}
