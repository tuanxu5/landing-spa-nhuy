import { validate } from 'class-validator';
import { CreatePostDto } from './create-post.dto';
import { PostCategory, PostStatus } from '../schemas/post.schema';

describe('CreatePostDto', () => {
  let dto: CreatePostDto;

  beforeEach(() => {
    dto = new CreatePostDto();
    dto.title = 'Relaxing Swedish Massage';
    dto.content =
      'Experience ultimate relaxation with our Swedish massage service.';
    dto.category = PostCategory.SERVICE;
    dto.status = PostStatus.PUBLISHED;
  });

  it('should pass validation with valid data', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('title validation', () => {
    it('should fail when title is empty', async () => {
      dto.title = '';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('title');
    });

    it('should fail when title exceeds 200 characters', async () => {
      dto.title = 'a'.repeat(201);
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('title');
    });

    it('should pass when title is within valid length', async () => {
      dto.title = 'Valid Title';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should pass when title is exactly 200 characters', async () => {
      dto.title = 'a'.repeat(200);
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('content validation', () => {
    it('should fail when content is empty', async () => {
      dto.content = '';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('content');
    });

    it('should pass when content is provided', async () => {
      dto.content = 'This is the post content with detailed information.';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('featuredImage validation', () => {
    it('should pass when featuredImage is not provided', async () => {
      dto.featuredImage = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail when featuredImage is not a valid URL', async () => {
      dto.featuredImage = 'not-a-url';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('featuredImage');
    });

    it('should pass when featuredImage is a valid URL', async () => {
      dto.featuredImage = 'https://example.com/image.jpg';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('category validation', () => {
    it('should fail when category is empty', async () => {
      dto.category = '' as any;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('category');
    });

    it('should fail when category is invalid', async () => {
      dto.category = 'invalid-category' as any;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('category');
    });

    it('should pass when category is service', async () => {
      dto.category = PostCategory.SERVICE;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should pass when category is promotion', async () => {
      dto.category = PostCategory.PROMOTION;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should pass when category is information', async () => {
      dto.category = PostCategory.INFORMATION;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('status validation', () => {
    it('should fail when status is empty', async () => {
      dto.status = '' as any;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('status');
    });

    it('should fail when status is invalid', async () => {
      dto.status = 'invalid-status' as any;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('status');
    });

    it('should pass when status is draft', async () => {
      dto.status = PostStatus.DRAFT;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should pass when status is published', async () => {
      dto.status = PostStatus.PUBLISHED;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('publishedAt validation', () => {
    it('should pass when publishedAt is not provided', async () => {
      dto.publishedAt = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail when publishedAt format is invalid', async () => {
      dto.publishedAt = 'invalid-date';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('publishedAt');
    });

    it('should pass when publishedAt is a valid ISO date string', async () => {
      dto.publishedAt = '2024-12-25T10:00:00Z';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });
});
