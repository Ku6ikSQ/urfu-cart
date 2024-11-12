import { config as configDotenv } from 'dotenv';
import { Client } from 'minio';
import { v7 as uuidv7 } from 'uuid';

configDotenv();


const minioClient = new Client({
  endPoint: process.env.SERVER,
  port: 9000,
  useSSL: false, // true for "vps"
  accessKey: process.env.MINIO_ROOT_USER,
  secretKey: process.env.MINIO_ROOT_PASSWORD,
});

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const minioCreateBucket = async (bucketName) => {
  try {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      await minioClient.makeBucket(bucketName, "ru");
      console.log('The bucket successfully created');
    } else {
      console.log('The bucket already exists');
    }
  } catch (err) {
    console.log('Failed to check or create the bucket', err);
  }
};

await minioCreateBucket(process.env.MINIO_BASE_BUCKET);

class FileService {
  static async uploadFile(file) {
    try {
      const fileName = uuidv7() + '-' + file.name; // generate name with uuid
      await minioClient.putObject(process.env.MINIO_BASE_BUCKET, fileName, file.data);
      return fileName;
    } catch (e) {
      throw new Error('Failed to upload file: ' + e.message);
    }
  }

  static async getFile(fileName) {
    try {
      const fileURL = await minioClient.presignedGetObject(process.env.MINIO_BASE_BUCKET, fileName, 60 * 60 * 4);
      return fileURL;
    } catch (e) {
      throw new Error('Failed to get file: ' + e.message);
    }
  }

  static async deleteFile(fileName) {
    try {
      await minioClient.removeObject(process.env.MINIO_BASE_BUCKET, fileName);
      return 'File deleted successfully';
    } catch (e) {
      throw new Error('Failed to delete file: ' + e.message);
    }
  }
}

export default FileService;
