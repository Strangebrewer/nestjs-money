import {
  ArgumentMetadata,
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  PipeTransform
} from "@nestjs/common";
import slugify from "slugify";
import { UsersService } from "../users.service";

@Injectable()
export class ValidateUserDataPipe implements PipeTransform {
  constructor(@Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService) { }

  async transform(value: any, metadata: ArgumentMetadata) {
    if (value.email) {
      const test = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value.email);
      if (!test) {
        throw new BadRequestException('That is not a valid email.');
      }

      const emailTaken = await this.usersService.findByEmail(value.email);
      if (emailTaken) {
        throw new ConflictException('That email address has already been used.');
      }
    }

    if (value.username) {
      let test = /^[A-Za-z0-9\s]*$/.test(value.username);
      if (!test) {
        throw new BadRequestException('Usernames must be letters, numbers, and spaces only');
      }

      const userTaken = await this.usersService.findByUsername(value.username);
      if (userTaken) {
        throw new ConflictException('That username is already taken.');
      }
    }

    return value;
  }
}