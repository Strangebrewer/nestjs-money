import {
  ArgumentMetadata,
  forwardRef,
  Inject,
  Injectable,
  PipeTransform
} from "@nestjs/common";
import slugify from "slugify";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class TransformUserDataPipe implements PipeTransform {
  constructor(@Inject(forwardRef(() => AuthService)) private readonly authService: AuthService) { }

  transform(value: any, metadata: ArgumentMetadata) {
    if (value.email) {
      value.normalizedEmail = value.email.toLowerCase();
    }

    if (value.username) {
      const trimmed = slugify(value.username, ' ').trim();
      value.username = trimmed;
      value.normalizedUsername = slugify(trimmed, { lower: true })
    }

    if (value.password) {
      value.password = this.authService.hashPassword(value.password);
    }

    return value;
  }
}