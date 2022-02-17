import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountsModule } from 'src/accounts/accounts.module';
import { AccountsService } from 'src/accounts/accounts.service';
import { Transaction, TransactionSchema } from './entities/transaction.entity';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
  controllers: [TransactionsController],
  imports: [
    AccountsModule,
    MongooseModule.forFeature([
      {
        name: Transaction.name,
        schema: TransactionSchema
      }
    ])
  ],
  providers: [TransactionsService]
})
export class TransactionsModule { }
