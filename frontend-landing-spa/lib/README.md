# Frontend Infrastructure

This directory contains the core utilities and infrastructure for the Spa Booking Landing Page frontend application.

## Files

### `api.ts`
API client utility for communicating with the backend NestJS API.

**Features:**
- Axios-based HTTP client with interceptors
- Automatic authentication token injection
- Centralized error handling
- Session expiration handling (auto-redirect to login)
- Type-safe API methods for bookings, posts, and authentication

**Configuration:**
- Base URL: Set via `NEXT_PUBLIC_API_BASE_URL` environment variable (defaults to `http://localhost:3000`)
- Timeout: 10 seconds

**Usage:**
```typescript
import { bookingsApi, postsApi, authApi } from '@/lib/api';

// Create a booking
const booking = await bookingsApi.create({
  customerName: 'John Doe',
  email: 'john@example.com',
  phone: '555-0123',
  service: 'Swedish Massage',
  preferredDate: '2024-12-25',
  preferredTime: '14:00',
});

// Get all published posts
const posts = await postsApi.getAll({ status: 'published' });

// Login
const response = await authApi.login({
  username: 'admin',
  password: 'password123',
});
```

### `auth.ts`
Authentication utilities for session token management.

**Features:**
- Session token storage in localStorage
- Administrator data caching
- Session validation helpers
- SSR-safe (checks for browser environment)

**Usage:**
```typescript
import { setSession, getSessionToken, isAuthenticated, clearSession } from '@/lib/auth';

// After successful login
setSession(token, administrator);

// Check if user is authenticated
if (isAuthenticated()) {
  // User is logged in
}

// Logout
clearSession();
```

### `validation.ts`
Form validation utilities using Zod schemas.

**Features:**
- Type-safe validation schemas for all forms
- Zod-based validation with detailed error messages
- Helper functions for common validations
- React Hook Form integration ready

**Schemas:**
- `bookingFormSchema` - Customer booking form validation
- `loginFormSchema` - Admin login form validation
- `passwordChangeFormSchema` - Password change form validation
- `postFormSchema` - Post creation/editing form validation

**Usage:**
```typescript
import { bookingFormSchema, formatZodErrors } from '@/lib/validation';

// Validate form data
const result = bookingFormSchema.safeParse(formData);

if (!result.success) {
  const errors = formatZodErrors(result.error);
  // errors = { email: 'Invalid email format', phone: 'Invalid phone number format' }
}

// With React Hook Form
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const form = useForm({
  resolver: zodResolver(bookingFormSchema),
});
```

## Environment Variables

Create a `.env.local` file in the frontend root directory:

```env
# Backend API URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

## Type Definitions

All TypeScript types are defined in `/types/index.ts` and can be imported as:

```typescript
import type { Booking, Post, Administrator } from '@/types';
```
