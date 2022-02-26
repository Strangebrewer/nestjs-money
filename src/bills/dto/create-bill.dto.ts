import { IsNumber, IsString } from "class-validator";

export class CreateBillDto {
  @IsNumber()
  amount: number;

  @IsString()
  description: string;

  @IsString()
  destination?: string;

  @IsString()
  dueDay: string;

  @IsString()
  dueMonth?: string;

  @IsString()
  name: string;

  @IsString()
  period: string;
  
  @IsString()
  source: string;

  @IsString()
  status: string;
  
  @IsString()
  user: string;
}
