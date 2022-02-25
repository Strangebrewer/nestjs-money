import { Module } from '@nestjs/common';
import { BillsService } from './bills.service';
import { BillsController } from './bills.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Bill, BillSchema } from './entities/bill.entity';
import { AccountsModule } from 'src/accounts/accounts.module';

@Module({
  providers: [BillsService],
  controllers: [BillsController],
  imports: [
    AccountsModule,
    MongooseModule.forFeature([
      {
        name: Bill.name,
        schema: BillSchema
      }
    ])
  ],
  exports: [BillsService]
})
export class BillsModule {}
