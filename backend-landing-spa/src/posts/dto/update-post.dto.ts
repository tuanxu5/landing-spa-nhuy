import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { PostStatus } from '../schemas/post.schema';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Title must be at least 1 character' })
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  featuredImage?: string;

  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Category must be at least 1 character' })
  @MaxLength(50, { message: 'Category must not exceed 50 characters' })
  category?: string;

  @IsOptional()
  @IsEnum(PostStatus, {
    message: 'Status must be one of: draft, published',
  })
  status?: PostStatus;

  @IsOptional()
  @IsDateString({}, { message: 'Invalid date format' })
  publishedAt?: string;
}
