import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { LeanDocument, Model } from 'mongoose';
import { AccountsService } from 'src/accounts/accounts.service';
import { Account } from 'src/accounts/entities/account.entity';
import { BillsService } from 'src/bills/bills.service';
import { Bill } from 'src/bills/entities/bill.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';

type CreateTransactionReturn = {
  destination?: Account;
  source?: Account;
  transaction?: Transaction;
}

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private readonly transactionModel: Model<Transaction>,
    @Inject(AccountsService) private readonly accountsService: AccountsService
  ) { }

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
    bill: LeanDocument<Bill>,
    req: Request,
    user: User,
    createTransactionDto: Partial<CreateTransactionDto>
  ) {
    // If any fields exist in createTransactionDto, use those
    //  otherwise, use the bill
    let originalBalance: number;
    let newBalance: number;
    let transaction: Transaction;
    let sourceId = bill.source.toString();
    let transactionSource = createTransactionDto.source ? createTransactionDto.source : bill.source;
    const amount = createTransactionDto.amount ? createTransactionDto.amount : bill.amount;

    try {
      const source = await this.accountsService.findOne(sourceId);
      originalBalance = source.balance;
      const accountType = source.accountType;
      if (accountType === 'asset') {
        source.balance = originalBalance - amount;
      } else {
        source.balance = originalBalance + amount;
      }
      const saved = await source.save();
      newBalance = saved.balance;
    } catch (err) {
      if (newBalance !== originalBalance) {
        await this.accountsService.update(sourceId, { balance: originalBalance });
      }
      console.log('err in transaction.service createFromBill account update:::', err);
      throw new InternalServerErrorException('Something went wrong - please try again');
    }

    try {
      const description = req.query.edited ? 'edited default payment' : 'default payment';
      const { year, month } = req.query;
      const transactionData: Partial<Transaction> = {
        amount,
        bill: bill.id,
        date: new Date(Number(year), Number(month), parseInt(bill.dueDay)),
        description,
        source: transactionSource.toString(),
        transactionType: 'expense',
        user: user.id
      };

      // uncomment when category module is created
      // if (createTransactionDto.category) {
      //   transactionData.category = createTransactionDto.category;
      // }

      transaction = await this.transactionModel.create(transactionData);
      return transaction;
    } catch (err) {
      console.log('err in transaction.service createFromBill transaction create:::', err);
      if (!transaction || !transaction._id || transaction.bill !== bill.id) {
        await this.accountsService.update(createTransactionDto.source, { balance: originalBalance });
      }
    }
  }
}
