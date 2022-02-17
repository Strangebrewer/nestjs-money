import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AccountsModule } from './accounts/accounts.module';
import { CommonModule } from './common/common.module';
import { TransactionsModule } from './transactions/transactions.module';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    AccountsModule,
    UsersModule,
    CommonModule,
    TransactionsModule,
    MongooseModule.forRoot('mongodb://localhost:27017/nest-money'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
