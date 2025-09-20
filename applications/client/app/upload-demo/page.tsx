"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/elements/pill-tabs';
import { 
  FileUploadExample, 
  FileUploadServerExample 
} from '@/components/forms';

export default function UploadDemoPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">File Upload Demo</h1>
        <p className="text-muted-foreground">
          Compare Next.js API upload vs Express server upload
        </p>
      </div>

      <Tabs defaultValue="nextjs" className="space-y-6">
        <TabsList>
          <TabsTrigger value="nextjs">Next.js API Upload</TabsTrigger>
          <TabsTrigger value="server">Express Server Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="nextjs">
          <Card>
            <CardHeader>
              <CardTitle>Next.js API Upload</CardTitle>
              <p className="text-sm text-muted-foreground">
                Upload files using Next.js API routes to Supabase storage
              </p>
            </CardHeader>
            <CardContent>
              <FileUploadExample />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="server">
          <Card>
            <CardHeader>
              <CardTitle>Express Server Upload</CardTitle>
              <p className="text-sm text-muted-foreground">
                Upload files using Express server API to Supabase storage
              </p>
            </CardHeader>
            <CardContent>
              <FileUploadServerExample />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Next.js API Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>✅ Client-side validation</li>
              <li>✅ Drag & drop interface</li>
              <li>✅ File preview</li>
              <li>✅ Progress tracking</li>
              <li>✅ Error handling</li>
              <li>✅ Multiple file support</li>
              <li>✅ Direct Supabase integration</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Express Server Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>✅ Server-side validation</li>
              <li>✅ Multer file handling</li>
              <li>✅ Express middleware</li>
              <li>✅ RESTful API endpoints</li>
              <li>✅ Centralized upload logic</li>
              <li>✅ Better error handling</li>
              <li>✅ Scalable architecture</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>API Endpoints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2">Next.js API Routes</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>POST /api/upload - Upload single file</li>
                  <li>DELETE /api/upload?path=... - Delete file</li>
                  <li>GET /api/upload?folder=... - List files</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Express Server Routes</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>POST /upload - Upload single file</li>
                  <li>POST /upload/multiple - Upload multiple files</li>
                  <li>DELETE /upload/:path - Delete file</li>
                  <li>GET /upload/list - List files</li>
                  <li>GET /upload/info/:path - Get file info</li>
                  <li>GET /upload/health - Health check</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
