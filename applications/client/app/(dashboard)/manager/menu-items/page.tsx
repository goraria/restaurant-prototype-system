"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  UtensilsCrossed
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useGetMenuItemsQuery } from "@/state/api"

export default function MenuItemsPage() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [availability, setAvailability] = useState<string>("all");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);

  const params = useMemo(() => {
    const p: Record<string, any> = { page, limit };
    if (search.trim()) p.search = search.trim();
    if (availability !== "all") p.is_available = availability === "available";
    return p;
  }, [page, limit, search, availability]);

  const { data, isFetching, isError, error: rqError } = useGetMenuItemsQuery(params as any);

  useEffect(() => {
    const normalized = Array.isArray(data)
      ? data
      : Array.isArray((data as any)?.items)
        ? (data as any).items
        : Array.isArray((data as any)?.data)
          ? (data as any).data
          : [];
    setMenuItems(normalized);
  }, [data]);

  useEffect(() => {
    setError(isError ? (rqError as any)?.error || "Không thể tải danh sách món ăn" : null);
  }, [isError, rqError]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Có sẵn</Badge>
      case "out_of_stock":
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Hết hàng</Badge>
      case "discontinued":
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Ngừng bán</Badge>
      default:
        return <Badge variant="secondary">Không xác định</Badge>
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <UtensilsCrossed className="h-8 w-8" />
            Quản lý món ăn
          </h1>
          <p className="text-muted-foreground">
            Quản lý tất cả món ăn và đồ uống trong nhà hàng
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm món mới
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm món ăn..."
            className="pl-8"
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value); }}
          />
        </div>
        <div className="w-48">
          <Select value={availability} onValueChange={(v) => { setPage(1); setAvailability(v); }}>
            <SelectTrigger>
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="available">Có sẵn</SelectItem>
              <SelectItem value="out_of_stock">Hết hàng</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-28">
          <Select value={String(limit)} onValueChange={(v) => { setPage(1); setLimit(Number(v)); }}>
            <SelectTrigger>
              <SelectValue placeholder="Số dòng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 / trang</SelectItem>
              <SelectItem value="20">20 / trang</SelectItem>
              <SelectItem value="50">50 / trang</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={() => { setPage(1); setSearch(""); setAvailability("all"); }}>
          <Filter className="mr-2 h-4 w-4" />
          Xóa lọc
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng món ăn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">
              +12% so với tháng trước
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Món có sẵn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98</div>
            <p className="text-xs text-muted-foreground">
              79% tổng số món
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hết hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">
              Cần bổ sung nguyên liệu
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Giá trung bình</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65.000đ</div>
            <p className="text-xs text-muted-foreground">
              +5% so với tháng trước
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Menu Items List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách món ăn</CardTitle>
          <CardDescription>
            Quản lý thông tin chi tiết từng món ăn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isFetching && (
              <div className="text-sm text-muted-foreground">Đang tải dữ liệu...</div>
            )}
            {error && !isFetching && (
              <div className="text-sm text-red-600">{error}</div>
            )}
            {!isFetching && !error && (!Array.isArray(menuItems) || menuItems.length === 0) && (
              <div className="text-sm text-muted-foreground">Chưa có món ăn nào.</div>
            )}
            {!isFetching && !error && Array.isArray(menuItems) && menuItems.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <UtensilsCrossed className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium">{item.name || item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description || ""}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {item.category && <Badge variant="outline">{item.category}</Badge>}
                      {getStatusBadge(item.status || (item.is_available ? "available" : "out_of_stock"))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">{(item.price ?? 0).toLocaleString('vi-VN')}đ</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" disabled={page <= 1 || isFetching} onClick={() => setPage((p) => Math.max(1, p - 1))}>Trước</Button>
        <div className="text-sm text-muted-foreground">Trang {page}</div>
        <Button variant="outline" disabled={isFetching || !Array.isArray(menuItems) || menuItems.length < limit} onClick={() => setPage((p) => p + 1)}>Sau</Button>
      </div>
    </div>
  )
}
