# Upload Service Setup Guide

## 🚀 Quick Start

### 1. Create Environment File
Create a `.env` file in the server directory with the following variables:

```bash
# Supabase Configuration
EXPRESS_SUPABASE_URL=https://your-project.supabase.co
EXPRESS_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Alternative variables (fallback)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Server Configuration
EXPRESS_PORT=8080
EXPRESS_ENV=development
EXPRESS_CLIENT_URL=http://localhost:3000
```

### 2. Get Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy your Project URL and Service Role Key

### 3. Start Server
```bash
npm run dev
```

## 📁 Upload Endpoints

### Single File Upload
```bash
POST /upload
Content-Type: multipart/form-data

# Form data:
file: [file]
folder: uploads (optional)
bucket: public (optional)
```

### Multiple Files Upload
```bash
POST /upload/multiple
Content-Type: multipart/form-data

# Form data:
files: [file1, file2, ...]
folder: uploads (optional)
bucket: public (optional)
```

### Delete File
```bash
DELETE /upload/:path
```

### List Files
```bash
GET /upload/list?folder=uploads&bucket=public&limit=100
```

### Get File Info
```bash
GET /upload/info/:path
```

### Health Check
```bash
GET /upload/health
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `EXPRESS_SUPABASE_URL` | Supabase project URL | Yes |
| `EXPRESS_SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `EXPRESS_PORT` | Server port | No (default: 8080) |
| `EXPRESS_ENV` | Environment | No (default: development) |

### File Upload Limits

- **Max file size**: 10MB
- **Max files per request**: 10
- **Allowed types**: Images, PDFs, Documents, Archives

## 🧪 Testing

### Test with curl
```bash
# Health check
curl http://localhost:8080/upload/health

# Upload file
curl -X POST -F "file=@test.txt" http://localhost:8080/upload

# List files
curl http://localhost:8080/upload/list
```

### Test with JavaScript
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('folder', 'uploads');

fetch('http://localhost:8080/upload', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

## 🚨 Troubleshooting

### Error: "Invalid supabaseUrl"
- Check your `EXPRESS_SUPABASE_URL` in `.env`
- Ensure the URL is valid and starts with `https://`

### Error: "Upload service not configured"
- Verify your Supabase credentials
- Check that `.env` file exists in server directory
- Restart the server after adding environment variables

### Error: "File type not allowed"
- Check the file type is in the allowed list
- Ensure file extension matches MIME type

## 📝 Notes

- Upload service will be disabled if Supabase credentials are not configured
- Files are stored in Supabase Storage
- All uploads are validated for type and size
- Service includes automatic file type detection
- Supports both single and multiple file uploads
