import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from './s3-upload';

export type GeneratePresignedUrlParams = {
  s3Key: string;
  expiresIn?: number; // seconds, default 48 hours
  fileName?: string; // optional filename for download
};

export type GeneratePresignedUrlResult = {
  url: string;
  expiresAt: Date;
  s3Key: string;
};

/**
 * Generate a pre-signed URL for downloading a file from S3
 *
 * @param params - Parameters for generating the pre-signed URL
 * @returns Pre-signed URL with expiration info
 *
 * @example
 * const result = await generatePresignedUrl({
 *   s3Key: 'orders/YMA-2025-ABC123/1/poster.pdf',
 *   expiresIn: 86400, // 24 hours
 *   fileName: 'my-custom-map.pdf'
 * });
 */
export async function generatePresignedUrl(
  params: GeneratePresignedUrlParams
): Promise<GeneratePresignedUrlResult> {
  const { s3Key, expiresIn = 172800, fileName } = params; // default 48 hours

  if (!process.env.AWS_S3_BUCKET) {
    throw new Error('AWS_S3_BUCKET is not set in environment variables');
  }

  // Validate expiry time (max 7 days)
  if (expiresIn > 604800) {
    throw new Error('Pre-signed URL expiration cannot exceed 7 days (604800 seconds)');
  }

  if (expiresIn < 60) {
    throw new Error('Pre-signed URL expiration must be at least 60 seconds');
  }

  try {
    // Create GetObject command
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: s3Key,
      // Optional: force download with custom filename
      ...(fileName && {
        ResponseContentDisposition: `attachment; filename="${fileName}"`,
      }),
    });

    // Generate pre-signed URL
    const url = await getSignedUrl(s3Client, command, {
      expiresIn,
    });

    // Calculate expiration time
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn);

    console.log(`Generated pre-signed URL for ${s3Key}, expires at ${expiresAt.toISOString()}`);

    return {
      url,
      expiresAt,
      s3Key,
    };
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    throw new Error(
      `Failed to generate pre-signed URL: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Generate multiple pre-signed URLs in parallel
 * Useful for batch download links
 */
export async function generatePresignedUrls(
  files: GeneratePresignedUrlParams[]
): Promise<GeneratePresignedUrlResult[]> {
  try {
    const urlPromises = files.map((file) => generatePresignedUrl(file));
    return await Promise.all(urlPromises);
  } catch (error) {
    console.error('Error generating multiple pre-signed URLs:', error);
    throw new Error(
      `Failed to generate pre-signed URLs: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Common expiry presets (in seconds)
 */
export const EXPIRY_PRESETS = {
  ONE_HOUR: 3600,
  SIX_HOURS: 21600,
  TWELVE_HOURS: 43200,
  ONE_DAY: 86400,
  TWO_DAYS: 172800,
  THREE_DAYS: 259200,
  ONE_WEEK: 604800,
} as const;
