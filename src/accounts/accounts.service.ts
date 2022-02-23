import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTransactionDto } from 'src/transactions/dto/create-transaction.dto';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account.name) private readonly accountModel: Model<Account>
  ) { }

  findAll(userId: string) {
    return this.accountModel.find({ user: userId });
  }

  findOne(id: string) {
    return this.accountModel.findById(id);
  }

  create(createAccountDto: CreateAccountDto) {
    return this.accountModel.create(createAccountDto);
  }

  update(id: string, updateAccountDto: UpdateAccountDto) {
    return this.accountModel.findByIdAndUpdate(id, updateAccountDto, { new: true });
  }

  remove(_id: string) {
    return this.accountModel.deleteOne({ _id });
  }

  deleteAll() {
    console.log('running AccountsService.deleteAll()');
    return this.accountModel.deleteMany({});
  }

  getCount() {
    return this.accountModel.count();
  }

  async adjustSourceBalance(tx: CreateTransactionDto | Transaction, reverse?: boolean): Promise<Account> {
    let sourceAccount = await this.accountModel.findOne({ _id: tx.source });
    if (!sourceAccount)
      throw new NotFoundException('Could not find source account');

    if (sourceAccount && sourceAccount.accountType === 'asset') {
      if (reverse) return this.add(sourceAccount, tx.amount);
      return this.subtract(sourceAccount, tx.amount);
    }

    if (sourceAccount && sourceAccount.accountType === 'debt') {
      if (reverse) return this.subtract(sourceAccount, tx.amount);
      return this.add(sourceAccount, tx.amount);
    }
  }

  async adjustDestinationBalance(tx: CreateTransactionDto | Transaction, reverse?: boolean): Promise<Account> {
    let destinatinAccount = await this.accountModel.findOne({ _id: tx.destination });
    if (!destinatinAccount)
      throw new NotFoundException('Could not find destination account');

    if (destinatinAccount.accountType === 'asset') {
      if (reverse) return this.subtract(destinatinAccount, tx.amount);
      return this.add(destinatinAccount, tx.amount);
    }

    if (destinatinAccount.accountType === 'debt') {
      if (reverse) return this.add(destinatinAccount, tx.amount);
      return this.subtract(destinatinAccount, tx.amount);
    }
  }

  private async subtract(account: Account, amount: number): Promise<Account> {
    const newBalance = account.balance - amount;
    account.balance = newBalance;
    return await account.save();
  }

  private async add(account: Account, amount: number): Promise<Account> {
    const newBalance = account.balance + amount;
    account.balance = newBalance;
    return await account.save();
  }
}
