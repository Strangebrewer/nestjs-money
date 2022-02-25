import { PartialType } from "@nestjs/mapped-types";
import { CreateTransactionDto } from "src/transactions/dto/create-transaction.dto";

export class UpdateBillDto extends PartialType(CreateTransactionDto) {}
