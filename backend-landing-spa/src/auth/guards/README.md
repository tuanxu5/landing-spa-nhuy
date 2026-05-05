# Authentication Guard

## Overview

The `AuthGuard` is a NestJS guard that protects routes requiring administrator authentication. It validates session tokens from the `Authorization` header and attaches the administrator ID to the request object.

## Usage

### Protecting a Single Route

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('api/admin')
export class AdminController {
  @Get('dashboard')
  @UseGuards(AuthGuard)
  getDashboard() {
    return { message: 'Protected dashboard data' };
  }
}
```

### Protecting an Entire Controller

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('api/admin')
@UseGuards(AuthGuard)
export class AdminController {
  @Get('dashboard')
  getDashboard() {
    return { message: 'Protected dashboard data' };
  }

  @Get('settings')
  getSettings() {
    return { message: 'Protected settings data' };
  }
}
```

### Accessing Administrator ID in Controllers

The guard attaches the `administratorId` to the request object, which can be accessed using a custom decorator or directly from the request:

```typescript
import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Request } from 'express';

@Controller('api/admin')
@UseGuards(AuthGuard)
export class AdminController {
  @Get('profile')
  getProfile(@Req() request: Request & { administratorId: Types.ObjectId }) {
    const administratorId = request.administratorId;
    return { administratorId };
  }
}
```

## Authorization Header Format

The guard expects the `Authorization` header in the following format:

```
Authorization: Bearer <session-token>
```

Example:
```
Authorization: Bearer abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

## Error Responses

The guard throws `UnauthorizedException` (HTTP 401) in the following cases:

1. **Missing Authorization Header**
   ```json
   {
     "statusCode": 401,
     "message": "Authorization header is missing"
   }
   ```

2. **Invalid Header Format**
   ```json
   {
     "statusCode": 401,
     "message": "Invalid authorization header format"
   }
   ```

3. **Missing Token**
   ```json
   {
     "statusCode": 401,
     "message": "Token is missing"
   }
   ```

4. **Invalid or Expired Session**
   ```json
   {
     "statusCode": 401,
     "message": "Invalid or expired session"
   }
   ```

## Implementation Details

The guard performs the following steps:

1. Extracts the `Authorization` header from the request
2. Validates the header format (must be "Bearer <token>")
3. Extracts the session token
4. Validates the session using `AuthService.validateSession()`
5. Attaches the `administratorId` to the request object
6. Returns `true` to allow the request to proceed

If any step fails, the guard throws an `UnauthorizedException` with an appropriate error message.

## Session Validation

The guard uses `AuthService.validateSession()` to validate the session token. This method:

- Checks if the session exists in the database
- Verifies the session has not expired
- Updates the `lastActivityAt` timestamp
- Returns the session document if valid, or `null` if invalid/expired

## Testing

The guard includes comprehensive unit tests covering:

- Valid Bearer token authentication
- Missing Authorization header
- Invalid header formats
- Empty or missing tokens
- Invalid/expired sessions
- Special characters in tokens
- Case sensitivity
- Edge cases

Run the tests with:

```bash
npm test -- auth.guard.spec.ts
```
