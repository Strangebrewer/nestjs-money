import { Controller, Delete, Get, Param } from '@nestjs/common';
import { AccountsService } from './accounts/accounts.service';
import { AppService } from './app.service';
import { BillsService } from './bills/bills.service';
import { CategoriesService } from './categories/categories.service';
import { TemplatesService } from './templates/templates.service';
import { TransactionsService } from './transactions/transactions.service';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly accountsService: AccountsService,
    private readonly billsService: BillsService,
    private readonly categoriesService: CategoriesService,
    private readonly templatesService: TemplatesService,
    private readonly transactionsService: TransactionsService,
    private readonly usersService: UsersService
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // for convenience while developing:
  @Delete('all/:type')
  async deleteAll(@Param('type') type: string) {
    switch (type) {
      case 'all':
        return Promise.all([
          this.accountsService.deleteAll(),
          this.billsService.deleteAll(),
          this.categoriesService.deleteAll(),
          this.templatesService.deleteAll(),
          this.transactionsService.deleteAll(),
          this.usersService.deleteAll()
        ]);
      case 'accounts':
        return this.accountsService.deleteAll();
      case 'bills':
        return this.billsService.deleteAll();
      case 'categories':
        return this.categoriesService.deleteAll();
      case 'templates':
        return this.templatesService.deleteAll();
      case 'transactions':
        return this.transactionsService.deleteAll();
      case 'users':
        return this.usersService.deleteAll();
    }
  }

  // for convenience while developing:
  @Get('count/:type')
  getCount(@Param('type') type: string) {
    switch (type) {
      case 'accounts':
        return this.accountsService.getCount();
      case 'users':
        return this.usersService.getCount();
    }
  }
}
