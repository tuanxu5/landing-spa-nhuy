import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AdministratorDocument = Administrator & Document;

@Schema({ timestamps: true })
export class Administrator {
  @Prop({ required: true, unique: true, minlength: 3, maxlength: 50 })
  username: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true })
  email: string;

  @Prop({ type: Date })
  lastLoginAt?: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const AdministratorSchema = SchemaFactory.createForClass(Administrator);

// Add unique index on username for login
AdministratorSchema.index({ username: 1 }, { unique: true });
