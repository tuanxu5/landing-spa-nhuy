import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BookingsService, BookingFilters, PaginatedBookings } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking, BookingStatus } from './schemas/booking.schema';

@Controller('api/bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  /**
   * POST /api/bookings
   * Create a new booking
   * Public endpoint - no authentication required
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBookingDto: CreateBookingDto): Promise<Booking> {
    try {
      return await this.bookingsService.create(createBookingDto);
    } catch (error) {
      // Re-throw BadRequestException from service
      if (error instanceof BadRequestException) {
        throw error;
      }
      // Handle unexpected errors
      throw new BadRequestException('Failed to create booking');
    }
  }

  /**
   * GET /api/bookings
   * Retrieve all bookings with optional filters and pagination
   * Authentication will be added later
   */
  @Get()
  async findAll(
    @Query('status') status?: BookingStatus,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('service') service?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<PaginatedBookings> {
    const filters: BookingFilters = {};

    // Build filters from query parameters
    if (status) {
      // Validate status is a valid enum value
      if (!Object.values(BookingStatus).includes(status)) {
        throw new BadRequestException(
          `Invalid status. Must be one of: ${Object.values(BookingStatus).join(', ')}`,
        );
      }
      filters.status = status;
    }

    if (startDate) {
      // Validate date format
      if (isNaN(Date.parse(startDate))) {
        throw new BadRequestException('Invalid startDate format');
      }
      filters.startDate = startDate;
    }

    if (endDate) {
      // Validate date format
      if (isNaN(Date.parse(endDate))) {
        throw new BadRequestException('Invalid endDate format');
      }
      filters.endDate = endDate;
    }

    if (service) {
      filters.service = service;
    }

    // Pagination parameters
    if (page) {
      const pageNum = parseInt(page, 10);
      if (isNaN(pageNum) || pageNum < 1) {
        throw new BadRequestException('Invalid page number');
      }
      filters.page = pageNum;
    }

    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
        throw new BadRequestException('Invalid limit (must be between 1 and 100)');
      }
      filters.limit = limitNum;
    }

    return await this.bookingsService.findAll(filters);
  }

  /**
   * GET /api/bookings/:id
   * Retrieve a specific booking by ID
   * Authentication will be added later
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Booking> {
    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('Invalid booking ID format');
    }

    const booking = await this.bookingsService.findOne(id);

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  /**
   * PATCH /api/bookings/:id
   * Update booking status
   * Authentication will be added later
   */
  @Patch(':id')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ): Promise<Booking> {
    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('Invalid booking ID format');
    }

    try {
      const booking = await this.bookingsService.updateStatus(
        id,
        updateBookingDto,
      );

      if (!booking) {
        throw new NotFoundException(`Booking with ID ${id} not found`);
      }

      return booking;
    } catch (error) {
      // Re-throw known exceptions
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      // Handle unexpected errors
      throw new BadRequestException('Failed to update booking status');
    }
  }
}
