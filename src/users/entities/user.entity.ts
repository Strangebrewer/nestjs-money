import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  normalizedUsername: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  normalizedEmail: string;

  @Prop({ required: true, enum: ['active', 'inactive', 'banned'], default: 'active' })
  status: string;

  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
