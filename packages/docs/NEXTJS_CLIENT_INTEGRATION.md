# 🌐 NextJS Client - Express API Integration

## 📋 Setup NextJS Client cho Webhook Integration

### 1. Environment Configuration

```env
# .env.local
NEXT_PUBLIC_EXPRESS_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
```

### 2. API Client Configuration

```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_EXPRESS_API_URL;

export const apiClient = {
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}/api${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },

  // User endpoints
  users: {
    getProfile: (userId: string) => 
      apiClient.request(`/users/${userId}`),
    updateProfile: (userId: string, data: any) =>
      apiClient.request(`/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  // Organization endpoints
  organizations: {
    getAll: () => apiClient.request('/organizations'),
    getById: (orgId: string) => 
      apiClient.request(`/organizations/${orgId}`),
    create: (data: any) =>
      apiClient.request('/organizations', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // Restaurant endpoints
  restaurants: {
    getByOrganization: (orgId: string) =>
      apiClient.request(`/restaurants?organization_id=${orgId}`),
  },
};
```

### 3. Real-time Hook với Socket.IO

```typescript
// hooks/useRealtimeSync.ts
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useUser } from '@clerk/nextjs';

export const useRealtimeSync = () => {
  const { user } = useUser();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [realtimeEvents, setRealtimeEvents] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    // Connect to Express server Socket.IO
    const socketInstance = io(process.env.NEXT_PUBLIC_EXPRESS_API_URL!, {
      auth: {
        userId: user.id,
        email: user.emailAddresses[0]?.emailAddress,
      },
    });

    socketInstance.on('connect', () => {
      console.log('🔗 Connected to Express server');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ Disconnected from Express server');
      setIsConnected(false);
    });

    // ================================
    // 👤 USER EVENTS FROM WEBHOOKS
    // ================================
    socketInstance.on('user.created', (data) => {
      console.log('🆕 New user registered:', data);
      setRealtimeEvents(prev => [...prev, { type: 'user.created', data, timestamp: new Date() }]);
      
      // Update global state if needed
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('userCreated', { detail: data }));
      }
    });

    socketInstance.on('user.updated', (data) => {
      console.log('🔄 User updated:', data);
      setRealtimeEvents(prev => [...prev, { type: 'user.updated', data, timestamp: new Date() }]);
      
      // Handle role changes
      if (data.changes?.role_changed && data.user.clerk_id === user.id) {
        window.location.reload(); // Refresh to update permissions
      }
    });

    socketInstance.on('user.deleted', (data) => {
      console.log('🗑️ User deleted:', data);
      setRealtimeEvents(prev => [...prev, { type: 'user.deleted', data, timestamp: new Date() }]);
    });

    // ================================
    // 🏢 ORGANIZATION EVENTS
    // ================================
    socketInstance.on('organization.created', (data) => {
      console.log('🏢 New organization created:', data);
      setRealtimeEvents(prev => [...prev, { type: 'organization.created', data, timestamp: new Date() }]);
      
      // Refresh organization list
      window.dispatchEvent(new CustomEvent('organizationCreated', { detail: data }));
    });

    socketInstance.on('organization.updated', (data) => {
      console.log('🔄 Organization updated:', data);
      setRealtimeEvents(prev => [...prev, { type: 'organization.updated', data, timestamp: new Date() }]);
      
      window.dispatchEvent(new CustomEvent('organizationUpdated', { detail: data }));
    });

    // ================================
    // 👥 MEMBERSHIP EVENTS
    // ================================
    socketInstance.on('membership.created', (data) => {
      console.log('👥 New membership created:', data);
      setRealtimeEvents(prev => [...prev, { type: 'membership.created', data, timestamp: new Date() }]);
      
      // If current user got new role
      if (data.user.clerk_id === user.id) {
        window.dispatchEvent(new CustomEvent('userRoleUpdated', { detail: data }));
      }
    });

    socketInstance.on('membership.updated', (data) => {
      console.log('🔄 Membership updated:', data);
      if (data.user.clerk_id === user.id) {
        // Current user's role changed
        window.location.reload();
      }
    });

    socketInstance.on('membership.deleted', (data) => {
      console.log('🗑️ Membership deleted:', data);
      if (data.user.clerk_id === user.id) {
        // Current user removed from organization
        window.location.href = '/dashboard';
      }
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

  return { socket, isConnected, realtimeEvents };
};
```

### 4. Data Synchronization Hook

```typescript
// hooks/useDataSync.ts
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { useRealtimeSync } from './useRealtimeSync';

export const useDataSync = () => {
  const { realtimeEvents } = useRealtimeSync();
  const [users, setUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  // Listen for realtime events and update local state
  useEffect(() => {
    const handleUserCreated = (event: CustomEvent) => {
      const { user } = event.detail;
      setUsers(prev => [...prev, user]);
    };

    const handleOrganizationCreated = (event: CustomEvent) => {
      const { organization } = event.detail;
      setOrganizations(prev => [...prev, organization]);
    };

    const handleOrganizationUpdated = (event: CustomEvent) => {
      const { organization } = event.detail;
      setOrganizations(prev => 
        prev.map(org => org.id === organization.id ? organization : org)
      );
    };

    window.addEventListener('userCreated', handleUserCreated);
    window.addEventListener('organizationCreated', handleOrganizationCreated);
    window.addEventListener('organizationUpdated', handleOrganizationUpdated);

    return () => {
      window.removeEventListener('userCreated', handleUserCreated);
      window.removeEventListener('organizationCreated', handleOrganizationCreated);
      window.removeEventListener('organizationUpdated', handleOrganizationUpdated);
    };
  }, []);

  // API methods that call Express server
  const dataAPI = {
    users: {
      fetchAll: async () => {
        try {
          const data = await apiClient.users.getProfile('all');
          setUsers(data);
          return data;
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      },
    },
    
    organizations: {
      fetchAll: async () => {
        try {
          const data = await apiClient.organizations.getAll();
          setOrganizations(data);
          return data;
        } catch (error) {
          console.error('Error fetching organizations:', error);
        }
      },
      
      create: async (orgData: any) => {
        try {
          const newOrg = await apiClient.organizations.create(orgData);
          // Real-time event will update state automatically
          return newOrg;
        } catch (error) {
          console.error('Error creating organization:', error);
        }
      },
    },
  };

  return {
    data: { users, organizations, restaurants },
    api: dataAPI,
    realtimeEvents,
  };
};
```

### 5. Layout Component với Real-time

```typescript
// components/Layout.tsx
import { useRealtimeSync } from '@/hooks/useRealtimeSync';
import { useUser } from '@clerk/nextjs';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const { isConnected, realtimeEvents } = useRealtimeSync();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Connection Status */}
      <div className="fixed top-4 right-4 z-50">
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          isConnected 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
      </div>

      {/* Real-time Events Debug (Development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 w-80 max-h-60 overflow-y-auto bg-white shadow-lg rounded-lg p-4">
          <h3 className="font-bold text-sm mb-2">Real-time Events</h3>
          {realtimeEvents.slice(-5).map((event, index) => (
            <div key={index} className="text-xs p-2 bg-gray-100 rounded mb-1">
              <div className="font-medium">{event.type}</div>
              <div className="text-gray-600">
                {new Date(event.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {children}
    </div>
  );
}
```

### 6. Example Usage trong Pages

```typescript
// pages/dashboard.tsx
import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useDataSync } from '@/hooks/useDataSync';
import Layout from '@/components/Layout';

export default function Dashboard() {
  const { user } = useUser();
  const { data, api } = useDataSync();

  useEffect(() => {
    // Fetch initial data from Express server
    api.organizations.fetchAll();
  }, []);

  const handleCreateOrganization = async () => {
    await api.organizations.create({
      name: 'New Restaurant',
      description: 'A new restaurant organization',
    });
    // Real-time event will automatically update the UI
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Organizations */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Organizations</h2>
            <button 
              onClick={handleCreateOrganization}
              className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
            >
              Create Organization
            </button>
            
            {data.organizations.map((org: any) => (
              <div key={org.id} className="p-3 bg-gray-50 rounded mb-2">
                <h3 className="font-medium">{org.name}</h3>
                <p className="text-sm text-gray-600">{org.description}</p>
              </div>
            ))}
          </div>

          {/* Users */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Users</h2>
            {data.users.map((user: any) => (
              <div key={user.id} className="p-3 bg-gray-50 rounded mb-2">
                <h3 className="font-medium">{user.full_name}</h3>
                <p className="text-sm text-gray-600">Role: {user.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
```

## 🎯 Key Benefits

1. **Centralized API**: Tất cả business logic trong Express server
2. **Real-time Updates**: Webhook events broadcast via Socket.IO
3. **Type Safety**: TypeScript cho tất cả API calls
4. **Auto Sync**: UI tự động update khi có webhook events
5. **Error Handling**: Comprehensive error handling
6. **Development Tools**: Debug panel cho real-time events

## 🚀 Next Steps

1. Setup tương tự cho Expo client
2. Test webhook integration end-to-end
3. Add authentication headers cho API calls
4. Implement offline support nếu cần

Bạn muốn tôi tiếp tục với Expo client integration không?
