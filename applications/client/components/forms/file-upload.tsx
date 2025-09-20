"use client"

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  X, 
  File, 
  Image, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { uploadFile, validateFile, formatFileSize, type UploadResponse } from '@/utils/supabase/upload';
import { toast } from 'sonner';

interface FileUploadProps {
  onUpload?: (response: UploadResponse) => void;
  onUploads?: (responses: UploadResponse[]) => void;
  folder?: string;
  bucket?: string;
  multiple?: boolean;
  maxFiles?: number;
  accept?: Record<string, string[]>;
  className?: string;
  disabled?: boolean;
}

interface FileWithPreview extends File {
  id: string;
  preview?: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
  response?: UploadResponse;
  size: number; // Override to ensure it's always a number
  originalFile?: File; // Store original file object
}

export function FileUpload({
  onUpload,
  onUploads,
  folder = 'uploads',
  bucket = 'waddles', // public
  multiple = false,
  maxFiles = 1,
  accept = {
    'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.svg'],
    'application/pdf': ['.pdf'],
    'text/plain': ['.txt'],
    'text/csv': ['.csv'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'application/vnd.ms-powerpoint': ['.ppt'],
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
    'application/zip': ['.zip'],
    'application/json': ['.json'],
    'application/xml': ['.xml'],
    'text/xml': ['.xml']
  },
  className = '',
  disabled = false
}: FileUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (disabled) return;

    const newFiles: FileWithPreview[] = acceptedFiles.map(file => {
      const validation = validateFile(file);
      // Debug: Log original file object
      console.log('Original file object:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        constructor: file.constructor.name
      });

      const fileWithPreview: FileWithPreview = {
        ...file,
        id: Math.random().toString(36).substr(2, 9),
        status: validation.valid ? 'pending' : 'error',
        progress: 0,
        error: validation.error,
        // Ensure size is always a valid number
        size: file.size || 0,
        // Store original file object
        originalFile: file
      };

      // Create preview for images
      if (file.type.startsWith('image/')) {
        fileWithPreview.preview = URL.createObjectURL(file);
      }

      return fileWithPreview;
    });

    setFiles(prev => {
      const updated = [...prev, ...newFiles];
      return multiple ? updated : updated.slice(-maxFiles);
    });
  }, [multiple, maxFiles, disabled]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxFiles,
    disabled
  });

  const removeFile = (fileId: string) => {
    setFiles(prev => {
      const updated = prev.filter(f => f.id !== fileId);
      // Clean up preview URLs
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return updated;
    });
  };

  const uploadFiles = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    if (pendingFiles.length === 0) return;

    setIsUploading(true);

    try {
      const uploadPromises = pendingFiles.map(async (file) => {
        // Update status to uploading
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, status: 'uploading' as const, progress: 0 } : f
        ));

        // Debug: Log file before upload
        console.log('File before upload:', {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          constructor: file.constructor.name
        });

        // Ensure we have a valid file object
        let fileToUpload: File = file;
        if (!file.name || !file.size) {
          console.warn('File object is corrupted, using original file...');
          // Use the stored original file
          if (file.originalFile && file.originalFile.name && file.originalFile.size) {
            fileToUpload = file.originalFile;
            console.log('Using original file:', {
              name: fileToUpload.name,
              size: fileToUpload.size,
              type: fileToUpload.type
            });
          } else {
            console.error('Cannot reconstruct file object');
            setFiles(prev => prev.map(f => 
              f.id === file.id 
                ? { ...f, status: 'error' as const, error: 'Invalid file object' }
                : f
            ));
            return;
          }
        }

        const response = await uploadFile(fileToUpload, { folder, bucket });
        
        // Update status based on response
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { 
                ...f, 
                status: response.success ? 'success' as const : 'error' as const,
                progress: 100,
                response,
                error: response.error
              } 
            : f
        ));

        return response;
      });

      const responses = await Promise.all(uploadPromises);
      const validResponses = responses.filter(r => r !== undefined) as UploadResponse[];
      
      if (onUploads) {
        onUploads(validResponses);
      } else if (onUpload && validResponses.length === 1) {
        onUpload(validResponses[0]);
      }

      // Show success message
      const successCount = validResponses.filter(r => r.success).length;
      if (successCount > 0) {
        toast.success(`${successCount} file(s) uploaded successfully`);
      }

      // Show error messages
      const errorCount = validResponses.filter(r => !r.success).length;
      if (errorCount > 0) {
        toast.error(`${errorCount} file(s) failed to upload`);
      }

    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-4 w-4" />;
    } else if (file.type === 'application/pdf') {
      return <FileText className="h-4 w-4" />;
    } else {
      return <File className="h-4 w-4" />;
    }
  };

  const safeFormatFileSize = (size: number | undefined): string => {
    if (!size || isNaN(size) || size < 0) return '0 Bytes';
    return formatFileSize(size);
  };

  const getStatusIcon = (file: FileWithPreview) => {
    switch (file.status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'uploading':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (file: FileWithPreview) => {
    switch (file.status) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'uploading':
        return <Badge variant="secondary">Uploading...</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const pendingFiles = files.filter(f => f.status === 'pending');
  const hasPendingFiles = pendingFiles.length > 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Dropzone */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-primary/5'}
            `}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-lg font-medium">Drop files here...</p>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">
                  Drag & drop files here, or click to select
                </p>
                <p className="text-sm text-muted-foreground">
                  {multiple ? `Up to ${maxFiles} files` : 'Single file only'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Max size: 10MB per file
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              {files.map((file) => (
                <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  {/* File Preview/Icon */}
                  <div className="flex-shrink-0">
                    {file.preview ? (
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="h-10 w-10 object-cover rounded"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-muted rounded flex items-center justify-center">
                        {getFileIcon(file)}
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      {getStatusIcon(file)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {safeFormatFileSize(file.size)}
                      </span>
                      {getStatusBadge(file)}
                    </div>
                    {file.error && (
                      <p className="text-xs text-red-500 mt-1">{file.error}</p>
                    )}
                    {file.status === 'uploading' && (
                      <Progress value={file.progress} className="mt-2 h-1" />
                    )}
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    disabled={file.status === 'uploading'}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Upload Button */}
            {hasPendingFiles && (
              <div className="mt-4 pt-4 border-t">
                <Button
                  onClick={uploadFiles}
                  disabled={isUploading}
                  className="w-full"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload {pendingFiles.length} file(s)
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
