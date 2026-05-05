import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingStatus } from './schemas/booking.schema';

describe('BookingsController', () => {
  let controller: BookingsController;
  let service: BookingsService;

  const mockBooking = {
    _id: '507f1f77bcf86cd799439011',
    customerName: 'John Doe',
    email: 'john@example.com',
    phone: '555-0123',
    service: 'Swedish Massage',
    preferredDate: new Date('2024-12-25'),
    preferredTime: '14:00',
    status: BookingStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockBookingsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    updateStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        {
          provide: BookingsService,
          useValue: mockBookingsService,
        },
      ],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
    service = module.get<BookingsService>(BookingsService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createBookingDto: CreateBookingDto = {
      customerName: 'John Doe',
      email: 'john@example.com',
      phone: '555-0123',
      service: 'Swedish Massage',
      preferredDate: '2024-12-25',
      preferredTime: '14:00',
    };

    it('should create a booking successfully', async () => {
      mockBookingsService.create.mockResolvedValue(mockBooking);

      const result = await controller.create(createBookingDto);

      expect(result).toEqual(mockBooking);
      expect(service.create).toHaveBeenCalledWith(createBookingDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException when service throws BadRequestException', async () => {
      const error = new BadRequestException(
        'Preferred date must not be in the past',
      );
      mockBookingsService.create.mockRejectedValue(error);

      await expect(controller.create(createBookingDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.create(createBookingDto)).rejects.toThrow(
        'Preferred date must not be in the past',
      );
    });

    it('should throw BadRequestException for unexpected errors', async () => {
      mockBookingsService.create.mockRejectedValue(new Error('Database error'));

      await expect(controller.create(createBookingDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.create(createBookingDto)).rejects.toThrow(
        'Failed to create booking',
      );
    });
  });

  describe('findAll', () => {
    it('should return all bookings without filters', async () => {
      const bookings = [mockBooking];
      mockBookingsService.findAll.mockResolvedValue(bookings);

      const result = await controller.findAll();

      expect(result).toEqual(bookings);
      expect(service.findAll).toHaveBeenCalledWith({});
    });

    it('should return bookings filtered by status', async () => {
      const bookings = [mockBooking];
      mockBookingsService.findAll.mockResolvedValue(bookings);

      const result = await controller.findAll(BookingStatus.PENDING);

      expect(result).toEqual(bookings);
      expect(service.findAll).toHaveBeenCalledWith({
        status: BookingStatus.PENDING,
      });
    });

    it('should return bookings filtered by date range', async () => {
      const bookings = [mockBooking];
      mockBookingsService.findAll.mockResolvedValue(bookings);

      const result = await controller.findAll(
        undefined,
        '2024-12-01',
        '2024-12-31',
      );

      expect(result).toEqual(bookings);
      expect(service.findAll).toHaveBeenCalledWith({
        startDate: '2024-12-01',
        endDate: '2024-12-31',
      });
    });

    it('should return bookings filtered by service', async () => {
      const bookings = [mockBooking];
      mockBookingsService.findAll.mockResolvedValue(bookings);

      const result = await controller.findAll(
        undefined,
        undefined,
        undefined,
        'Swedish Massage',
      );

      expect(result).toEqual(bookings);
      expect(service.findAll).toHaveBeenCalledWith({
        service: 'Swedish Massage',
      });
    });

    it('should return bookings with multiple filters', async () => {
      const bookings = [mockBooking];
      mockBookingsService.findAll.mockResolvedValue(bookings);

      const result = await controller.findAll(
        BookingStatus.CONFIRMED,
        '2024-12-01',
        '2024-12-31',
        'Swedish Massage',
      );

      expect(result).toEqual(bookings);
      expect(service.findAll).toHaveBeenCalledWith({
        status: BookingStatus.CONFIRMED,
        startDate: '2024-12-01',
        endDate: '2024-12-31',
        service: 'Swedish Massage',
      });
    });

    it('should throw BadRequestException for invalid status', async () => {
      await expect(
        controller.findAll('invalid-status' as BookingStatus),
      ).rejects.toThrow(BadRequestException);
      await expect(
        controller.findAll('invalid-status' as BookingStatus),
      ).rejects.toThrow('Invalid status');
    });

    it('should throw BadRequestException for invalid startDate', async () => {
      await expect(
        controller.findAll(undefined, 'invalid-date'),
      ).rejects.toThrow(BadRequestException);
      await expect(
        controller.findAll(undefined, 'invalid-date'),
      ).rejects.toThrow('Invalid startDate format');
    });

    it('should throw BadRequestException for invalid endDate', async () => {
      await expect(
        controller.findAll(undefined, undefined, 'invalid-date'),
      ).rejects.toThrow(BadRequestException);
      await expect(
        controller.findAll(undefined, undefined, 'invalid-date'),
      ).rejects.toThrow('Invalid endDate format');
    });
  });

  describe('findOne', () => {
    const validId = '507f1f77bcf86cd799439011';

    it('should return a booking by ID', async () => {
      mockBookingsService.findOne.mockResolvedValue(mockBooking);

      const result = await controller.findOne(validId);

      expect(result).toEqual(mockBooking);
      expect(service.findOne).toHaveBeenCalledWith(validId);
    });

    it('should throw NotFoundException when booking not found', async () => {
      mockBookingsService.findOne.mockResolvedValue(null);

      await expect(controller.findOne(validId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(controller.findOne(validId)).rejects.toThrow(
        `Booking with ID ${validId} not found`,
      );
    });

    it('should throw BadRequestException for invalid ID format', async () => {
      const invalidId = 'invalid-id';

      await expect(controller.findOne(invalidId)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.findOne(invalidId)).rejects.toThrow(
        'Invalid booking ID format',
      );
    });

    it('should throw BadRequestException for short ID', async () => {
      const shortId = '123';

      await expect(controller.findOne(shortId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updateStatus', () => {
    const validId = '507f1f77bcf86cd799439011';
    const updateBookingDto: UpdateBookingDto = {
      status: BookingStatus.CONFIRMED,
    };

    it('should update booking status successfully', async () => {
      const updatedBooking = { ...mockBooking, status: BookingStatus.CONFIRMED };
      mockBookingsService.updateStatus.mockResolvedValue(updatedBooking);

      const result = await controller.updateStatus(validId, updateBookingDto);

      expect(result).toEqual(updatedBooking);
      expect(service.updateStatus).toHaveBeenCalledWith(
        validId,
        updateBookingDto,
      );
    });

    it('should throw NotFoundException when booking not found', async () => {
      mockBookingsService.updateStatus.mockResolvedValue(null);

      await expect(
        controller.updateStatus(validId, updateBookingDto),
      ).rejects.toThrow(NotFoundException);
      await expect(
        controller.updateStatus(validId, updateBookingDto),
      ).rejects.toThrow(`Booking with ID ${validId} not found`);
    });

    it('should throw BadRequestException for invalid ID format', async () => {
      const invalidId = 'invalid-id';

      await expect(
        controller.updateStatus(invalidId, updateBookingDto),
      ).rejects.toThrow(BadRequestException);
      await expect(
        controller.updateStatus(invalidId, updateBookingDto),
      ).rejects.toThrow('Invalid booking ID format');
    });

    it('should re-throw BadRequestException from service', async () => {
      const error = new BadRequestException('Invalid status');
      mockBookingsService.updateStatus.mockRejectedValue(error);

      await expect(
        controller.updateStatus(validId, updateBookingDto),
      ).rejects.toThrow(BadRequestException);
      await expect(
        controller.updateStatus(validId, updateBookingDto),
      ).rejects.toThrow('Invalid status');
    });

    it('should throw BadRequestException for unexpected errors', async () => {
      mockBookingsService.updateStatus.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(
        controller.updateStatus(validId, updateBookingDto),
      ).rejects.toThrow(BadRequestException);
      await expect(
        controller.updateStatus(validId, updateBookingDto),
      ).rejects.toThrow('Failed to update booking status');
    });
  });
});
