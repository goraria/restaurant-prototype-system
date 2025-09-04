// ================================
// 📁 File Upload Configuration
// ================================

import multer from "multer";
import path from "path";
import fs from 'fs';

/**
 * Get upload directory path
 * @returns Absolute path to upload directory
 */
export const getUploadDirectory = (): string => {
  const directory = path.resolve(__dirname, "..", "public");
  if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true });
  return directory;
};

/**
 * Multer storage configuration
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, getUploadDirectory());
  },
  filename: (req, file, cb) => {
    const safeBase = path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, "_");
    const ext = path.extname(safeBase);
    const name = path.basename(safeBase, ext);
    cb(null, `${name}_${Date.now()}_${Math.random().toString(36).slice(2,8)}${ext}`);
  },
});

/**
 * Image upload middleware with file type validation
 * Accepts: image/* files
 * Max size: 5MB
 */
export const imageUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype || !file.mimetype.startsWith('image/')) {
      return cb(new Error('Chỉ hỗ trợ file ảnh (image/*)'));
    }
    cb(null, true);
  },
});

/**
 * General file upload middleware
 * Accepts: all file types
 * Max size: 20MB
 */
export const fileUpload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

/**
 * Document upload middleware with file type validation
 * Accepts: PDF, DOC, DOCX, XLS, XLSX files
 * Max size: 10MB
 */
export const documentUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (!allowedMimes.includes(file.mimetype)) {
      return cb(new Error('Chỉ hỗ trợ file PDF, DOC, DOCX, XLS, XLSX'));
    }
    cb(null, true);
  },
});

/**
 * Video upload middleware with file type validation
 * Accepts: video/* files
 * Max size: 100MB
 */
export const videoUpload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype || !file.mimetype.startsWith('video/')) {
      return cb(new Error('Chỉ hỗ trợ file video (video/*)'));
    }
    cb(null, true);
  },
});

/**
 * Avatar upload middleware (smaller size limit)
 * Accepts: image/* files
 * Max size: 2MB
 */
export const avatarUpload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype || !file.mimetype.startsWith('image/')) {
      return cb(new Error('Chỉ hỗ trợ file ảnh (image/*)'));
    }
    cb(null, true);
  },
});

/**
 * Menu item image upload middleware
 * Accepts: image/* files
 * Max size: 3MB
 */
export const menuImageUpload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp'
    ];
    
    if (!allowedMimes.includes(file.mimetype)) {
      return cb(new Error('Chỉ hỗ trợ file ảnh JPEG, PNG, WebP'));
    }
    cb(null, true);
  },
});

/**
 * Create file URL from filename
 * @param filename - The uploaded filename
 * @returns Public URL for the file
 */
export const createFileUrl = (filename: string): string => {
  const baseUrl = process.env.EXPRESS_SERVER_URL || 'http://localhost:8080';
  return `${baseUrl}/@/public/${filename}`;
};

/**
 * Delete uploaded file
 * @param filename - The filename to delete
 * @returns Promise<boolean> - Success status
 */
export const deleteFile = async (filename: string): Promise<boolean> => {
  try {
    const filePath = path.join(getUploadDirectory(), filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

/**
 * Get file info
 * @param filename - The filename to check
 * @returns File stats or null if not found
 */
export const getFileInfo = (filename: string) => {
  try {
    const filePath = path.join(getUploadDirectory(), filename);
    if (fs.existsSync(filePath)) {
      return fs.statSync(filePath);
    }
    return null;
  } catch (error) {
    console.error('Error getting file info:', error);
    return null;
  }
};