import { Request, Response } from 'express';
import {
  uploadFile,
  deleteFile,
  listFiles,
  getFileUrl
} from '@/services/uploadService';

/**
 * Upload single file
 */
export async function uploadFileController(req: Request, res: Response) {
  try {
    console.log('Upload request received');
    console.log('Headers:', req.headers);
    console.log('Body keys:', Object.keys(req.body || {}));
    console.log('File:', req.file ? 'File present' : 'No file');

    if (!req.file) {
      console.log('No file provided in request');
      return res.status(400).json({
        success: false,
        error: 'No file provided'
      });
    }

    const folder = req.body.folder || 'uploads';
    const bucket = req.body.bucket || 'public';

    console.log('Processing upload with folder:', folder, 'bucket:', bucket);

    const result = await uploadFile(req.file, {
      folder,
      bucket
    });

    if (!result.success) {
      console.log('Upload service failed:', result.error);
      return res.status(400).json(result);
    }

    console.log('Upload successful:', result);
    res.json(result);
  } catch (error) {
    console.error('Upload controller error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

/**
 * Upload multiple files
 */
export async function uploadFilesController(req: Request, res: Response) {
  try {
    if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
      return res.status(400).json({
        success: false,
        error: 'No files provided'
      });
    }

    const folder = req.body.folder || 'uploads';
    const bucket = req.body.bucket || 'public';
    const files = Array.isArray(req.files) ? req.files : [req.files];

    const uploadPromises = files.map(file =>
      uploadFile(file as Express.Multer.File, { folder, bucket })
    );

    const results = await Promise.all(uploadPromises);
    const successCount = results.filter(r => r.success).length;
    const errorCount = results.filter(r => !r.success).length;

    res.json({
      success: true,
      data: {
        results,
        summary: {
          total: results.length,
          successful: successCount,
          failed: errorCount
        }
      }
    });
  } catch (error) {
    console.error('Upload multiple controller error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

/**
 * Delete file
 */
export async function deleteFileController(req: Request, res: Response) {
  try {
    const { path } = req.params;
    const { bucket = 'public' } = req.query;

    if (!path) {
      return res.status(400).json({
        success: false,
        error: 'File path is required'
      });
    }

    const result = await deleteFile(path as string, bucket as string);

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete controller error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

/**
 * List files
 */
export async function listFilesController(req: Request, res: Response) {
  try {
    const { folder = '', bucket = 'public', limit = 100 } = req.query;

    const result = await listFiles(
      folder as string,
      bucket as string,
      parseInt(limit as string)
    );

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('List files controller error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

/**
 * Get file info
 */
export async function getFileInfoController(req: Request, res: Response) {
  try {
    const { path } = req.params;
    const { bucket = 'public' } = req.query;

    if (!path) {
      return res.status(400).json({
        success: false,
        error: 'File path is required'
      });
    }

    const publicUrl = getFileUrl(path, bucket as string);

    res.json({
      success: true,
      data: {
        path,
        bucket,
        publicUrl
      }
    });
  } catch (error) {
    console.error('Get file info controller error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

/**
 * Health check
 */
export async function healthCheckController(req: Request, res: Response) {
  res.json({
    success: true,
    message: 'Upload service is running',
    timestamp: new Date().toISOString()
  });
}
