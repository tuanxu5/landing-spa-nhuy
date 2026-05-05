import { IsEnum, IsNotEmpty } from 'class-validator';
import { BookingStatus } from '../schemas/booking.schema';

export class UpdateBookingDto {
  @IsNotEmpty({ message: 'Status is required' })
  @IsEnum(BookingStatus, {
    message: 'Status must be one of: pending, confirmed, completed, cancelled',
  })
  status: BookingStatus;
}
