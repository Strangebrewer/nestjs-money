import { IsNumber, IsString } from "class-validator";

export class CreateTemplateDto {
  @IsNumber()
  amount: number;

  @IsString()
  category?: string;

  @IsString()
  description?: string;

  @IsString()
  destination?: string;

  @IsString()
  name: string;

  @IsString()
  source?: string;

  @IsString()
  transactionType: string;

  @IsString()
  user: string;
}
