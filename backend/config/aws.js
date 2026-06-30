import dotenv from 'dotenv';

dotenv.config();

export const awsConfig = {
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'mock-access-key-id',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'mock-secret-access-key',
  }
};
