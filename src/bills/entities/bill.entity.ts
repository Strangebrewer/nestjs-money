import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as Skeema } from "mongoose";
import { Account } from "src/accounts/entities/account.entity";
import { User } from "src/users/entities/user.entity";

@Schema({ timestamps: true })
export class Bill extends Document {
  @Prop({ required: true })
  amount: number;

  // @Prop({ ref: Category.name })
  // category: string;

  @Prop()
  description: string;

  @Prop({ ref: Account.name })
  destination: string;

  @Prop()
  dueDay: string;

  @Prop()
  dueMonth: string;

  @Prop()
  name: string;

  @Prop({ enum: ['yearly', 'monthly'], default: 'monthly' })
  period: string;
  
  @Prop({ ref: Account.name })
  source: string;

  @Prop({ required: true, enum: ['active', 'inactive'], default: 'active' })
  status: string;
  
  @Prop({ required: true, ref: User.name })
  user: string;
}

export const BillSchema = SchemaFactory.createForClass(Bill);

