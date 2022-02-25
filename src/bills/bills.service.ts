import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { Bill } from './entities/bill.entity';

@Injectable()
export class BillsService {
  constructor(
    @InjectModel(Bill.name) private readonly billModel: Model<Bill>
  ) {}

  findAll(userId: string) {
    return this.billModel.find({ user: userId });
  }

  findOne(id: string) {
    return this.billModel.findById(id);
  }

  create(createBillDto: CreateBillDto) {
    return this.billModel.create(createBillDto);
  }

  update(id: string, updateBillDto: UpdateBillDto) {
    return this.billModel.findByIdAndUpdate(id, updateBillDto, { new: true });
  }

  remove(_id: string) {
    return this.billModel.findOneAndDelete({ _id });
  }
}
