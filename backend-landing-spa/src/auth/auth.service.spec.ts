import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import {
  Administrator,
  AdministratorDocument,
} from './schemas/administrator.schema';
import { Session, SessionDocument } from './schemas/session.schema';

describe('AuthService', () => {
  let service: AuthService;
  let administratorModel: Model<AdministratorDocument>;
  let sessionModel: Model<SessionDocument>;

  const mockAdministratorId = new Types.ObjectId();
  const mockAdministrator = {
    _id: mockAdministratorId,
    username: 'testadmin',
    passwordHash: '$2b$10$hashedpassword',
    email: 'admin@test.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockSession = {
    _id: new Types.ObjectId(),
    administratorId: mockAdministratorId,
    token: 'test-token-123',
    expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
    lastActivityAt: new Date(),
    createdAt: new Date(),
    save: jest.fn().mockResolvedValue(this),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(Administrator.name),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getModelToken(Session.name),
          useValue: {
            findOne: jest.fn(),
            deleteOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    administratorModel = module.get<Model<AdministratorDocument>>(
      getModelToken(Administrator.name),
    );
    sessionModel = module.get<Model<SessionDocument>>(
      getModelToken(Session.name),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hashPassword', () => {
    it('should hash a password using bcrypt', async () => {
      const password = 'testpassword123';
      const hashedPassword = await service.hashPassword(password);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.startsWith('$2b$')).toBe(true);
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'testpassword123';
      const hash1 = await service.hashPassword(password);
      const hash2 = await service.hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching password and hash', async () => {
      const password = 'testpassword123';
      const hash = await bcrypt.hash(password, 10);

      const result = await service.comparePassword(password, hash);

      expect(result).toBe(true);
    });

    it('should return false for non-matching password and hash', async () => {
      const password = 'testpassword123';
      const wrongPassword = 'wrongpassword';
      const hash = await bcrypt.hash(password, 10);

      const result = await service.comparePassword(wrongPassword, hash);

      expect(result).toBe(false);
    });
  });

  describe('validateCredentials', () => {
    it('should return administrator for valid credentials', async () => {
      const password = 'testpassword123';
      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = {
        ...mockAdministrator,
        passwordHash: hashedPassword,
      };

      jest.spyOn(administratorModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(admin),
      } as any);

      const result = await service.validateCredentials('testadmin', password);

      expect(result).toBeDefined();
      expect(result?.username).toBe('testadmin');
      expect(administratorModel.findOne).toHaveBeenCalledWith({
        username: 'testadmin',
      });
    });

    it('should return null for invalid username', async () => {
      jest.spyOn(administratorModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      const result = await service.validateCredentials(
        'nonexistent',
        'password',
      );

      expect(result).toBeNull();
    });

    it('should return null for invalid password', async () => {
      const password = 'testpassword123';
      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = {
        ...mockAdministrator,
        passwordHash: hashedPassword,
      };

      jest.spyOn(administratorModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(admin),
      } as any);

      const result = await service.validateCredentials(
        'testadmin',
        'wrongpassword',
      );

      expect(result).toBeNull();
    });
  });

  describe('createSession', () => {
    it('should create a session with 8-hour expiration', async () => {
      const now = Date.now();

      // Create a mock session instance that will be returned
      let capturedSessionData: any;
      const mockSave = jest.fn().mockImplementation(function () {
        return Promise.resolve(this);
      });

      // Mock the Model constructor to capture the data and return a mock instance
      const MockSessionModel = jest.fn().mockImplementation((data) => {
        capturedSessionData = data;
        return {
          ...data,
          save: mockSave,
        };
      });

      // Replace the sessionModel in the service
      (service as any).sessionModel = MockSessionModel;

      const result = await service.createSession(mockAdministratorId);

      expect(result).toBeDefined();
      expect(result.administratorId).toBe(mockAdministratorId);
      expect(result.token).toBeDefined();
      expect(result.token.length).toBe(64); // 32 bytes = 64 hex characters
      expect(result.expiresAt).toBeDefined();

      // Check that expiration is approximately 8 hours from now
      const expirationTime = result.expiresAt.getTime();
      const expectedExpiration = now + 8 * 60 * 60 * 1000;
      expect(expirationTime).toBeGreaterThan(expectedExpiration - 1000);
      expect(expirationTime).toBeLessThan(expectedExpiration + 1000);

      expect(mockSave).toHaveBeenCalled();
    });

    it('should generate unique tokens for different sessions', async () => {
      const mockSave = jest.fn().mockImplementation(function () {
        return Promise.resolve(this);
      });

      // Mock the Model constructor
      const MockSessionModel = jest.fn().mockImplementation((data) => {
        return {
          ...data,
          save: mockSave,
        };
      });

      // Replace the sessionModel in the service
      (service as any).sessionModel = MockSessionModel;

      const session1 = await service.createSession(mockAdministratorId);
      const session2 = await service.createSession(mockAdministratorId);

      expect(session1.token).not.toBe(session2.token);
    });
  });

  describe('validateSession', () => {
    it('should return session for valid non-expired token', async () => {
      const validSession = {
        ...mockSession,
        expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
        save: jest.fn().mockResolvedValue(mockSession),
      };

      jest.spyOn(sessionModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(validSession),
      } as any);

      const result = await service.validateSession('test-token-123');

      expect(result).toBeDefined();
      expect(result?.token).toBe('test-token-123');
      expect(validSession.save).toHaveBeenCalled();
    });

    it('should return null for non-existent token', async () => {
      jest.spyOn(sessionModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      const result = await service.validateSession('invalid-token');

      expect(result).toBeNull();
    });

    it('should return null and invalidate expired session', async () => {
      const expiredSession = {
        ...mockSession,
        expiresAt: new Date(Date.now() - 1000), // Expired 1 second ago
      };

      jest.spyOn(sessionModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(expiredSession),
      } as any);

      jest.spyOn(sessionModel, 'deleteOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      } as any);

      const result = await service.validateSession('expired-token');

      expect(result).toBeNull();
      expect(sessionModel.deleteOne).toHaveBeenCalledWith({
        token: 'expired-token',
      });
    });

    it('should update lastActivityAt when validating session', async () => {
      const oldActivityTime = new Date(Date.now() - 60000); // 1 minute ago
      const validSession = {
        ...mockSession,
        lastActivityAt: oldActivityTime,
        expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
        save: jest.fn().mockResolvedValue(mockSession),
      };

      jest.spyOn(sessionModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(validSession),
      } as any);

      await service.validateSession('test-token-123');

      expect(validSession.lastActivityAt.getTime()).toBeGreaterThan(
        oldActivityTime.getTime(),
      );
      expect(validSession.save).toHaveBeenCalled();
    });
  });

  describe('invalidateSession', () => {
    it('should return true when session is successfully deleted', async () => {
      jest.spyOn(sessionModel, 'deleteOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      } as any);

      const result = await service.invalidateSession('test-token-123');

      expect(result).toBe(true);
      expect(sessionModel.deleteOne).toHaveBeenCalledWith({
        token: 'test-token-123',
      });
    });

    it('should return false when session is not found', async () => {
      jest.spyOn(sessionModel, 'deleteOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 0 }),
      } as any);

      const result = await service.invalidateSession('nonexistent-token');

      expect(result).toBe(false);
    });
  });
});
