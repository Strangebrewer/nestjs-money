import { Body, Injectable, Param, Request } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request as Req } from 'express';
import { Model } from 'mongoose';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account.name) private readonly accountModel: Model<Account>
  ) { }

  findAll() {
    return this.accountModel.find();
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
}
