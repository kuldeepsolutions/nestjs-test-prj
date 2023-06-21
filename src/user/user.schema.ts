import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export type UserDocument = User & Document;
@Schema()
export class User {
  @Prop()
  fullname: string;
  @Prop({ lowercase: true })
  email: string;
  @Prop()
  password: string;
  @Prop({ default: Date.now() })
  createdDate: Date;
  @Prop({ default: false })
  isDeleted: boolean;
  @Prop({ default: null })
  deletedDate: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);
