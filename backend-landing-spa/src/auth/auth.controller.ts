import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  BadRequestException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthGuard } from './guards/auth.guard';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Administrator,
  AdministratorDocument,
} from './schemas/administrator.schema';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectModel(Administrator.name)
    private administratorModel: Model<AdministratorDocument>,
  ) {}

  /**
   * POST /api/auth/login
   * Authenticate administrator and create session
   * Public endpoint - no authentication required
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    const { username, password } = loginDto;

    // Validate credentials
    const administrator = await this.authService.validateCredentials(
      username,
      password,
    );

    if (!administrator) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // Create session
    const session = await this.authService.createSession(administrator._id);

    // Update last login time
    administrator.lastLoginAt = new Date();
    await administrator.save();

    return { token: session.token };
  }

  /**
   * POST /api/auth/logout
   * Terminate administrator session
   * Requires authentication
   */
  @Post('logout')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req): Promise<{ message: string }> {
    // Extract token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

    // Invalidate session
    await this.authService.invalidateSession(token);

    return { message: 'Logged out successfully' };
  }

  /**
   * POST /api/auth/change-password
   * Change administrator password
   * Requires authentication
   */
  @Post('change-password')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const { currentPassword, newPassword, confirmPassword } = changePasswordDto;

    // Verify new passwords match
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('New passwords do not match');
    }

    // Get administrator from database
    const administrator = await this.administratorModel
      .findById(req.administratorId)
      .exec();

    if (!administrator) {
      throw new UnauthorizedException('Administrator not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await this.authService.comparePassword(
      currentPassword,
      administrator.passwordHash,
    );

    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const newPasswordHash = await this.authService.hashPassword(newPassword);

    // Update password
    administrator.passwordHash = newPasswordHash;
    await administrator.save();

    return { message: 'Password changed successfully' };
  }

  /**
   * GET /api/auth/me
   * Retrieve current authenticated administrator
   * Requires authentication
   */
  @Get('me')
  @UseGuards(AuthGuard)
  async getCurrentUser(@Request() req): Promise<{
    id: string;
    username: string;
    email: string;
    lastLoginAt?: Date;
  }> {
    // Get administrator from database
    const administrator = await this.administratorModel
      .findById(req.administratorId)
      .select('-passwordHash')
      .exec();

    if (!administrator) {
      throw new UnauthorizedException('Administrator not found');
    }

    return {
      id: administrator._id.toString(),
      username: administrator.username,
      email: administrator.email,
      lastLoginAt: administrator.lastLoginAt,
    };
  }
}
