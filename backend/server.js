import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import errorMiddleware from './middleware/errorMiddleware.js';
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import docClient from "./config/dynamodb.js";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import s3Client from "./config/s3.js";

// Load environmental parameters
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Standard Middlewares
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Routes mounting
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);

// Server Heartbeat Healthcheck
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CloudDrive Backend Server API is operational.',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/test-dynamodb', async (req, res) => {
  try {
    const result = await docClient.send(
      new ScanCommand({
        TableName: process.env.DYNAMODB_USERS_TABLE
      })
    );

    res.status(200).json({
      success: true,
      count: result.Items.length,
      data: result.Items
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

app.get("/test-s3", async (req, res) => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME,
    });

    const result = await s3Client.send(command);

    res.status(200).json({
      success: true,
      bucket: process.env.AWS_BUCKET_NAME,
      objectCount: result.KeyCount || 0,
      objects: result.Contents || [],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

console.log(process.env.AWS_REGION);
console.log(process.env.DYNAMODB_USERS_TABLE);
console.log(process.env.PORT);

console.log("Access Key:", process.env.AWS_ACCESS_KEY_ID);
console.log(
  "Secret Key Loaded:",
  process.env.AWS_SECRET_ACCESS_KEY ? "YES" : "NO"
);
// Centralized Unhandled Errors Handler (MUST be placed after routes)
app.use(errorMiddleware);

// Spin up HTTP Server listeners
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`  CloudDrive Express Backend started successfully  `);
  console.log(`  Port: http://localhost:${PORT}                   `);
  console.log(`  Env:  ${process.env.NODE_ENV || 'development'}  `);
  console.log(`==================================================`);
});

export default app;
