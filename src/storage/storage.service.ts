import { randomBytes } from 'crypto';
import { extname } from 'path';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { getImageUrl } from './image-url';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(config: ConfigService) {
    const required = [
      'R2_ENDPOINT',
      'R2_ACCESS_KEY_ID',
      'R2_SECRET_ACCESS_KEY',
      'R2_BUCKET',
      'STORAGE_PUBLIC_URL',
    ];
    const missing = required.filter((name) => !config.get(name));

    if (missing.length) {
      throw new Error(`Не заданы переменные окружения: ${missing.join(', ')}`);
    }

    this.bucket = config.get('R2_BUCKET');
    this.client = new S3Client({
      region: 'auto',
      endpoint: config.get('R2_ENDPOINT'),
      credentials: {
        accessKeyId: config.get('R2_ACCESS_KEY_ID'),
        secretAccessKey: config.get('R2_SECRET_ACCESS_KEY'),
      },
      // Новые версии SDK по умолчанию добавляют checksum, который R2 не принимает.
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
    });
  }

  async upload(file?: Express.Multer.File): Promise<string | undefined> {
    if (!file) return undefined;

    const key = `${randomBytes(16).toString('hex')}${extname(
      file.originalname,
    ).toLowerCase()}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        CacheControl: 'public, max-age=31536000, immutable',
      }),
    );

    return key;
  }

  async delete(keyOrUrl?: string): Promise<void> {
    if (!keyOrUrl) return;

    const key = keyOrUrl.split('/').pop();

    try {
      await this.client.send(
        new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
      );
    } catch (error) {
      this.logger.error(`Не удалось удалить файл ${key}: ${error}`);
    }
  }

  getUrl(key: string): string {
    return getImageUrl(key);
  }
}
