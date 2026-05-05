import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

export enum PostCategory {
  SERVICE = 'service',
  PROMOTION = 'promotion',
  INFORMATION = 'information',
}

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
    enum: Object.values(PostCategory),
  })
  category: PostCategory;

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
