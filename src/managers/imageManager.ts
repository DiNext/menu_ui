import { PutObjectCommand } from '@aws-sdk/client-s3';
import type { PutObjectCommandOutput } from '@aws-sdk/client-s3';
import { client } from './s3Client';

class ImageManager {
  static async uploadImage(
    file: File,
    fileName: string,
  ): Promise<PutObjectCommandOutput | undefined> {
    const uploadParams = {
      Bucket: 'imagesmenubucket',
      Key: `images/${fileName}`,
      Body: file,
    };

    try {
      const data = await client.send(new PutObjectCommand(uploadParams));
      console.log('Success', data);
      return data;
    } catch (err) {
      console.log('Error', err);
      return undefined;
    }
  }
}

export default ImageManager;
