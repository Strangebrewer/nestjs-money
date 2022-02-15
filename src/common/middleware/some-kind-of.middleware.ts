import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class SomeKindOfMiddleware implements NestMiddleware {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  use(req: any, res: any, next: () => void) {
    console.log('req.body in SomeKindOfMiddleware:::', req.body);
    console.log('req.headers in SomeKindOfMiddleware:::', req.headers);
    // This won't have access to req.user - it hasn't been added yet;
    next();
  }
}