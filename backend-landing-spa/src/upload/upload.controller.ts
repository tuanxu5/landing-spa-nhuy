import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as sharp from 'sharp';
import { promises as fs } from 'fs';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('upload')
@UseGuards(AuthGuard)
export class UploadController {
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, callback) => {
          // Generate unique filename: timestamp-randomstring.ext
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        // Only allow image files
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return callback(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max for upload (will be compressed)
      },
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      // Compress and optimize the image
      const compressedFilename = `compressed-${file.filename}`;
      const compressedPath = `./uploads/images/${compressedFilename}`;

      await sharp(file.path)
        .resize(1920, 1080, {
          fit: 'inside', // Maintain aspect ratio
          withoutEnlargement: true, // Don't enlarge smaller images
        })
        .jpeg({
          quality: 80, // Good balance between quality and size
          progressive: true,
        })
        .toFile(compressedPath);

      // Delete original file
      await fs.unlink(file.path);

      // Get compressed file size
      const stats = await fs.stat(compressedPath);

      // Return the compressed file path
      return {
        filename: compressedFilename,
        path: `/uploads/images/${compressedFilename}`,
        size: stats.size,
        mimetype: 'image/jpeg',
      };
    } catch (error) {
      // Clean up files on error
      try {
        await fs.unlink(file.path);
      } catch (unlinkError) {
        // Ignore unlink errors
      }
      throw new BadRequestException('Failed to process image');
    }
  }
}
