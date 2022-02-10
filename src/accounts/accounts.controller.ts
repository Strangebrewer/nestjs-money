import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { Request as Req } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AddUserIdPipe } from 'src/common/pipes/add-user-id.pipe';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.accountsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body(AddUserIdPipe) createAccountDto: CreateAccountDto, @Request() req: any) {
    console.log('req.user:::', req.user);
    createAccountDto.user = req.user.id;
    return this.accountsService.create(createAccountDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountsService.update(id, updateAccountDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountsService.remove(id);
  }
}
