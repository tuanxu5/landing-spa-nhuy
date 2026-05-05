# Authentication Module

This module provides authentication and authorization functionality for the spa booking system.

## Components

### DTOs (Data Transfer Objects)

#### LoginDto
- **File**: `dto/login.dto.ts`
- **Purpose**: Validates login credentials
- **Fields**:
  - `username` (required, string)
  - `password` (required, string)

#### ChangePasswordDto
- **File**: `dto/change-password.dto.ts`
- **Purpose**: Validates password change requests
- **Fields**:
  - `currentPassword` (required, string)
  - `newPassword` (required, string, min 8 characters)
  - `confirmPassword` (required, string)

### Controller

#### AuthController
- **File**: `auth.controller.ts`
- **Base Route**: `/api/auth`

**Endpoints**:

1. **POST /api/auth/login**
   - Public endpoint
   - Authenticates administrator credentials
   - Returns session token on success
   - Updates last login timestamp

2. **POST /api/auth/logout**
   - Protected endpoint (requires AuthGuard)
   - Invalidates current session
   - Returns success message

3. **POST /api/auth/change-password**
   - Protected endpoint (requires AuthGuard)
   - Verifies current password
   - Validates new passwords match
   - Updates password hash
   - Returns success message

4. **GET /api/auth/me**
   - Protected endpoint (requires AuthGuard)
   - Returns current authenticated administrator
   - Excludes password hash from response

### Service

#### AuthService
- **File**: `auth.service.ts`
- **Purpose**: Handles authentication business logic

**Methods**:
- `validateCredentials(username, password)`: Validates administrator credentials
- `hashPassword(password)`: Hashes password using bcrypt
- `comparePassword(password, hash)`: Compares plain password with hash
- `createSession(administratorId)`: Creates new session with 8-hour expiration
- `validateSession(token)`: Validates session token and checks expiration
- `invalidateSession(token)`: Removes session from database

### Guard

#### AuthGuard
- **File**: `guards/auth.guard.ts`
- **Purpose**: Protects routes requiring authentication

**Functionality**:
- Extracts Bearer token from Authorization header
- Validates session token
- Attaches administrator ID to request object
- Returns 401 for invalid/expired sessions

### Schemas

#### Administrator Schema
- **File**: `schemas/administrator.schema.ts`
- **Fields**:
  - `username` (unique, 3-50 characters)
  - `passwordHash` (bcrypt hash)
  - `email` (valid email format)
  - `lastLoginAt` (optional, updated on login)
  - `createdAt`, `updatedAt` (auto-managed)

#### Session Schema
- **File**: `schemas/session.schema.ts`
- **Fields**:
  - `administratorId` (reference to Administrator)
  - `token` (unique session token)
  - `expiresAt` (8 hours from creation)
  - `lastActivityAt` (updated on each request)
  - `createdAt` (auto-managed)

## Module Configuration

### AuthModule
- **File**: `auth.module.ts`
- **Imports**: MongooseModule with Administrator and Session schemas
- **Controllers**: AuthController
- **Providers**: AuthService, AuthGuard
- **Exports**: AuthService, AuthGuard (for use in other modules)

## Testing

All components have comprehensive unit tests:
- `dto/login.dto.spec.ts` - LoginDto validation tests
- `dto/change-password.dto.spec.ts` - ChangePasswordDto validation tests
- `auth.controller.spec.ts` - Controller endpoint tests
- `auth.service.spec.ts` - Service method tests
- `guards/auth.guard.spec.ts` - Guard authorization tests
- `schemas/administrator.schema.spec.ts` - Administrator schema tests
- `schemas/session.schema.spec.ts` - Session schema tests

## Usage Example

### Login
```typescript
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}

Response:
{
  "token": "abc123..."
}
```

### Get Current User
```typescript
GET /api/auth/me
Authorization: Bearer abc123...

Response:
{
  "id": "507f1f77bcf86cd799439011",
  "username": "admin",
  "email": "admin@spa.com",
  "lastLoginAt": "2024-01-15T10:30:00.000Z"
}
```

### Change Password
```typescript
POST /api/auth/change-password
Authorization: Bearer abc123...
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}

Response:
{
  "message": "Password changed successfully"
}
```

### Logout
```typescript
POST /api/auth/logout
Authorization: Bearer abc123...

Response:
{
  "message": "Logged out successfully"
}
```

## Security Features

- Passwords hashed with bcrypt (10 salt rounds)
- Session tokens generated with crypto.randomBytes (32 bytes)
- Sessions expire after 8 hours
- Session activity tracked and updated on each request
- Expired sessions automatically cleaned up
- Password hash never exposed in API responses
- Current password verification required for password changes
