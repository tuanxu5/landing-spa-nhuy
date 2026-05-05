import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { PostsService } from './posts.service';
import { Post, PostCategory, PostStatus } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

describe('PostsService', () => {
  let service: PostsService;
  let mockPostModel: any;

  const mockPost = {
    _id: '507f1f77bcf86cd799439011',
    title: 'Relaxing Swedish Massage',
    content:
      'Experience ultimate relaxation with our Swedish massage service...',
    featuredImage: 'https://example.com/images/swedish-massage.jpg',
    category: PostCategory.SERVICE,
    status: PostStatus.PUBLISHED,
    publishedAt: new Date('2024-01-15'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(async () => {
    // Create mock model with chainable methods
    const mockQuery = {
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    };

    mockPostModel = jest.fn().mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(mockPost),
    }));

    mockPostModel.find = jest.fn().mockReturnValue(mockQuery);
    mockPostModel.findOne = jest.fn().mockReturnValue({
      exec: jest.fn(),
    });
    mockPostModel.findById = jest.fn().mockReturnValue({
      exec: jest.fn(),
    });
    mockPostModel.findByIdAndUpdate = jest.fn().mockReturnValue({
      exec: jest.fn(),
    });
    mockPostModel.findByIdAndDelete = jest.fn().mockReturnValue({
      exec: jest.fn(),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getModelToken(Post.name),
          useValue: mockPostModel,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a post with valid data', async () => {
      const createPostDto: CreatePostDto = {
        title: 'Relaxing Swedish Massage',
        content:
          'Experience ultimate relaxation with our Swedish massage service...',
        featuredImage: 'https://example.com/images/swedish-massage.jpg',
        category: PostCategory.SERVICE,
        status: PostStatus.PUBLISHED,
        publishedAt: '2024-01-15T00:00:00.000Z',
      };

      const mockSave = jest.fn().mockResolvedValue(mockPost);
      const mockPostInstance = {
        save: mockSave,
      };

      mockPostModel.mockReturnValue(mockPostInstance);

      const result = await service.create(createPostDto);

      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual(mockPost);
    });

    it('should create a post without optional fields', async () => {
      const createPostDto: CreatePostDto = {
        title: 'New Promotion',
        content: 'Check out our latest promotion!',
        category: PostCategory.PROMOTION,
        status: PostStatus.DRAFT,
      };

      const mockPostWithoutOptionals = {
        ...mockPost,
        title: 'New Promotion',
        content: 'Check out our latest promotion!',
        category: PostCategory.PROMOTION,
        status: PostStatus.DRAFT,
        featuredImage: undefined,
        publishedAt: undefined,
      };

      const mockSave = jest.fn().mockResolvedValue(mockPostWithoutOptionals);
      const mockPostInstance = {
        save: mockSave,
      };

      mockPostModel.mockReturnValue(mockPostInstance);

      const result = await service.create(createPostDto);

      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual(mockPostWithoutOptionals);
    });

    it('should convert publishedAt string to Date', async () => {
      const createPostDto: CreatePostDto = {
        title: 'Test Post',
        content: 'Test content',
        category: PostCategory.INFORMATION,
        status: PostStatus.PUBLISHED,
        publishedAt: '2024-01-15T00:00:00.000Z',
      };

      const mockSave = jest.fn().mockResolvedValue(mockPost);
      const mockPostInstance = {
        save: mockSave,
      };

      mockPostModel.mockReturnValue(mockPostInstance);

      await service.create(createPostDto);

      expect(mockPostModel).toHaveBeenCalledWith(
        expect.objectContaining({
          publishedAt: expect.any(Date),
        }),
      );
    });
  });

  describe('findAll', () => {
    it('should return only published posts for public requests', async () => {
      const mockPosts = [mockPost];
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockPosts),
      };
      mockPostModel.find.mockReturnValue(mockQuery);

      const result = await service.findAll(undefined, true);

      expect(mockPostModel.find).toHaveBeenCalledWith({
        status: PostStatus.PUBLISHED,
      });
      expect(mockQuery.sort).toHaveBeenCalledWith({ publishedAt: -1 });
      expect(result).toEqual(mockPosts);
    });

    it('should return all posts for admin requests', async () => {
      const mockPosts = [mockPost];
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockPosts),
      };
      mockPostModel.find.mockReturnValue(mockQuery);

      const result = await service.findAll(undefined, false);

      expect(mockPostModel.find).toHaveBeenCalledWith({});
      expect(mockQuery.sort).toHaveBeenCalledWith({ publishedAt: -1 });
      expect(result).toEqual(mockPosts);
    });

    it('should filter posts by category for public requests', async () => {
      const mockPosts = [mockPost];
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockPosts),
      };
      mockPostModel.find.mockReturnValue(mockQuery);

      const result = await service.findAll(
        { category: PostCategory.SERVICE },
        true,
      );

      expect(mockPostModel.find).toHaveBeenCalledWith({
        category: PostCategory.SERVICE,
        status: PostStatus.PUBLISHED,
      });
      expect(result).toEqual(mockPosts);
    });

    it('should filter posts by category for admin requests', async () => {
      const mockPosts = [mockPost];
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockPosts),
      };
      mockPostModel.find.mockReturnValue(mockQuery);

      const result = await service.findAll(
        { category: PostCategory.PROMOTION },
        false,
      );

      expect(mockPostModel.find).toHaveBeenCalledWith({
        category: PostCategory.PROMOTION,
      });
      expect(result).toEqual(mockPosts);
    });

    it('should filter posts by status for admin requests', async () => {
      const mockPosts = [mockPost];
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockPosts),
      };
      mockPostModel.find.mockReturnValue(mockQuery);

      const result = await service.findAll({ status: PostStatus.DRAFT }, false);

      expect(mockPostModel.find).toHaveBeenCalledWith({
        status: PostStatus.DRAFT,
      });
      expect(result).toEqual(mockPosts);
    });

    it('should filter posts by category and status for admin requests', async () => {
      const mockPosts = [mockPost];
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockPosts),
      };
      mockPostModel.find.mockReturnValue(mockQuery);

      const result = await service.findAll(
        { category: PostCategory.SERVICE, status: PostStatus.PUBLISHED },
        false,
      );

      expect(mockPostModel.find).toHaveBeenCalledWith({
        category: PostCategory.SERVICE,
        status: PostStatus.PUBLISHED,
      });
      expect(result).toEqual(mockPosts);
    });

    it('should sort posts by publishedAt in reverse chronological order', async () => {
      const mockPosts = [mockPost];
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockPosts),
      };
      mockPostModel.find.mockReturnValue(mockQuery);

      await service.findAll();

      expect(mockQuery.sort).toHaveBeenCalledWith({ publishedAt: -1 });
    });
  });

  describe('findOne', () => {
    it('should return a published post by id for public requests', async () => {
      const mockExec = jest.fn().mockResolvedValue(mockPost);
      mockPostModel.findOne.mockReturnValue({
        exec: mockExec,
      });

      const result = await service.findOne('507f1f77bcf86cd799439011', true);

      expect(mockPostModel.findOne).toHaveBeenCalledWith({
        _id: '507f1f77bcf86cd799439011',
        status: PostStatus.PUBLISHED,
      });
      expect(result).toEqual(mockPost);
    });

    it('should return any post by id for admin requests', async () => {
      const mockExec = jest.fn().mockResolvedValue(mockPost);
      mockPostModel.findOne.mockReturnValue({
        exec: mockExec,
      });

      const result = await service.findOne('507f1f77bcf86cd799439011', false);

      expect(mockPostModel.findOne).toHaveBeenCalledWith({
        _id: '507f1f77bcf86cd799439011',
      });
      expect(result).toEqual(mockPost);
    });

    it('should return null for non-existent post', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      mockPostModel.findOne.mockReturnValue({
        exec: mockExec,
      });

      const result = await service.findOne('507f1f77bcf86cd799439011', true);

      expect(result).toBeNull();
    });

    it('should return null for draft post on public request', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      mockPostModel.findOne.mockReturnValue({
        exec: mockExec,
      });

      const result = await service.findOne('507f1f77bcf86cd799439011', true);

      expect(mockPostModel.findOne).toHaveBeenCalledWith({
        _id: '507f1f77bcf86cd799439011',
        status: PostStatus.PUBLISHED,
      });
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a post with valid data', async () => {
      const updatePostDto: UpdatePostDto = {
        title: 'Updated Title',
        content: 'Updated content',
      };
      const updatedPost = { ...mockPost, ...updatePostDto };
      const mockExec = jest.fn().mockResolvedValue(updatedPost);
      mockPostModel.findByIdAndUpdate.mockReturnValue({
        exec: mockExec,
      });

      const result = await service.update(
        '507f1f77bcf86cd799439011',
        updatePostDto,
      );

      expect(mockPostModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        updatePostDto,
        { new: true },
      );
      expect(result).toEqual(updatedPost);
    });

    it('should update post status from draft to published', async () => {
      const updatePostDto: UpdatePostDto = {
        status: PostStatus.PUBLISHED,
        publishedAt: '2024-01-20T00:00:00.000Z',
      };
      const updatedPost = {
        ...mockPost,
        status: PostStatus.PUBLISHED,
        publishedAt: new Date('2024-01-20'),
      };
      const mockExec = jest.fn().mockResolvedValue(updatedPost);
      mockPostModel.findByIdAndUpdate.mockReturnValue({
        exec: mockExec,
      });

      const result = await service.update(
        '507f1f77bcf86cd799439011',
        updatePostDto,
      );

      expect(mockPostModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        expect.objectContaining({
          status: PostStatus.PUBLISHED,
          publishedAt: expect.any(Date),
        }),
        { new: true },
      );
      expect(result?.status).toBe(PostStatus.PUBLISHED);
    });

    it('should update post category', async () => {
      const updatePostDto: UpdatePostDto = {
        category: PostCategory.PROMOTION,
      };
      const updatedPost = { ...mockPost, category: PostCategory.PROMOTION };
      const mockExec = jest.fn().mockResolvedValue(updatedPost);
      mockPostModel.findByIdAndUpdate.mockReturnValue({
        exec: mockExec,
      });

      const result = await service.update(
        '507f1f77bcf86cd799439011',
        updatePostDto,
      );

      expect(result?.category).toBe(PostCategory.PROMOTION);
    });

    it('should update featured image', async () => {
      const updatePostDto: UpdatePostDto = {
        featuredImage: 'https://example.com/images/new-image.jpg',
      };
      const updatedPost = {
        ...mockPost,
        featuredImage: 'https://example.com/images/new-image.jpg',
      };
      const mockExec = jest.fn().mockResolvedValue(updatedPost);
      mockPostModel.findByIdAndUpdate.mockReturnValue({
        exec: mockExec,
      });

      const result = await service.update(
        '507f1f77bcf86cd799439011',
        updatePostDto,
      );

      expect(result?.featuredImage).toBe(
        'https://example.com/images/new-image.jpg',
      );
    });

    it('should convert publishedAt string to Date when updating', async () => {
      const updatePostDto: UpdatePostDto = {
        publishedAt: '2024-01-20T00:00:00.000Z',
      };
      const updatedPost = {
        ...mockPost,
        publishedAt: new Date('2024-01-20'),
      };
      const mockExec = jest.fn().mockResolvedValue(updatedPost);
      mockPostModel.findByIdAndUpdate.mockReturnValue({
        exec: mockExec,
      });

      await service.update('507f1f77bcf86cd799439011', updatePostDto);

      expect(mockPostModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        expect.objectContaining({
          publishedAt: expect.any(Date),
        }),
        { new: true },
      );
    });

    it('should return null for non-existent post', async () => {
      const updatePostDto: UpdatePostDto = {
        title: 'Updated Title',
      };
      const mockExec = jest.fn().mockResolvedValue(null);
      mockPostModel.findByIdAndUpdate.mockReturnValue({
        exec: mockExec,
      });

      const result = await service.update(
        '507f1f77bcf86cd799439011',
        updatePostDto,
      );

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete a post by id', async () => {
      const mockExec = jest.fn().mockResolvedValue(mockPost);
      mockPostModel.findByIdAndDelete.mockReturnValue({
        exec: mockExec,
      });

      const result = await service.delete('507f1f77bcf86cd799439011');

      expect(mockPostModel.findByIdAndDelete).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
      expect(result).toEqual(mockPost);
    });

    it('should return null for non-existent post', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      mockPostModel.findByIdAndDelete.mockReturnValue({
        exec: mockExec,
      });

      const result = await service.delete('507f1f77bcf86cd799439011');

      expect(result).toBeNull();
    });
  });

  describe('error handling for database failures', () => {
    it('should propagate database errors when creating a post', async () => {
      const createPostDto: CreatePostDto = {
        title: 'Test Post',
        content: 'Test content',
        category: PostCategory.SERVICE,
        status: PostStatus.DRAFT,
      };

      const dbError = new Error('Database connection failed');
      const mockSave = jest.fn().mockRejectedValue(dbError);
      const mockPostInstance = {
        save: mockSave,
      };

      mockPostModel.mockReturnValue(mockPostInstance);

      await expect(service.create(createPostDto)).rejects.toThrow(
        'Database connection failed',
      );
    });

    it('should propagate database errors when finding all posts', async () => {
      const dbError = new Error('Database query failed');
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockRejectedValue(dbError),
      };
      mockPostModel.find.mockReturnValue(mockQuery);

      await expect(service.findAll()).rejects.toThrow('Database query failed');
    });

    it('should propagate database errors when finding one post', async () => {
      const dbError = new Error('Database query failed');
      const mockExec = jest.fn().mockRejectedValue(dbError);
      mockPostModel.findOne.mockReturnValue({
        exec: mockExec,
      });

      await expect(service.findOne('507f1f77bcf86cd799439011')).rejects.toThrow(
        'Database query failed',
      );
    });

    it('should propagate database errors when updating a post', async () => {
      const updatePostDto: UpdatePostDto = {
        title: 'Updated Title',
      };
      const dbError = new Error('Database update failed');
      const mockExec = jest.fn().mockRejectedValue(dbError);
      mockPostModel.findByIdAndUpdate.mockReturnValue({
        exec: mockExec,
      });

      await expect(
        service.update('507f1f77bcf86cd799439011', updatePostDto),
      ).rejects.toThrow('Database update failed');
    });

    it('should propagate database errors when deleting a post', async () => {
      const dbError = new Error('Database delete failed');
      const mockExec = jest.fn().mockRejectedValue(dbError);
      mockPostModel.findByIdAndDelete.mockReturnValue({
        exec: mockExec,
      });

      await expect(service.delete('507f1f77bcf86cd799439011')).rejects.toThrow(
        'Database delete failed',
      );
    });
  });
});
