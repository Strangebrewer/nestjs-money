import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    UsersModule,
    MongooseModule.forRoot('mongodb://localhost:27017/nest-money'),
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
