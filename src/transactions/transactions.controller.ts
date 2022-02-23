import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { User as UserEntity } from 'src/users/entities/user.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@User() user: UserEntity) {
    return this.transactionsService.findAll(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }


  @UseGuards(JwtAuthGuard)
  @Post('from-template/:templateId')
  createFromTemplate(
    @Param('templateId') templateId: string,
    @Body() createTransactionDto: CreateTransactionDto
  ) {
    console.log('templateId:::', templateId);
    // TODO: once the template module is ready
    //  look up the template, call this.transactionsService.mergeTemplateIntoTransaction
    //  then send it to the create method
    return this.transactionsService.create(createTransactionDto);
  }


  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionsService.update(id, updateTransactionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(id);
  }
}
