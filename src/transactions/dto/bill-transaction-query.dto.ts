import { IsBoolean, IsOptional, IsString } from "class-validator";

export class BillTransactionQueryDto {
  @IsString()
  month: string;

  @IsString()
  year: string;

  @IsOptional()
  @IsBoolean()
  edited: boolean;
}
