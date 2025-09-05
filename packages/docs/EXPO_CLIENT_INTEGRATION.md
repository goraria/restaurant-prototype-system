# 📱 Expo Client - Express API Integration

## 📋 Setup Expo Client cho Webhook Integration

### 1. Dependencies Installation

```bash
# Socket.IO client
npm install socket.io-client

# Additional dependencies
npm install @react-native-async-storage/async-storage
npm install react-native-url-polyfill

# Types (nếu sử dụng TypeScript)
npm install --save-dev @types/socket.io-client
```

### 2. Environment Configuration

```typescript
// config/env.ts
export const ENV = {
  EXPRESS_API_URL: __DEV__ 
    ? 'http://localhost:3001' 
    : 'https://your-production-api.com',
  SUPABASE_URL: 'https://your-project.supabase.co',
  SUPABASE_ANON_KEY: 'your-anon-key',
  CLERK_PUBLISHABLE_KEY: 'pk_live_xxxxx',
};
```

### 3. API Client Service

```typescript
// services/apiClient.ts
import { ENV } from '../config/env';

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = `${ENV.EXPRESS_API_URL}/api`;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // ================================
  // 👤 USER ENDPOINTS
  // ================================
  users = {
    getProfile: (userId: string) => 
      this.request(`/users/${userId}`),
    
    updateProfile: (userId: string, data: any) =>
      this.request(`/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    
    getAll: () => this.request('/users'),
  };

  // ================================
  // 🏢 ORGANIZATION ENDPOINTS  
  // ================================
  organizations = {
    getAll: () => this.request('/organizations'),
    
    getById: (orgId: string) => 
      this.request(`/organizations/${orgId}`),
    
    create: (data: any) =>
      this.request('/organizations', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    update: (orgId: string, data: any) =>
      this.request(`/organizations/${orgId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  };

  // ================================
  // 🍽️ RESTAURANT ENDPOINTS
  // ================================
  restaurants = {
    getByOrganization: (orgId: string) =>
      this.request(`/restaurants?organization_id=${orgId}`),
    
    getMenus: (restaurantId: string) =>
      this.request(`/restaurants/${restaurantId}/menus`),
    
    getOrders: (restaurantId: string) =>
      this.request(`/restaurants/${restaurantId}/orders`),
  };

  // ================================
  // 📦 ORDER ENDPOINTS
  // ================================
  orders = {
    create: (data: any) =>
      this.request('/orders', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    getById: (orderId: string) =>
      this.request(`/orders/${orderId}`),
    
    updateStatus: (orderId: string, status: string) =>
      this.request(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }),
  };
}

export const apiClient = new ApiClient();
```

### 4. Real-time Hook với Socket.IO

```typescript
// hooks/useRealtimeSync.ts
import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useUser } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENV } from '../config/env';

interface RealtimeEvent {
  type: string;
  data: any;
  timestamp: Date;
}

export const useRealtimeSync = () => {
  const { user } = useUser();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [realtimeEvents, setRealtimeEvents] = useState<RealtimeEvent[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    let socketInstance: Socket;

    const connectSocket = () => {
      try {
        socketInstance = io(ENV.EXPRESS_API_URL, {
          auth: {
            userId: user.id,
            email: user.emailAddresses[0]?.emailAddress,
          },
          transports: ['websocket', 'polling'],
          timeout: 10000,
        });

        socketInstance.on('connect', () => {
          console.log('🔗 Connected to Express server via Socket.IO');
          setIsConnected(true);
          setConnectionError(null);
        });

        socketInstance.on('disconnect', (reason) => {
          console.log('❌ Disconnected from Express server:', reason);
          setIsConnected(false);
        });

        socketInstance.on('connect_error', (error) => {
          console.error('🚫 Connection error:', error);
          setConnectionError(error.message);
          setIsConnected(false);
        });

        // ================================
        // 👤 USER WEBHOOK EVENTS
        // ================================
        socketInstance.on('user.created', (data) => {
          console.log('🆕 User created via webhook:', data.user?.email);
          addRealtimeEvent('user.created', data);
          
          // Store in AsyncStorage for offline access
          storeEventLocally('user.created', data);
        });

        socketInstance.on('user.updated', (data) => {
          console.log('🔄 User updated via webhook:', data.user?.email);
          addRealtimeEvent('user.updated', data);
          
          // Handle role changes for current user
          if (data.user?.clerk_id === user.id && data.changes?.role_changed) {
            handleCurrentUserRoleChange(data);
          }
        });

        socketInstance.on('user.deleted', (data) => {
          console.log('🗑️ User deleted via webhook');
          addRealtimeEvent('user.deleted', data);
        });

        // ================================
        // 🏢 ORGANIZATION WEBHOOK EVENTS
        // ================================
        socketInstance.on('organization.created', (data) => {
          console.log('🏢 Organization created via webhook:', data.organization?.name);
          addRealtimeEvent('organization.created', data);
          storeEventLocally('organization.created', data);
        });

        socketInstance.on('organization.updated', (data) => {
          console.log('🔄 Organization updated via webhook:', data.organization?.name);
          addRealtimeEvent('organization.updated', data);
          storeEventLocally('organization.updated', data);
        });

        socketInstance.on('organization.deleted', (data) => {
          console.log('🗑️ Organization deletion requested via webhook');
          addRealtimeEvent('organization.deleted', data);
        });

        // ================================
        // 👥 MEMBERSHIP WEBHOOK EVENTS
        // ================================
        socketInstance.on('membership.created', (data) => {
          console.log('👥 Membership created via webhook');
          addRealtimeEvent('membership.created', data);
          
          // If current user got new role
          if (data.user?.clerk_id === user.id) {
            handleCurrentUserRoleChange(data);
          }
        });

        socketInstance.on('membership.updated', (data) => {
          console.log('🔄 Membership updated via webhook');
          addRealtimeEvent('membership.updated', data);
          
          if (data.user?.clerk_id === user.id) {
            handleCurrentUserRoleChange(data);
          }
        });

        socketInstance.on('membership.deleted', (data) => {
          console.log('🗑️ Membership deleted via webhook');
          addRealtimeEvent('membership.deleted', data);
          
          if (data.user?.clerk_id === user.id) {
            handleCurrentUserRoleChange(data);
          }
        });

        setSocket(socketInstance);

      } catch (error) {
        console.error('Failed to connect socket:', error);
        setConnectionError('Failed to connect to server');
      }
    };

    connectSocket();

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [user]);

  const addRealtimeEvent = (type: string, data: any) => {
    const event: RealtimeEvent = {
      type,
      data,
      timestamp: new Date(),
    };
    
    setRealtimeEvents(prev => [...prev.slice(-19), event]); // Keep last 20 events
  };

  const storeEventLocally = async (type: string, data: any) => {
    try {
      const key = `realtime_event_${type}_${Date.now()}`;
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to store event locally:', error);
    }
  };

  const handleCurrentUserRoleChange = async (data: any) => {
    try {
      // Store new role info
      await AsyncStorage.setItem('user_role_update', JSON.stringify({
        newRole: data.newRole || data.role,
        timestamp: new Date().toISOString(),
        organizationId: data.organizationId,
      }));

      // You might want to trigger a navigation or state update here
      console.log('🔄 Current user role changed, app should refresh');
      
    } catch (error) {
      console.error('Failed to handle role change:', error);
    }
  };

  const reconnect = () => {
    if (socket) {
      socket.disconnect();
      socket.connect();
    }
  };

  return {
    socket,
    isConnected,
    connectionError,
    realtimeEvents,
    reconnect,
  };
};
```

### 5. Data Management Hook

```typescript
// hooks/useDataManager.ts
import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/apiClient';
import { useRealtimeSync } from './useRealtimeSync';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useDataManager = () => {
  const { realtimeEvents, isConnected } = useRealtimeSync();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Data state
  const [users, setUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);

  // ================================
  // 🔄 REAL-TIME EVENT HANDLERS
  // ================================
  useEffect(() => {
    const latestEvent = realtimeEvents[realtimeEvents.length - 1];
    if (!latestEvent) return;

    switch (latestEvent.type) {
      case 'user.created':
        setUsers(prev => [...prev, latestEvent.data.user]);
        break;
        
      case 'user.updated':
        setUsers(prev => 
          prev.map(user => 
            user.id === latestEvent.data.user.id 
              ? latestEvent.data.user 
              : user
          )
        );
        break;
        
      case 'organization.created':
        setOrganizations(prev => [...prev, latestEvent.data.organization]);
        break;
        
      case 'organization.updated':
        setOrganizations(prev =>
          prev.map(org =>
            org.id === latestEvent.data.organization.id
              ? latestEvent.data.organization
              : org
          )
        );
        break;
    }
  }, [realtimeEvents]);

  // ================================
  // 📡 API METHODS
  // ================================
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiClient.users.getAll();
      setUsers(data);
      
      // Cache for offline access
      await AsyncStorage.setItem('cached_users', JSON.stringify(data));
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
      
      // Try to load from cache
      try {
        const cached = await AsyncStorage.getItem('cached_users');
        if (cached) {
          setUsers(JSON.parse(cached));
        }
      } catch (cacheError) {
        console.error('Failed to load cached users:', cacheError);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrganizations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiClient.organizations.getAll();
      setOrganizations(data);
      
      await AsyncStorage.setItem('cached_organizations', JSON.stringify(data));
    } catch (err) {
      setError('Failed to fetch organizations');
      console.error('Error fetching organizations:', err);
      
      // Load from cache
      try {
        const cached = await AsyncStorage.getItem('cached_organizations');
        if (cached) {
          setOrganizations(JSON.parse(cached));
        }
      } catch (cacheError) {
        console.error('Failed to load cached organizations:', cacheError);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrganization = useCallback(async (orgData: any) => {
    try {
      setLoading(true);
      const newOrg = await apiClient.organizations.create(orgData);
      // Real-time event will update state automatically
      return newOrg;
    } catch (err) {
      setError('Failed to create organization');
      console.error('Error creating organization:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRestaurants = useCallback(async (organizationId: string) => {
    try {
      setLoading(true);
      const data = await apiClient.restaurants.getByOrganization(organizationId);
      setRestaurants(data);
    } catch (err) {
      setError('Failed to fetch restaurants');
      console.error('Error fetching restaurants:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrder = useCallback(async (orderData: any) => {
    try {
      setLoading(true);
      const newOrder = await apiClient.orders.create(orderData);
      setOrders(prev => [...prev, newOrder]);
      return newOrder;
    } catch (err) {
      setError('Failed to create order');
      console.error('Error creating order:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ================================
  // 🔄 AUTO-REFRESH WHEN RECONNECTED
  // ================================
  useEffect(() => {
    if (isConnected) {
      fetchUsers();
      fetchOrganizations();
    }
  }, [isConnected, fetchUsers, fetchOrganizations]);

  return {
    // Data
    data: {
      users,
      organizations,
      restaurants,
      orders,
    },
    
    // State
    loading,
    error,
    isConnected,
    
    // Actions
    actions: {
      fetchUsers,
      fetchOrganizations,
      fetchRestaurants,
      createOrganization,
      createOrder,
      clearError: () => setError(null),
    },
    
    // Real-time
    realtimeEvents,
  };
};
```

### 6. Example Screen Implementation

```typescript
// screens/DashboardScreen.tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useDataManager } from '../hooks/useDataManager';
import { useRealtimeSync } from '../hooks/useRealtimeSync';

export default function DashboardScreen() {
  const { user } = useUser();
  const { data, loading, error, actions, realtimeEvents } = useDataManager();
  const { isConnected, connectionError, reconnect } = useRealtimeSync();

  useEffect(() => {
    // Initial data fetch
    actions.fetchUsers();
    actions.fetchOrganizations();
  }, []);

  const handleCreateOrganization = () => {
    Alert.prompt(
      'Create Organization',
      'Enter organization name:',
      async (name) => {
        if (name) {
          try {
            await actions.createOrganization({
              name,
              description: `Organization created by ${user?.firstName}`,
            });
            Alert.alert('Success', 'Organization created successfully!');
          } catch (error) {
            Alert.alert('Error', 'Failed to create organization');
          }
        }
      }
    );
  };

  const renderOrganization = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardDescription}>{item.description}</Text>
      <Text style={styles.cardMeta}>
        Owner: {item.owner?.full_name || 'Unknown'}
      </Text>
    </View>
  );

  const renderRealtimeEvent = ({ item }: { item: any }) => (
    <View style={styles.eventCard}>
      <Text style={styles.eventType}>{item.type}</Text>
      <Text style={styles.eventTime}>
        {item.timestamp.toLocaleTimeString()}
      </Text>
    </View>
  );

  if (loading && data.organizations.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={styles.loadingText}>Loading data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Connection Status */}
      <View style={[styles.statusBar, { 
        backgroundColor: isConnected ? '#10B981' : '#EF4444' 
      }]}>
        <Text style={styles.statusText}>
          {isConnected ? '🟢 Connected to Server' : '🔴 Disconnected'}
        </Text>
        {connectionError && (
          <TouchableOpacity onPress={reconnect}>
            <Text style={styles.reconnectText}>Tap to reconnect</Text>
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={actions.clearError}>
            <Text style={styles.clearErrorText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.header}>Dashboard</Text>
      <Text style={styles.subHeader}>
        Welcome, {user?.firstName || 'User'}!
      </Text>

      {/* Organizations Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Organizations</Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={handleCreateOrganization}
          >
            <Text style={styles.createButtonText}>+ Create</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={data.organizations}
          renderItem={renderOrganization}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Real-time Events (Development) */}
      {__DEV__ && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Real-time Events ({realtimeEvents.length})
          </Text>
          <FlatList
            data={realtimeEvents.slice(-5)} // Show last 5 events
            renderItem={renderRealtimeEvent}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBar: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    fontWeight: '600',
  },
  reconnectText: {
    color: 'white',
    textDecorationLine: 'underline',
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: '#DC2626',
    flex: 1,
  },
  clearErrorText: {
    color: '#DC2626',
    fontWeight: '600',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  createButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  createButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  cardMeta: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  eventCard: {
    backgroundColor: '#EEF2FF',
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
    minWidth: 120,
  },
  eventType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4338CA',
  },
  eventTime: {
    fontSize: 10,
    color: '#6B7280',
  },
  loadingText: {
    marginTop: 8,
    color: '#6B7280',
  },
});
```

## 🎯 Key Features

1. **Real-time Webhook Integration**: Tất cả webhook events từ Express server
2. **Offline Support**: Cache data trong AsyncStorage
3. **Error Handling**: Comprehensive error handling với retry logic
4. **TypeScript Support**: Type-safe API calls và data management
5. **Development Tools**: Real-time event debugging
6. **Connection Management**: Auto-reconnect và connection status
7. **Role Management**: Handle user role changes automatically

## 🚀 Benefits over Next.js API Routes

1. **Centralized Logic**: Tất cả business logic trong Express server
2. **Better Performance**: Dedicated server cho API operations
3. **Scalability**: Express server có thể scale độc lập
4. **Real-time**: Socket.IO cho instant updates
5. **Multi-platform**: Cùng API cho web và mobile

Bạn muốn tôi tiếp tục với setup cho authentication hoặc implement thêm features nào khác không?
