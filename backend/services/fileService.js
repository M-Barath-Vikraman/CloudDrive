import { PutCommand, QueryCommand, GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { docClient } from '../config/dynamodb.js';
import s3Client from '../config/s3.js';

console.log(process.env.DYNAMODB_FILES_TABLE);


const FILES_TABLE = process.env.DYNAMODB_FILES_TABLE || 'UserFiles';

export const fileService = {
  /**
   * Saves file metadata to DynamoDB UserFiles table
   */
  createFileMetadata: async (userId, fileName, s3Key, contentType, fileSize) => {
    const fileId = uuidv4();
    const fileType = contentType.startsWith('image/')
      ? 'image'
      : contentType.startsWith('video/')
      ? 'video'
      : 'document';

    const newFile = {
      UserID: userId,
      FileID: fileId,
      FileName: fileName,
      S3Key: s3Key,
      ContentType: contentType,
      FileType: fileType,
      FileSize: parseInt(fileSize, 10),
      UploadedAt: new Date().toISOString(),
    };

    const putParams = {
      TableName: FILES_TABLE,
      Item: newFile,
    };
    console.log("Saving to table:", FILES_TABLE);
    console.log("Item:", newFile);

    await docClient.send(new PutCommand(putParams));
    return newFile;
  },

  /**
   * Retrieves all files uploaded by a specific user using QueryCommand, sorted newest first
   */
  getFilesByUserId: async (userId) => {
    const queryParams = {
      TableName: FILES_TABLE,
      KeyConditionExpression: 'UserID = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    };

    const result = await docClient.send(new QueryCommand(queryParams));
    const items = result.Items || [];
    
    // Sort in memory by UploadedAt timestamp descending (newest first)
    return items.sort((a, b) => new Date(b.UploadedAt) - new Date(a.UploadedAt));
  },

  /**
   * Retrieves specific file metadata (implicitly validates user ownership via compound key check)
   */
  getFileByIdAndUserId: async (fileId, userId) => {
    const getParams = {
      TableName: FILES_TABLE,
      Key: {
        UserID: userId,
        FileID: fileId,
      },
    };

    const result = await docClient.send(new GetCommand(getParams));
    return result.Item || null;
  },

  /**
   * Removes S3 object first, then deletes file metadata record from DynamoDB
   */
  deleteFile: async (fileId, userId) => {
    const file = await fileService.getFileByIdAndUserId(fileId, userId);
    if (!file) {
      const err = new Error('File not found or access unauthorized.');
      err.statusCode = 404;
      throw err;
    }

    // 1. Delete the raw file from Amazon S3
    const s3Params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.S3Key,
    };
    await s3Client.send(new DeleteObjectCommand(s3Params));

    // 2. Delete metadata from DynamoDB UserFiles
    const dbParams = {
      TableName: FILES_TABLE,
      Key: {
        UserID: userId,
        FileID: fileId,
      },
    };
    await docClient.send(new DeleteCommand(dbParams));
    return file;
  },

  /**
   * Generates a 5-minute Presigned GetObject download link for a file
   */
  generateDownloadUrl: async (fileId, userId, preview = false) => {
    const file = await fileService.getFileByIdAndUserId(fileId, userId);
    if (!file) {
      const err = new Error('File not found or access unauthorized.');
      err.statusCode = 404;
      throw err;
    }

    const commandParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.S3Key,
    };

    // If it's a download request (not preview), force browser download attachment
    if (!preview) {
      commandParams.ResponseContentDisposition = `attachment; filename="${file.FileName}"`;
    }

    const command = new GetObjectCommand(commandParams);

    const downloadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 300, // 5 minutes expiration
    });

    return downloadUrl;
  },
};

export default fileService;
