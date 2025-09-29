"use client"

import React, { useState, useEffect, useMemo } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  ColumnDef,
} from "@tanstack/react-table"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// React Table imports
import { DataTablePagination } from "@/components/elements/data-table"
import { Search, Utensils, Coffee, Cake, Soup } from "lucide-react"
import { MenuItemDataColumn } from "@/constants/interfaces"
import { MenuItemCard } from "@/components/elements/menu"
import { useGetAllMenuItemsQuery } from "@/state/api";
import { toast } from "sonner"

export default function MenuPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const [selectedItem, setSelectedItem] = useState<MenuItemDataColumn | null>(null)

  const {
    data: menuItems = [],
    error,
    isLoading
  } = useGetAllMenuItemsQuery();

  // Xử lý lỗi từ RTK Query
  useEffect(() => {
    if (error) {
      console.log('Lỗi khi tải menu items:', error);
      let errorMessage = 'Có lỗi xảy ra khi tải danh sách món ăn!';

      if ('status' in error) {
        if (error.status === 'FETCH_ERROR') {
          errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra server backend có đang chạy không!';
        } else if (error.status === 401) {
          errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!';
        } else if (error.status === 404) {
          errorMessage = 'API endpoint không tồn tại. Vui lòng kiểm tra cấu hình backend!';
        } else if (error.status === 500) {
          errorMessage = 'Lỗi server nội bộ. Vui lòng thử lại sau!';
        }
      }

      toast.error(errorMessage);
    }
  }, [error]);

  // Define columns for React Table (used for pagination only)
  const columns: ColumnDef<MenuItemDataColumn>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
  ]

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    const filtered = menuItems.filter((item: MenuItemDataColumn) => {
      // Only show available items
      if (!item.is_available) return false;

      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory = selectedCategory === "all" ||
                             (selectedCategory === "appetizer" && item.categories?.name?.toLowerCase().includes('kha')) ||
                             (selectedCategory === "main" && item.categories?.name?.toLowerCase().includes('chính')) ||
                             (selectedCategory === "soup" && (item.categories?.name?.toLowerCase().includes('súp') || item.categories?.name?.toLowerCase().includes('canh'))) ||
                             (selectedCategory === "dessert" && item.categories?.name?.toLowerCase().includes('tráng')) ||
                             (selectedCategory === "beverage" && item.categories?.name?.toLowerCase().includes('uống'))

      return matchesSearch && matchesCategory
    })

    // Sort items
    filtered.sort((a: MenuItemDataColumn, b: MenuItemDataColumn) => {
      switch (sortBy) {
        case "price-low":
          return parseFloat(a.price) - parseFloat(b.price)
        case "price-high":
          return parseFloat(b.price) - parseFloat(a.price)
        case "name":
          return a.name.localeCompare(b.name)
        case "popular":
        default:
          // Sort by featured first, then by display order
          if (a.is_featured && !b.is_featured) return -1
          if (!a.is_featured && b.is_featured) return 1
          return a.display_order - b.display_order
      }
    })

    return filtered
  }, [menuItems, searchTerm, selectedCategory, sortBy])

  // Create React Table instance for pagination
  const table = useReactTable({
    data: filteredAndSortedItems,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 6,
      },
    },
  })

  const categories = [
    { id: "all", name: "Tất cả", icon: Utensils },
    { id: "appetizer", name: "Khai vị", icon: Utensils },
    { id: "main", name: "Món chính", icon: Utensils },
    { id: "soup", name: "Canh/Súp", icon: Soup },
    { id: "dessert", name: "Tráng miệng", icon: Cake },
    { id: "beverage", name: "Đồ uống", icon: Coffee }
  ]



  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-professional-main to-professional-sub rounded-xl text-white py-18">
        <div className="flex flex-col gap-6 text-center">
          <h1 className="text-4xl font-bold">Thực Đơn</h1>
          <p className="text-xl opacity-90">
            Khám phá những món ăn ngon nhất từ ẩm thực Việt Nam
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Filters */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm món ăn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Phổ biến nhất</SelectItem>
                <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
                <SelectItem value="name">Tên A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Buttons */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  // size=""
                  onClick={() => setSelectedCategory(category.id)}
                  className="text-xs"
                >
                  <Icon className="h-4 w-4 mr-1" />
                  {category.name}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Menu Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-[4/3] bg-muted animate-pulse" />
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-12 bg-muted animate-pulse rounded" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-5 bg-muted animate-pulse rounded" />
                    <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 w-20 bg-muted animate-pulse rounded" />
                    <div className="flex gap-2">
                      <div className="h-8 w-20 bg-muted animate-pulse rounded" />
                      <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {table.getRowModel().rows.map((row) => {
              const item = row.original
              return (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onSelectItem={setSelectedItem}
                  selectedItem={selectedItem}
                />
              )
            })}
          </div>
        )}

        {/* Pagination */}
        <Card className="px-6">
          {table.getPageCount() > 1 && (
            <DataTablePagination table={table} />
          )}
        </Card>

        {/* Load More */}
        {filteredAndSortedItems.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <Utensils className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Không tìm thấy món ăn</h3>
            <p className="text-muted-foreground">Thử tìm kiếm với từ khóa khác</p>
          </div>
        )}
      </div>
    </div>
  )
}
