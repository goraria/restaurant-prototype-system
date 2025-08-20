'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  // Users
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  
  // Restaurants
  useGetAllRestaurantsQuery,
  useGetRestaurantByIdQuery,
  useCreateRestaurantMutation,
  useUpdateRestaurantMutation,
  useDeleteRestaurantMutation,
  
  // Orders
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  
  // Menus
  useGetAllMenusQuery,
  useGetMenuByIdQuery,
  useCreateMenuMutation,
  useUpdateMenuMutation,
  useDeleteMenuMutation,
} from '@/state/api';

export default function TestPage() {
  const [selectedEntity, setSelectedEntity] = useState<'users' | 'restaurants' | 'orders' | 'menus'>('users');
  const [selectedId, setSelectedId] = useState('');
  const [formData, setFormData] = useState<any>({});

  // Query hooks
  const { data: users, isLoading: usersLoading, error: usersError } = useGetAllUsersQuery();
  const { data: restaurants, isLoading: restaurantsLoading, error: restaurantsError } = useGetAllRestaurantsQuery();
  const { data: orders, isLoading: ordersLoading, error: ordersError } = useGetAllOrdersQuery();
  const { data: menus, isLoading: menusLoading, error: menusError } = useGetAllMenusQuery();

  // Individual item queries
  const { data: selectedUser } = useGetUserByIdQuery(selectedId, { skip: selectedEntity !== 'users' || !selectedId });
  const { data: selectedRestaurant } = useGetRestaurantByIdQuery(selectedId, { skip: selectedEntity !== 'restaurants' || !selectedId });
  const { data: selectedOrder } = useGetOrderByIdQuery(selectedId, { skip: selectedEntity !== 'orders' || !selectedId });
  const { data: selectedMenu } = useGetMenuByIdQuery(selectedId, { skip: selectedEntity !== 'menus' || !selectedId });

  // Mutation hooks
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  
  const [createRestaurant] = useCreateRestaurantMutation();
  const [updateRestaurant] = useUpdateRestaurantMutation();
  const [deleteRestaurant] = useDeleteRestaurantMutation();
  
  const [createOrder] = useCreateOrderMutation();
  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();
  
  const [createMenu] = useCreateMenuMutation();
  const [updateMenu] = useUpdateMenuMutation();
  const [deleteMenu] = useDeleteMenuMutation();

  const handleCreate = async () => {
    try {
      let result;
      switch (selectedEntity) {
        case 'users':
          result = await createUser(formData).unwrap();
          break;
        case 'restaurants':
          result = await createRestaurant(formData).unwrap();
          break;
        case 'orders':
          result = await createOrder(formData).unwrap();
          break;
        case 'menus':
          result = await createMenu(formData).unwrap();
          break;
      }
      toast.success(`${selectedEntity.slice(0, -1)} tạo thành công!`);
      setFormData({});
      console.log('Create result:', result);
    } catch (error: any) {
      toast.error(`Lỗi tạo ${selectedEntity.slice(0, -1)}: ${error.message}`);
      console.error('Create error:', error);
    }
  };

  const handleUpdate = async () => {
    if (!selectedId) {
      toast.error('Vui lòng chọn ID để cập nhật');
      return;
    }
    
    try {
      let result;
      switch (selectedEntity) {
        case 'users':
          result = await updateUser({ id: selectedId, data: formData }).unwrap();
          break;
        case 'restaurants':
          result = await updateRestaurant({ id: selectedId, data: formData }).unwrap();
          break;
        case 'orders':
          result = await updateOrder({ id: selectedId, data: formData }).unwrap();
          break;
        case 'menus':
          result = await updateMenu({ id: selectedId, data: formData }).unwrap();
          break;
      }
      toast.success(`${selectedEntity.slice(0, -1)} cập nhật thành công!`);
      console.log('Update result:', result);
    } catch (error: any) {
      toast.error(`Lỗi cập nhật ${selectedEntity.slice(0, -1)}: ${error.message}`);
      console.error('Update error:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) {
      toast.error('Vui lòng chọn ID để xóa');
      return;
    }
    
    try {
      let result;
      switch (selectedEntity) {
        case 'users':
          result = await deleteUser(selectedId).unwrap();
          break;
        case 'restaurants':
          result = await deleteRestaurant(selectedId).unwrap();
          break;
        case 'orders':
          result = await deleteOrder(selectedId).unwrap();
          break;
        case 'menus':
          result = await deleteMenu(selectedId).unwrap();
          break;
      }
      toast.success(`${selectedEntity.slice(0, -1)} xóa thành công!`);
      setSelectedId('');
      console.log('Delete result:', result);
    } catch (error: any) {
      toast.error(`Lỗi xóa ${selectedEntity.slice(0, -1)}: ${error.message}`);
      console.error('Delete error:', error);
    }
  };

  const getCurrentData = () => {
    switch (selectedEntity) {
      case 'users':
        return { data: users, loading: usersLoading, error: usersError };
      case 'restaurants':
        return { data: restaurants, loading: restaurantsLoading, error: restaurantsError };
      case 'orders':
        return { data: orders, loading: ordersLoading, error: ordersError };
      case 'menus':
        return { data: menus, loading: menusLoading, error: menusError };
      default:
        return { data: [], loading: false, error: null };
    }
  };

  const getSelectedItem = () => {
    switch (selectedEntity) {
      case 'users':
        return selectedUser;
      case 'restaurants':
        return selectedRestaurant;
      case 'orders':
        return selectedOrder;
      case 'menus':
        return selectedMenu;
      default:
        return null;
    }
  };

  const { data, loading, error } = getCurrentData();
  const selectedItem = getSelectedItem();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">API Test Page</h1>
        <p className="text-muted-foreground">Test CRUD operations cho Users, Restaurants, Orders, và Menus</p>
      </div>

      {/* Entity Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Chọn Entity để Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {(['users', 'restaurants', 'orders', 'menus'] as const).map((entity) => (
              <Button
                key={entity}
                variant={selectedEntity === entity ? 'default' : 'outline'}
                onClick={() => setSelectedEntity(entity)}
                className="capitalize"
              >
                {entity}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Display */}
      <Card>
        <CardHeader>
          <CardTitle>Dữ liệu hiện tại - {selectedEntity}</CardTitle>
          <CardDescription>
            {loading && 'Đang tải...'}
            {error && `Lỗi: ${JSON.stringify(error)}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-60 overflow-auto bg-muted p-4 rounded">
            <pre className="text-sm">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Item by ID */}
      <Card>
        <CardHeader>
          <CardTitle>Lấy item theo ID</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Nhập ID"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            />
            <Button onClick={() => setSelectedId('')} variant="outline">
              Clear
            </Button>
          </div>
          
          {selectedItem && (
            <div className="max-h-40 overflow-auto bg-muted p-4 rounded">
              <pre className="text-sm">
                {JSON.stringify(selectedItem, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CRUD Operations */}
      <Card>
        <CardHeader>
          <CardTitle>CRUD Operations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="formData">Dữ liệu JSON (cho Create/Update)</Label>
            <Textarea
              id="formData"
              placeholder={`Nhập dữ liệu JSON cho ${selectedEntity}...`}
              value={JSON.stringify(formData, null, 2)}
              onChange={(e) => {
                try {
                  setFormData(JSON.parse(e.target.value));
                } catch {
                  // Ignore invalid JSON while typing
                }
              }}
              rows={8}
            />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700">
              Create
            </Button>
            <Button onClick={handleUpdate} className="bg-blue-600 hover:bg-blue-700">
              Update (cần ID)
            </Button>
            <Button onClick={handleDelete} variant="destructive">
              Delete (cần ID)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sample Data Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Mẫu dữ liệu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>User Sample:</Label>
              <Button
                variant="outline" 
                size="sm"
                onClick={() => setFormData({
                  email: "test@example.com",
                  username: "testuser",
                  first_name: "Test",
                  last_name: "User",
                  password: "password123"
                })}
              >
                Load User Sample
              </Button>
            </div>
            
            <div>
              <Label>Restaurant Sample:</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFormData({
                  name: "Test Restaurant",
                  address: "123 Test Street",
                  phone: "0123456789",
                  email: "restaurant@test.com"
                })}
              >
                Load Restaurant Sample
              </Button>
            </div>
            
            <div>
              <Label>Order Sample:</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFormData({
                  user_id: "user-id-here",
                  restaurant_id: "restaurant-id-here",
                  total_amount: 250000,
                  status: "pending"
                })}
              >
                Load Order Sample
              </Button>
            </div>
            
            <div>
              <Label>Menu Sample:</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFormData({
                  restaurant_id: "restaurant-id-here",
                  name: "Phở Bò",
                  description: "Phở bò truyền thống",
                  price: 65000,
                  category: "main"
                })}
              >
                Load Menu Sample
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}