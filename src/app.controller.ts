import { Controller, Delete, Get, Param } from '@nestjs/common';
import { AccountsService } from './accounts/accounts.service';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly accountsService: AccountsService,
    private readonly usersService: UsersService
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // for convenience while developing:
  @Get('all/:type')
  async getAll(@Param('type') type: string) {
    switch (type) {
      case 'accounts':
        return this.accountsService.findAll();
      case 'users':
        return this.usersService.findAll();
      default:
        return [];
    }
  }

  // for convenience while developing:
  @Delete('all/:type')
  async deleteAll(@Param('type') type: string) {
    console.log('type:::', type);
    switch (type) {
      case 'all':
        return Promise.all([
          this.accountsService.deleteAll(),
          this.usersService.deleteAll()
        ]);
      case 'accounts':
        return this.accountsService.deleteAll();
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
