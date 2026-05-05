import { AdministratorSchema } from './administrator.schema';

describe('AdministratorSchema', () => {
  it('should have the correct indexes defined', () => {
    const indexes = AdministratorSchema.indexes();

    // Check that we have the expected number of indexes
    expect(indexes.length).toBeGreaterThanOrEqual(1);

    // Check for username unique index
    const usernameIndex = indexes.find(
      (index) => index[0].username !== undefined,
    );
    expect(usernameIndex).toBeDefined();
    expect(usernameIndex[0].username).toBe(1);
    expect(usernameIndex[1].unique).toBe(true);
  });

  it('should have timestamps enabled', () => {
    const schemaOptions = AdministratorSchema.options;
    expect(schemaOptions.timestamps).toBe(true);
  });

  it('should have correct field requirements', () => {
    const schemaDefinition = AdministratorSchema.obj;

    expect(schemaDefinition.username.required).toBe(true);
    expect(schemaDefinition.passwordHash.required).toBe(true);
    expect(schemaDefinition.email.required).toBe(true);
  });

  it('should have correct field constraints', () => {
    const schemaDefinition = AdministratorSchema.obj;

    expect(schemaDefinition.username.unique).toBe(true);
    expect(schemaDefinition.username.minlength).toBe(3);
    expect(schemaDefinition.username.maxlength).toBe(50);
  });

  it('should have optional lastLoginAt field', () => {
    const schemaDefinition = AdministratorSchema.obj;

    expect(schemaDefinition.lastLoginAt).toBeDefined();
    expect(schemaDefinition.lastLoginAt.required).toBeUndefined();
  });
});
