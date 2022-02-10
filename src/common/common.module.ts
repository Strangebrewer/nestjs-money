import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AddUserIdMiddleware } from './middleware/add-user-id.middleware';

@Module({})
export class CommonModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AddUserIdMiddleware).forRoutes(
      { path: 'accounts', method: RequestMethod.POST }
    )
  }
}
