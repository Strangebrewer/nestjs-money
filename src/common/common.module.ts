import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { SomeKindOfMiddleware } from './middleware/some-kind-of.middleware';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema
      }
    ])
  ],
})
export class CommonModule {
  configure(consumer: MiddlewareConsumer) {
    // a middle ware for all POST routes, for example
    consumer.apply(SomeKindOfMiddleware).forRoutes(
      { path: "*", method: RequestMethod.POST },
    )
  }
}
