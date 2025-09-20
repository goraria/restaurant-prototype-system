export interface UploadResponse {
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
  onProgress?: (progress: number) => void;
}

/**
 * Upload file to Supabase storage via Next.js API route
 */
export async function uploadFile(
  file: File,
  options: UploadOptions = {}
): Promise<UploadResponse> {
  const { folder = 'uploads', bucket = 'public', onProgress } = options;

  try {
    // Debug logging
    console.log('Uploading file:', {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified
    });

    // Validate file before sending
    if (!file || !file.name || !file.size) {
      console.error('Invalid file object:', file);
      return {
        success: false,
        error: 'Invalid file object'
      };
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    formData.append('bucket', bucket);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Upload failed');
    }

    return result;
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
}

/**
 * Upload multiple files
 */
export async function uploadFiles(
  files: File[],
  options: UploadOptions = {}
): Promise<UploadResponse[]> {
  const uploadPromises = files.map(file => uploadFile(file, options));
  return Promise.all(uploadPromises);
}

/**
 * Delete file from Supabase storage
 */
export async function deleteFile(
  filePath: string,
  bucket: string = 'public'
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`/api/upload?path=${encodeURIComponent(filePath)}&bucket=${bucket}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Delete failed');
    }

    return result;
  } catch (error) {
    console.error('Delete error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed'
    };
  }
}

/**
 * List files in a folder
 */
export async function listFiles(
  folder: string = '',
  bucket: string = 'public',
  limit: number = 100
): Promise<{ success: boolean; data?: any[]; error?: string }> {
  try {
    const params = new URLSearchParams({
      folder,
      bucket,
      limit: limit.toString()
    });

    const response = await fetch(`/api/upload?${params}`, {
      method: 'GET',
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'List failed');
    }

    return result;
  } catch (error) {
    console.error('List error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'List failed'
    };
  }
}

/**
 * Get file URL from path
 */
export function getFileUrl(path: string, bucket: string = 'public'): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

/**
 * Validate file before upload
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
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
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
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
  const detectedType = file.type || (fileExtension ? extensionToMimeType[fileExtension] : null);

  if (!detectedType || !allowedTypes.includes(detectedType)) {
    return { valid: false, error: `File type ${detectedType || 'undefined'} not allowed` };
  }

  return { valid: true };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  // Handle invalid input
  if (!bytes || isNaN(bytes) || bytes < 0) return '0 Bytes';
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
