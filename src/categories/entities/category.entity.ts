import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Template } from "src/templates/entities/template.entity";
import { User } from "src/users/entities/user.entity";

@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ ref: Template.name })
  template: string;

  @Prop({ required: true, ref: User.name })
  user: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
