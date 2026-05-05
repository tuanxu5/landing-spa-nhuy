import { PostSchema, PostStatus, PostCategory } from './post.schema';

describe('PostSchema', () => {
  it('should have the correct indexes defined', () => {
    const indexes = PostSchema.indexes();

    // Check that we have the expected number of indexes
    expect(indexes.length).toBeGreaterThanOrEqual(2);

    // Check for publishedAt index
    const publishedAtIndex = indexes.find(
      (index) => index[0].publishedAt !== undefined,
    );
    expect(publishedAtIndex).toBeDefined();
    expect(publishedAtIndex[0].publishedAt).toBe(-1);

    // Check for compound index on category and status
    const compoundIndex = indexes.find(
      (index) =>
        index[0].category !== undefined && index[0].status !== undefined,
    );
    expect(compoundIndex).toBeDefined();
    expect(compoundIndex[0].category).toBe(1);
    expect(compoundIndex[0].status).toBe(1);
  });

  it('should have correct default values', () => {
    const schemaDefinition = PostSchema.obj;

    expect(schemaDefinition.status.default).toBe(PostStatus.DRAFT);
  });

  it('should have timestamps enabled', () => {
    const schemaOptions = PostSchema.options;
    expect(schemaOptions.timestamps).toBe(true);
  });

  it('should have correct field requirements', () => {
    const schemaDefinition = PostSchema.obj;

    expect(schemaDefinition.title.required).toBe(true);
    expect(schemaDefinition.content.required).toBe(true);
    expect(schemaDefinition.category.required).toBe(true);
    expect(schemaDefinition.status.required).toBe(true);
  });

  it('should have correct field constraints', () => {
    const schemaDefinition = PostSchema.obj;

    expect(schemaDefinition.title.minlength).toBe(1);
    expect(schemaDefinition.title.maxlength).toBe(200);
  });

  it('should have correct enum values for category', () => {
    const schemaDefinition = PostSchema.obj;

    expect(schemaDefinition.category.enum).toEqual([
      'service',
      'promotion',
      'information',
    ]);
  });

  it('should have correct enum values for status', () => {
    const schemaDefinition = PostSchema.obj;

    expect(schemaDefinition.status.enum).toEqual(['draft', 'published']);
  });
});
