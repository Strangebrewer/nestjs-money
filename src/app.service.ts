import { Inject, Injectable } from '@nestjs/common';
import { AccountsService } from './accounts/accounts.service';

@Injectable()
export class AppService {
  constructor(@Inject(AccountsService) private readonly accountsService: AccountsService) {}

  getHello(): string {
    return 'Hello World!';
  }
}
