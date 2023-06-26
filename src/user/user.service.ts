import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import { PrismaService } from "src/services/prisma.service";
import { generateUUID } from "src/utils/functions.utils";
import { password as passwordUtils } from "src/utils/password.utils";
import { UsersRepository } from "./user.repository";
import {
  AskResetPasswordResponse,
  ConfirmAccountResponse,
  ConfirmChangeEmailResponse,
  ConfirmChangePasswordResponse,
  CreateUserDto,
  GetUserDto,
  LoginUserDto,
  LoginUserResponseDto,
  UpdateEmailUserDto,
  UpdatePasswordUserDto,
  UpdateUserDto,
  UserDto,
  UserRole,
} from "./users.schema";

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private repository: UsersRepository
  ) {}

  async login(body: LoginUserDto): Promise<LoginUserResponseDto> {
    const { email, password } = body;
    const user = await this.repository.getUser({
      where: {
        email,
      },
    });

    if (!user || !user.is_email_verified) {
      throw new NotFoundException("User not found");
    }

    const isPasswordValid = await passwordUtils.verify(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return this.authService.generateUserToken(user.id, user.role as UserRole);
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
    const { firstname, lastname, email, password: passwordDto } = createUserDto;
    const password = await passwordUtils.hash(passwordDto);
    const email_token = generateUUID();
    const existingUser = await this.repository.getUser({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new ConflictException("L'email est déjà utilisé");
    }

    const user = await this.repository.createUser({
      data: {
        firstname,
        lastname,
        email,
        password,
        role: "USER",
        email_token,
        Wallet: {
          create: {
            amount: 0,
          },
        },
      },
    });
    return user;
  }

  async getUsers(): Promise<UserDto[]> {
    const users = await this.repository.getUsers({});

    return users.filter((user) => {
      delete user.password;
      return user;
    });
  }

  async getUser(params: GetUserDto): Promise<UserDto> {
    const { id } = params;
    const user = await this.repository.getUser({
      where: {
        id,
      },
    });
    delete user.password;
    return user;
  }

  async updateUser(updateUserDto: UpdateUserDto): Promise<UserDto> {
    const { id, firstname, lastname, email, role, email_token } = updateUserDto;

    const user = await this.repository.updateUser({
      where: {
        id,
      },
      data: {
        firstname: firstname,
        lastname: lastname,
        email: email,
        role: role,
        email_token: email_token,
      },
    });

    delete user.password;
    return user;
  }

  async removeUser(params: GetUserDto): Promise<UserDto> {
    const { id } = params;
    const user = await this.repository.deleteUser({
      where: {
        id,
      },
    });

    return user;
  }

  async confirmAccountUser(email_token: string): ConfirmAccountResponse {
    const user = await this.repository.getUser({
      where: {
        email_token: email_token,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const confirmedUser = await this.repository.updateUser({
      where: {
        email_token: email_token,
      },
      data: {
        email_token: null,
        is_email_verified: true,
      },
    });

    if (!confirmedUser) {
      throw new InternalServerErrorException("Error while confirming user");
    }

    return true;
  }

  async askResetPassword(email: string): AskResetPasswordResponse {
    const user = await this.repository.getUser({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const updatedUser = await this.repository.updateUser({
      where: {
        email: email,
      },
      data: {
        email_token: generateUUID(),
      },
    });

    if (!updatedUser) {
      throw new InternalServerErrorException(
        "Error while asking reset password"
      );
    }

    return {
      email_token: updatedUser.email_token,
    };
  }

  async resetPasswordUser(
    email_token: string,
    updatedPassword: string
  ): Promise<UserDto> {
    const user = await this.repository.getUser({
      where: {
        email_token: email_token,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const updatedUser = await this.repository.updateUser({
      where: {
        email_token: email_token,
      },
      data: {
        password: await passwordUtils.hash(updatedPassword),
        email_token: null,
      },
    });

    if (!updatedUser) {
      throw new InternalServerErrorException("Error while reseting password");
    }

    delete updatedUser.password;
    return updatedUser;
  }

  async updatePasswordUser(
    updatedPassword: UpdatePasswordUserDto
  ): ConfirmChangePasswordResponse {
    const user = await this.repository.getUser({
      where: {
        id: updatedPassword.id,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Check if old password is valid
    const isPasswordValid = await passwordUtils.verify(
      updatedPassword.oldPassword,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // check if new password is different from old password
    const isNewPasswordDifferent = await passwordUtils.verify(
      updatedPassword.password,
      user.password
    );

    if (isNewPasswordDifferent) {
      throw new UnauthorizedException("New password must be different");
    }

    //update password
    const updatedUser = await this.repository.updateUser({
      where: {
        id: updatedPassword.id,
      },
      data: {
        password: await passwordUtils.hash(updatedPassword.password),
      },
    });

    if (!updatedUser) {
      throw new InternalServerErrorException("Error while updating password");
    }

    return true;
  }

  // update email
  async updateEmailUser(
    updatedEmail: UpdateEmailUserDto
  ): ConfirmChangeEmailResponse {
    const user = await this.repository.getUser({
      where: {
        id: updatedEmail.id,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Check if old email is different from new email
    if (user.email === updatedEmail.email) {
      throw new UnauthorizedException("New email must be different");
    }

    //update email
    const updatedUser = await this.repository.updateUser({
      where: {
        id: updatedEmail.id,
      },
      data: {
        email: updatedEmail.email,
        email_token: generateUUID(),
        is_email_verified: false,
      },
    });

    if (!updatedUser) {
      throw new InternalServerErrorException("Error while updating email");
    }

    return true;
  }
}
