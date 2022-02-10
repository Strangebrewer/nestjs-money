import { ArgumentMetadata, Inject, Injectable, PipeTransform, Req, Request } from "@nestjs/common";
import { Request as Fuquest } from "express";

@Injectable()
export class AddUserIdPipe implements PipeTransform {
  // constructor(@Inject(Request) private readonly req) {}

  transform(value: any, metadata: ArgumentMetadata) {
      // console.log('this.req.user:::', this.req.user);
      // console.log('this.req:::', this.req);
      // console.log('metadata:::', metadata);
      return value;
  }
}