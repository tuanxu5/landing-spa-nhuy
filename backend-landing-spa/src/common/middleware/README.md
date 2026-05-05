# Security Middleware

This directory contains documentation for the security middleware implemented in the application.

## Overview

The application implements multiple layers of security middleware to protect against common web vulnerabilities and attacks:

1. **Helmet** - Security headers
2. **CORS** - Cross-Origin Resource Sharing policy
3. **Input Sanitization** - MongoDB injection prevention
4. **Rate Limiting** - Request throttling
5. **Validation Pipe** - Input validation and transformation

## Security Headers (Helmet)

**Purpose:** Adds various HTTP security headers to protect against common web vulnerabilities.

**Implementation:** Configured in `src/main.ts`

**Headers Set:**
- `X-DNS-Prefetch-Control` - Controls DNS prefetching
- `X-Frame-Options` - Prevents clickjacking attacks
- `X-Content-Type-Options` - Prevents MIME type sniffing
- `X-Download-Options` - Prevents file downloads in IE
- `Strict-Transport-Security` - Enforces HTTPS
- `X-XSS-Protection` - Enables XSS filter in older browsers

**Requirements:** 15.5

## CORS Configuration

**Purpose:** Restricts which origins can access the API, preventing unauthorized cross-origin requests.

**Implementation:** Configured in `src/main.ts`

**Configuration:**
- **Allowed Origins:** Configurable via `ALLOWED_ORIGINS` environment variable
- **Default Origins:** `http://localhost:3001`, `http://localhost:3000`
- **Credentials:** Enabled (allows cookies and authentication headers)
- **Methods:** GET, POST, PUT, PATCH, DELETE, OPTIONS
- **Headers:** Content-Type, Authorization

**Environment Variable:**
```env
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:3000,https://yourdomain.com
```

**Requirements:** 15.1

## Input Sanitization

**Purpose:** Prevents MongoDB injection attacks by validating and sanitizing user input.

**Implementation:** Uses NestJS ValidationPipe with strict validation rules in `src/main.ts`

**How It Works:**
- The ValidationPipe with `whitelist: true` strips any properties not defined in DTOs
- The `forbidNonWhitelisted: true` option throws errors if unexpected properties are present
- All DTOs use class-validator decorators to enforce strict type and format validation
- MongoDB operators and malicious input are rejected at the validation layer

**Protected Against:**
- MongoDB operator injection (`$where`, `$gt`, `$lt`, `$ne`, etc.)
- Unexpected properties in request bodies
- Type confusion attacks
- Nested injection attempts

**Requirements:** 15.2

## Rate Limiting

**Purpose:** Prevents abuse and DoS attacks by limiting the number of requests per IP address.

**Implementation:** Uses `@nestjs/throttler` module configured in `src/app.module.ts`

**Configuration:**
- **Time Window:** 60 seconds (1 minute)
- **Request Limit:** 100 requests per time window
- **Scope:** Applied globally to all endpoints

**Response:**
- Returns `429 Too Many Requests` when limit is exceeded
- Includes rate limit headers in responses:
  - `X-RateLimit-Limit` - Maximum requests allowed
  - `X-RateLimit-Remaining` - Requests remaining
  - `X-RateLimit-Reset` - Time when limit resets

**Customization:**
To adjust rate limits, modify the `ThrottlerModule` configuration in `src/app.module.ts`:

```typescript
ThrottlerModule.forRoot([
  {
    ttl: 60000, // Time window in milliseconds
    limit: 100, // Maximum requests
  },
]),
```

**Requirements:** 15.4

## Validation Pipe

**Purpose:** Validates and transforms incoming request data to ensure data integrity and security.

**Implementation:** Configured globally in `src/main.ts`

**Configuration:**
- **whitelist:** `true` - Strips non-whitelisted properties from request objects
- **forbidNonWhitelisted:** `true` - Throws error if non-whitelisted properties are present
- **transform:** `true` - Automatically transforms payloads to DTO instances

**Benefits:**
- Prevents mass assignment vulnerabilities
- Ensures only expected properties are processed
- Automatically converts types (e.g., string to Date)
- Validates data against DTO decorators

**Requirements:** 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7

## Testing

Security middleware is tested in `src/common/middleware/security.spec.ts`.

**Test Coverage:**
- Helmet security headers are set correctly
- CORS allows authorized origins and blocks unauthorized ones
- Input sanitization removes MongoDB operators
- Rate limiting enforces request limits
- Validation pipe rejects invalid input

**Running Tests:**
```bash
npm test -- security.spec.ts
```

## Production Considerations

### HTTPS

In production, ensure the application runs behind HTTPS. Update the CORS configuration to use HTTPS origins:

```env
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Rate Limiting

Consider adjusting rate limits based on your application's needs:
- **Public endpoints:** Lower limits (e.g., 20 requests/minute)
- **Authenticated endpoints:** Higher limits (e.g., 100 requests/minute)
- **Admin endpoints:** Moderate limits (e.g., 50 requests/minute)

### Monitoring

Monitor security events:
- Input sanitization warnings (logged to console)
- Rate limit violations (429 responses)
- CORS violations (blocked by browser)
- Validation errors (400 responses)

### Environment Variables

Ensure sensitive configuration is stored in environment variables:
- `ALLOWED_ORIGINS` - Comma-separated list of allowed origins
- `PORT` - Application port
- `MONGODB_URI` - Database connection string

**Never commit `.env` files to version control.**

## Security Best Practices

1. **Keep Dependencies Updated:** Regularly update security-related packages
2. **Use HTTPS:** Always use HTTPS in production
3. **Rotate Secrets:** Regularly rotate API keys and secrets
4. **Monitor Logs:** Watch for suspicious patterns in logs
5. **Implement Authentication:** Protect sensitive endpoints with authentication
6. **Validate All Input:** Never trust user input
7. **Sanitize Output:** Prevent XSS by sanitizing output
8. **Use Prepared Statements:** Prevent SQL injection (not applicable for MongoDB)
9. **Implement CSRF Protection:** For state-changing operations
10. **Regular Security Audits:** Conduct regular security reviews

## References

- [Helmet Documentation](https://helmetjs.github.io/)
- [NestJS CORS](https://docs.nestjs.com/security/cors)
- [express-mongo-sanitize](https://github.com/fiznool/express-mongo-sanitize)
- [NestJS Throttler](https://docs.nestjs.com/security/rate-limiting)
- [NestJS Validation](https://docs.nestjs.com/techniques/validation)
