import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookingDocument = Booking & Document;

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true })
export class Booking {
  @Prop({ required: true, minlength: 1, maxlength: 100 })
  customerName: string;

  @Prop({ required: false })
  email?: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  service: string;

  @Prop({ required: true, type: Date })
  preferredDate: Date;

  @Prop({ required: true })
  preferredTime: string;

  @Prop({
    required: true,
    enum: Object.values(BookingStatus),
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Prop()
  notes?: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

// Add indexes for efficient querying
BookingSchema.index({ createdAt: -1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ preferredDate: 1 });
