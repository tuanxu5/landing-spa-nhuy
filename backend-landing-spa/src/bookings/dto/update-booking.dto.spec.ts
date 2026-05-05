import { validate } from 'class-validator';
import { UpdateBookingDto } from './update-booking.dto';
import { BookingStatus } from '../schemas/booking.schema';

describe('UpdateBookingDto', () => {
  let dto: UpdateBookingDto;

  beforeEach(() => {
    dto = new UpdateBookingDto();
  });

  it('should pass validation with valid status', async () => {
    dto.status = BookingStatus.CONFIRMED;
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

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

  it('should pass with all valid status values', async () => {
    const validStatuses = [
      BookingStatus.PENDING,
      BookingStatus.CONFIRMED,
      BookingStatus.COMPLETED,
      BookingStatus.CANCELLED,
    ];

    for (const status of validStatuses) {
      dto.status = status;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    }
  });
});
