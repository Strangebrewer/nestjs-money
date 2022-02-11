import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(username: string, givenPassword: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && this.checkPassword(givenPassword, user.password)) {
      const { password, ...rest } = user;
      return rest;
    }
    return null;
  }

  getToken(user: any) {
    const payload = { username: user.username, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload)
    }
  }

  checkPassword(given: string, original: string): boolean {
    return bcrypt.compareSync(given, original);
  }

  hashPassword(plainTextPassword: string): string {
    return bcrypt.hashSync(plainTextPassword, bcrypt.genSaltSync(10));
  }
}
