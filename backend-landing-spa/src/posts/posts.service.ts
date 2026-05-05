import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Post,
  PostDocument,
  PostStatus,
} from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

export interface PostFilters {
  category?: string;
  status?: PostStatus;
}

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  /**
   * Create a new post
   * Validates post data and stores it in the database
   */
  async create(createPostDto: CreatePostDto): Promise<Post> {
    // Convert publishedAt string to Date if provided
    const postData: any = { ...createPostDto };
    if (createPostDto.publishedAt) {
      postData.publishedAt = new Date(createPostDto.publishedAt);
    }

    const post = new this.postModel(postData);
    return post.save();
  }

  /**
   * Find all posts with optional filters
   * Supports filtering by category and status
   * For public requests (no status filter or status=published), returns only published posts
   * Returns posts sorted by publication date in reverse chronological order
   */
  async findAll(
    filters?: PostFilters,
    isPublicRequest: boolean = true,
  ): Promise<Post[]> {
    const query: any = {};

    // Filter by category
    if (filters?.category) {
      query.category = filters.category;
    }

    // Filter by status
    // For public requests, only return published posts
    if (isPublicRequest) {
      query.status = PostStatus.PUBLISHED;
    } else if (filters?.status) {
      query.status = filters.status;
    }

    // Sort by publication date in reverse chronological order (newest first)
    return this.postModel.find(query).sort({ publishedAt: -1 }).exec();
  }

  /**
   * Find a single post by ID
   * For public requests, only returns published posts
   */
  async findOne(
    id: string,
    isPublicRequest: boolean = true,
  ): Promise<Post | null> {
    const query: any = { _id: id };

    // For public requests, only return published posts
    if (isPublicRequest) {
      query.status = PostStatus.PUBLISHED;
    }

    return this.postModel.findOne(query).exec();
  }

  /**
   * Update an existing post
   * Validates post data and updates it in the database
   */
  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post | null> {
    // Convert publishedAt string to Date if provided
    const updateData: any = { ...updatePostDto };
    if (updatePostDto.publishedAt) {
      updateData.publishedAt = new Date(updatePostDto.publishedAt);
    }

    return this.postModel
      .findByIdAndUpdate(
        id,
        updateData,
        { new: true }, // Return the updated document
      )
      .exec();
  }

  /**
   * Delete a post
   * Removes the post from the database
   */
  async delete(id: string): Promise<Post | null> {
    return this.postModel.findByIdAndDelete(id).exec();
  }
}
