import fs from 'fs';
import { Client } from 'minio';
import util from 'util';
let minioClient: Client;

import { pipeline } from 'stream';

const pump = util.promisify(pipeline);

export const initializeMinio = async () => {
  minioClient = new Client({
    endPoint: 'minio',
    port: 9000,
    useSSL: false,
    accessKey: 'root',
    secretKey: '6fd37861-d2a9-4aa3-8a1f-52559367223a',
  });
};

export const uploadFile = async (file: any) => {
  // CHECK IF BUCKET EXISTS

  const bucketExists = await minioClient.bucketExists('mybucket');
  if (!bucketExists) {
    await minioClient.makeBucket('mybucket', 'us-east-1');
    await minioClient.setBucketPolicy(
      'mybucket',
      JSON.stringify(READONLY_POLICY),
    );
  }

  //get file extension
  const fileExtension = file.filename.split('.').pop();
  const filename = `tmp/backgorund.${fileExtension}`;

  await pump(file.file, fs.createWriteStream(filename));

  console.log(file);

  const e = await minioClient.fPutObject('mybucket', 'background', filename);
  console.log(e);
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
