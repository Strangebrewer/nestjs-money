import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request as Req } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { TransformUserDataPipe } from 'src/users/pipes/transform-user-data.pipe';
import { ValidateUserDataPipe } from 'src/users/pipes/validate-user-data.pipe';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) { }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req: Req) {
    const { token } = this.authService.getToken(req.user);
    return { user: req.user, token };
  }

  @Post('register')
  async register(
    @Body(ValidateUserDataPipe, TransformUserDataPipe) createUserDto: CreateUserDto,
    @Request() req: Req
  ) {
    return await this.usersService.create(createUserDto);
  }
}
