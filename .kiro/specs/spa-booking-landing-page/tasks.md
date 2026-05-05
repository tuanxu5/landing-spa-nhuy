# Implementation Plan: Spa Booking Landing Page

## Overview

This implementation plan breaks down the spa booking system into discrete coding tasks. The system consists of a Next.js frontend (customer landing page + admin panel) and a NestJS backend API with MongoDB integration. Tasks are organized to build incrementally, starting with backend infrastructure, then core features, and finally frontend integration.

## Tasks

- [x] 1. Set up backend infrastructure and database connection
  - Install required NestJS packages: `@nestjs/mongoose`, `mongoose`, `@nestjs/config`, `bcrypt`, `@types/bcrypt`, `class-validator`, `class-transformer`
  - Configure MongoDB connection using the provided connection string
  - Create database module and providers
  - Set up environment configuration
  - Verify database connection on application startup
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 2. Implement booking data models and API
  - [x] 2.1 Create booking schema and DTOs
    - Define Mongoose schema for Booking with all required fields
    - Create `CreateBookingDto` with validation decorators
    - Create `UpdateBookingDto` for status updates
    - Add indexes for `createdAt`, `status`, and `preferredDate`
    - _Requirements: 1.1, 1.2, 12.1, 12.2, 12.3, 12.4, 12.6_
  
  - [x] 2.2 Implement bookings service
    - Create `BookingsService` with methods: `create()`, `findAll()`, `findOne()`, `updateStatus()`
    - Implement filtering by status, date range, and service
    - Implement sorting by creation date (reverse chronological)
    - Add validation logic for booking data
    - _Requirements: 1.3, 2.1, 2.2, 2.5, 2.6, 12.4_
  
  - [x] 2.3 Create bookings controller and routes
    - Create `BookingsController` with endpoints: POST `/api/bookings`, GET `/api/bookings`, GET `/api/bookings/:id`, PATCH `/api/bookings/:id`
    - Apply validation pipe to request bodies
    - Implement error handling for validation failures
    - _Requirements: 1.2, 1.3, 1.4, 2.3, 2.4, 2.5, 9.1_
  
  - [x] 2.4 Write unit tests for bookings service
    - Test `create()` with valid and invalid data
    - Test `findAll()` with various filter combinations
    - Test `updateStatus()` with valid and invalid statuses
    - Test error handling for database failures
    - _Requirements: 1.2, 1.3, 2.5_

- [x] 3. Implement authentication system
  - [x] 3.1 Create administrator schema and session schema
    - Define Mongoose schema for Administrator with username, passwordHash, email
    - Define Mongoose schema for Session with administratorId, token, expiresAt
    - Add unique index on `username` and `token` fields
    - Add TTL index on Session `expiresAt` for automatic cleanup
    - _Requirements: 4.2, 13.1, 13.4_
  
  - [x] 3.2 Implement authentication service
    - Create `AuthService` with methods: `validateCredentials()`, `hashPassword()`, `comparePassword()`, `createSession()`, `validateSession()`, `invalidateSession()`
    - Implement bcrypt password hashing with salt
    - Implement session creation with 8-hour expiration
    - Implement session validation and expiration checking
    - _Requirements: 4.2, 4.3, 5.4, 5.7, 13.1, 13.2, 13.5, 15.6_
  
  - [x] 3.3 Create authentication guard
    - Create `AuthGuard` to protect admin routes
    - Implement session token extraction from request headers
    - Implement session validation logic
    - Return 401 for invalid or expired sessions
    - _Requirements: 4.5, 9.2_
  
  - [x] 3.4 Create authentication controller and routes
    - Create `AuthController` with endpoints: POST `/api/auth/login`, POST `/api/auth/logout`, POST `/api/auth/change-password`, GET `/api/auth/me`
    - Create `LoginDto` and `ChangePasswordDto` with validation
    - Implement login logic with credential verification
    - Implement logout logic with session invalidation
    - Implement password change with current password verification
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.6, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  
  - [x] 3.5 Write unit tests for authentication service
    - Test password hashing and comparison
    - Test session creation and validation
    - Test session expiration logic
    - Test credential validation
    - _Requirements: 4.2, 4.3, 13.1, 13.3_

- [x] 4. Checkpoint - Ensure backend authentication and bookings work
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement posts/content management system
  - [x] 5.1 Create post schema and DTOs
    - Define Mongoose schema for Post with title, content, featuredImage, category, status, publishedAt
    - Create `CreatePostDto` and `UpdatePostDto` with validation decorators
    - Add indexes for `publishedAt` and compound index on `category` and `status`
    - _Requirements: 3.2, 3.3, 12.5, 12.6_
  
  - [x] 5.2 Implement posts service
    - Create `PostsService` with methods: `create()`, `findAll()`, `findOne()`, `update()`, `delete()`
    - Implement filtering by category and status
    - Implement logic to return only published posts for public requests
    - Implement sorting by publication date (reverse chronological)
    - _Requirements: 3.1, 3.3, 3.4, 3.5, 3.6, 10.2_
  
  - [x] 5.3 Create posts controller and routes
    - Create `PostsController` with endpoints: POST `/api/posts`, GET `/api/posts`, GET `/api/posts/:id`, PUT `/api/posts/:id`, DELETE `/api/posts/:id`
    - Apply authentication guard to create, update, and delete endpoints
    - Implement public access for GET endpoints with published posts only
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 10.2_
  
  - [x] 5.4 Write unit tests for posts service
    - Test `create()` with valid and invalid data
    - Test `findAll()` returns only published posts for public requests
    - Test `findAll()` returns all posts for admin requests
    - Test `update()` and `delete()` operations
    - _Requirements: 3.3, 3.5, 10.2_

- [ ] 6. Implement API security and error handling
  - [x] 6.1 Set up global error handling
    - Create HTTP exception filter for consistent error responses
    - Implement error response format with statusCode, message, and errors array
    - Add logging for all errors with timestamp and request context
    - Ensure sensitive information is not exposed in error responses
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_
  
  - [x] 6.2 Implement security middleware
    - Configure CORS policy for authorized origins
    - Set up input sanitization to prevent injection attacks
    - Implement rate limiting middleware
    - Add security headers (helmet)
    - _Requirements: 15.1, 15.2, 15.4, 15.5_
  
  - [x] 6.3 Set up validation pipe globally
    - Configure global validation pipe with class-validator
    - Enable whitelist and forbidNonWhitelisted options
    - Configure transform option for automatic type conversion
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7_

- [x] 7. Checkpoint - Ensure all backend features are complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Set up frontend infrastructure
  - Install required frontend packages: `axios` or `fetch` wrapper, `react-hook-form`, `zod` for validation
  - Create API client utility in `lib/api.ts` with base URL configuration
  - Create TypeScript type definitions in `types/index.ts` for Booking, Post, Administrator
  - Set up authentication utilities in `lib/auth.ts` for session token management
  - Create validation utilities in `lib/validation.ts` for form validation
  - _Requirements: 1.4, 4.4, 9.1_

- [ ] 9. Implement landing page components
  - [ ] 9.1 Create Hero component
    - Build Hero section with spa branding, heading, and CTA button
    - Style with Tailwind CSS for responsive design
    - Add smooth scroll to booking form on CTA click
    - _Requirements: 6.1, 6.3, 6.4, 6.5, 7.1, 7.2, 7.4_
  
  - [ ] 9.2 Create Services component
    - Fetch services from `/api/posts?category=service&status=published`
    - Display loading state while fetching
    - Display services in responsive grid layout with images, titles, descriptions
    - Handle fetch errors with user-friendly error message
    - Implement lazy loading for service images
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 3.7, 6.1, 6.3, 6.5, 14.3_
  
  - [ ] 9.3 Create BookingForm component
    - Build form with fields: customerName, email, phone, service, preferredDate, preferredTime, notes
    - Implement client-side validation using validation utilities
    - Display inline error messages for invalid fields
    - Implement form submission to POST `/api/bookings`
    - Display loading state during submission
    - Display success message after successful booking
    - Display error messages for submission failures
    - Prevent submission with empty required fields
    - _Requirements: 1.1, 1.2, 1.4, 1.5, 1.6, 6.1, 6.3, 7.5, 7.6, 12.1, 12.2, 12.3, 12.4, 12.6_
  
  - [ ] 9.4 Create Footer component
    - Build footer with spa contact information and social links
    - Style with Tailwind CSS for responsive design
    - _Requirements: 6.1, 6.3, 6.5, 7.1_
  
  - [ ] 9.5 Assemble landing page
    - Create main landing page in `app/page.tsx`
    - Compose Hero, Services, BookingForm, and Footer components
    - Implement smooth scrolling between sections
    - Optimize for performance with code splitting if needed
    - _Requirements: 6.1, 6.3, 6.5, 7.1, 7.2, 7.3, 14.1, 14.2, 14.4_
  
  - [ ] 9.6 Write unit tests for landing page components
    - Test BookingForm validation logic
    - Test Services component data fetching and display
    - Test error handling in components
    - _Requirements: 1.4, 10.3, 10.4_

- [ ] 10. Implement admin authentication pages
  - [ ] 10.1 Create login page
    - Build login form with username and password fields
    - Implement form submission to POST `/api/auth/login`
    - Store session token in localStorage or cookies on successful login
    - Display error message for invalid credentials
    - Redirect to admin dashboard on successful login
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [ ] 10.2 Implement authentication context and protected routes
    - Create authentication context to manage session state
    - Implement route protection logic to redirect unauthenticated users to login
    - Implement automatic session validation on page load
    - Handle session expiration with redirect to login
    - _Requirements: 4.5, 13.2, 13.3_
  
  - [ ] 10.3 Write unit tests for authentication logic
    - Test login form validation
    - Test session token storage and retrieval
    - Test protected route redirection
    - _Requirements: 4.4, 4.5_

- [ ] 11. Implement admin panel navigation and layout
  - [ ] 11.1 Create admin layout component
    - Build admin layout with navigation sidebar or top bar
    - Display logged-in administrator's username
    - Add navigation links to bookings, posts, and settings
    - Add logout button with logout functionality
    - Style with Tailwind CSS for responsive design
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 6.2, 7.7_
  
  - [ ] 11.2 Create admin dashboard page
    - Build dashboard with summary statistics (total bookings, pending bookings, published posts)
    - Add quick links to main management sections
    - _Requirements: 11.1_

- [ ] 12. Implement bookings management interface
  - [ ] 12.1 Create BookingList component
    - Fetch bookings from GET `/api/bookings` with authentication
    - Display bookings in table format with customer details, service, date, time, status
    - Implement loading state while fetching
    - Implement error handling for fetch failures
    - Display empty state when no bookings exist
    - _Requirements: 2.1, 2.6, 7.5_
  
  - [ ] 12.2 Implement booking filters
    - Add filter controls for status, date range, and service type
    - Update bookings list when filters change
    - Persist filter state in URL query parameters
    - _Requirements: 2.2_
  
  - [ ] 12.3 Implement booking status updates
    - Add action buttons to update booking status (confirm, complete, cancel)
    - Implement status update via PATCH `/api/bookings/:id`
    - Display loading state during update
    - Refresh bookings list after successful update
    - Display error message if update fails
    - _Requirements: 2.3, 2.4, 2.5_
  
  - [ ] 12.4 Create bookings management page
    - Assemble BookingList component with filters and actions
    - Add page in `app/admin/bookings/page.tsx`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_
  
  - [ ] 12.5 Write unit tests for bookings management
    - Test BookingList component rendering
    - Test filter functionality
    - Test status update actions
    - _Requirements: 2.1, 2.2, 2.5_

- [ ] 13. Checkpoint - Ensure admin authentication and bookings management work
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 14. Implement posts management interface
  - [ ] 14.1 Create posts list page
    - Fetch posts from GET `/api/posts` with authentication
    - Display posts in table or card layout with title, category, status, publication date
    - Add action buttons for edit and delete
    - Implement delete functionality with confirmation dialog
    - Add "Create New Post" button
    - _Requirements: 3.1, 3.5_
  
  - [ ] 14.2 Create PostEditor component
    - Build form with fields: title, content, featuredImage, category, status
    - Implement client-side validation
    - Support both create and edit modes based on postId prop
    - Fetch existing post data for edit mode
    - Implement form submission to POST `/api/posts` or PUT `/api/posts/:id`
    - Display loading state during save
    - Display success message after successful save
    - Display error messages for validation failures
    - _Requirements: 3.2, 3.3, 12.5, 12.6_
  
  - [ ] 14.3 Create post creation page
    - Add page in `app/admin/posts/new/page.tsx`
    - Render PostEditor component in create mode
    - Redirect to posts list after successful creation
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [ ] 14.4 Create post edit page
    - Add page in `app/admin/posts/[id]/edit/page.tsx`
    - Render PostEditor component in edit mode with postId
    - Redirect to posts list after successful update
    - _Requirements: 3.1, 3.4_
  
  - [ ] 14.5 Write unit tests for posts management
    - Test PostEditor validation logic
    - Test post creation and update flows
    - Test delete functionality
    - _Requirements: 3.2, 3.3, 3.4, 3.5_

- [ ] 15. Implement account settings page
  - [ ] 15.1 Create PasswordChange component
    - Build form with fields: currentPassword, newPassword, confirmPassword
    - Implement client-side validation
    - Verify new passwords match before submission
    - Implement form submission to POST `/api/auth/change-password`
    - Display success message after successful password change
    - Display error messages for validation failures or incorrect current password
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  
  - [ ] 15.2 Create settings page
    - Add page in `app/admin/settings/page.tsx`
    - Render PasswordChange component
    - Display current administrator information
    - _Requirements: 5.1_
  
  - [ ] 15.3 Write unit tests for password change
    - Test password validation logic
    - Test password match verification
    - Test error handling
    - _Requirements: 5.5, 5.6_

- [ ] 16. Implement responsive design and UX polish
  - [ ] 16.1 Optimize landing page for mobile devices
    - Test and adjust layout for screen widths 320px-767px
    - Ensure single-column layout on mobile
    - Ensure touch-friendly button sizes and spacing
    - Test booking form usability on mobile
    - _Requirements: 6.1, 6.3, 6.6, 7.1, 7.2_
  
  - [ ] 16.2 Optimize landing page for tablet devices
    - Test and adjust layout for screen widths 768px-1023px
    - Optimize grid layouts for medium screens
    - _Requirements: 6.1, 6.2, 6.4, 6.6_
  
  - [ ] 16.3 Optimize landing page for desktop devices
    - Test and adjust layout for screen widths 1024px-2560px
    - Utilize multi-column layouts where appropriate
    - _Requirements: 6.1, 6.2, 6.5, 6.6_
  
  - [ ] 16.4 Optimize admin panel for responsive design
    - Test admin panel on screen widths 768px-2560px
    - Ensure navigation adapts appropriately (sidebar on desktop, hamburger on tablet)
    - Ensure tables and forms are usable on all supported sizes
    - _Requirements: 6.2, 6.6_
  
  - [ ] 16.5 Implement responsive images
    - Use Next.js Image component for automatic optimization
    - Implement responsive image sizes for different breakpoints
    - Add lazy loading for below-the-fold images
    - _Requirements: 6.7, 14.2, 14.3_
  
  - [ ] 16.6 Add smooth transitions and animations
    - Add smooth transitions for interactive elements (buttons, links, form fields)
    - Add loading animations for data fetching
    - Add success/error animations for form submissions
    - Ensure animations respect user's motion preferences
    - _Requirements: 7.3, 7.5, 7.6_
  
  - [ ] 16.7 Implement consistent design system
    - Define and apply consistent color scheme throughout
    - Define and apply consistent typography scale
    - Define and apply consistent spacing scale
    - Ensure clear visual hierarchy with headings and whitespace
    - _Requirements: 7.1, 7.2, 7.7_

- [ ] 17. Implement performance optimizations
  - [ ] 17.1 Optimize frontend bundle size
    - Analyze bundle size with Next.js build analyzer
    - Implement code splitting for admin panel routes
    - Optimize imports to reduce bundle size
    - _Requirements: 14.1, 14.5_
  
  - [ ] 17.2 Implement caching strategies
    - Configure cache headers for static assets
    - Implement API response caching where appropriate
    - Use Next.js static generation for landing page if possible
    - _Requirements: 14.5_
  
  - [ ] 17.3 Optimize API performance
    - Verify database indexes are created correctly
    - Test query performance with sample data
    - Implement pagination for large result sets if needed
    - _Requirements: 8.6, 14.4_

- [ ] 18. Final integration and testing
  - [ ] 18.1 Create seed script for initial administrator account
    - Create script to insert initial administrator into database
    - Use bcrypt to hash the initial password
    - Document default credentials for first-time setup
    - _Requirements: 4.2, 5.7_
  
  - [ ] 18.2 Test complete customer booking flow
    - Navigate to landing page
    - Browse services
    - Fill and submit booking form
    - Verify booking appears in admin panel
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 2.1, 10.1_
  
  - [ ] 18.3 Test complete admin management flow
    - Log in to admin panel
    - View and filter bookings
    - Update booking status
    - Create, edit, and delete posts
    - Change password
    - Log out
    - _Requirements: 4.1, 4.3, 4.6, 2.2, 2.4, 2.5, 3.1, 3.2, 3.4, 3.5, 5.3, 5.4_
  
  - [ ] 18.4 Run integration tests
    - Set up test database
    - Run API integration tests with Supertest
    - Verify all endpoints work correctly
    - Verify authentication and authorization
    - _Requirements: All API requirements_
  
  - [ ] 18.5 Run end-to-end tests
    - Set up Playwright or Cypress
    - Write E2E tests for customer booking flow
    - Write E2E tests for admin management flow
    - Test responsive design at different breakpoints
    - _Requirements: All requirements_

- [ ] 19. Final checkpoint - Ensure complete system works end-to-end
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation and provide opportunities for user feedback
- The implementation follows an incremental approach: backend infrastructure → backend features → frontend infrastructure → frontend features → integration
- All code should use TypeScript for type safety
- Follow Next.js and NestJS best practices and conventions
- Use Tailwind CSS utility classes for styling
- Ensure all sensitive data (passwords, session tokens) are handled securely
