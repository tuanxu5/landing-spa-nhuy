import { validate } from 'class-validator';
import { CreateBookingDto } from './create-booking.dto';

describe('CreateBookingDto', () => {
  let dto: CreateBookingDto;

  beforeEach(() => {
    dto = new CreateBookingDto();
    dto.customerName = 'John Doe';
    dto.email = 'john@example.com';
    dto.phone = '555-0123';
    dto.service = 'Swedish Massage';
    dto.preferredDate = '2024-12-25';
    dto.preferredTime = '14:00';
  });

  it('should pass validation with valid data', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('customerName validation', () => {
    it('should fail when customerName is empty', async () => {
      dto.customerName = '';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('customerName');
    });

    it('should fail when customerName exceeds 100 characters', async () => {
      dto.customerName = 'a'.repeat(101);
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('customerName');
    });

    it('should fail when customerName contains invalid characters', async () => {
      dto.customerName = 'John123';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('customerName');
    });

    it('should pass when customerName contains letters, spaces, and hyphens', async () => {
      dto.customerName = 'Mary-Jane Smith';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('email validation', () => {
    it('should fail when email is empty', async () => {
      dto.email = '';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
    });

    it('should fail when email format is invalid', async () => {
      dto.email = 'invalid-email';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
    });

    it('should pass when email format is valid', async () => {
      dto.email = 'test@example.com';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('phone validation', () => {
    it('should fail when phone is empty', async () => {
      dto.phone = '';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('phone');
    });

    it('should fail when phone contains invalid characters', async () => {
      dto.phone = '555-0123abc';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('phone');
    });

    it('should pass with various valid phone formats', async () => {
      const validPhones = [
        '555-0123',
        '(555) 0123',
        '+1 555 0123',
        '5550123',
      ];

      for (const phone of validPhones) {
        dto.phone = phone;
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
      }
    });
  });

  describe('service validation', () => {
    it('should fail when service is empty', async () => {
      dto.service = '';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('service');
    });

    it('should pass when service is provided', async () => {
      dto.service = 'Deep Tissue Massage';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('preferredDate validation', () => {
    it('should fail when preferredDate is empty', async () => {
      dto.preferredDate = '';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('preferredDate');
    });

    it('should fail when preferredDate format is invalid', async () => {
      dto.preferredDate = 'invalid-date';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('preferredDate');
    });

    it('should pass when preferredDate is a valid ISO date string', async () => {
      dto.preferredDate = '2024-12-25';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('preferredTime validation', () => {
    it('should fail when preferredTime is empty', async () => {
      dto.preferredTime = '';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('preferredTime');
    });

    it('should fail when preferredTime format is invalid', async () => {
      dto.preferredTime = '25:00';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('preferredTime');
    });

    it('should pass when preferredTime is in HH:MM format', async () => {
      const validTimes = ['09:00', '14:30', '23:59', '00:00'];

      for (const time of validTimes) {
        dto.preferredTime = time;
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
      }
    });
  });

  describe('notes validation', () => {
    it('should pass when notes is not provided', async () => {
      dto.notes = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should pass when notes is provided', async () => {
      dto.notes = 'Please use lavender oil';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });
});
