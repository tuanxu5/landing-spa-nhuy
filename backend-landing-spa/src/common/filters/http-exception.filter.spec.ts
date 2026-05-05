import { HttpExceptionFilter } from './http-exception.filter';
import {
  HttpException,
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockResponse: any;
  let mockRequest: any;
  let mockArgumentsHost: ArgumentsHost;

  beforeEach(() => {
    filter = new HttpExceptionFilter();

    // Mock response object
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    // Mock request object
    mockRequest = {
      url: '/api/test',
      method: 'GET',
      ip: '127.0.0.1',
      get: jest.fn().mockReturnValue('test-user-agent'),
    };

    // Mock ArgumentsHost
    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as any;
  });

  describe('catch', () => {
    it('should handle BadRequestException with validation errors', () => {
      const exception = new BadRequestException({
        message: ['email must be a valid email', 'name is required'],
      });

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Validation failed',
          errors: [
            { message: 'email must be a valid email' },
            { message: 'name is required' },
          ],
          timestamp: expect.any(String),
          path: '/api/test',
        }),
      );
    });

    it('should handle BadRequestException with single message', () => {
      const exception = new BadRequestException('Invalid input');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid input',
          errors: [],
          timestamp: expect.any(String),
          path: '/api/test',
        }),
      );
    });

    it('should handle UnauthorizedException', () => {
      const exception = new UnauthorizedException('Invalid credentials');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Invalid credentials',
          errors: [],
          timestamp: expect.any(String),
          path: '/api/test',
        }),
      );
    });

    it('should handle ForbiddenException', () => {
      const exception = new ForbiddenException('Insufficient permissions');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Insufficient permissions',
          errors: [],
          timestamp: expect.any(String),
          path: '/api/test',
        }),
      );
    });

    it('should handle NotFoundException', () => {
      const exception = new NotFoundException('Resource not found');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Resource not found',
          errors: [],
          timestamp: expect.any(String),
          path: '/api/test',
        }),
      );
    });

    it('should handle InternalServerErrorException without exposing details', () => {
      const exception = new InternalServerErrorException(
        'Database connection failed',
      );

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
          errors: [],
          timestamp: expect.any(String),
          path: '/api/test',
        }),
      );
    });

    it('should handle non-HTTP exceptions as internal server errors', () => {
      const exception = new Error('Unexpected error');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
          errors: [],
          timestamp: expect.any(String),
          path: '/api/test',
        }),
      );
    });

    it('should include timestamp in ISO format', () => {
      const exception = new BadRequestException('Test error');

      filter.catch(exception, mockArgumentsHost);

      const callArgs = mockResponse.json.mock.calls[0][0];
      expect(callArgs.timestamp).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      );
    });

    it('should include request path in error response', () => {
      mockRequest.url = '/api/bookings/123';
      const exception = new NotFoundException('Booking not found');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          path: '/api/bookings/123',
        }),
      );
    });

    it('should handle exceptions with custom response objects', () => {
      const exception = new HttpException(
        {
          message: 'Custom error message',
          customField: 'custom value',
        },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Custom error message',
          errors: [],
        }),
      );
    });

    it('should handle string exception responses', () => {
      const exception = new HttpException(
        'Simple error message',
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Simple error message',
          errors: [],
        }),
      );
    });
  });

  describe('error response format', () => {
    it('should always include statusCode, message, errors, timestamp, and path', () => {
      const exception = new BadRequestException('Test error');

      filter.catch(exception, mockArgumentsHost);

      const callArgs = mockResponse.json.mock.calls[0][0];
      expect(callArgs).toHaveProperty('statusCode');
      expect(callArgs).toHaveProperty('message');
      expect(callArgs).toHaveProperty('errors');
      expect(callArgs).toHaveProperty('timestamp');
      expect(callArgs).toHaveProperty('path');
    });

    it('should have errors as an array', () => {
      const exception = new BadRequestException('Test error');

      filter.catch(exception, mockArgumentsHost);

      const callArgs = mockResponse.json.mock.calls[0][0];
      expect(Array.isArray(callArgs.errors)).toBe(true);
    });
  });

  describe('sensitive information protection', () => {
    it('should not expose internal error details for 500 errors', () => {
      const exception = new Error('Database password is: secret123');

      filter.catch(exception, mockArgumentsHost);

      const callArgs = mockResponse.json.mock.calls[0][0];
      expect(callArgs.message).toBe('Internal server error');
      expect(callArgs.message).not.toContain('secret123');
      expect(callArgs.message).not.toContain('Database password');
    });

    it('should not expose stack traces in error responses', () => {
      const exception = new Error('Test error with stack');

      filter.catch(exception, mockArgumentsHost);

      const callArgs = mockResponse.json.mock.calls[0][0];
      expect(callArgs).not.toHaveProperty('stack');
    });
  });
});
