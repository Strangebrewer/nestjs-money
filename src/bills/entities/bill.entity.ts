import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as Skeema } from "mongoose";
import { Account } from "src/accounts/entities/account.entity";
import { User } from "src/users/entities/user.entity";

export class Bill extends Document {
  @Prop({ required: true })
  amount: number;

  // @Prop({ type: Skeema.Types.ObjectId, ref: Category.name })
  // category: Skeema.Types.ObjectId;

  @Prop()
  description: string;

  @Prop({ ref: Account.name, type: Skeema.Types.ObjectId })
  destination: Skeema.Types.ObjectId | Account;

  @Prop()
  dueDay: string;

  @Prop()
  dueMonth: string;

  @Prop()
  name: string;

  @Prop({ enum: ['yearly', 'monthly'], default: 'monthly' })
  period: string;
  
  @Prop({ ref: Account.name, type: Skeema.Types.ObjectId })
  source: Skeema.Types.ObjectId | Account;

  @Prop({ required: true, enum: ['active', 'inactive'], default: 'active' })
  status: string;
  
  @Prop({ required: true, ref: User.name })
  user: Skeema.Types.ObjectId;
}

export const BillSchema = SchemaFactory.createForClass(Bill);

