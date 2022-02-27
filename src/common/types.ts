import { Account } from "src/accounts/entities/account.entity";
import { Transaction } from "src/transactions/entities/transaction.entity";

export type CreateTransactionReturn = {
  destination?: Account;
  source?: Account;
  transaction?: Transaction;
}