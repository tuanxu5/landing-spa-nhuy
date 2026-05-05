import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { Administrator } from './schemas/administrator.schema';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let administratorModel: any;

  const mockAdministrator = {
    _id: new Types.ObjectId(),
    username: 'admin',
    email: 'admin@spa.com',
    passwordHash: '$2b$10$hashedpassword',
    lastLoginAt: new Date(),
    save: jest.fn().mockResolvedValue(true),
  };

  const mockSession = {
    _id: new Types.ObjectId(),
    administratorId: mockAdministrator._id,
    token: 'test-session-token',
    expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
    lastActivityAt: new Date(),
  };

  const mockAuthService = {
    validateCredentials: jest.fn(),
    createSession: jest.fn(),
    invalidateSession: jest.fn(),
    comparePassword: jest.fn(),
    hashPassword: jest.fn(),
  };

  const mockAdministratorModel = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: getModelToken(Administrator.name),
          useValue: mockAdministratorModel,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    administratorModel = module.get(getModelToken(Administrator.name));

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return session token for valid credentials', async () => {
      mockAuthService.validateCredentials.mockResolvedValue(mockAdministrator);
      mockAuthService.createSession.mockResolvedValue(mockSession);

      const result = await controller.login({
        username: 'admin',
        password: 'password123',
      });

      expect(result).toEqual({ token: 'test-session-token' });
      expect(mockAuthService.validateCredentials).toHaveBeenCalledWith(
        'admin',
        'password123',
      );
      expect(mockAuthService.createSession).toHaveBeenCalledWith(
        mockAdministrator._id,
      );
      expect(mockAdministrator.save).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      mockAuthService.validateCredentials.mockResolvedValue(null);

      await expect(
        controller.login({
          username: 'admin',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should invalidate session and return success message', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer test-session-token',
        },
      };

      mockAuthService.invalidateSession.mockResolvedValue(true);

      const result = await controller.logout(mockRequest);

      expect(result).toEqual({ message: 'Logged out successfully' });
      expect(mockAuthService.invalidateSession).toHaveBeenCalledWith(
        'test-session-token',
      );
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const mockRequest = {
        administratorId: mockAdministrator._id,
      };

      const mockAdminDoc = {
        ...mockAdministrator,
        save: jest.fn().mockResolvedValue(true),
      };

      mockAdministratorModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockAdminDoc),
      });

      mockAuthService.comparePassword.mockResolvedValue(true);
      mockAuthService.hashPassword.mockResolvedValue('$2b$10$newhash');

      const result = await controller.changePassword(mockRequest, {
        currentPassword: 'oldpassword',
        newPassword: 'newpassword123',
        confirmPassword: 'newpassword123',
      });

      expect(result).toEqual({ message: 'Password changed successfully' });
      expect(mockAuthService.comparePassword).toHaveBeenCalledWith(
        'oldpassword',
        mockAdministrator.passwordHash,
      );
      expect(mockAuthService.hashPassword).toHaveBeenCalledWith(
        'newpassword123',
      );
      expect(mockAdminDoc.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException when new passwords do not match', async () => {
      const mockRequest = {
        administratorId: mockAdministrator._id,
      };

      await expect(
        controller.changePassword(mockRequest, {
          currentPassword: 'oldpassword',
          newPassword: 'newpassword123',
          confirmPassword: 'differentpassword',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when current password is incorrect', async () => {
      const mockRequest = {
        administratorId: mockAdministrator._id,
      };

      mockAdministratorModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockAdministrator),
      });

      mockAuthService.comparePassword.mockResolvedValue(false);

      await expect(
        controller.changePassword(mockRequest, {
          currentPassword: 'wrongpassword',
          newPassword: 'newpassword123',
          confirmPassword: 'newpassword123',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw UnauthorizedException when administrator not found', async () => {
      const mockRequest = {
        administratorId: mockAdministrator._id,
      };

      mockAdministratorModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        controller.changePassword(mockRequest, {
          currentPassword: 'oldpassword',
          newPassword: 'newpassword123',
          confirmPassword: 'newpassword123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getCurrentUser', () => {
    it('should return current administrator without password', async () => {
      const mockAdminDoc = {
        _id: mockAdministrator._id,
        username: mockAdministrator.username,
        email: mockAdministrator.email,
        lastLoginAt: mockAdministrator.lastLoginAt,
      };

      mockAdministratorModel.findById.mockReturnValue({
        select: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockAdminDoc),
        }),
      });

      const mockRequest = {
        administratorId: mockAdministrator._id,
      };

      const result = await controller.getCurrentUser(mockRequest);

      expect(result).toEqual({
        id: mockAdministrator._id.toString(),
        username: mockAdministrator.username,
        email: mockAdministrator.email,
        lastLoginAt: mockAdministrator.lastLoginAt,
      });
      expect(mockAdministratorModel.findById).toHaveBeenCalledWith(
        mockAdministrator._id,
      );
    });

    it('should throw UnauthorizedException when administrator not found', async () => {
      mockAdministratorModel.findById.mockReturnValue({
        select: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });

      const mockRequest = {
        administratorId: mockAdministrator._id,
      };

      await expect(controller.getCurrentUser(mockRequest)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
