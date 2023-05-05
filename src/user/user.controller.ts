import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto, LoginUserResponseDto } from './dto/login-user.dto';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ServiceGuard } from 'src/auth/auth-service.guard';
import { ConfirmAccountApiBody, ConfirmAccountDto, ConfirmAccountResponse } from './users.schema';
import { ZodValidationPipe } from 'nestjs-zod';

@ApiHeader({
  name: 'x-service-auth',
  description: 'Token d\'authentification pour les services Nest',
}) // ajoute une description de l'en-tête x-service-auth
@Controller('user')
@ApiTags('Users controller')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post("login")
  @ApiBearerAuth("x-service-auth")
  @UseGuards(ServiceGuard)
  @ApiBody({
    type: LoginUserDto
  })
  @ApiResponse({
    status: 200,
    description: "User logged in successfully",
    type: LoginUserResponseDto
  })
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.userService.login(loginUserDto);
  }


  @Post("register")
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @UseGuards(ServiceGuard)
  @Post("confirm-account")
  @ApiBody({
    type: ConfirmAccountApiBody,
    description: "Confirm user's account with email token"
  })
  async confirmAccount(@Body(ZodValidationPipe) confirmAccountDto: ConfirmAccountDto): ConfirmAccountResponse {
    return await this.userService.confirmAccount(confirmAccountDto.email_token);
  }


  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.userService.remove(+id);
  }
}
