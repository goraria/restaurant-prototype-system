import { createClient } from '@supabase/supabase-js';
// import { uploadConfig, validateUploadConfig } from '../config/upload';
import { createAdminSupabaseClient } from '@/config/admin';

const supabase = createAdminSupabaseClient();

// try {
//   // Validate configuration before initializing
//   if (!validateUploadConfig()) {
//     console.warn('⚠️ Upload service configuration failed. Upload functionality will be disabled.');
//     console.warn('📝 Please create a .env file with Supabase credentials to enable uploads.');
//   } else {
//     // Initialize Supabase client for server-side operations
//     // supabase = createClient(uploadConfig.supabaseUrl!, uploadConfig.supabaseServiceKey!);
//     console.log('✅ Upload service initialized successfully');
//   }
// } catch (error) {
//   console.error('❌ Failed to initialize upload service:', error);
//   console.warn('⚠️ Upload functionality will be disabled.');
// }

// Allowed file types
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'text/plain',
  'text/csv',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/zip',
  'application/x-zip-compressed',
  'application/json',
  'application/xml',
  'text/xml'
];

// Maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export interface UploadResult {
  success: boolean;
  data?: {
    path: string;
    fullPath: string;
    publicUrl: string;
    fileName: string;
    originalName: string;
    size: number;
    type: string;
    uploadedAt: string;
  };
  error?: string;
}

export interface UploadOptions {
  folder?: string;
  bucket?: string;
}

/**
 * Upload file to Supabase storage
 */
export async function uploadFile(
  file: Express.Multer.File,
  options: UploadOptions = {}
): Promise<UploadResult> {
  try {
    if (!supabase) {
      return {
        success: false,
        error: 'Upload service not configured. Please check your Supabase credentials.'
      };
    }

    const { folder = 'uploads', bucket = 'waddles' } = options;

    // Debug logging
    console.log('Uploading file:', {
      name: file.originalname,
      size: file.size,
      type: file.mimetype,
      buffer: file.buffer ? 'present' : 'missing'
    });

    // Validate file object
    if (!file || !file.originalname || !file.size) {
      console.error('Invalid file object:', {
        hasFile: !!file,
        originalname: file?.originalname,
        size: file?.size,
        mimetype: file?.mimetype,
        buffer: !!file?.buffer
      });
      return {
        success: false,
        error: 'Invalid file object - missing name or size'
      };
    }

    // Validate file buffer
    if (!file.buffer) {
      console.error('File buffer is missing:', {
        originalname: file.originalname,
        size: file.size,
        mimetype: file.mimetype
      });
      return {
        success: false,
        error: 'File buffer is missing - file may not have been processed correctly by multer'
      };
    }

    // Get file extension as fallback
    const fileExt = file.originalname ? file.originalname.split('.').pop()?.toLowerCase() : null;
    const extensionToMimeType: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
      'pdf': 'application/pdf',
      'txt': 'text/plain',
      'csv': 'text/csv',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'zip': 'application/zip',
      'json': 'application/json',
      'xml': 'application/xml'
    };

    // Use detected MIME type or fallback to extension-based type
    const detectedType = file.mimetype || (fileExt ? extensionToMimeType[fileExt] : null);

    // Validate file type
    if (!detectedType || !ALLOWED_TYPES.includes(detectedType)) {
      console.log('File type validation failed:', {
        originalType: file.mimetype,
        detectedType: detectedType,
        fileExtension: fileExt,
        allowedTypes: ALLOWED_TYPES
      });
      return {
        success: false,
        error: `File type ${detectedType || 'undefined'} not allowed`
      };
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: 'File size exceeds 10MB limit'
      };
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtForName = file.originalname ? file.originalname.split('.').pop() : 'file';
    const fileName = `${timestamp}-${randomString}.${fileExtForName}`;
    const filePath = `${folder}/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file.buffer, {
        contentType: detectedType,
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', {
        error: error,
        fileName: fileName,
        fileSize: file.size,
        fileType: detectedType,
        bucket: bucket,
        folder: folder
      });
      return {
        success: false,
        error: `Failed to upload file to storage: ${error.message || 'Unknown error'}`
      };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      success: true,
      data: {
        path: data.path,
        fullPath: data.fullPath,
        publicUrl: urlData.publicUrl,
        fileName: fileName,
        originalName: file.originalname,
        size: file.size,
        type: detectedType,
        uploadedAt: new Date().toISOString()
      }
    };

  } catch (error) {
    console.error('Upload service error:', error);
    return {
      success: false,
      error: 'Internal server error'
    };
  }
}

/**
 * Delete file from Supabase storage
 */
export async function deleteFile(
  filePath: string,
  bucket: string = 'waddles'
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!supabase) {
      return {
        success: false,
        error: 'Upload service not configured. Please check your Supabase credentials.'
      };
    }

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Supabase delete error:', error);
      return {
        success: false,
        error: 'Failed to delete file'
      };
    }

    return {
      success: true
    };
  } catch (error) {
    console.error('Delete service error:', error);
    return {
      success: false,
      error: 'Internal server error'
    };
  }
}

/**
 * List files in a folder
 */
export async function listFiles(
  folder: string = '',
  bucket: string = 'waddles',
  limit: number = 100
): Promise<{ success: boolean; data?: any[]; error?: string }> {
  try {
    if (!supabase) {
      return {
        success: false,
        error: 'Upload service not configured. Please check your Supabase credentials.'
      };
    }

    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder, {
        limit,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) {
      console.error('Supabase list error:', error);
      return {
        success: false,
        error: 'Failed to list files'
      };
    }

    return {
      success: true,
      data: data || []
    };
  } catch (error) {
    console.error('List service error:', error);
    return {
      success: false,
      error: 'Internal server error'
    };
  }
}

/**
 * Get file URL from path
 */
export function getFileUrl(path: string, bucket: string = 'waddles'): string {
  if (!process.env.EXPRESS_SUPABASE_REALTIME) {
    return '';
  }
  return `${process.env.EXPRESS_SUPABASE_REALTIME}/storage/v1/object/public/${bucket}/${path}`;
}

/**
 * Validate file before upload
 */
export function validateFile(file: Express.Multer.File): { valid: boolean; error?: string } {
  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 10MB limit' };
  }

  // Check file type
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'application/pdf',
    'text/plain',
    'text/csv',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/zip',
    'application/x-zip-compressed',
    'application/json',
    'application/xml',
    'text/xml'
  ];

  // Get file extension as fallback
  const fileExtension = file.originalname ? file.originalname.split('.').pop()?.toLowerCase() : null;
  const extensionToMimeType: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'pdf': 'application/pdf',
    'txt': 'text/plain',
    'csv': 'text/csv',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'zip': 'application/zip',
    'json': 'application/json',
    'xml': 'application/xml'
  };

  // Use detected MIME type or fallback to extension-based type
  const detectedType = file.mimetype || (fileExtension ? extensionToMimeType[fileExtension] : null);

  if (!detectedType || !allowedTypes.includes(detectedType)) {
    return { valid: false, error: `File type ${detectedType || 'undefined'} not allowed` };
  }

  return { valid: true };
}
