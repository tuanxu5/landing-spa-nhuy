import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { PostsService, PostFilters } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  Post as PostEntity,
  PostCategory,
  PostStatus,
} from './schemas/post.schema';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('api/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * POST /api/posts
   * Create a new post
   * Requires authentication
   */
  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPostDto: CreatePostDto): Promise<PostEntity> {
    try {
      return await this.postsService.create(createPostDto);
    } catch (error) {
      // Re-throw BadRequestException from service
      if (error instanceof BadRequestException) {
        throw error;
      }
      // Handle unexpected errors
      throw new BadRequestException('Failed to create post');
    }
  }

  /**
   * GET /api/posts
   * Retrieve all posts with optional filters
   * Public endpoint - returns only published posts
   * Admin endpoint - returns all posts when authenticated
   */
  @Get()
  async findAll(
    @Query('category') category?: PostCategory,
    @Query('status') status?: PostStatus,
  ): Promise<PostEntity[]> {
    const filters: PostFilters = {};

    // Build filters from query parameters
    if (category) {
      // Validate category is a valid enum value
      if (!Object.values(PostCategory).includes(category)) {
        throw new BadRequestException(
          `Invalid category. Must be one of: ${Object.values(PostCategory).join(', ')}`,
        );
      }
      filters.category = category;
    }

    if (status) {
      // Validate status is a valid enum value
      if (!Object.values(PostStatus).includes(status)) {
        throw new BadRequestException(
          `Invalid status. Must be one of: ${Object.values(PostStatus).join(', ')}`,
        );
      }
      filters.status = status;
    }

    // Determine if this is a public request
    // For simplicity, we consider it a public request if no status filter is provided
    // or if the status filter is explicitly "published"
    const isPublicRequest = !status || status === PostStatus.PUBLISHED;

    return await this.postsService.findAll(filters, isPublicRequest);
  }

  /**
   * GET /api/posts/:id
   * Retrieve a specific post by ID
   * Public endpoint - returns only published posts
   * Admin endpoint - returns any post when authenticated
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PostEntity> {
    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('Invalid post ID format');
    }

    // For simplicity, we consider this a public request
    // In a real implementation, you would check for authentication
    const isPublicRequest = true;

    const post = await this.postsService.findOne(id, isPublicRequest);

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  /**
   * PUT /api/posts/:id
   * Update an existing post
   * Requires authentication
   */
  @Put(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostEntity> {
    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('Invalid post ID format');
    }

    try {
      const post = await this.postsService.update(id, updatePostDto);

      if (!post) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }

      return post;
    } catch (error) {
      // Re-throw known exceptions
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      // Handle unexpected errors
      throw new BadRequestException('Failed to update post');
    }
  }

  /**
   * DELETE /api/posts/:id
   * Delete a post
   * Requires authentication
   */
  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('Invalid post ID format');
    }

    const post = await this.postsService.delete(id);

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
  }
}
