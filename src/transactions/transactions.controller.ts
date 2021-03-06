import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AccountsService } from 'src/accounts/accounts.service';
import { Account } from 'src/accounts/entities/account.entity';
import { BillsService } from 'src/bills/bills.service';
import { User } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { User as UserEntity } from 'src/users/entities/user.entity';
import { BillTransactionQueryDto } from './dto/bill-transaction-query.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionsService } from './transactions.service';
import { PopulatedDoc } from 'mongoose';
import { Bill } from 'src/bills/entities/bill.entity';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly billsService: BillsService,
    private readonly accountsService: AccountsService
  ) { }

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
  @Post('pay-bill/:billId')
  async createFromBill(
    @Query() billTxQueryDto: BillTransactionQueryDto,
    @Param('billId') billId: string,
    @Body() createTransactionDto: Partial<CreateTransactionDto>
  ) {
    let bill = await this.billsService.findOne(billId).lean();
    bill = { ...bill, ...createTransactionDto };
    return this.transactionsService.createFromBill(bill, billTxQueryDto);
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
