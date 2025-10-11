import { S3Client, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';

// Validate required environment variables
if (!process.env.AWS_REGION) {
  throw new Error('AWS_REGION is not set in environment variables');
}
if (!process.env.AWS_S3_BUCKET) {
  throw new Error('AWS_S3_BUCKET is not set in environment variables');
}
if (!process.env.AWS_ACCESS_KEY_ID) {
  throw new Error('AWS_ACCESS_KEY_ID is not set in environment variables');
}
if (!process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error('AWS_SECRET_ACCESS_KEY is not set in environment variables');
}

// Create S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export type UploadFileParams = {
  fileBuffer: Buffer;
  fileName: string;
  mimeType: string;
  orderNumber: string;
  orderItemId: number;
  metadata?: Record<string, string>;
};

export type UploadFileResult = {
  s3Key: string;
  bucket: string;
  region: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
};

/**
 * Upload a file to S3 with proper key structure
 * Key format: orders/<orderNumber>/<orderItemId>/<filename>
 */
export async function uploadFileToS3(params: UploadFileParams): Promise<UploadFileResult> {
  const { fileBuffer, fileName, mimeType, orderNumber, orderItemId, metadata } = params;

  // Construct S3 key
  const s3Key = `orders/${orderNumber}/${orderItemId}/${fileName}`;

  // Prepare upload parameters
  const uploadParams: PutObjectCommandInput = {
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: s3Key,
    Body: fileBuffer,
    ContentType: mimeType,
    Metadata: metadata || {},
    // Set cache control for efficient delivery
    CacheControl: 'max-age=31536000', // 1 year
  };

  try {
    // Upload to S3
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    console.log(`Successfully uploaded file to S3: ${s3Key}`);

    return {
      s3Key,
      bucket: process.env.AWS_S3_BUCKET!,
      region: process.env.AWS_REGION!,
      fileName,
      mimeType,
      fileSize: fileBuffer.length,
    };
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw new Error(`Failed to upload file to S3: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Upload multiple files to S3
 * Returns array of upload results
 */
export async function uploadFilesToS3(files: UploadFileParams[]): Promise<UploadFileResult[]> {
  try {
    const uploadPromises = files.map(file => uploadFileToS3(file));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple files to S3:', error);
    throw new Error(`Failed to upload files to S3: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export { s3Client };
