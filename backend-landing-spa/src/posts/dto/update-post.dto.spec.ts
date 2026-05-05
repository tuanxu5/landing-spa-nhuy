import { validate } from 'class-validator';
import { UpdatePostDto } from './update-post.dto';
import { PostCategory, PostStatus } from '../schemas/post.schema';

describe('UpdatePostDto', () => {
  let dto: UpdatePostDto;

  beforeEach(() => {
    dto = new UpdatePostDto();
  });

  it('should pass validation with no fields provided', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('title validation', () => {
    it('should fail when title is too short', async () => {
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
      dto.title = 'Updated Title';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('content validation', () => {
    it('should pass when content is provided', async () => {
      dto.content = 'Updated content for the post.';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('featuredImage validation', () => {
    it('should fail when featuredImage is not a valid URL', async () => {
      dto.featuredImage = 'not-a-url';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('featuredImage');
    });

    it('should pass when featuredImage is a valid URL', async () => {
      dto.featuredImage = 'https://example.com/new-image.jpg';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('category validation', () => {
    it('should fail when category is invalid', async () => {
      dto.category = 'invalid-category' as any;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('category');
    });

    it('should pass with all valid category values', async () => {
      const validCategories = [
        PostCategory.SERVICE,
        PostCategory.PROMOTION,
        PostCategory.INFORMATION,
      ];

      for (const category of validCategories) {
        dto.category = category;
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
      }
    });
  });

  describe('status validation', () => {
    it('should fail when status is invalid', async () => {
      dto.status = 'invalid-status' as any;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('status');
    });

    it('should pass with all valid status values', async () => {
      const validStatuses = [PostStatus.DRAFT, PostStatus.PUBLISHED];

      for (const status of validStatuses) {
        dto.status = status;
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
      }
    });
  });

  describe('publishedAt validation', () => {
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
