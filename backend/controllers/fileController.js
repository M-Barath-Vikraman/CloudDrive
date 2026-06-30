import { fileService } from '../services/fileService.js';

/**
 * Saves uploaded file metadata after successful S3 upload
 */
export const createFile = async (req, res, next) => {
  try {
    const { fileName, key, contentType, fileSize } = req.body;
    const userId = req.user.userId;

    // Validate inputs
    if (!fileName || !key || !contentType || fileSize === undefined) {
      return res.status(400).json({
        success: false,
        message: 'fileName, key, contentType, and fileSize fields are all required.',
      });
    }

    const fileMetadata = await fileService.createFileMetadata(
      userId,
      fileName,
      key,
      contentType,
      fileSize
    );

    return res.status(201).json({
      success: true,
      message: 'File metadata saved successfully.',
      data: fileMetadata,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Returns all files belonging to the authenticated user
 */
export const getFiles = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const files = await fileService.getFilesByUserId(userId);

    return res.status(200).json({
      success: true,
      data: files,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Returns metadata of a single file owned by the authenticated user
 */
export const getFileById = async (req, res, next) => {
  try {
    const fileId = req.params.id;
    const userId = req.user.userId;

    const file = await fileService.getFileByIdAndUserId(fileId, userId);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found or access unauthorized.',
      });
    }

    return res.status(200).json({
      success: true,
      data: file,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Deletes S3 object and DynamoDB metadata
 */
export const deleteFile = async (req, res, next) => {
  try {
    const fileId = req.params.id;
    const userId = req.user.userId;

    await fileService.deleteFile(fileId, userId);

    return res.status(200).json({
      success: true,
      message: 'File and metadata deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Generates a presigned GET url to download the file
 */
export const downloadFile = async (req, res, next) => {
  try {
    const fileId = req.params.id;
    const userId = req.user.userId;
    const preview = req.query.preview === 'true';

    const downloadUrl = await fileService.generateDownloadUrl(fileId, userId, preview);

    return res.status(200).json({
      success: true,
      downloadUrl,
    });
  } catch (err) {
    next(err);
  }
};

export default {
  createFile,
  getFiles,
  getFileById,
  deleteFile,
  downloadFile,
};
