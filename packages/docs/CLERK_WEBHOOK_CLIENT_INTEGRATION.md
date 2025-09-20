# 🔗 Clerk Webhook Client Integration Guide

## 📖 Overview
This guide shows how to integrate Clerk webhooks with your **Expo** and **NextJS** clients using Supabase Realtime for automatic synchronization.

## 🚀 Server-Side Setup (Completed)

### Webhook Controller Features:
- ✅ **Comprehensive Clerk Events**: User, Organization, Membership events
- ✅ **Supabase Realtime Sync**: Automatically broadcasts to all clients
- ✅ **Multi-Role Support**: Customer, Staff, Manager, Admin roles
- ✅ **Organization Management**: Restaurant chains and individual restaurants
- ✅ **Real-time Notifications**: Live updates across all connected clients

### Supported Events:
```typescript
// User Events
'user.created'    → Syncs to 'users' table
'user.updated'    → Syncs to 'users' table  
'user.deleted'    → Soft delete in 'users' table

// Organization Events
'organization.created' → Syncs to 'organizations' table
'organization.updated' → Syncs to 'organizations' table
'organization.deleted' → Soft delete in 'organizations' table

// Membership Events
'organizationMembership.created' → Syncs to 'restaurant_staffs' table
'organizationMembership.updated' → Syncs to 'restaurant_staffs' table
'organizationMembership.deleted' → Removes from 'restaurant_staffs' table
```

## 📱 Expo Client Integration

### 1. Install Dependencies
```bash
npm install @supabase/supabase-js @clerk/clerk-expo
```

### 2. Setup Supabase Client
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 3. Listen to Webhook Events
```typescript
// hooks/useClerkWebhookSync.ts
import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useUser } from '@clerk/clerk-expo'

export function useClerkWebhookSync() {
  const { user } = useUser()

  useEffect(() => {
    if (!user) return

    // Listen to users table changes
    const userSubscription = supabase
      .channel('users-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'users',
          filter: `clerk_id=eq.${user.id}`
        },
        (payload) => {
          console.log('👤 User updated from webhook:', payload)
          // Update local state, refresh user profile, etc.
          handleUserUpdate(payload)
        }
      )
      .subscribe()

    // Listen to organizations table changes
    const orgSubscription = supabase
      .channel('organizations-changes')
      .on('postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'organizations'
        },
        (payload) => {
          console.log('🏢 Organization updated from webhook:', payload)
          handleOrganizationUpdate(payload)
        }
      )
      .subscribe()

    // Listen to staff changes (for role-based updates)
    const staffSubscription = supabase
      .channel('staff-changes')
      .on('postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'restaurant_staffs'
        },
        (payload) => {
          console.log('👥 Staff updated from webhook:', payload)
          handleStaffUpdate(payload)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(userSubscription)
      supabase.removeChannel(orgSubscription)
      supabase.removeChannel(staffSubscription)
    }
  }, [user?.id])

  function handleUserUpdate(payload: any) {
    // Handle user profile updates
    // Refresh user data, update cached info, etc.
  }

  function handleOrganizationUpdate(payload: any) {
    // Handle organization changes
    // Update restaurant list, refresh organization data, etc.
  }

  function handleStaffUpdate(payload: any) {
    // Handle staff role changes
    // Update permissions, refresh access levels, etc.
  }
}
```

### 4. Use in Components
```typescript
// components/ProfileScreen.tsx
import { useClerkWebhookSync } from '../hooks/useClerkWebhookSync'

export function ProfileScreen() {
  // This hook automatically syncs webhook changes
  useClerkWebhookSync()

  return (
    <View>
      {/* Your profile UI */}
    </View>
  )
}
```

## 🌐 NextJS Client Integration

### 1. Install Dependencies
```bash
npm install @supabase/supabase-js @clerk/nextjs
```

### 2. Setup Supabase Client
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 3. Create Webhook Sync Hook
```typescript
// hooks/useClerkWebhookSync.ts
import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { supabase } from '../lib/supabase'

export function useClerkWebhookSync() {
  const { user } = useUser()

  useEffect(() => {
    if (!user) return

    // Create a single channel for all webhook events
    const webhookChannel = supabase
      .channel('clerk-webhook-sync')
      .on('postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'users',
          filter: `clerk_id=eq.${user.id}`
        },
        (payload) => {
          console.log('🔔 User webhook event:', payload)
          // Trigger SWR revalidation, update Zustand store, etc.
          mutateUser(payload.new)
        }
      )
      .on('postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'organizations'
        },
        (payload) => {
          console.log('🔔 Organization webhook event:', payload)
          mutateOrganizations()
        }
      )
      .on('postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'restaurant_staffs'
        },
        (payload) => {
          console.log('🔔 Staff webhook event:', payload)
          mutateStaff()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(webhookChannel)
    }
  }, [user?.id])
}

// Helper functions for data revalidation
function mutateUser(userData: any) {
  // Update SWR cache, Zustand store, etc.
}

function mutateOrganizations() {
  // Revalidate organizations data
}

function mutateStaff() {
  // Revalidate staff data
}
```

### 4. Global Layout Integration
```typescript
// components/Layout.tsx
import { useClerkWebhookSync } from '../hooks/useClerkWebhookSync'

export function Layout({ children }: { children: React.ReactNode }) {
  // Enable webhook sync globally
  useClerkWebhookSync()

  return (
    <div>
      {/* Your layout */}
      {children}
    </div>
  )
}
```

## 🔧 Configuration

### Environment Variables (Server)
```env
EXPRESS_CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret
EXPRESS_SUPABASE_URL=https://your-project.supabase.co
EXPRESS_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Environment Variables (Clients)
```env
# Expo (.env)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key

# NextJS (.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key
```

## 📋 Clerk Dashboard Configuration

### 1. Add Webhook Endpoint
```
Endpoint URL: https://your-server.com/clerk/webhooks
Events: user.created, user.updated, user.deleted,
        organization.created, organization.updated, organization.deleted,
        organizationMembership.created, organizationMembership.updated, organizationMembership.deleted
```

### 2. Test Events
Use the webhook test endpoint:
```bash
curl -X POST https://your-server.com/clerk/webhooks/test \
  -H "Content-Type: application/json" \
  -d '{"test": "event"}'
```

## 🎯 Use Cases

### Restaurant Management App
- **Customer Registration**: Automatically creates user profile and sends welcome notification
- **Staff Onboarding**: Creates staff record, assigns restaurant, sends role-based permissions
- **Manager Promotion**: Updates role, grants new permissions, notifies all relevant clients
- **Organization Updates**: Restaurant info changes propagate to all staff devices instantly

### Real-time Scenarios
1. **New Customer Signs Up** → Webhook creates user → All admin dashboards show new customer
2. **Manager Updates Staff Role** → Webhook updates permissions → Staff app refreshes access level
3. **Organization Profile Update** → Webhook syncs data → All clients update restaurant info
4. **Staff Member Leaves** → Webhook deactivates access → Removed from all client interfaces

## 🚀 Benefits

- ✅ **Real-time Sync**: Changes in Clerk instantly reflect in all clients
- ✅ **Offline Resilience**: Supabase Realtime queues updates for offline clients
- ✅ **Multi-Client Support**: Works seamlessly with Expo, NextJS, and any Supabase client
- ✅ **Role-Based Updates**: Different user roles receive relevant updates
- ✅ **Organization Scoped**: Updates are scoped to relevant organizations/restaurants
- ✅ **Automatic Fallback**: If realtime fails, clients can still fetch latest data via API

## 🔍 Monitoring & Debugging

### Server Logs
```bash
# Watch webhook processing
tail -f server.log | grep "webhook"

# Monitor realtime publishing
tail -f server.log | grep "📡 Synced"
```

### Client Debugging
```typescript
// Enable Supabase debug mode
const supabase = createClient(url, key, {
  realtime: {
    log_level: 'debug'
  }
})
```

This integration ensures your restaurant management system stays perfectly synchronized across all platforms! 🎉
