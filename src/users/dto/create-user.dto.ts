import { IsString } from "class-validator";

export class CreateUserDto {  
  @IsString()
  username: string;

  @IsString()
  normalizedUsername: string;

  @IsString()
  readonly email: string;

  @IsString()
  normalizedEmail: string;

  @IsString()
  readonly status: string;

  @IsString()
  password: string;
}
