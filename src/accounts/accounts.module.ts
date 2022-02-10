import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { Account, AccountSchema } from './entities/account.entity';

@Module({
  controllers: [AccountsController],
  imports: [
    MongooseModule.forFeature([
      {
        name: Account.name,
        schema: AccountSchema
      }
    ])
  ],
  providers: [AccountsService],
  exports: [AccountsService]
})
export class AccountsModule { }
