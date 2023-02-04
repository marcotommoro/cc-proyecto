import fs from 'fs';
import { Client } from 'minio';
import pump from 'pump';
let minioClient: Client;
// const pump = util.promisify(pipeline);

export const initializeMinio = async () => {
  minioClient = new Client({
    endPoint: process.env.MINIO_HOSTNAME || '0.minioclient',
    port: 80,
    useSSL: false,
    accessKey: process.env.MINIO_ROOT_USER || 'root',
    secretKey: process.env.MINIO_ROOT_PASSWORD || '',
  });
};

export const uploadFile = async (file: any) => {
  // CHECK IF BUCKET EXISTS

  const bucketExists = await minioClient.bucketExists('mybucket');

  if (!bucketExists) {
    console.log('Bucket does not exist, creating it...');
    await minioClient.makeBucket('mybucket', 'us-east-1');
    await minioClient.setBucketPolicy(
      'mybucket',
      JSON.stringify(READONLY_POLICY),
    );
  }

  //get file extension
  const fileExtension = file.filename.split('.').pop();
  const filename = `tmp/background.${fileExtension}`;
  //delete file if exists
  if (fs.existsSync(filename)) fs.unlinkSync(filename);

  await pump(file.file, fs.createWriteStream(filename));

  await minioClient.removeObject('mybucket', 'background');

  await minioClient.fPutObject('mybucket', 'background', filename);
};

const READONLY_POLICY = {
  Version: '2012-10-17',
  Statement: [
    {
      Action: ['s3:GetObject'],
      Effect: 'Allow',
      Resource: 'arn:aws:s3:::mybucket/*',
      Principal: '*',
    },
  ],
};
