import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {
  Administrator,
  AdministratorDocument,
} from './schemas/administrator.schema';
import { Session, SessionDocument } from './schemas/session.schema';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 10;
  private readonly SESSION_DURATION_HOURS = 8;

  constructor(
    @InjectModel(Administrator.name)
    private administratorModel: Model<AdministratorDocument>,
    @InjectModel(Session.name)
    private sessionModel: Model<SessionDocument>,
  ) {}

  /**
   * Validates administrator credentials
   * @param username - The administrator's username
   * @param password - The plain text password
   * @returns The administrator document if credentials are valid, null otherwise
   */
  async validateCredentials(
    username: string,
    password: string,
  ): Promise<AdministratorDocument | null> {
    const administrator = await this.administratorModel
      .findOne({ username })
      .exec();

    if (!administrator) {
      return null;
    }

    const isPasswordValid = await this.comparePassword(
      password,
      administrator.passwordHash,
    );

    if (!isPasswordValid) {
      return null;
    }

    return administrator;
  }

  /**
   * Hashes a password using bcrypt with salt
   * @param password - The plain text password to hash
   * @returns The hashed password
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Compares a plain text password with a hashed password
   * @param password - The plain text password
   * @param hash - The hashed password to compare against
   * @returns True if passwords match, false otherwise
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Creates a new session for an administrator
   * @param administratorId - The administrator's ID
   * @returns The created session document
   */
  async createSession(
    administratorId: Types.ObjectId,
  ): Promise<SessionDocument> {
    const token = this.generateSecureToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + this.SESSION_DURATION_HOURS);

    const session = new this.sessionModel({
      administratorId,
      token,
      expiresAt,
      lastActivityAt: new Date(),
    });

    return session.save();
  }

  /**
   * Validates a session token and checks expiration
   * @param token - The session token to validate
   * @returns The session document if valid and not expired, null otherwise
   */
  async validateSession(token: string): Promise<SessionDocument | null> {
    const session = await this.sessionModel.findOne({ token }).exec();

    if (!session) {
      return null;
    }

    const now = new Date();
    if (session.expiresAt < now) {
      // Session expired, remove it
      await this.invalidateSession(token);
      return null;
    }

    // Update last activity time
    session.lastActivityAt = now;
    await session.save();

    return session;
  }

  /**
   * Invalidates a session by removing it from the database
   * @param token - The session token to invalidate
   * @returns True if session was invalidated, false if not found
   */
  async invalidateSession(token: string): Promise<boolean> {
    const result = await this.sessionModel.deleteOne({ token }).exec();
    return result.deletedCount > 0;
  }

  /**
   * Generates a secure random token for session identification
   * @returns A secure random token string
   */
  private generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}
