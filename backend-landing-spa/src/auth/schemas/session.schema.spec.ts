import { SessionSchema } from './session.schema';

describe('SessionSchema', () => {
  it('should have the correct indexes defined', () => {
    const indexes = SessionSchema.indexes();

    // Check that we have the expected number of indexes (token unique + expiresAt TTL)
    expect(indexes.length).toBeGreaterThanOrEqual(2);

    // Check for token unique index
    const tokenIndex = indexes.find((index) => index[0].token !== undefined);
    expect(tokenIndex).toBeDefined();
    expect(tokenIndex[0].token).toBe(1);
    expect(tokenIndex[1].unique).toBe(true);

    // Check for expiresAt TTL index
    const expiresAtIndex = indexes.find(
      (index) => index[0].expiresAt !== undefined,
    );
    expect(expiresAtIndex).toBeDefined();
    expect(expiresAtIndex[0].expiresAt).toBe(1);
    expect(expiresAtIndex[1].expireAfterSeconds).toBe(0);
  });

  it('should have timestamps enabled', () => {
    const schemaOptions = SessionSchema.options;
    expect(schemaOptions.timestamps).toBe(true);
  });

  it('should have correct field requirements', () => {
    const schemaDefinition = SessionSchema.obj;

    expect(schemaDefinition.administratorId.required).toBe(true);
    expect(schemaDefinition.token.required).toBe(true);
    expect(schemaDefinition.expiresAt.required).toBe(true);
    expect(schemaDefinition.lastActivityAt.required).toBe(true);
  });

  it('should have unique constraint on token', () => {
    const schemaDefinition = SessionSchema.obj;

    expect(schemaDefinition.token.unique).toBe(true);
  });

  it('should have correct field types', () => {
    const schemaDefinition = SessionSchema.obj;

    expect(schemaDefinition.expiresAt.type).toBe(Date);
    expect(schemaDefinition.lastActivityAt.type).toBe(Date);
  });

  it('should have default value for lastActivityAt', () => {
    const schemaDefinition = SessionSchema.obj;

    expect(schemaDefinition.lastActivityAt.default).toBeDefined();
    expect(typeof schemaDefinition.lastActivityAt.default).toBe('function');
  });

  it('should reference Administrator collection', () => {
    const schemaDefinition = SessionSchema.obj;

    expect(schemaDefinition.administratorId.ref).toBe('Administrator');
  });
});
