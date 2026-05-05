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
  @IsNotEmpty({ message: 'Vui lòng nhập họ và tên' })
  @IsString()
  @MinLength(1, { message: 'Họ và tên phải có ít nhất 1 ký tự' })
  @MaxLength(100, { message: 'Họ và tên không được vượt quá 100 ký tự' })
  @Matches(/^[a-zA-ZÀ-ỹ\s\-]+$/, {
    message: 'Họ và tên chỉ được chứa chữ cái, khoảng trắng và dấu gạch ngang',
  })
  customerName: string;

  @IsOptional()
  @IsEmail({}, { message: 'Định dạng email không hợp lệ' })
  email?: string;

  @IsNotEmpty({ message: 'Vui lòng nhập số điện thoại' })
  @IsString()
  @Matches(/^[\d\s\-\+\(\)]+$/, {
    message: 'Số điện thoại chỉ được chứa số, khoảng trắng và các ký tự định dạng chuẩn',
  })
  phone: string;

  @IsNotEmpty({ message: 'Vui lòng chọn dịch vụ' })
  @IsString()
  service: string;

  @IsNotEmpty({ message: 'Vui lòng chọn ngày hẹn' })
  @IsDateString({}, { message: 'Định dạng ngày không hợp lệ' })
  preferredDate: string;

  @IsNotEmpty({ message: 'Vui lòng chọn giờ hẹn' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Giờ hẹn phải có định dạng HH:MM',
  })
  preferredTime: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
