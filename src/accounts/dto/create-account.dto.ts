import { IsNumber, IsString } from "class-validator";

export class CreateAccountDto {
  @IsString()
  accountType: string;

  @IsNumber()
  balance: number;

  @IsString()
  name: string;

  @IsString()
  status: string;

  @IsString()
  user: string;
}
