import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingSchema, BookingStatus } from './booking.schema';

describe('BookingSchema', () => {
  it('should have the correct indexes defined', () => {
    const indexes = BookingSchema.indexes();

    // Check that we have the expected number of indexes
    expect(indexes.length).toBeGreaterThanOrEqual(3);

    // Check for createdAt index
    const createdAtIndex = indexes.find(
      (index) => index[0].createdAt !== undefined,
    );
    expect(createdAtIndex).toBeDefined();
    expect(createdAtIndex[0].createdAt).toBe(-1);

    // Check for status index
    const statusIndex = indexes.find((index) => index[0].status !== undefined);
    expect(statusIndex).toBeDefined();
    expect(statusIndex[0].status).toBe(1);

    // Check for preferredDate index
    const preferredDateIndex = indexes.find(
      (index) => index[0].preferredDate !== undefined,
    );
    expect(preferredDateIndex).toBeDefined();
    expect(preferredDateIndex[0].preferredDate).toBe(1);
  });

  it('should have correct default values', () => {
    const schemaDefinition = BookingSchema.obj;

    expect(schemaDefinition.status.default).toBe(BookingStatus.PENDING);
  });

  it('should have timestamps enabled', () => {
    const schemaOptions = BookingSchema.options;
    expect(schemaOptions.timestamps).toBe(true);
  });

  it('should have correct field requirements', () => {
    const schemaDefinition = BookingSchema.obj;

    expect(schemaDefinition.customerName.required).toBe(true);
    expect(schemaDefinition.email.required).toBe(true);
    expect(schemaDefinition.phone.required).toBe(true);
    expect(schemaDefinition.service.required).toBe(true);
    expect(schemaDefinition.preferredDate.required).toBe(true);
    expect(schemaDefinition.preferredTime.required).toBe(true);
    expect(schemaDefinition.status.required).toBe(true);
  });

  it('should have correct field constraints', () => {
    const schemaDefinition = BookingSchema.obj;

    expect(schemaDefinition.customerName.minlength).toBe(1);
    expect(schemaDefinition.customerName.maxlength).toBe(100);
  });

  it('should have correct enum values for status', () => {
    const schemaDefinition = BookingSchema.obj;

    expect(schemaDefinition.status.enum).toEqual([
      'pending',
      'confirmed',
      'completed',
      'cancelled',
    ]);
  });
});
