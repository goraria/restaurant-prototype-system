"use client"

import React, { useState } from 'react';
import { FileUpload } from './file-upload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type UploadResponse } from '@/utils/supabase/upload';

export function FileUploadExample() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadResponse[]>([]);

  const handleSingleUpload = (response: UploadResponse) => {
    console.log('Single file upload:', response);
    setUploadedFiles(prev => [...prev, response]);
  };

  const handleMultipleUpload = (responses: UploadResponse[]) => {
    console.log('Multiple files upload:', responses);
    setUploadedFiles(prev => [...prev, ...responses]);
  };

  const clearFiles = () => {
    setUploadedFiles([]);
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">File Upload Examples</h1>
        <p className="text-muted-foreground">
          Examples of using the FileUpload component with Supabase storage
        </p>
      </div>

      {/* Single File Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Single File Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload
            onUpload={handleSingleUpload}
            folder="single-uploads"
            multiple={false}
            maxFiles={1}
          />
        </CardContent>
      </Card>

      {/* Multiple Files Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Multiple Files Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload
            onUploads={handleMultipleUpload}
            folder="multiple-uploads"
            multiple={true}
            maxFiles={5}
          />
        </CardContent>
      </Card>

      {/* Image Only Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Image Only Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload
            onUploads={handleMultipleUpload}
            folder="images"
            multiple={true}
            maxFiles={10}
            accept={{
              'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
            }}
          />
        </CardContent>
      </Card>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Uploaded Files</CardTitle>
              <Button variant="outline" size="sm" onClick={clearFiles}>
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {file.data?.type.startsWith('image/') ? (
                        <img
                          src={file.data.publicUrl}
                          alt={file.data.originalName}
                          className="h-10 w-10 object-cover rounded"
                        />
                      ) : (
                        <div className="h-10 w-10 bg-muted rounded flex items-center justify-center">
                          📄
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{file.data?.originalName}</p>
                      <p className="text-sm text-muted-foreground">
                        {file.data?.size && `${(file.data.size / 1024).toFixed(1)} KB`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={file.success ? "default" : "destructive"}>
                      {file.success ? "Success" : "Error"}
                    </Badge>
                    {file.data?.publicUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(file.data.publicUrl, '_blank')}
                      >
                        View
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
