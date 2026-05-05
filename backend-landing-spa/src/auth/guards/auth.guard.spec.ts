import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../auth.service';
import { Types } from 'mongoose';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jest.Mocked<AuthService>;

  const mockAdministratorId = new Types.ObjectId();
  const mockSession = {
    _id: new Types.ObjectId(),
    administratorId: mockAdministratorId,
    token: 'valid-token-123',
    expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
    lastActivityAt: new Date(),
    createdAt: new Date(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const mockAuthService = {
      validateSession: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    authService = module.get(AuthService) as jest.Mocked<AuthService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createMockExecutionContext = (
    authorizationHeader?: string,
  ): ExecutionContext => {
    const mockRequest = {
      headers: authorizationHeader ? { authorization: authorizationHeader } : {},
    };

    return {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;
  };

  describe('canActivate', () => {
    it('should return true and attach administratorId for valid Bearer token', async () => {
      const context = createMockExecutionContext('Bearer valid-token-123');
      authService.validateSession.mockResolvedValue(mockSession as any);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(authService.validateSession).toHaveBeenCalledWith(
        'valid-token-123',
      );
      const request = context.switchToHttp().getRequest();
      expect(request.administratorId).toEqual(mockAdministratorId);
    });

    it('should throw UnauthorizedException when Authorization header is missing', async () => {
      const context = createMockExecutionContext();

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(guard.canActivate(context)).rejects.toThrow(
        'Authorization header is missing',
      );
      expect(authService.validateSession).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when Authorization header is empty', async () => {
      const context = createMockExecutionContext('');

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(guard.canActivate(context)).rejects.toThrow(
        'Authorization header is missing',
      );
      expect(authService.validateSession).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when Authorization header does not start with Bearer', async () => {
      const context = createMockExecutionContext('Basic some-token');

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(guard.canActivate(context)).rejects.toThrow(
        'Invalid authorization header format',
      );
      expect(authService.validateSession).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when Authorization header has only Bearer without token', async () => {
      const context = createMockExecutionContext('Bearer');

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(guard.canActivate(context)).rejects.toThrow(
        'Invalid authorization header format',
      );
      expect(authService.validateSession).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when token is empty string', async () => {
      const context = createMockExecutionContext('Bearer ');

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(guard.canActivate(context)).rejects.toThrow(
        'Token is missing',
      );
      expect(authService.validateSession).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when Authorization header has extra parts', async () => {
      const context = createMockExecutionContext(
        'Bearer token-123 extra-part',
      );

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(guard.canActivate(context)).rejects.toThrow(
        'Invalid authorization header format',
      );
      expect(authService.validateSession).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when session validation returns null (invalid token)', async () => {
      const context = createMockExecutionContext('Bearer invalid-token');
      authService.validateSession.mockResolvedValue(null);

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(guard.canActivate(context)).rejects.toThrow(
        'Invalid or expired session',
      );
      expect(authService.validateSession).toHaveBeenCalledWith(
        'invalid-token',
      );
    });

    it('should throw UnauthorizedException when session validation returns null (expired token)', async () => {
      const context = createMockExecutionContext('Bearer expired-token');
      authService.validateSession.mockResolvedValue(null);

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(guard.canActivate(context)).rejects.toThrow(
        'Invalid or expired session',
      );
      expect(authService.validateSession).toHaveBeenCalledWith(
        'expired-token',
      );
    });

    it('should handle tokens with special characters', async () => {
      const specialToken = 'abc123-_+=./~!@#$%^&*()';
      const context = createMockExecutionContext(`Bearer ${specialToken}`);
      authService.validateSession.mockResolvedValue(mockSession as any);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(authService.validateSession).toHaveBeenCalledWith(specialToken);
    });

    it('should handle very long tokens', async () => {
      const longToken = 'a'.repeat(1000);
      const context = createMockExecutionContext(`Bearer ${longToken}`);
      authService.validateSession.mockResolvedValue(mockSession as any);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(authService.validateSession).toHaveBeenCalledWith(longToken);
    });

    it('should preserve case sensitivity in Bearer keyword check', async () => {
      const context = createMockExecutionContext('bearer valid-token-123');

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(guard.canActivate(context)).rejects.toThrow(
        'Invalid authorization header format',
      );
      expect(authService.validateSession).not.toHaveBeenCalled();
    });

    it('should handle authorization header with different casing', async () => {
      const mockRequest = {
        headers: { Authorization: 'Bearer valid-token-123' },
      };
      const context = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as ExecutionContext;

      // This should fail because we check for lowercase 'authorization'
      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
