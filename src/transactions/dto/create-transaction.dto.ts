import { IsDate, IsNumber, IsString } from "class-validator";

export class CreateTransactionDto {
  @IsNumber()
  amount: number;
  
  @IsString()
  bill?: string;
  
  @IsString()
  category?: string;
  
  @IsDate()
  date: Date;

  @IsString()
  description?: string;

  @IsString()
  destination?: string;
  
  @IsString()
  source?: string;
  
  @IsString()
  transactionType: string;
  
  @IsString()
  user: string;
}
