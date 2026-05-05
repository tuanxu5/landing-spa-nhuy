# Design Document: Spa Booking Landing Page

## Overview

The Spa Booking Landing Page system is a full-stack web application that provides a customer-facing booking interface and an administrative management panel. The system consists of three main components:

1. **Frontend Application (Next.js + Tailwind CSS)**: A responsive web application serving both the customer landing page and admin panel
2. **Backend API (NestJS)**: A RESTful API handling business logic, authentication, and data operations
3. **Database (MongoDB)**: A document database storing bookings, posts, and administrator accounts

### Key Features

- **Customer Booking**: Customers can browse services and submit booking requests through an intuitive form interface
- **Content Management**: Administrators can create, edit, and delete posts (services, promotions, information)
- **Booking Management**: Administrators can view, filter, and update booking statuses
- **Authentication & Authorization**: Secure login system with session management for administrators
- **Responsive Design**: Fully responsive interface optimized for desktop, tablet, and mobile devices
- **Modern UX**: Clean, professional design with smooth interactions and clear visual feedback

### Technology Stack

**Frontend:**
- Next.js 16.2.4 (React 19.2.4)
- Tailwind CSS 4.x for styling
- TypeScript for type safety

**Backend:**
- NestJS 11.x
- Express.js (via @nestjs/platform-express)
- Jest for testing

**Database:**
- MongoDB (hosted on MongoDB Atlas)
- Connection: `mongodb+srv://uyenptforimex_db_user:Ptuylht090821@cluster0.z6zymcn.mongodb.net/spa-nhuy?retryWrites=true&w=majority`

## Architecture

### System Architecture

The system follows a three-tier architecture pattern:

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer                             │
│  ┌──────────────────────┐  ┌──────────────────────────┐    │
│  │   Landing Page       │  │    Admin Panel           │    │
│  │  (Next.js/React)     │  │   (Next.js/React)        │    │
│  └──────────────────────┘  └──────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              NestJS Backend API                       │  │
│  │  ┌────────────┐ ┌────────────┐ ┌─────────────────┐  │  │
│  │  │  Bookings  │ │   Posts    │ │  Authentication │  │  │
│  │  │  Module    │ │   Module   │ │     Module      │  │  │
│  │  └────────────┘ └────────────┘ └─────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ MongoDB Driver
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              MongoDB Database                         │  │
│  │  ┌────────────┐ ┌────────────┐ ┌─────────────────┐  │  │
│  │  │  Bookings  │ │   Posts    │ │  Administrators │  │  │
│  │  │ Collection │ │ Collection │ │   Collection    │  │  │
│  │  └────────────┘ └────────────┘ └─────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Frontend Architecture

The Next.js application uses the App Router pattern with the following structure:

```
frontend-landing-spa/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page (/)
│   ├── admin/
│   │   ├── layout.tsx          # Admin layout with navigation
│   │   ├── login/
│   │   │   └── page.tsx        # Login page
│   │   ├── bookings/
│   │   │   └── page.tsx        # Bookings management
│   │   ├── posts/
│   │   │   ├── page.tsx        # Posts list
│   │   │   ├── new/
│   │   │   │   └── page.tsx    # Create post
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx # Edit post
│   │   └── settings/
│   │       └── page.tsx        # Account settings
│   └── globals.css
├── components/
│   ├── landing/
│   │   ├── Hero.tsx
│   │   ├── Services.tsx
│   │   ├── BookingForm.tsx
│   │   └── Footer.tsx
│   └── admin/
│       ├── Navigation.tsx
│       ├── BookingList.tsx
│       ├── PostEditor.tsx
│       └── PasswordChange.tsx
├── lib/
│   ├── api.ts                  # API client functions
│   ├── auth.ts                 # Authentication utilities
│   └── validation.ts           # Form validation
└── types/
    └── index.ts                # TypeScript type definitions
```

### Backend Architecture

The NestJS application follows a modular architecture:

```
backend-landing-spa/
├── src/
│   ├── main.ts                 # Application entry point
│   ├── app.module.ts           # Root module
│   ├── bookings/
│   │   ├── bookings.module.ts
│   │   ├── bookings.controller.ts
│   │   ├── bookings.service.ts
│   │   ├── dto/
│   │   │   ├── create-booking.dto.ts
│   │   │   └── update-booking.dto.ts
│   │   └── schemas/
│   │       └── booking.schema.ts
│   ├── posts/
│   │   ├── posts.module.ts
│   │   ├── posts.controller.ts
│   │   ├── posts.service.ts
│   │   ├── dto/
│   │   │   ├── create-post.dto.ts
│   │   │   └── update-post.dto.ts
│   │   └── schemas/
│   │       └── post.schema.ts
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── guards/
│   │   │   └── auth.guard.ts
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   └── change-password.dto.ts
│   │   └── schemas/
│   │       └── administrator.schema.ts
│   ├── database/
│   │   ├── database.module.ts
│   │   └── database.providers.ts
│   └── common/
│       ├── filters/
│       │   └── http-exception.filter.ts
│       ├── interceptors/
│       │   └── logging.interceptor.ts
│       └── pipes/
│           └── validation.pipe.ts
└── test/
    └── e2e/
```

## Components and Interfaces

### Frontend Components

#### Landing Page Components

**Hero Component**
- Purpose: Display main banner with spa branding and call-to-action
- Props: None (static content)
- State: None
- Renders: Hero section with background image, heading, and booking CTA button

**Services Component**
- Purpose: Display available spa services fetched from the API
- Props: None
- State: `services: Post[]`, `loading: boolean`, `error: string | null`
- Effects: Fetch services on mount from `/api/posts?category=service`
- Renders: Grid of service cards with images, titles, and descriptions

**BookingForm Component**
- Purpose: Collect customer booking information and submit to API
- Props: None
- State: `formData: BookingFormData`, `errors: ValidationErrors`, `submitting: boolean`, `success: boolean`
- Validation: Client-side validation before submission
- API Call: POST `/api/bookings`
- Renders: Form with fields for name, email, phone, service, date, time

**Footer Component**
- Purpose: Display footer with contact information and links
- Props: None
- State: None
- Renders: Footer section with spa contact details and social links

#### Admin Panel Components

**Navigation Component**
- Purpose: Provide navigation menu for admin panel
- Props: `currentPath: string`, `username: string`
- State: None
- Renders: Sidebar or top navigation with links to bookings, posts, settings, and logout

**BookingList Component**
- Purpose: Display and manage all customer bookings
- Props: None
- State: `bookings: Booking[]`, `filters: FilterState`, `loading: boolean`
- Effects: Fetch bookings on mount and when filters change
- API Calls: GET `/api/bookings`, PATCH `/api/bookings/:id`
- Renders: Table or list of bookings with filter controls and status update actions

**PostEditor Component**
- Purpose: Create or edit posts (services, promotions)
- Props: `postId?: string` (undefined for new posts)
- State: `postData: PostFormData`, `errors: ValidationErrors`, `saving: boolean`
- API Calls: GET `/api/posts/:id`, POST `/api/posts`, PUT `/api/posts/:id`
- Renders: Form with fields for title, content, image, category, status

**PasswordChange Component**
- Purpose: Allow administrators to change their password
- Props: None
- State: `formData: PasswordChangeData`, `errors: ValidationErrors`, `submitting: boolean`
- API Call: POST `/api/auth/change-password`
- Renders: Form with current password, new password, and confirmation fields

### Backend API Endpoints

#### Bookings API

**POST /api/bookings**
- Purpose: Create a new booking
- Authentication: None (public endpoint)
- Request Body: `CreateBookingDto`
- Response: `201 Created` with booking object
- Validation: Name, email, phone, service, date, time required and valid

**GET /api/bookings**
- Purpose: Retrieve all bookings with optional filters
- Authentication: Required (admin only)
- Query Parameters: `status`, `startDate`, `endDate`, `service`
- Response: `200 OK` with array of bookings
- Sorting: Reverse chronological by creation date

**GET /api/bookings/:id**
- Purpose: Retrieve a specific booking
- Authentication: Required (admin only)
- Response: `200 OK` with booking object or `404 Not Found`

**PATCH /api/bookings/:id**
- Purpose: Update booking status
- Authentication: Required (admin only)
- Request Body: `UpdateBookingDto` (status field)
- Response: `200 OK` with updated booking
- Allowed statuses: "pending", "confirmed", "completed", "cancelled"

#### Posts API

**POST /api/posts**
- Purpose: Create a new post
- Authentication: Required (admin only)
- Request Body: `CreatePostDto`
- Response: `201 Created` with post object
- Validation: Title (1-200 chars), content, category required

**GET /api/posts**
- Purpose: Retrieve posts with optional filters
- Authentication: None for published posts, required for all posts
- Query Parameters: `category`, `status`
- Response: `200 OK` with array of posts
- Filtering: Public endpoint returns only published posts

**GET /api/posts/:id**
- Purpose: Retrieve a specific post
- Authentication: None for published posts, required for unpublished
- Response: `200 OK` with post object or `404 Not Found`

**PUT /api/posts/:id**
- Purpose: Update an existing post
- Authentication: Required (admin only)
- Request Body: `UpdatePostDto`
- Response: `200 OK` with updated post

**DELETE /api/posts/:id**
- Purpose: Delete a post
- Authentication: Required (admin only)
- Response: `204 No Content` or `404 Not Found`

#### Authentication API

**POST /api/auth/login**
- Purpose: Authenticate administrator and create session
- Authentication: None
- Request Body: `LoginDto` (username, password)
- Response: `200 OK` with session token or `401 Unauthorized`
- Session: Creates session with 8-hour expiration

**POST /api/auth/logout**
- Purpose: Terminate administrator session
- Authentication: Required
- Response: `200 OK`
- Session: Invalidates current session

**POST /api/auth/change-password**
- Purpose: Change administrator password
- Authentication: Required
- Request Body: `ChangePasswordDto` (currentPassword, newPassword, confirmPassword)
- Response: `200 OK` or `400 Bad Request` with validation errors
- Validation: Current password verified, new passwords match

**GET /api/auth/me**
- Purpose: Retrieve current authenticated administrator
- Authentication: Required
- Response: `200 OK` with administrator object (excluding password)

## Data Models

### Booking Schema

```typescript
interface Booking {
  _id: ObjectId;
  customerName: string;        // 1-100 characters, letters/spaces/hyphens only
  email: string;               // Valid email format
  phone: string;               // Valid phone format
  service: string;             // Service name or ID
  preferredDate: Date;         // Must be present or future
  preferredTime: string;       // Time in HH:MM format
  status: BookingStatus;       // "pending" | "confirmed" | "completed" | "cancelled"
  notes?: string;              // Optional customer notes
  createdAt: Date;             // Auto-generated
  updatedAt: Date;             // Auto-updated
}

enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  COMPLETED = "completed",
  CANCELLED = "cancelled"
}
```

**Indexes:**
- `createdAt: -1` (for chronological sorting)
- `status: 1` (for filtering)
- `preferredDate: 1` (for date range queries)

### Post Schema

```typescript
interface Post {
  _id: ObjectId;
  title: string;               // 1-200 characters
  content: string;             // Rich text content
  featuredImage?: string;      // URL to image
  category: PostCategory;      // "service" | "promotion" | "information"
  status: PostStatus;          // "draft" | "published"
  publishedAt?: Date;          // Publication date
  createdAt: Date;             // Auto-generated
  updatedAt: Date;             // Auto-updated
}

enum PostCategory {
  SERVICE = "service",
  PROMOTION = "promotion",
  INFORMATION = "information"
}

enum PostStatus {
  DRAFT = "draft",
  PUBLISHED = "published"
}
```

**Indexes:**
- `publishedAt: -1` (for chronological sorting)
- `category: 1, status: 1` (for filtering)

### Administrator Schema

```typescript
interface Administrator {
  _id: ObjectId;
  username: string;            // Unique, 3-50 characters
  passwordHash: string;        // Bcrypt hash with salt
  email: string;               // Valid email format
  createdAt: Date;             // Auto-generated
  updatedAt: Date;             // Auto-updated
  lastLoginAt?: Date;          // Updated on successful login
}
```

**Indexes:**
- `username: 1` (unique index for login)

### Session Schema

```typescript
interface Session {
  _id: ObjectId;
  administratorId: ObjectId;   // Reference to Administrator
  token: string;               // Unique session token
  expiresAt: Date;             // 8 hours from creation
  createdAt: Date;             // Auto-generated
  lastActivityAt: Date;        // Updated on each authenticated request
}
```

**Indexes:**
- `token: 1` (unique index for lookup)
- `expiresAt: 1` (TTL index for automatic cleanup)

## Error Handling

### Frontend Error Handling

**API Communication Errors**
- Network failures: Display user-friendly message "Unable to connect. Please check your internet connection."
- Timeout errors: Display "Request timed out. Please try again."
- Server errors (5xx): Display "Something went wrong. Please try again later."

**Form Validation Errors**
- Display inline error messages below each invalid field
- Highlight invalid fields with red border
- Prevent form submission until all errors are resolved
- Show summary of errors at top of form if multiple fields are invalid

**Authentication Errors**
- Invalid credentials: Display "Invalid username or password"
- Session expired: Redirect to login page with message "Your session has expired. Please log in again."
- Unauthorized access: Redirect to login page

**Loading States**
- Display skeleton loaders or spinners while fetching data
- Disable form submit buttons during submission
- Show progress indicators for long-running operations

### Backend Error Handling

**Validation Errors (400 Bad Request)**
```typescript
{
  statusCode: 400,
  message: "Validation failed",
  errors: [
    {
      field: "email",
      message: "Invalid email format"
    },
    {
      field: "preferredDate",
      message: "Date must be in the future"
    }
  ]
}
```

**Authentication Errors (401 Unauthorized)**
```typescript
{
  statusCode: 401,
  message: "Invalid credentials" | "Session expired"
}
```

**Authorization Errors (403 Forbidden)**
```typescript
{
  statusCode: 403,
  message: "Insufficient permissions"
}
```

**Not Found Errors (404 Not Found)**
```typescript
{
  statusCode: 404,
  message: "Resource not found"
}
```

**Server Errors (500 Internal Server Error)**
```typescript
{
  statusCode: 500,
  message: "Internal server error"
}
```

**Database Connection Errors**
- Log detailed error information
- Implement retry logic with exponential backoff
- Return generic 500 error to client
- Alert system administrators if connection fails repeatedly

**Logging Strategy**
- Log all errors with timestamp, request ID, and stack trace
- Log authentication attempts (success and failure)
- Log database operations for audit trail
- Use structured logging format (JSON) for easy parsing
- Implement log levels: ERROR, WARN, INFO, DEBUG
- Never log sensitive information (passwords, tokens, full credit card numbers)

## Testing Strategy

### Testing Approach

This spa booking system is a full-stack web application involving UI rendering, database operations, authentication, and external integrations. **Property-based testing is NOT the primary testing approach** for this feature because:

1. **UI Rendering**: The landing page and admin panel involve visual layouts, responsive design, and user interactions that are better tested with snapshot tests, visual regression tests, and E2E tests
2. **Database Operations**: CRUD operations with MongoDB are better tested with integration tests using a test database
3. **Authentication & Sessions**: Session management and authentication flows are better tested with integration and E2E tests
4. **Form Validation**: While some validation logic could use property-based testing, the primary concern is ensuring specific business rules are met, which is better suited to example-based tests

### Testing Layers

**Unit Tests**
- Test individual functions and components in isolation
- Mock external dependencies (API calls, database)
- Focus on business logic, validation functions, and utility functions
- Target: 80%+ code coverage for business logic

**Integration Tests**
- Test API endpoints with real database (test instance)
- Test authentication flows
- Test data persistence and retrieval
- Verify error handling and validation at API level

**End-to-End Tests**
- Test complete user workflows (booking creation, admin login, post management)
- Test responsive design across different viewport sizes
- Test cross-browser compatibility
- Use tools like Playwright or Cypress

**Visual Regression Tests**
- Capture screenshots of key pages and components
- Detect unintended visual changes
- Test responsive layouts at different breakpoints

### Unit Testing Strategy

**Frontend Unit Tests (Jest + React Testing Library)**

Test the following components and utilities:

1. **BookingForm Component**
   - Renders all required fields
   - Validates email format
   - Validates phone format
   - Validates date is not in past
   - Prevents submission with empty required fields
   - Displays success message after successful submission
   - Displays error messages for validation failures

2. **Services Component**
   - Displays loading state while fetching
   - Displays services in grid layout
   - Displays error message on fetch failure
   - Filters services by category

3. **BookingList Component**
   - Displays bookings in table format
   - Filters bookings by status
   - Filters bookings by date range
   - Updates booking status on action
   - Displays empty state when no bookings

4. **Validation Utilities**
   - `validateEmail()`: Returns true for valid emails, false for invalid
   - `validatePhone()`: Returns true for valid phone formats
   - `validateName()`: Returns true for names with letters/spaces/hyphens only
   - `validateDate()`: Returns true for present/future dates, false for past

**Backend Unit Tests (Jest)**

Test the following services and utilities:

1. **BookingsService**
   - `create()`: Creates booking with valid data
   - `create()`: Throws validation error for invalid data
   - `findAll()`: Returns all bookings
   - `findAll()`: Filters by status correctly
   - `findAll()`: Filters by date range correctly
   - `updateStatus()`: Updates booking status
   - `updateStatus()`: Throws error for invalid status

2. **PostsService**
   - `create()`: Creates post with valid data
   - `create()`: Throws validation error for invalid title length
   - `findAll()`: Returns only published posts for public requests
   - `findAll()`: Returns all posts for admin requests
   - `update()`: Updates post fields
   - `delete()`: Removes post from database

3. **AuthService**
   - `validateCredentials()`: Returns true for valid credentials
   - `validateCredentials()`: Returns false for invalid credentials
   - `hashPassword()`: Returns bcrypt hash
   - `comparePassword()`: Returns true for matching password
   - `createSession()`: Creates session with 8-hour expiration
   - `validateSession()`: Returns true for valid, non-expired session
   - `validateSession()`: Returns false for expired session

### Integration Testing Strategy

**API Integration Tests (Supertest + Jest)**

Test complete request/response cycles with test database:

1. **Bookings API**
   - POST /api/bookings: Creates booking and returns 201
   - POST /api/bookings: Returns 400 for invalid data
   - GET /api/bookings: Returns 401 without authentication
   - GET /api/bookings: Returns bookings array with authentication
   - PATCH /api/bookings/:id: Updates status with authentication
   - PATCH /api/bookings/:id: Returns 404 for non-existent booking

2. **Posts API**
   - POST /api/posts: Returns 401 without authentication
   - POST /api/posts: Creates post with authentication
   - GET /api/posts: Returns only published posts without authentication
   - GET /api/posts: Returns all posts with authentication
   - PUT /api/posts/:id: Updates post with authentication
   - DELETE /api/posts/:id: Removes post with authentication

3. **Authentication API**
   - POST /api/auth/login: Returns session token for valid credentials
   - POST /api/auth/login: Returns 401 for invalid credentials
   - POST /api/auth/logout: Invalidates session
   - POST /api/auth/change-password: Updates password with valid current password
   - POST /api/auth/change-password: Returns 400 for incorrect current password

**Database Integration Tests**

- Test MongoDB connection establishment
- Test schema validation
- Test index creation
- Test query performance with sample data

### End-to-End Testing Strategy

**Customer Booking Flow (Playwright/Cypress)**

1. Navigate to landing page
2. Scroll to services section
3. Click on a service to view details
4. Scroll to booking form
5. Fill in customer information
6. Select service, date, and time
7. Submit booking
8. Verify success message displayed
9. Verify booking appears in admin panel

**Admin Management Flow**

1. Navigate to admin login page
2. Enter credentials and submit
3. Verify redirect to admin dashboard
4. Navigate to bookings page
5. Filter bookings by status
6. Update a booking status
7. Verify status change persisted
8. Navigate to posts page
9. Create a new post
10. Verify post appears in list
11. Edit the post
12. Verify changes saved
13. Delete the post
14. Verify post removed
15. Logout
16. Verify redirect to login page

**Responsive Design Tests**

Test at the following breakpoints:
- Mobile: 375px width
- Tablet: 768px width
- Desktop: 1440px width

Verify:
- Layout adapts appropriately
- All interactive elements are accessible
- Forms are usable
- Navigation works correctly

### Test Data Management

**Test Database**
- Use separate MongoDB database for testing
- Seed database with sample data before each test suite
- Clean up database after each test
- Use factories or fixtures for consistent test data

**Test Fixtures**
```typescript
const mockBooking = {
  customerName: "John Doe",
  email: "john@example.com",
  phone: "555-0123",
  service: "Swedish Massage",
  preferredDate: new Date("2024-12-25"),
  preferredTime: "14:00",
  status: "pending"
};

const mockPost = {
  title: "Relaxing Swedish Massage",
  content: "Experience ultimate relaxation...",
  category: "service",
  status: "published",
  publishedAt: new Date()
};

const mockAdmin = {
  username: "admin",
  passwordHash: "$2b$10$...", // bcrypt hash of "password123"
  email: "admin@spa.com"
};
```

### Continuous Integration

**CI Pipeline (GitHub Actions / GitLab CI)**

1. **Lint Stage**: Run ESLint on frontend and backend
2. **Unit Test Stage**: Run Jest unit tests with coverage report
3. **Integration Test Stage**: Run API integration tests with test database
4. **Build Stage**: Build frontend and backend for production
5. **E2E Test Stage**: Run Playwright tests against built application
6. **Coverage Report**: Generate and publish coverage reports
7. **Deployment Stage**: Deploy to staging environment if all tests pass

**Test Coverage Requirements**
- Minimum 80% code coverage for backend services
- Minimum 70% code coverage for frontend components
- 100% coverage for critical paths (authentication, booking creation)

### Performance Testing

**Load Testing**
- Test API endpoints under load (100+ concurrent requests)
- Verify response times remain under 500ms for 95th percentile
- Test database query performance with large datasets

**Frontend Performance**
- Lighthouse CI for performance metrics
- Target scores: Performance > 90, Accessibility > 95, Best Practices > 90, SEO > 90
- Monitor bundle size and implement code splitting if needed

---

## Summary

This design document outlines a comprehensive full-stack spa booking system with clear separation of concerns, robust error handling, and a thorough testing strategy. The architecture follows industry best practices with a three-tier design, RESTful API, and responsive frontend.

The testing strategy emphasizes **unit tests, integration tests, and end-to-end tests** rather than property-based testing, as this approach is more appropriate for a web application involving UI rendering, database operations, and authentication flows. The combination of these testing layers ensures comprehensive coverage and confidence in the system's correctness and reliability.
