import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Account } from "src/accounts/entities/account.entity";
import { User } from "src/users/entities/user.entity";

@Schema({ timestamps: true })
export class Template extends Document {
  @Prop({ required: true })
  amount: number;

  @Prop({ ref: "Category" })
  category: string;

  @Prop()
  description: string;

  @Prop({ ref: Account.name })
  destination: string;

  @Prop({ required: true })
  name: string;

  @Prop({ Ref: Account.name })
  source: string;

  @Prop({ required: true, enum: ['expense', 'deposit'], default: 'expense' })
  transactionType: string;

  @Prop({ required: true, ref: User.name })
  user: string;
}

export const TemplateSchema = SchemaFactory.createForClass(Template);
