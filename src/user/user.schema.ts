import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export type UserDocument = User & Document;
import { UserModel } from './user.interface';
@Schema()
export class User implements UserModel {
  @Prop()
  mobile: string;
  @Prop()
  countryCode: string;
  @Prop({ lowercase: true })
  firstName: string;
  @Prop({ lowercase: true })
  lastName: string;
  @Prop({ lowercase: true, unique: true, required: true })
  email: string;
  @Prop()
  password: string;
  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt: Date;
  @Prop()
  isDeleted: boolean;
  @Prop()
  deletedAt: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);
