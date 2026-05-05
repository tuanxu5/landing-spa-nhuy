# Database Setup Documentation

## Overview

This document describes the MongoDB database configuration for the Spa Booking Landing Page backend.

## Database Connection

**Database Provider:** MongoDB Atlas  
**Connection String:** Configured via environment variable `MONGODB_URI`  
**Database Name:** spa-nhuy

## Configuration

### Environment Variables

Create a `.env` file in the root of the backend directory with the following variables:

```env
MONGODB_URI=mongodb+srv://uyenptforimex_db_user:Ptuylht090821@cluster0.z6zymcn.mongodb.net/spa-nhuy?retryWrites=true&w=majority
PORT=3000
```

### Installed Packages

The following packages were installed for database and configuration support:

- `@nestjs/mongoose` - NestJS integration for Mongoose ODM
- `mongoose` - MongoDB object modeling tool
- `@nestjs/config` - Configuration module for environment variables
- `bcrypt` - Password hashing library
- `@types/bcrypt` - TypeScript types for bcrypt
- `class-validator` - Validation decorators for DTOs
- `class-transformer` - Transformation decorators for DTOs

## Module Structure

### DatabaseModule

Located at `src/database/database.module.ts`, this module:

- Imports `ConfigModule` to access environment variables
- Configures `MongooseModule` with async factory pattern
- Uses the `MONGODB_URI` from environment configuration
- Enables retry writes and majority write concern

### AppModule

The root module imports:

- `ConfigModule.forRoot()` - Global configuration with `.env` file support
- `DatabaseModule` - Database connection setup

## Connection Verification

The application verifies the database connection on startup:

1. NestJS initializes the `MongooseCoreModule`
2. Connection is established to MongoDB Atlas
3. Success message is logged: "Database connection established successfully"
4. If connection fails, the application logs the error and exits

## Testing

A test suite is provided at `src/database/database.module.spec.ts` to verify:

- The database module is properly defined
- The database connection initializes without errors

Run the test with:

```bash
npm test -- database.module.spec.ts
```

## Global Validation

The application enables global validation pipes in `main.ts`:

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,           // Strip properties not in DTO
    forbidNonWhitelisted: true, // Throw error for unknown properties
    transform: true,            // Auto-transform payloads to DTO instances
  }),
);
```

This ensures all incoming requests are validated against their DTOs using `class-validator` decorators.

## Next Steps

Future tasks will implement:

1. **Booking Schema** - Define the booking data model
2. **Post Schema** - Define the post/content data model
3. **Administrator Schema** - Define the admin user data model
4. **Session Schema** - Define the session management data model

Each schema will include appropriate indexes for query optimization as specified in the design document.
