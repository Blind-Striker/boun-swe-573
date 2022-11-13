import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  _id: string;

  @AutoMap()
  @Prop({ required: true })
  userName: string;

  @AutoMap()
  @Prop({ required: true })
  firstName: string;

  @AutoMap()
  @Prop({ required: true })
  lastName: string;

  @AutoMap()
  @Prop({ required: true })
  email: string;

  @AutoMap()
  @Prop({ required: true })
  password: string;

  @AutoMap()
  createdAt?: Date;

  @AutoMap()
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
