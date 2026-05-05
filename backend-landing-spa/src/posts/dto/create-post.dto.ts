import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { PostStatus } from '../schemas/post.schema';

export class CreatePostDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  @MinLength(1, { message: 'Title must be at least 1 character' })
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  title: string;

  @IsNotEmpty({ message: 'Content is required' })
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  featuredImage?: string;

  @IsNotEmpty({ message: 'Category is required' })
  @IsString()
  @MinLength(1, { message: 'Category must be at least 1 character' })
  @MaxLength(50, { message: 'Category must not exceed 50 characters' })
  category: string;

  @IsNotEmpty({ message: 'Status is required' })
  @IsEnum(PostStatus, {
    message: 'Status must be one of: draft, published',
  })
  status: PostStatus;

  @IsOptional()
  @IsDateString({}, { message: 'Invalid date format' })
  publishedAt?: string;
}
