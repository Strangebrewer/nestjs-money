import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as Skeema } from "mongoose";
import { User } from "src/users/entities/user.entity";
import { Account } from "../../accounts/entities/account.entity";

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop({ required: true })
  amount: number;
  
  // @Prop({ ref: Bill.name })
  // bill: Skeema.Types.ObjectId;
  
  // @Prop({ ref: Category.name })
  // category: Skeema.Types.ObjectId;

  @Prop({ required: true, default: new Date() })
  date: Date;

  @Prop()
  description: string;

  @Prop({ ref: Account.name, type: Skeema.Types.ObjectId })
  destination: Skeema.Types.ObjectId | Account;
  
  @Prop({ ref: Account.name, type: Skeema.Types.ObjectId })
  source: Skeema.Types.ObjectId | Account;
  
  @Prop({ required: true, enum: ['expense', 'deposit'], default: 'expense' })
  transactionType: string;
  
  @Prop({ required: true, ref: User.name })
  user: Skeema.Types.ObjectId;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
