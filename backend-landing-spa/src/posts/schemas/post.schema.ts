import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

// Category is now a free-text string instead of enum
export type PostCategory = string;

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true, minlength: 1, maxlength: 200 })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  featuredImage?: string;

  @Prop({
    required: true,
    type: String,
    maxlength: 50,
  })
  category: string;

  @Prop({
    required: true,
    enum: Object.values(PostStatus),
    default: PostStatus.DRAFT,
  })
  status: PostStatus;

  @Prop({ type: Date })
  publishedAt?: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);

// Add indexes for efficient querying
PostSchema.index({ publishedAt: -1 });
PostSchema.index({ category: 1, status: 1 });
