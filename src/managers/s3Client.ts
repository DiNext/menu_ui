import { S3Client } from '@aws-sdk/client-s3';

export const client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'AKIA3CQW6FB7N7LVMDOR',
    secretAccessKey: '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',
  },
});
