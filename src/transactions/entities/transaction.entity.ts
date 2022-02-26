import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as Skeema } from "mongoose";
import { Bill } from "src/bills/entities/bill.entity";
import { User } from "src/users/entities/user.entity";
import { Account } from "../../accounts/entities/account.entity";

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop({ required: true })
  amount: number;
  
  @Prop({ ref: Bill.name })
  bill: string;;
  
  // @Prop({ ref: Category.name })
  // category: string;

  @Prop({ required: true, default: new Date() })
  date: Date;

  @Prop()
  description: string;

  @Prop({ ref: Account.name })
  destination: string;
  
  @Prop({ ref: Account.name })
  source: string;
  
  @Prop({ required: true, enum: ['expense', 'deposit'], default: 'expense' })
  transactionType: string;
  
  @Prop({ required: true, ref: User.name })
  user: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
