import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountsModule } from 'src/accounts/accounts.module';
import { BillsModule } from 'src/bills/bills.module';
import { Transaction, TransactionSchema } from './entities/transaction.entity';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
  providers: [TransactionsService],
  controllers: [TransactionsController],
  imports: [
    AccountsModule,
    BillsModule,
    MongooseModule.forFeature([
      {
        name: Transaction.name,
        schema: TransactionSchema
      }
    ])
  ],
})
export class TransactionsModule { }
