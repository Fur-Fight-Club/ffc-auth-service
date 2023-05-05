import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto, LoginUserResponseDto } from './dto/login-user.dto';
import { UserDto, UserRole } from './dto/user.dto';
import { PrismaService } from 'src/services/prisma.service';
import { password } from 'src/utils/password.utils';
import { AuthService } from 'src/auth/auth.service';
import { generateUUID } from 'src/utils/functions.utils';
import { AskResetPasswordResponse, ConfirmAccountResponse } from './users.schema';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService, private readonly authService: AuthService) { }

  async login(loginUserDto: LoginUserDto): Promise<LoginUserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginUserDto.email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await password.verify(loginUserDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.authService.generateUserToken(user.id, user.role as UserRole);
  }

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const user = await this.prisma.user.create({
      data: {
        firstname: createUserDto.firstname,
        lastname: createUserDto.lastname,
        email: createUserDto.email,
        password: await password.hash(createUserDto.password),
        role: "USER",
        email_token: generateUUID()
      },
    });

    return {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role as UserRole,
      password: "redacted",
      email_token: user.email_token
    };
  }

  async findAll(): Promise<UserDto[]> {
    const users = await this.prisma.user.findMany();

    return users.map((user) => {
      return {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role as UserRole,
        password: "redacted",
        email_token: user.email_token
      };
    });
  }

  async findOne(id: number): Promise<UserDto> {

    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role as UserRole,
      password: "redacted",
      email_token: user.email_token
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserDto> {
    const { firstname, lastname, email, password, role, email_token } = updateUserDto;
    const user = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
        role: role,
        email_token: email_token
      },
    });

    return {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role as UserRole,
      password: "redacted",
      email_token: user.email_token
    };
  }

  remove(id: number): boolean {
    const user = this.prisma.user.delete({
      where: {
        id: id,
      },
    });
    return true;

  }

  async confirmAccount(email_token: string): ConfirmAccountResponse {
    const user = await this.prisma.user.findUnique({
      where: {
        email_token: email_token,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const confirmedUser = await this.prisma.user.update({
      where: {
        email_token: email_token,
      },
      data: {
        email_token: null
      },
    });

    if (!confirmedUser) {
      throw new InternalServerErrorException('Error while confirming user');
    }

    return true;
  }

  async askResetPassword(email: string): AskResetPasswordResponse {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        email: email,
      },
      data: {
        email_token: generateUUID()
      },
    });

    if (!updatedUser) {
      throw new InternalServerErrorException('Error while asking reset password');
    }

    return {
      email_token: updatedUser.email_token
    };
  }


}
