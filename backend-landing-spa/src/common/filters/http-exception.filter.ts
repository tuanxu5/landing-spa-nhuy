import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Global HTTP exception filter for consistent error responses
 * Implements requirements 9.1-9.7 for API error handling
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Determine HTTP status code
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Extract error message and details
    const errorResponse = this.getErrorResponse(exception, status);

    // Log error with context
    this.logError(exception, request, status);

    // Send consistent error response
    response.status(status).json({
      statusCode: status,
      message: errorResponse.message,
      errors: errorResponse.errors,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  /**
   * Extract error message and validation errors from exception
   */
  private getErrorResponse(
    exception: unknown,
    status: number,
  ): { message: string; errors: any[] } {
    // For 500 errors, never expose internal details
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      return {
        message: 'Internal server error',
        errors: [],
      };
    }

    if (exception instanceof HttpException) {
      const response = exception.getResponse();

      // Handle validation errors from class-validator
      if (typeof response === 'object' && 'message' in response) {
        const exceptionResponse = response as any;

        // If message is an array, it's validation errors
        if (Array.isArray(exceptionResponse.message)) {
          return {
            message: 'Validation failed',
            errors: exceptionResponse.message.map((msg: string) => ({
              message: msg,
            })),
          };
        }

        // Single error message
        return {
          message: exceptionResponse.message || exception.message,
          errors: [],
        };
      }

      // String response
      return {
        message: exception.message,
        errors: [],
      };
    }

    // Fallback for unknown exceptions
    return {
      message: 'An unexpected error occurred',
      errors: [],
    };
  }

  /**
   * Log error with timestamp and request context
   * Requirement 9.6: Log all errors with sufficient detail for debugging
   */
  private logError(exception: unknown, request: Request, status: number) {
    const timestamp = new Date().toISOString();
    const method = request.method;
    const url = request.url;
    const userAgent = request.get('user-agent') || 'unknown';
    const ip = request.ip || 'unknown';

    // Build log context
    const context = {
      timestamp,
      method,
      url,
      statusCode: status,
      ip,
      userAgent,
    };

    // Log based on severity
    if (status >= 500) {
      // Server errors - log with full stack trace
      this.logger.error(
        {
          ...context,
          message:
            exception instanceof Error ? exception.message : 'Unknown error',
          stack: exception instanceof Error ? exception.stack : undefined,
        },
        'Server error occurred',
      );
    } else if (status >= 400) {
      // Client errors - log without stack trace
      this.logger.warn(
        {
          ...context,
          message:
            exception instanceof Error ? exception.message : 'Unknown error',
        },
        'Client error occurred',
      );
    }
  }
}
