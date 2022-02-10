import { Injectable } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class AddUserIdMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    next();
  }
}
