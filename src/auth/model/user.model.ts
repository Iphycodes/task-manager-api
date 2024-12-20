import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Exclude } from 'class-transformer';

@Schema({
  timestamps: true,
  //   toJSON: {
  //     transform: (_, ret) => {
  //       // Explicitly convert _id to string
  //       ret._id = ret._id.toString();
  //       delete ret.__v;
  //       delete ret.password;
  //       return ret;
  //     },
  //   },
})
export class User extends Document {
  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @Prop({ required: true })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Exclude() // Prevents password from being serialized
  password: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// UserSchema.methods.getStringId = function () {
//   return this._id.toString();
// };
