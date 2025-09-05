# 🏢 Organization API Documentation (Schema v2.0)

## 📊 New Schema Overview
The organization schema has been updated to remove Clerk dependencies:

**Current Schema:**
```sql
organizations {
  id: UUID (Primary Key)
  name: String
  code: String (Unique)
  description: String?
  logo_url: String?
  owner_id: UUID (Foreign Key to users.id)
  created_at: DateTime
  updated_at: DateTime
}
```

## API Endpoints Overview

### 1. Main Organization CRUD
- `GET /api/organizations` - List all organizations
- `POST /api/organizations` - Create new organization
- `PUT /api/organizations` - Update organization
- `DELETE /api/organizations` - Delete organization

### 2. ~~Clerk Sync~~ (DEPRECATED)
- ~~`POST /api/organizations/sync/[clerk_org_id]`~~ - **HTTP 410 Gone** (Schema incompatible)
- ~~`DELETE /api/organizations/sync/[clerk_org_id]`~~ - **HTTP 410 Gone** (Schema incompatible)

### 3. Organization Members
- `GET /api/organizations/[org_id]/members` - Get organization members
- `POST /api/organizations/[org_id]/members` - Add member to organization
- `DELETE /api/organizations/[org_id]/members` - Remove member from organization

## API Usage Examples

### 📋 Get Organizations
```bash
# Get all organizations
curl -X GET "http://localhost:3000/api/organizations?limit=10&offset=0"

# Get specific organization by code
curl -X GET "http://localhost:3000/api/organizations?code=restaurant-abc"
```

### 🆕 Create Organization
```bash
curl -X POST "http://localhost:3000/api/organizations" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Restaurant Chain ABC",
    "code": "restaurant-abc",
    "description": "Premium restaurant chain",
    "logo_url": "https://example.com/logo.png",
    "owner_clerk_id": "user_xxxxx"
  }'
```

### 🔄 Update Organization
```bash
curl -X PUT "http://localhost:3000/api/organizations" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "org-uuid-123",
    "name": "Updated Restaurant Chain",
    "description": "Updated description"
  }'
```

### 🗑️ Delete Organization
```bash
curl -X DELETE "http://localhost:3000/api/organizations?id=org-uuid-123"
```

### ~~🔄 Sync from Clerk~~ (DEPRECATED)
```bash
# These endpoints now return HTTP 410 Gone
# curl -X POST "http://localhost:3000/api/organizations/sync/org_xxxxx"  # ❌ DEPRECATED
# curl -X DELETE "http://localhost:3000/api/organizations/sync/org_xxxxx" # ❌ DEPRECATED
```

### 👥 Organization Members
```bash
# Get members
curl -X GET "http://localhost:3000/api/organizations/org-uuid-123/members?limit=20&offset=0"

# Add member
curl -X POST "http://localhost:3000/api/organizations/org-uuid-123/members" \
  -H "Content-Type: application/json" \
  -d '{
    "user_clerk_id": "user_xxxxx",
    "restaurant_id": "restaurant-uuid",
    "role": "staff"
  }'

# Remove member
curl -X DELETE "http://localhost:3000/api/organizations/org-uuid-123/members?staff_id=staff-uuid"
```

## Response Examples

### Success Response (New Schema)
```json
{
  "success": true,
  "data": {
    "id": "org-uuid-123",
    "name": "Restaurant Chain ABC",
    "code": "restaurant-abc",
    "description": "Premium restaurant chain",
    "logo_url": "https://example.com/logo.png",
    "owner_id": "user-uuid-456",
    "owner": {
      "id": "user-uuid-456",
      "username": "john_doe",
      "email": "john@example.com",
      "full_name": "John Doe",
      "avatar_url": "https://example.com/avatar.jpg"
    },
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### Error Response
```json
{
  "error": "Organization not found",
  "status": 404
}
```

## Features

### ✅ Database-First Design (Schema v2.0)
- Pure database-driven organization management
- No external dependencies (removed Clerk integration)
- Simplified codebase and improved performance

### ✅ Database Management
- UUID-based primary keys
- Unique code constraint for organization identification
- Comprehensive error handling
- Foreign key validation with users table

### ✅ Organization Lifecycle
- Create, Read, Update, Delete operations
- Member management through restaurant staff assignments
- Restaurant-organization relationships

### ✅ Data Consistency
- Atomic transactions
- Rollback on failures
- Dependency checking (restaurants, chains, staff)

## Migration Notes

### Schema Changes (v1 → v2)
- ❌ Removed: `clerk_org_id` field
- ❌ Removed: `slug` field  
- ❌ Removed: `status` field
- ✅ Added: `code` field (unique identifier, replaces slug)
- ✅ Enhanced: Direct `owner_id` relationship to users table

### API Changes
- ❌ Deprecated: All `/sync/[clerk_org_id]` endpoints (HTTP 410 Gone)
- ✅ Updated: Organization queries now use `code` instead of `slug`
- ✅ Enhanced: Member management with improved validation

## Error Handling

The API includes comprehensive error handling for:
- Missing required fields  
- Invalid organization codes
- Database constraint violations
- Resource dependency conflicts
- Duplicate code conflicts

## Security Features

- Service role key for database operations
- Input validation and sanitization
- Dependency checking before deletion
- Owner verification for sensitive operations
