"use client"

import React, { useEffect, useMemo, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  ChefHat,
  Clock,
  Users2
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MenuItemDataColumn, RecipeDataColumn, StatsBoxProps } from "@/constants/interfaces"
import { DataTable } from "@/components/elements/data-table"
import { StatsBox } from "@/components/elements/stats-box"
import { useGetAllMenuItemsQuery, useGetRecipeByMenuItemIdQuery } from "@/state/api"
import { toast } from "sonner"

export default function RecipesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMenuItemId, setSelectedMenuItemId] = useState<string>("")

  // const { data: recipes = [], error, isLoading, refetch } = useGetRecipesQuery({})
  const {
    data: menuItems = [],
    isLoading: isMenuLoading,
    error: errorMenuItem,
    refetch: refetchMenuItems,
  } = useGetAllMenuItemsQuery()
  const {
    data: recipe,
    isFetching: isRecipeLoading,
    error: errorRecipe,
    refetch: refetchRecipe,
  } = useGetRecipeByMenuItemIdQuery(selectedMenuItemId!, { skip: !selectedMenuItemId })

  useEffect(() => {
    if (errorMenuItem || errorRecipe) {
      toast.error("Có lỗi xảy ra khi tải danh sách công thức!")
    }
  }, [errorMenuItem, errorRecipe])

  // Combined loading
  const isLoading = isMenuLoading || (selectedMenuItemId ? isRecipeLoading : false)

  const stats = useMemo(() => {
    const r = recipe as RecipeDataColumn | undefined
    const total = r ? 1 : 0
    const totalIngredients = r?.ingredients?.length ?? 0
    const avgCookTime = r?.cook_time ?? 0
    const avgServing = r?.serving_size ?? 0
    return { total, totalIngredients, avgCookTime, avgServing }
  }, [recipe])

  const columns: ColumnDef<RecipeDataColumn, unknown>[] = [
    {
      accessorKey: "name",
      header: () => <div className="text-left">Công thức</div>,
      cell: ({ row }) => {
        const recipe = row.original
        return (
          <div className="min-w-0">
            <div className="font-medium truncate">{recipe.name}</div>
            <div className="text-xs text-muted-foreground truncate">{recipe.description ?? "Không có mô tả"}</div>
          </div>
        )
      },
      size: 320,
    },
    {
      accessorKey: "menu_items",
      header: () => <div className="text-center">Món ăn</div>,
      cell: ({ row }) => {
        const recipe = row.original
        return <div className="text-center">{recipe.menu_items?.name ?? "—"}</div>
      },
      size: 160,
    },
    {
      accessorKey: "ingredients",
      header: () => <div className="text-center">Nguyên liệu</div>,
      cell: ({ row }) => {
        const count = row.original.ingredients?.length ?? 0
        return <div className="text-center font-medium">{count}</div>
      },
      size: 120,
    },
    {
      accessorKey: "cook_time",
      header: () => <div className="text-center">Thời gian (phút)</div>,
      cell: ({ row }) => {
        const t = row.original.cook_time ?? 0
        return <div className="text-center">{t > 0 ? t : "—"}</div>
      },
      size: 140,
    },
    {
      id: "actions",
      enableResizing: false,
      size: 64,
      cell: ({ row }) => {
        const recipe = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="p-0">
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
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  // Ingredients DataTable
  type IngredientRow = NonNullable<RecipeDataColumn['ingredients']>[number]
  const ingredientColumns: ColumnDef<IngredientRow, unknown>[] = [
    {
      accessorKey: "inventory_items.name",
      header: () => <div className="text-left">Nguyên liệu</div>,
      cell: ({ row }) => (
        <div className="font-medium">{row.original.inventory_items?.name ?? "—"}</div>
      ),
      size: 280,
    },
    {
      accessorKey: "quantity",
      header: () => <div className="text-center">Số lượng</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.original.quantity ?? "—"}</div>
      ),
      size: 120,
    },
    {
      accessorKey: "unit",
      header: () => <div className="text-center">Đơn vị</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.original.unit ?? row.original.inventory_items?.unit ?? "—"}</div>
      ),
      size: 120,
    },
    {
      accessorKey: "notes",
      header: () => <div className="text-left">Ghi chú</div>,
      cell: ({ row }) => (
        <div className="truncate text-muted-foreground">{row.original.notes ?? ""}</div>
      ),
    },
  ]

  // Auto-select first menu item
  useEffect(() => {
    if (!selectedMenuItemId && Array.isArray(menuItems) && (menuItems as MenuItemDataColumn[]).length > 0) {
      setSelectedMenuItemId((menuItems as MenuItemDataColumn[])[0].id)
    }
  }, [menuItems, selectedMenuItemId])

  const selectedRecipe: RecipeDataColumn | undefined = useMemo(() => {
    return (recipe as RecipeDataColumn) ?? undefined
  }, [recipe])

  const ingredientRows: IngredientRow[] = useMemo(() => {
    return (selectedRecipe?.ingredients ?? []) as IngredientRow[]
  }, [selectedRecipe])

  const statsBox: StatsBoxProps[] = [
    {
      title: "Tổng công thức",
      description: "Trong hệ thống",
      icon: ChefHat,
      stats: stats.total,
    },
    {
      title: "Tổng nguyên liệu",
      description: "Tất cả công thức",
      icon: Users2,
      stats: stats.totalIngredients,
    },
    {
      title: "Thời gian TB",
      description: "Phút nấu",
      icon: Clock,
      stats: stats.avgCookTime,
    },
    {
      title: "Khẩu phần TB",
      description: "Mỗi công thức",
      icon: Users2,
      stats: stats.avgServing,
    },
  ]

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ChefHat className="h-8 w-8" />
            Quản lý công thức
          </h1>
          <p className="text-muted-foreground">Lưu trữ và quản lý công thức nấu ăn chi tiết</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm công thức mới
          </Button>
        </div>
      </div> */}

      {!isLoading ? (
        <>
          <Card className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ChefHat className="h-5 w-5" />
                  <h2 className="text-xl font-semibold">Thông tin công thức</h2>
                </div>
                {!selectedMenuItemId || isRecipeLoading ? (
                  <div className="grid gap-2">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-5/6" />
                    <div className="grid grid-cols-3 gap-3">
                      <Skeleton className="h-9" />
                      <Skeleton className="h-9" />
                      <Skeleton className="h-9" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-lg font-medium">{selectedRecipe?.name ?? "—"}</div>
                    <div className="text-sm text-muted-foreground">{selectedRecipe?.description ?? "Không có mô tả"}</div>
                    {selectedRecipe?.instructions && (
                      <div className="text-sm text-muted-foreground">{selectedRecipe.instructions}</div>
                    )}
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Thời gian: {selectedRecipe?.cook_time ? `${selectedRecipe.cook_time} phút` : "—"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users2 className="h-4 w-4" />
                        <span>Khẩu phần: {selectedRecipe?.serving_size ?? "—"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{selectedRecipe?.ingredients?.length ?? 0} nguyên liệu</Badge>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Chọn món ăn (tối đa 200):</div>
                <Select value={selectedMenuItemId} onValueChange={setSelectedMenuItemId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={isMenuLoading ? "Đang tải..." : "Chọn món ăn"} />
                  </SelectTrigger>
                  <SelectContent>
                    {(menuItems as MenuItemDataColumn[]).slice(0, 200).map((mi) => (
                      <SelectItem key={mi.id} value={mi.id}>
                        {mi.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedRecipe?.menu_items?.name && (
                  <div className="text-sm text-muted-foreground">Công thức của: <span className="font-medium text-foreground">{selectedRecipe.menu_items.name}</span></div>
                )}
              </div>
            </div>
          </Card>
          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {statsBox.map((box, idx) => (
              <StatsBox
                key={idx}
                title={box.title}
                description={box.description}
                icon={box.icon}
                color={box.color}
                stats={box.stats}
              />
            ))}
          </div>
          <Card className="m-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">Nguyên liệu của công thức</CardTitle>
              <CardDescription>Danh sách nguyên liệu theo món đã chọn</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input disabled placeholder="Tìm kiếm trong bảng (dùng hộp tìm kiếm của bảng)" className="pl-8" />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    refetchMenuItems()
                    if (selectedMenuItemId) refetchRecipe()
                  }}
                >
                  Làm mới
                </Button>
              </div>
              <DataTable
                columns={ingredientColumns}
                data={ingredientRows}
                search={{ column: "inventory_items.name", placeholder: "Tìm kiếm nguyên liệu..." }}
              />
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Skeleton className="h-36 rounded-xl" />
              <Skeleton className="h-36 rounded-xl" />
              <Skeleton className="h-36 rounded-xl" />
              <Skeleton className="h-36 rounded-xl" />
            </div>
            <Skeleton className="h-screen w-full rounded-xl" />
          </div>
        </>
      )}
    </div>
  )
}
