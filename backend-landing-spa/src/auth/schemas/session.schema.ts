import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SessionDocument = Session & Document;

@Schema({ timestamps: true })
export class Session {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Administrator' })
  administratorId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  token: string;

  @Prop({ required: true, type: Date })
  expiresAt: Date;

  @Prop({ required: true, type: Date, default: () => new Date() })
  lastActivityAt: Date;

  @Prop()
  createdAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);

// Add unique index on token for lookup
SessionSchema.index({ token: 1 }, { unique: true });

// Add TTL index on expiresAt for automatic cleanup
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
