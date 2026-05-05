import { validate } from 'class-validator';
import { ChangePasswordDto } from './change-password.dto';

describe('ChangePasswordDto', () => {
  it('should pass validation with valid data', async () => {
    const dto = new ChangePasswordDto();
    dto.currentPassword = 'oldpassword123';
    dto.newPassword = 'newpassword123';
    dto.confirmPassword = 'newpassword123';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation when currentPassword is missing', async () => {
    const dto = new ChangePasswordDto();
    dto.newPassword = 'newpassword123';
    dto.confirmPassword = 'newpassword123';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('currentPassword');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation when newPassword is missing', async () => {
    const dto = new ChangePasswordDto();
    dto.currentPassword = 'oldpassword123';
    dto.confirmPassword = 'newpassword123';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('newPassword');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation when confirmPassword is missing', async () => {
    const dto = new ChangePasswordDto();
    dto.currentPassword = 'oldpassword123';
    dto.newPassword = 'newpassword123';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('confirmPassword');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation when newPassword is less than 8 characters', async () => {
    const dto = new ChangePasswordDto();
    dto.currentPassword = 'oldpassword123';
    dto.newPassword = 'short';
    dto.confirmPassword = 'short';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('newPassword');
    expect(errors[0].constraints).toHaveProperty('minLength');
  });

  it('should fail validation when passwords are not strings', async () => {
    const dto = new ChangePasswordDto();
    dto.currentPassword = 123 as any;
    dto.newPassword = 456 as any;
    dto.confirmPassword = 789 as any;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.property === 'currentPassword')).toBe(true);
    expect(errors.some((e) => e.property === 'newPassword')).toBe(true);
    expect(errors.some((e) => e.property === 'confirmPassword')).toBe(true);
  });
});
