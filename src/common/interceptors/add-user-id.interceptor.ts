import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";

@Injectable()
export class AddUserIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const includedUrls = ['accounts', 'bills', 'categories', 'templates', 'transactions'];

    if (includedUrls.includes(request.url.substring(1)) && request.method === 'POST') {
      console.log('request.user:::', request.user);
      const { user } = request as any;
      request.body.user = user.id;
    }
    
    return next.handle();
  }
}