# HTTP Exception Filter

This directory contains the global HTTP exception filter for consistent error handling across the API.

## Overview

The `HttpExceptionFilter` provides:
- **Consistent error response format** across all endpoints
- **Comprehensive logging** with request context
- **Security protection** by hiding sensitive information in 500 errors
- **Validation error formatting** for class-validator errors

## Error Response Format

All errors return a consistent JSON structure:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "message": "email must be a valid email"
    },
    {
      "message": "name is required"
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/bookings"
}
```

## HTTP Status Codes

The filter handles the following status codes:

- **400 Bad Request**: Validation errors, invalid input
- **401 Unauthorized**: Authentication failures
- **403 Forbidden**: Authorization failures
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server errors (details hidden for security)

## Logging

The filter logs all errors with context:

### Client Errors (4xx)
Logged as **WARN** with:
- Timestamp
- HTTP method
- Request URL
- Status code
- IP address
- User agent
- Error message

### Server Errors (5xx)
Logged as **ERROR** with:
- All client error fields
- Stack trace (for debugging)

**Note**: Stack traces are logged but never exposed in API responses.

## Security Features

### Sensitive Information Protection

For 500 Internal Server Error responses:
- Original error messages are **not exposed** to clients
- Generic "Internal server error" message is returned
- Full error details are logged for debugging
- Stack traces are never included in responses

Example:
```typescript
// Internal error with sensitive data
throw new Error('Database password is: secret123');

// Client receives:
{
  "statusCode": 500,
  "message": "Internal server error",
  "errors": [],
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/bookings"
}

// Server logs contain full details for debugging
```

## Usage

The filter is registered globally in `main.ts`:

```typescript
app.useGlobalFilters(new HttpExceptionFilter());
```

No additional configuration is needed in controllers or services. All exceptions are automatically caught and formatted.

## Testing

Comprehensive unit tests are provided in `http-exception.filter.spec.ts`:
- Tests for all HTTP status codes
- Validation error formatting
- Sensitive information protection
- Response format consistency

Run tests:
```bash
npm test -- http-exception.filter.spec.ts
```

## Requirements Satisfied

This implementation satisfies the following requirements:

- **9.1**: Returns HTTP 400 with field error messages for validation errors
- **9.2**: Returns HTTP 401 for authentication errors
- **9.3**: Returns HTTP 403 for authorization errors
- **9.4**: Returns HTTP 404 for resource not found
- **9.5**: Returns HTTP 500 for server errors
- **9.6**: Logs all errors with sufficient detail for debugging
- **9.7**: Does not expose sensitive information in error responses
