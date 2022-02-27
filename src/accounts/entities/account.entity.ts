import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { User } from "src/users/entities/user.entity";

@Schema({ timestamps: true })
export class Account extends Document {
  @Prop({ required: true, enum: ['asset', 'debt'], default: 'debt' })
  accountType: string;

  @Prop({ required: true, default: 0 })
  balance: number;

  @Prop()
  description: string;

  @Prop({ required: true, default: 'New Account' })
  name: string;

  @Prop({ required: true, enum: ['active', 'closed'], default: 'active' })
  status: string;

  @Prop({ required: true, ref: User.name })
  user: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
