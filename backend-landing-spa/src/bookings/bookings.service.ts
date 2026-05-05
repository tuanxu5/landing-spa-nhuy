import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument, BookingStatus } from './schemas/booking.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

export interface BookingFilters {
  status?: BookingStatus;
  startDate?: string;
  endDate?: string;
  service?: string;
}

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
  ) {}

  /**
   * Create a new booking
   * Validates that the preferred date is not in the past
   */
  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    // Validate that the preferred date is not in the past
    const preferredDate = new Date(createBookingDto.preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (preferredDate < today) {
      throw new BadRequestException('Preferred date must not be in the past');
    }

    const booking = new this.bookingModel({
      ...createBookingDto,
      preferredDate,
      status: BookingStatus.PENDING,
    });

    return booking.save();
  }

  /**
   * Find all bookings with optional filters
   * Supports filtering by status, date range, and service
   * Returns bookings sorted by creation date in reverse chronological order
   */
  async findAll(filters?: BookingFilters): Promise<Booking[]> {
    const query: any = {};

    // Filter by status
    if (filters?.status) {
      query.status = filters.status;
    }

    // Filter by date range
    if (filters?.startDate || filters?.endDate) {
      query.preferredDate = {};
      
      if (filters.startDate) {
        query.preferredDate.$gte = new Date(filters.startDate);
      }
      
      if (filters.endDate) {
        query.preferredDate.$lte = new Date(filters.endDate);
      }
    }

    // Filter by service
    if (filters?.service) {
      query.service = filters.service;
    }

    // Sort by creation date in reverse chronological order (newest first)
    return this.bookingModel
      .find(query)
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Find a single booking by ID
   */
  async findOne(id: string): Promise<Booking | null> {
    return this.bookingModel.findById(id).exec();
  }

  /**
   * Update booking status
   * Validates that the status is a valid BookingStatus enum value
   */
  async updateStatus(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking | null> {
    // Validate status is a valid enum value
    if (!Object.values(BookingStatus).includes(updateBookingDto.status)) {
      throw new BadRequestException(
        `Invalid status. Must be one of: ${Object.values(BookingStatus).join(', ')}`,
      );
    }

    return this.bookingModel
      .findByIdAndUpdate(
        id,
        { status: updateBookingDto.status },
        { new: true }, // Return the updated document
      )
      .exec();
  }
}
