import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Booking, BookingStatus } from './schemas/booking.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

describe('BookingsService', () => {
  let service: BookingsService;
  let mockBookingModel: any;

  const mockBooking = {
    _id: '507f1f77bcf86cd799439011',
    customerName: 'John Doe',
    email: 'john@example.com',
    phone: '555-0123',
    service: 'Swedish Massage',
    preferredDate: new Date('2024-12-25'),
    preferredTime: '14:00',
    status: BookingStatus.PENDING,
    notes: 'Please call before arriving',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(async () => {
    // Create mock model with chainable methods
    const mockQuery = {
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    };

    mockBookingModel = jest.fn().mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(mockBooking),
    }));

    mockBookingModel.find = jest.fn().mockReturnValue(mockQuery);
    mockBookingModel.findById = jest.fn().mockReturnValue({
      exec: jest.fn(),
    });
    mockBookingModel.findByIdAndUpdate = jest.fn().mockReturnValue({
      exec: jest.fn(),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getModelToken(Booking.name),
          useValue: mockBookingModel,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a booking with valid data', async () => {
      // Use a date 30 days in the future to ensure it's always valid
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const futureDateString = futureDate.toISOString().split('T')[0];

      const createBookingDto: CreateBookingDto = {
        customerName: 'John Doe',
        email: 'john@example.com',
        phone: '555-0123',
        service: 'Swedish Massage',
        preferredDate: futureDateString,
        preferredTime: '14:00',
        notes: 'Please call before arriving',
      };

      const mockSave = jest.fn().mockResolvedValue(mockBooking);
      const mockBookingInstance = {
        save: mockSave,
      };

      // Mock the model constructor
      jest
        .spyOn(mockBookingModel, 'constructor' as any)
        .mockReturnValue(mockBookingInstance);
      mockBookingModel.mockReturnValue(mockBookingInstance);

      const result = await service.create(createBookingDto);

      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual(mockBooking);
    });

    it('should throw BadRequestException for past date', async () => {
      const createBookingDto: CreateBookingDto = {
        customerName: 'John Doe',
        email: 'john@example.com',
        phone: '555-0123',
        service: 'Swedish Massage',
        preferredDate: '2020-01-01',
        preferredTime: '14:00',
      };

      await expect(service.create(createBookingDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(createBookingDto)).rejects.toThrow(
        'Preferred date must not be in the past',
      );
    });

    it('should accept today as a valid date', async () => {
      const today = new Date();
      const todayString = today.toISOString().split('T')[0];

      const createBookingDto: CreateBookingDto = {
        customerName: 'John Doe',
        email: 'john@example.com',
        phone: '555-0123',
        service: 'Swedish Massage',
        preferredDate: todayString,
        preferredTime: '14:00',
      };

      const mockSave = jest.fn().mockResolvedValue(mockBooking);
      const mockBookingInstance = {
        save: mockSave,
      };

      mockBookingModel.mockReturnValue(mockBookingInstance);

      await service.create(createBookingDto);

      expect(mockSave).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all bookings sorted by creation date', async () => {
      const mockBookings = [mockBooking];
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockBookings),
      };
      mockBookingModel.find.mockReturnValue(mockQuery);

      const result = await service.findAll();

      expect(mockBookingModel.find).toHaveBeenCalledWith({});
      expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(mockBookings);
    });

    it('should filter bookings by status', async () => {
      const mockBookings = [mockBooking];
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockBookings),
      };
      mockBookingModel.find.mockReturnValue(mockQuery);

      const result = await service.findAll({ status: BookingStatus.PENDING });

      expect(mockBookingModel.find).toHaveBeenCalledWith({
        status: BookingStatus.PENDING,
      });
      expect(result).toEqual(mockBookings);
    });

    it('should filter bookings by date range', async () => {
      const mockBookings = [mockBooking];
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockBookings),
      };
      mockBookingModel.find.mockReturnValue(mockQuery);

      const result = await service.findAll({
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      });

      expect(mockBookingModel.find).toHaveBeenCalledWith({
        preferredDate: {
          $gte: new Date('2024-01-01'),
          $lte: new Date('2024-12-31'),
        },
      });
      expect(result).toEqual(mockBookings);
    });

    it('should filter bookings by service', async () => {
      const mockBookings = [mockBooking];
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockBookings),
      };
      mockBookingModel.find.mockReturnValue(mockQuery);

      const result = await service.findAll({ service: 'Swedish Massage' });

      expect(mockBookingModel.find).toHaveBeenCalledWith({
        service: 'Swedish Massage',
      });
      expect(result).toEqual(mockBookings);
    });

    it('should filter bookings by multiple criteria', async () => {
      const mockBookings = [mockBooking];
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockBookings),
      };
      mockBookingModel.find.mockReturnValue(mockQuery);

      const result = await service.findAll({
        status: BookingStatus.CONFIRMED,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        service: 'Swedish Massage',
      });

      expect(mockBookingModel.find).toHaveBeenCalledWith({
        status: BookingStatus.CONFIRMED,
        preferredDate: {
          $gte: new Date('2024-01-01'),
          $lte: new Date('2024-12-31'),
        },
        service: 'Swedish Massage',
      });
      expect(result).toEqual(mockBookings);
    });

    it('should filter by start date only', async () => {
      const mockBookings = [mockBooking];
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockBookings),
      };
      mockBookingModel.find.mockReturnValue(mockQuery);

      const result = await service.findAll({ startDate: '2024-01-01' });

      expect(mockBookingModel.find).toHaveBeenCalledWith({
        preferredDate: {
          $gte: new Date('2024-01-01'),
        },
      });
      expect(result).toEqual(mockBookings);
    });

    it('should filter by end date only', async () => {
      const mockBookings = [mockBooking];
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockBookings),
      };
      mockBookingModel.find.mockReturnValue(mockQuery);

      const result = await service.findAll({ endDate: '2024-12-31' });

      expect(mockBookingModel.find).toHaveBeenCalledWith({
        preferredDate: {
          $lte: new Date('2024-12-31'),
        },
      });
      expect(result).toEqual(mockBookings);
    });
  });

  describe('findOne', () => {
    it('should return a booking by id', async () => {
      const mockExec = jest.fn().mockResolvedValue(mockBooking);
      mockBookingModel.findById.mockReturnValue({
        exec: mockExec,
      });

      const result = await service.findOne('507f1f77bcf86cd799439011');

      expect(mockBookingModel.findById).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
      expect(result).toEqual(mockBooking);
    });

    it('should return null for non-existent booking', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      mockBookingModel.findById.mockReturnValue({
        exec: mockExec,
      });

      const result = await service.findOne('507f1f77bcf86cd799439011');

      expect(result).toBeNull();
    });
  });

  describe('updateStatus', () => {
    it('should update booking status to confirmed', async () => {
      const updateBookingDto: UpdateBookingDto = {
        status: BookingStatus.CONFIRMED,
      };
      const updatedBooking = {
        ...mockBooking,
        status: BookingStatus.CONFIRMED,
      };
      const mockExec = jest.fn().mockResolvedValue(updatedBooking);
      mockBookingModel.findByIdAndUpdate.mockReturnValue({
        exec: mockExec,
      });

      const result = await service.updateStatus(
        '507f1f77bcf86cd799439011',
        updateBookingDto,
      );

      expect(mockBookingModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        { status: BookingStatus.CONFIRMED },
        { new: true },
      );
      expect(result).toEqual(updatedBooking);
    });

    it('should update booking status to completed', async () => {
      const updateBookingDto: UpdateBookingDto = {
        status: BookingStatus.COMPLETED,
      };
      const updatedBooking = {
        ...mockBooking,
        status: BookingStatus.COMPLETED,
      };
      const mockExec = jest.fn().mockResolvedValue(updatedBooking);
      mockBookingModel.findByIdAndUpdate.mockReturnValue({
        exec: mockExec,
      });

      const result = await service.updateStatus(
        '507f1f77bcf86cd799439011',
        updateBookingDto,
      );

      expect(result?.status).toBe(BookingStatus.COMPLETED);
    });

    it('should update booking status to cancelled', async () => {
      const updateBookingDto: UpdateBookingDto = {
        status: BookingStatus.CANCELLED,
      };
      const updatedBooking = {
        ...mockBooking,
        status: BookingStatus.CANCELLED,
      };
      const mockExec = jest.fn().mockResolvedValue(updatedBooking);
      mockBookingModel.findByIdAndUpdate.mockReturnValue({
        exec: mockExec,
      });

      const result = await service.updateStatus(
        '507f1f77bcf86cd799439011',
        updateBookingDto,
      );

      expect(result?.status).toBe(BookingStatus.CANCELLED);
    });

    it('should throw BadRequestException for invalid status', async () => {
      const updateBookingDto = {
        status: 'invalid-status' as any,
      };

      await expect(
        service.updateStatus('507f1f77bcf86cd799439011', updateBookingDto),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.updateStatus('507f1f77bcf86cd799439011', updateBookingDto),
      ).rejects.toThrow('Invalid status');
    });

    it('should return null for non-existent booking', async () => {
      const updateBookingDto: UpdateBookingDto = {
        status: BookingStatus.CONFIRMED,
      };
      const mockExec = jest.fn().mockResolvedValue(null);
      mockBookingModel.findByIdAndUpdate.mockReturnValue({
        exec: mockExec,
      });

      const result = await service.updateStatus(
        '507f1f77bcf86cd799439011',
        updateBookingDto,
      );

      expect(result).toBeNull();
    });
  });

  describe('error handling for database failures', () => {
    it('should propagate database errors when creating a booking', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const futureDateString = futureDate.toISOString().split('T')[0];

      const createBookingDto: CreateBookingDto = {
        customerName: 'John Doe',
        email: 'john@example.com',
        phone: '555-0123',
        service: 'Swedish Massage',
        preferredDate: futureDateString,
        preferredTime: '14:00',
      };

      const dbError = new Error('Database connection failed');
      const mockSave = jest.fn().mockRejectedValue(dbError);
      const mockBookingInstance = {
        save: mockSave,
      };

      mockBookingModel.mockReturnValue(mockBookingInstance);

      await expect(service.create(createBookingDto)).rejects.toThrow(
        'Database connection failed',
      );
    });

    it('should propagate database errors when finding all bookings', async () => {
      const dbError = new Error('Database query failed');
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockRejectedValue(dbError),
      };
      mockBookingModel.find.mockReturnValue(mockQuery);

      await expect(service.findAll()).rejects.toThrow('Database query failed');
    });

    it('should propagate database errors when finding one booking', async () => {
      const dbError = new Error('Database query failed');
      const mockExec = jest.fn().mockRejectedValue(dbError);
      mockBookingModel.findById.mockReturnValue({
        exec: mockExec,
      });

      await expect(service.findOne('507f1f77bcf86cd799439011')).rejects.toThrow(
        'Database query failed',
      );
    });

    it('should propagate database errors when updating booking status', async () => {
      const updateBookingDto: UpdateBookingDto = {
        status: BookingStatus.CONFIRMED,
      };
      const dbError = new Error('Database update failed');
      const mockExec = jest.fn().mockRejectedValue(dbError);
      mockBookingModel.findByIdAndUpdate.mockReturnValue({
        exec: mockExec,
      });

      await expect(
        service.updateStatus('507f1f77bcf86cd799439011', updateBookingDto),
      ).rejects.toThrow('Database update failed');
    });
  });
});
