"use client"

import React, { useState } from 'react';
import { FileUploadServer } from './file-upload-server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type ServerUploadResponse } from './file-upload-server';

export function FileUploadServerExample() {
  const [uploadedFiles, setUploadedFiles] = useState<ServerUploadResponse[]>([]);

  const handleSingleUpload = (response: ServerUploadResponse) => {
    console.log('Single file upload to server:', response);
    setUploadedFiles(prev => [...prev, response]);
  };

  const handleMultipleUpload = (responses: ServerUploadResponse[]) => {
    console.log('Multiple files upload to server:', responses);
    setUploadedFiles(prev => [...prev, ...responses]);
  };

  const clearFiles = () => {
    setUploadedFiles([]);
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">File Upload Server Examples</h1>
        <p className="text-muted-foreground">
          Examples of using the FileUploadServer component with Express server API
        </p>
      </div>

      {/* Single File Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Single File Upload to Server</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUploadServer
            onUpload={handleSingleUpload}
            folder="server-uploads"
            multiple={false}
            maxFiles={1}
          />
        </CardContent>
      </Card>

      {/* Multiple Files Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Multiple Files Upload to Server</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUploadServer
            onUploads={handleMultipleUpload}
            folder="server-multiple-uploads"
            multiple={true}
            maxFiles={5}
          />
        </CardContent>
      </Card>

      {/* Image Only Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Image Only Upload to Server</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUploadServer
            onUploads={handleMultipleUpload}
            folder="server-images"
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
              <CardTitle>Uploaded Files (Server)</CardTitle>
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
                      <p className="text-xs text-muted-foreground">
                        Server: {file.data?.path}
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
