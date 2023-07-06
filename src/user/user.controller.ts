import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ZodValidationPipe } from "nestjs-zod";
import { ServiceGuard } from "src/auth/auth-service.guard";
import { UserService } from "./user.service";
import {
  AskResetPasswordApiBody,
  AskResetPasswordApiResponse,
  AskResetPasswordDto,
  AskResetPasswordResponse,
  ConfirmAccountApiBody,
  ConfirmAccountDto,
  ConfirmAccountResponse,
  CreateUserDto,
  GetUserDto,
  LoginUserDto,
  LoginUserResponseDto,
  ResetPasswordApiBody,
  ResetPasswordDto,
  UpdateEmailUserDto,
  UpdateUserDto,
  UserApiReponse,
  UserDto,
} from "./users.schema";

@ApiHeader({
  name: "x-service-auth",
  description: "Token d'authentification pour les services Nest",
}) // ajoute une description de l'en-tête x-service-auth
@Controller("user")
@ApiTags("Users controller")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("login")
  @ApiBearerAuth("x-service-auth")
  @UseGuards(ServiceGuard)
  @ApiBody({
    type: LoginUserDto,
  })
  @ApiResponse({
    status: 200,
    description: "User logged in successfully",
    type: LoginUserResponseDto,
  })
  async login(@Body(ZodValidationPipe) data: LoginUserDto) {
    return await this.userService.login(data);
  }

  @Post("register")
  async create(@Body(ZodValidationPipe) data: CreateUserDto) {
    return await this.userService.createUser(data);
  }

  @Post("confirm-account")
  @UseGuards(ServiceGuard)
  @ApiBody({
    type: ConfirmAccountApiBody,
    description: "Confirm user's account with email token",
  })
  @ApiResponse({
    status: 200,
    description: "Account confirmed successfully",
    type: Boolean,
  })
  async confirmAccount(
    @Body(ZodValidationPipe) confirmAccountDto: ConfirmAccountDto
  ): ConfirmAccountResponse {
    return await this.userService.confirmAccountUser(
      confirmAccountDto.email_token
    );
  }

  @Post("ask-reset-password")
  @UseGuards(ServiceGuard)
  @ApiBody({
    type: AskResetPasswordApiBody,
    description: "Ask for a password reset",
  })
  @ApiResponse({
    status: 200,
    description: "Password reset asked successfully, returns email token",
    type: AskResetPasswordApiResponse,
  })
  async askResetPassword(
    @Body(ZodValidationPipe) askResetPasswordDto: AskResetPasswordDto
  ): AskResetPasswordResponse {
    return await this.userService.askResetPassword(askResetPasswordDto.email);
  }

  @Patch("reset-password")
  @UseGuards(ServiceGuard)
  @ApiBody({
    type: ResetPasswordApiBody,
    description: "Reset user's password",
  })
  @ApiResponse({
    status: 200,
    description: "Password reset successfully",
    type: UserApiReponse,
  })
  async resetPassword(
    @Body(ZodValidationPipe) resetPasswordDto: ResetPasswordDto
  ): Promise<UserDto> {
    return await this.userService.resetPasswordUser(
      resetPasswordDto.email_token,
      resetPasswordDto.password
    );
  }

  @Get()
  async findAll() {
    return await this.userService.getUsers();
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: GetUserDto) {
    return await this.userService.getUser({ id: +id });
  }

  @Patch(":id")
  @UseGuards(ServiceGuard)
  @ApiBearerAuth()
  async update(
    @Param("id", ParseIntPipe) id: GetUserDto,
    @Body(ZodValidationPipe) data: UpdateUserDto
  ) {
    return await this.userService.updateUser({ ...data, id: +id });
  }

  @Patch(":id/password")
  @UseGuards(ServiceGuard)
  @ApiBearerAuth()
  async updatePassword(
    @Param("id", ParseIntPipe) id: GetUserDto,
    @Body() data: UpdatePasswordUserDto
  ) {
    return await this.userService.updatePasswordUser({ ...data, id: +id });
  }

  @Patch(":id/email")
  @UseGuards(ServiceGuard)
  @ApiBearerAuth()
  async updateEmail(
    @Param("id", ParseIntPipe) id: GetUserDto,
    @Body(ZodValidationPipe) data: UpdateEmailUserDto
  ) {
    return await this.userService.updateEmailUser({ ...data, id: +id });
  }

  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: string) {
    return await this.userService.removeUser({ id: +id });
  }
}
