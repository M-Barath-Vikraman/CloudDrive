import { Router } from 'express';
import { createFile, getFiles, getFileById, deleteFile, downloadFile } from '../controllers/fileController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Apply authMiddleware globally to all files CRUD operations
router.use(authMiddleware);

// File Metadata CRUD Routes
router.post('/', createFile);
router.get('/', getFiles);

// Specific download route must be listed before the general parameterized /:id route
router.get('/download/:id', downloadFile);

router.get('/:id', getFileById);
router.delete('/:id', deleteFile);

export default router;
export { router as fileRoutes };
