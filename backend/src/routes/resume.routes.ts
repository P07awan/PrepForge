import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate } from '../middleware/auth';
import * as resumeController from '../controllers/resume.controller';

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads/resumes');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-userId-originalname
    const userId = (req as any).user?.id || 'unknown';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `${timestamp}-${userId}-${sanitizedName}${ext}`);
  },
});

// File filter to accept only PDF and DOCX
const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

/**
 * @route   POST /api/resumes/upload
 * @desc    Upload and analyze a resume
 * @access  Private (Candidates only)
 */
router.post('/upload', authenticate, upload.single('resume'), resumeController.uploadResume);

/**
 * @route   GET /api/resumes
 * @desc    Get all resumes for authenticated user
 * @access  Private
 */
router.get('/', authenticate, resumeController.getMyResumes);

/**
 * @route   GET /api/resumes/:id
 * @desc    Get detailed analysis for a specific resume
 * @access  Private
 */
router.get('/:id', authenticate, resumeController.getResumeDetails);

/**
 * @route   DELETE /api/resumes/:id
 * @desc    Delete a resume
 * @access  Private
 */
router.delete('/:id', authenticate, resumeController.deleteResumeById);

export default router;
