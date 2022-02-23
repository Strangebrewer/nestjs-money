import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ITokenized, UsersService } from './users.service';
import { Request as Req } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidateUserDataPipe } from './pipes/validate-user-data.pipe';
import { TransformUserDataPipe } from './pipes/transform-user-data.pipe';
import { User } from 'src/common/decorators/user.decorator';
import { User as UserEntity } from './entities/user.entity';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  getCurrentUser(@User() user: UserEntity): Promise<ITokenized> {
    return this.usersService.getCurrentUser(user.id);
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
