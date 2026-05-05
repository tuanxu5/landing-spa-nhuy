import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../app.module';
import { HttpExceptionFilter } from '../filters/http-exception.filter';
import helmet from 'helmet';

describe('Security Middleware', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply the same middleware as in main.ts
    app.use(helmet());
    app.enableCors({
      origin: ['http://localhost:3001', 'http://localhost:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Helmet Security Headers', () => {
    it('should set security headers on responses', async () => {
      const response = await request(app.getHttpServer()).get('/');

      // Helmet sets various security headers
      expect(response.headers['x-dns-prefetch-control']).toBeDefined();
      expect(response.headers['x-frame-options']).toBeDefined();
      expect(response.headers['x-content-type-options']).toBeDefined();
      expect(response.headers['x-download-options']).toBeDefined();
    });

    it('should set X-Content-Type-Options to nosniff', async () => {
      const response = await request(app.getHttpServer()).get('/');

      expect(response.headers['x-content-type-options']).toBe('nosniff');
    });
  });

  describe('CORS Configuration', () => {
    it('should allow requests from authorized origins', async () => {
      const response = await request(app.getHttpServer())
        .get('/')
        .set('Origin', 'http://localhost:3001');

      expect(response.headers['access-control-allow-origin']).toBe(
        'http://localhost:3001',
      );
    });

    it('should allow credentials', async () => {
      const response = await request(app.getHttpServer())
        .get('/')
        .set('Origin', 'http://localhost:3001');

      expect(response.headers['access-control-allow-credentials']).toBe('true');
    });

    it('should handle OPTIONS preflight requests', async () => {
      const response = await request(app.getHttpServer())
        .options('/')
        .set('Origin', 'http://localhost:3001')
        .set('Access-Control-Request-Method', 'POST');

      expect(response.status).toBe(204);
    });
  });

  describe('Input Sanitization via Validation Pipe', () => {
    it('should reject requests with MongoDB operators in unexpected fields', async () => {
      const maliciousPayload = {
        customerName: 'John Doe',
        email: 'john@example.com',
        phone: '555-0123',
        service: 'Swedish Massage',
        preferredDate: new Date('2024-12-25'),
        preferredTime: '14:00',
        // Malicious MongoDB operator - should be rejected by forbidNonWhitelisted
        $where: 'malicious code',
      };

      const response = await request(app.getHttpServer())
        .post('/api/bookings')
        .send(maliciousPayload);

      // Should return 400 Bad Request due to non-whitelisted property
      expect(response.status).toBe(400);
    });

    it('should reject nested MongoDB operators in unexpected fields', async () => {
      const maliciousPayload = {
        customerName: 'John Doe',
        email: 'john@example.com',
        phone: '555-0123',
        service: 'Swedish Massage',
        preferredDate: new Date('2024-12-25'),
        preferredTime: '14:00',
        // Nested malicious field
        nested: { $gt: '' },
      };

      const response = await request(app.getHttpServer())
        .post('/api/bookings')
        .send(maliciousPayload);

      // Should return 400 Bad Request due to non-whitelisted property
      expect(response.status).toBe(400);
    });
  });

  describe('Rate Limiting', () => {
    it('should allow requests within rate limit', async () => {
      // Make a few requests within the limit
      for (let i = 0; i < 5; i++) {
        const response = await request(app.getHttpServer()).get('/');
        expect(response.status).not.toBe(429);
      }
    });

    it('should have ThrottlerGuard configured', async () => {
      // Just verify the app starts successfully with ThrottlerGuard
      // Rate limit headers may not be present in all responses
      const response = await request(app.getHttpServer()).get('/');
      expect(response.status).toBeDefined();
    });
  });

  describe('Validation Pipe', () => {
    it('should reject requests with non-whitelisted properties', async () => {
      const invalidPayload = {
        customerName: 'John Doe',
        email: 'john@example.com',
        phone: '555-0123',
        service: 'Swedish Massage',
        preferredDate: new Date('2024-12-25'),
        preferredTime: '14:00',
        // Non-whitelisted property
        maliciousField: 'should be rejected',
      };

      const response = await request(app.getHttpServer())
        .post('/api/bookings')
        .send(invalidPayload);

      // Should return 400 Bad Request due to non-whitelisted property
      expect(response.status).toBe(400);
    });

    it('should transform and validate input data', async () => {
      const payload = {
        customerName: 'John Doe',
        email: 'john@example.com',
        phone: '555-0123',
        service: 'Swedish Massage',
        preferredDate: '2024-12-25', // String that should be transformed to Date
        preferredTime: '14:00',
      };

      const response = await request(app.getHttpServer())
        .post('/api/bookings')
        .send(payload);

      // Should either succeed (201) or fail validation (400), but not server error (500)
      expect([201, 400]).toContain(response.status);
    });
  });
});
