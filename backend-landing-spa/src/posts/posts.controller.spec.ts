import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostCategory, PostStatus } from './schemas/post.schema';
import { AuthGuard } from '../auth/guards/auth.guard';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  const mockPost = {
    _id: '507f1f77bcf86cd799439011',
    title: 'Relaxing Swedish Massage',
    content: 'Experience ultimate relaxation with our Swedish massage service.',
    featuredImage: 'https://example.com/image.jpg',
    category: PostCategory.SERVICE,
    status: PostStatus.PUBLISHED,
    publishedAt: new Date('2024-12-01'),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPostsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: mockPostsService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createPostDto: CreatePostDto = {
      title: 'Relaxing Swedish Massage',
      content:
        'Experience ultimate relaxation with our Swedish massage service.',
      featuredImage: 'https://example.com/image.jpg',
      category: PostCategory.SERVICE,
      status: PostStatus.PUBLISHED,
      publishedAt: '2024-12-01',
    };

    it('should create a post successfully', async () => {
      mockPostsService.create.mockResolvedValue(mockPost);

      const result = await controller.create(createPostDto);

      expect(result).toEqual(mockPost);
      expect(service.create).toHaveBeenCalledWith(createPostDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException when service throws BadRequestException', async () => {
      const error = new BadRequestException(
        'Title must not exceed 200 characters',
      );
      mockPostsService.create.mockRejectedValue(error);

      await expect(controller.create(createPostDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.create(createPostDto)).rejects.toThrow(
        'Title must not exceed 200 characters',
      );
    });

    it('should throw BadRequestException for unexpected errors', async () => {
      mockPostsService.create.mockRejectedValue(new Error('Database error'));

      await expect(controller.create(createPostDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.create(createPostDto)).rejects.toThrow(
        'Failed to create post',
      );
    });
  });

  describe('findAll', () => {
    it('should return all published posts without filters (public request)', async () => {
      const posts = [mockPost];
      mockPostsService.findAll.mockResolvedValue(posts);

      const result = await controller.findAll();

      expect(result).toEqual(posts);
      expect(service.findAll).toHaveBeenCalledWith({}, true);
    });

    it('should return posts filtered by category', async () => {
      const posts = [mockPost];
      mockPostsService.findAll.mockResolvedValue(posts);

      const result = await controller.findAll(PostCategory.SERVICE);

      expect(result).toEqual(posts);
      expect(service.findAll).toHaveBeenCalledWith(
        { category: PostCategory.SERVICE },
        true,
      );
    });

    it('should return posts filtered by status (published)', async () => {
      const posts = [mockPost];
      mockPostsService.findAll.mockResolvedValue(posts);

      const result = await controller.findAll(undefined, PostStatus.PUBLISHED);

      expect(result).toEqual(posts);
      expect(service.findAll).toHaveBeenCalledWith(
        { status: PostStatus.PUBLISHED },
        true,
      );
    });

    it('should return all posts when status is draft (admin request)', async () => {
      const posts = [mockPost];
      mockPostsService.findAll.mockResolvedValue(posts);

      const result = await controller.findAll(undefined, PostStatus.DRAFT);

      expect(result).toEqual(posts);
      expect(service.findAll).toHaveBeenCalledWith(
        { status: PostStatus.DRAFT },
        false,
      );
    });

    it('should return posts with multiple filters', async () => {
      const posts = [mockPost];
      mockPostsService.findAll.mockResolvedValue(posts);

      const result = await controller.findAll(
        PostCategory.SERVICE,
        PostStatus.PUBLISHED,
      );

      expect(result).toEqual(posts);
      expect(service.findAll).toHaveBeenCalledWith(
        {
          category: PostCategory.SERVICE,
          status: PostStatus.PUBLISHED,
        },
        true,
      );
    });

    it('should throw BadRequestException for invalid category', async () => {
      await expect(
        controller.findAll('invalid-category' as PostCategory),
      ).rejects.toThrow(BadRequestException);
      await expect(
        controller.findAll('invalid-category' as PostCategory),
      ).rejects.toThrow('Invalid category');
    });

    it('should throw BadRequestException for invalid status', async () => {
      await expect(
        controller.findAll(undefined, 'invalid-status' as PostStatus),
      ).rejects.toThrow(BadRequestException);
      await expect(
        controller.findAll(undefined, 'invalid-status' as PostStatus),
      ).rejects.toThrow('Invalid status');
    });
  });

  describe('findOne', () => {
    const validId = '507f1f77bcf86cd799439011';

    it('should return a post by ID', async () => {
      mockPostsService.findOne.mockResolvedValue(mockPost);

      const result = await controller.findOne(validId);

      expect(result).toEqual(mockPost);
      expect(service.findOne).toHaveBeenCalledWith(validId, true);
    });

    it('should throw NotFoundException when post not found', async () => {
      mockPostsService.findOne.mockResolvedValue(null);

      await expect(controller.findOne(validId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(controller.findOne(validId)).rejects.toThrow(
        `Post with ID ${validId} not found`,
      );
    });

    it('should throw BadRequestException for invalid ID format', async () => {
      const invalidId = 'invalid-id';

      await expect(controller.findOne(invalidId)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.findOne(invalidId)).rejects.toThrow(
        'Invalid post ID format',
      );
    });

    it('should throw BadRequestException for short ID', async () => {
      const shortId = '123';

      await expect(controller.findOne(shortId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    const validId = '507f1f77bcf86cd799439011';
    const updatePostDto: UpdatePostDto = {
      title: 'Updated Title',
      status: PostStatus.PUBLISHED,
    };

    it('should update post successfully', async () => {
      const updatedPost = { ...mockPost, title: 'Updated Title' };
      mockPostsService.update.mockResolvedValue(updatedPost);

      const result = await controller.update(validId, updatePostDto);

      expect(result).toEqual(updatedPost);
      expect(service.update).toHaveBeenCalledWith(validId, updatePostDto);
    });

    it('should throw NotFoundException when post not found', async () => {
      mockPostsService.update.mockResolvedValue(null);

      await expect(controller.update(validId, updatePostDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(controller.update(validId, updatePostDto)).rejects.toThrow(
        `Post with ID ${validId} not found`,
      );
    });

    it('should throw BadRequestException for invalid ID format', async () => {
      const invalidId = 'invalid-id';

      await expect(controller.update(invalidId, updatePostDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.update(invalidId, updatePostDto)).rejects.toThrow(
        'Invalid post ID format',
      );
    });

    it('should re-throw BadRequestException from service', async () => {
      const error = new BadRequestException('Invalid title length');
      mockPostsService.update.mockRejectedValue(error);

      await expect(controller.update(validId, updatePostDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.update(validId, updatePostDto)).rejects.toThrow(
        'Invalid title length',
      );
    });

    it('should throw BadRequestException for unexpected errors', async () => {
      mockPostsService.update.mockRejectedValue(new Error('Database error'));

      await expect(controller.update(validId, updatePostDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.update(validId, updatePostDto)).rejects.toThrow(
        'Failed to update post',
      );
    });
  });

  describe('delete', () => {
    const validId = '507f1f77bcf86cd799439011';

    it('should delete post successfully', async () => {
      mockPostsService.delete.mockResolvedValue(mockPost);

      await controller.delete(validId);

      expect(service.delete).toHaveBeenCalledWith(validId);
    });

    it('should throw NotFoundException when post not found', async () => {
      mockPostsService.delete.mockResolvedValue(null);

      await expect(controller.delete(validId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(controller.delete(validId)).rejects.toThrow(
        `Post with ID ${validId} not found`,
      );
    });

    it('should throw BadRequestException for invalid ID format', async () => {
      const invalidId = 'invalid-id';

      await expect(controller.delete(invalidId)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.delete(invalidId)).rejects.toThrow(
        'Invalid post ID format',
      );
    });
  });
});
