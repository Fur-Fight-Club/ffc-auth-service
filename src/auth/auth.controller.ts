import { Controller, HttpCode, HttpStatus, Post, Get, Request, UseGuards, Body, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JWTServiceRequest } from './auth.model';
import { ServiceGuard } from './auth-service.guard';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginRequest, UserApi, UserResponse } from 'src/api/auth/user/user.interface';

@Controller('auth')
@ApiTags("Authentication")
export class AuthController {
  constructor(private readonly authService: AuthService, @Inject(UserApi) private userApi: UserApi) { }

  @HttpCode(HttpStatus.OK)
  @Post('login-service')
  // FOR TESTING PURPOSES ONLY — TO BE REMOVED
  signinService() {
    return this.authService.signinService();
  }

  @ApiBearerAuth()
  @ApiHeader({
    name: 'x-service-auth',
    description: 'Token d\'authentification pour les services Nest',
  }) // ajoute une description de l'en-tête x-service-auth
  @UseGuards(ServiceGuard)
  @Get('login-service')
  // FOR TESTING PURPOSES ONLY — TO BE REMOVED
  loginService(
    @Request() req: JWTServiceRequest,
  ) {
    return req.service;
  }

  @ApiBody({
    description: "Un utilisateur se connecte",
    type: LoginRequest
  })
  @ApiResponse({
    description: "L'utilisateur est connecté",
    type: UserResponse
  })
  @Post('login')
  async login(
    @Body() body: LoginRequest
  ) {
    return await this.userApi.login(body.email, body.password);
  }
}
