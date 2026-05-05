import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty({ message: 'Customer name is required' })
  @IsString()
  @MinLength(1, { message: 'Customer name must be at least 1 character' })
  @MaxLength(100, { message: 'Customer name must not exceed 100 characters' })
  @Matches(/^[a-zA-Z\s\-]+$/, {
    message: 'Customer name can only contain letters, spaces, and hyphens',
  })
  customerName: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString()
  @Matches(/^[\d\s\-\+\(\)]+$/, {
    message:
      'Phone number can only contain digits, spaces, and standard phone formatting characters',
  })
  phone: string;

  @IsNotEmpty({ message: 'Service is required' })
  @IsString()
  service: string;

  @IsNotEmpty({ message: 'Preferred date is required' })
  @IsDateString({}, { message: 'Invalid date format' })
  preferredDate: string;

  @IsNotEmpty({ message: 'Preferred time is required' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Preferred time must be in HH:MM format',
  })
  preferredTime: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
