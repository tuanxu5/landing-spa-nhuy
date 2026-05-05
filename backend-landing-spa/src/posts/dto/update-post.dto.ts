import {
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  IsDateString,
} from 'class-validator';
import { PostCategory, PostStatus } from '../schemas/post.schema';

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
  @IsUrl({}, { message: 'Featured image must be a valid URL' })
  featuredImage?: string;

  @IsOptional()
  @IsEnum(PostCategory, {
    message: 'Category must be one of: service, promotion, information',
  })
  category?: PostCategory;

  @IsOptional()
  @IsEnum(PostStatus, {
    message: 'Status must be one of: draft, published',
  })
  status?: PostStatus;

  @IsOptional()
  @IsDateString({}, { message: 'Invalid date format' })
  publishedAt?: string;
}
