import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Request,
  UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { Request as Req } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidateUserDataPipe } from './pipes/validate-user-data.pipe';
import { TransformUserDataPipe } from './pipes/transform-user-data.pipe';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  getCurrentUser(@Request() req: Req) {
    return this.usersService.getCurrentUser(req.user);
  }

  @Get('all')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body(ValidateUserDataPipe, TransformUserDataPipe) updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto, id)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
