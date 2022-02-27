import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { LeanDocument, Model, PopulatedDoc } from 'mongoose';
import * as mongoose from 'mongoose';
import { AccountsService } from 'src/accounts/accounts.service';
import { Bill } from 'src/bills/entities/bill.entity';
import { CreateTransactionReturn } from 'src/common/types';
import { User } from 'src/users/entities/user.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { Account } from 'src/accounts/entities/account.entity';
import { BillTransactionQueryDto } from './dto/bill-transaction-query.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private readonly transactionModel: Model<Transaction>,
    @Inject(AccountsService) private readonly accountsService: AccountsService,
    @InjectConnection() private readonly connection: mongoose.Connection
  ) { }

  // This is only for development convenience - remove later
  deleteAll() {
    console.log('running TransactionsService.deleteAll()');
    return this.transactionModel.deleteMany({});
  }

  findAll(userId: string) {
    return this.transactionModel.find({ user: userId });
  }

  findOne(id: string) {
    return this.transactionModel.findById(id);
  }

  async create(createTransactionDto: CreateTransactionDto) {
    const { category, destination, source, ...rest } = createTransactionDto;
    const txObject: CreateTransactionDto = rest;
    const toReturn: CreateTransactionReturn = {};

    if (category) txObject.category = category;
    if (destination) {
      txObject.destination = destination;
      toReturn.destination = await this.accountsService.adjustDestinationBalance(txObject);
    }
    if (source) {
      txObject.source = source;
      toReturn.source = await this.accountsService.adjustSourceBalance(txObject);
    }

    try {
      toReturn.transaction = await this.transactionModel.create(txObject);
      return toReturn;
    } catch (err) {
      if (destination) await this.accountsService.adjustDestinationBalance(txObject, true);
      if (source) await this.accountsService.adjustSourceBalance(txObject, true);
      throw new InternalServerErrorException('Something wetn wrong - please try again');
    }
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto) {
    return this.transactionModel.findByIdAndUpdate(id, updateTransactionDto, { new: true });
  }

  async remove(_id: string) {
    let found = await this.transactionModel.findOne({ _id });
    if (!found) throw new NotFoundException('Transaction not found');

    if (found.source) {
      const foundSource = await this.accountsService.adjustSourceBalance(found, true);
      found.source = foundSource._id;
    }
    if (found.destination) {
      const foundDestination = await this.accountsService.adjustDestinationBalance(found, true);
      found.destination = foundDestination._id;
    }

    try {
      await this.transactionModel.findOneAndRemove({ _id });
      return found;
    } catch (err) {
      if (found.source) await this.accountsService.adjustSourceBalance(found);
      if (found.destination) await this.accountsService.adjustDestinationBalance(found);
      throw new InternalServerErrorException('Something went wrong - please try again');
    }
  }

  mergeTemplateIntoTransaction(
    createTransactionDto: CreateTransactionDto,
    // TODO: change 'any' to 'Template' once that module is created
    template: any
  ): CreateTransactionDto {
    return { ...template, createTransactionDto };
  }

  // TODO: delete this if the merge thing works
  async createFromTemplate(
    createTransactionDto: CreateTransactionDto,
    // TODO: change 'any' to 'Template' once that module is created
    template: any
  ): Promise<CreateTransactionReturn> {
    let amount: number;
    if (template) amount = template.amount;
    else amount = createTransactionDto.amount;

    const { category, description, destination, source, transactionType } = template;
    const txObject: CreateTransactionDto = { description, transactionType, amount, ...createTransactionDto };
    const toReturn: CreateTransactionReturn = {};

    if (category) txObject.category = category;
    if (destination) {
      txObject.destination = destination;
      toReturn.destination = await this.accountsService.adjustDestinationBalance(txObject);
    }
    if (source) {
      txObject.source = source;
      toReturn.source = await this.accountsService.adjustSourceBalance(txObject);
    }

    try {
      toReturn.transaction = await this.transactionModel.create(txObject);
      return toReturn;
    } catch (err) {
      if (destination) await this.accountsService.adjustDestinationBalance(txObject, true);
      if (source) await this.accountsService.adjustSourceBalance(txObject, true);
      throw new InternalServerErrorException('Something wetn wrong - please try again');
    }
  }

  async createFromBill(
    bill: PopulatedDoc<Account & Bill>,
    query: BillTransactionQueryDto
  ) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const description = query.edited ? 'edited default payment' : 'default payment';
      const { year, month } = query;
      // const source = bill.source;
      // const originalBalance = source.balance;

      await this.accountsService.adjustSourceBalance(bill);

      // if (source.accountType === 'asset') {
      //   source.balance = originalBalance - bill.amount;
      // } else {
      //   source.balance = originalBalance + bill.amount;
      // }
      // await this.accountsService.update(source._id, source);

      const transactionData: Partial<Transaction> = {
        amount: bill.amount,
        bill: bill.id,
        date: new Date(Number(year), Number(month), parseInt(bill.dueDay)),
        description,
        source: bill.source,
        transactionType: 'expense',
        user: bill.user
      };
      if (bill.category) transactionData.category = bill.category;

      return await this.transactionModel.create(transactionData);
    } catch (err) {
      console.log('err in createFromBill:::', err);
      await session.abortTransaction();
      throw new InternalServerErrorException('Something went wrong - please try again');
    } finally {
      session.endSession();
    }
  }
}
