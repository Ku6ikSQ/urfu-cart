import { configDotenv } from 'dotenv';
import {Client} from 'minio'
import {v7} from 'uuid'

configDotenv()
const minioClient = new Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ROOT_USER,
    secretKey: process.env.MINIO_ROOT_PASSWORD
  });

const minioCreateBucket = async (bucketName) => {
    await minioClient.bucketExists(bucketName, (err, exists) => {
        if (err) {
          return console.log('Failed to check the bucket', err);
        }
        if (!exists) {
            minioClient.makeBucket(bucketName, "ru", (err) => {
            if (err) {
              return console.log('Failed to make the bucket', err);
            }
            console.log('The bucket successfully created');
          });
        } else {
          console.log('The bucket already had been created');
        }
      });
}
await minioCreateBucket(process.env.MINIO_BASE_BUCKET);

class FileService {
    static async uploadFile(file) {
      try {
        const fileName = v7() + '-' + file.name; // generate name with uuid
        await minioClient.putObject(process.env.MINIO_BASE_BUCKET, fileName, file.data, (err, etag) => {
            if(err)
              throw new Error(err.message)
          });
        return fileName
      } catch (e) {
        throw new Error(e.message)
      }
    }

    static async getFile(fileName) {
      try {
        let fileURL;
        await minioClient.presignedGetObject(process.env.MINIO_BASE_BUCKET, fileName, 60*60*4, (err, presignedUrl) => {
          if(err)
            throw new Error("Failed to get the file")
            fileURL = presignedUrl
        });
        return fileURL
      } catch (e) {
        throw new Error(e.message)
      }
    }

    static async deleteFile(fileName) {
      try {
        minioClient.removeObject(process.env.MINIO_BASE_BUCKET, fileName, (err) => {
          if(err)
            throw new Error("Failed to delete the file")
          return 1;
        });
      } catch (e) {
        throw new Error(e.message)
      }
    }
}

export default FileService