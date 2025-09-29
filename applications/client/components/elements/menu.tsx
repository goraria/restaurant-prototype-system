"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/elements/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Star, Heart, ShoppingCart, Utensils } from "lucide-react"
import { MenuItemDataColumn } from "@/constants/interfaces"
import { formatCurrency } from "@/utils/format-utils"
import Image from "next/image"

interface MenuItemCardProps {
  item: MenuItemDataColumn
  onSelectItem: (item: MenuItemDataColumn) => void
  selectedItem: MenuItemDataColumn | null
}

export function MenuItemCard({ item, onSelectItem, selectedItem }: MenuItemCardProps) {
  return (
    <Card className="overflow-hidden p-0 hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="aspect-[4/3] bg-muted relative">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <Utensils className="h-16 w-16" />
          </div>
        )}
        <div className="absolute top-4 left-4 space-y-2">
          {item.is_featured && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              Nổi bật
            </Badge>
          )}
          {item.dietary_info?.includes('vegetarian') && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Chay
            </Badge>
          )}
          {item.allergens?.includes('spicy') && (
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              Cay
            </Badge>
          )}
        </div>
        <div className="absolute top-4 right-4">
          <Button size="icon" variant="outline" className="bg-white/90">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-6">
        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">4.5</span>
          </div>
          <span className="text-sm text-muted-foreground">
            (0 đánh giá)
          </span>
        </div>

        {/* Name & Description */}
        <h3 className="font-bold text-lg mb-2">{item.name}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {item.description || 'Chưa có mô tả'}
        </p>

        {/* Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <span>⏱️ {item.preparation_time || 15} phút</span>
          <span>🔥 {item.calories || 0} kcal</span>
        </div>

        {/* Price & Actions */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-orange-600">
            {formatCurrency({ value: parseFloat(item.price), currency: "VND" })}
          </span>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => onSelectItem(item)}>
                  Chi tiết
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{selectedItem?.name}</DialogTitle>
                  <DialogDescription>
                    Thông tin chi tiết về món ăn
                  </DialogDescription>
                </DialogHeader>
                {selectedItem && (
                  <div className="space-y-6">
                    {/* Image */}
                    <div className="aspect-[16/9] bg-muted rounded-lg flex items-center justify-center">
                      {selectedItem.image_url ? (
                        <Image
                          src={selectedItem.image_url}
                          alt={selectedItem.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      ) : (
                        <Utensils className="h-16 w-16 text-muted-foreground" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Mô tả</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          {selectedItem.description || 'Chưa có mô tả'}
                        </p>

                        <h4 className="font-semibold mb-2">Danh mục</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          {selectedItem.categories?.name || 'Chưa phân loại'}
                        </p>

                        <div className="flex items-center gap-4 text-sm">
                          <span>⏱️ {selectedItem.preparation_time || 15} phút</span>
                          {selectedItem.dietary_info?.includes('vegetarian') && <span>🌱 Chay</span>}
                          {selectedItem.allergens?.includes('spicy') && <span>🌶️ Cay</span>}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Dinh dưỡng</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Calories:</span>
                            <span>{selectedItem.calories || 0} kcal</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Protein:</span>
                            <span>0g</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Carbs:</span>
                            <span>0g</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Fat:</span>
                            <span>0g</span>
                          </div>
                        </div>

                        <div className="mt-6">
                          <h4 className="font-semibold mb-2">Giá</h4>
                          <span className="text-2xl font-bold text-orange-600">
                            {formatCurrency({ value: parseFloat(selectedItem.price), currency: "VND" })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Reviews */}
                    <div>
                      <h4 className="font-semibold mb-4">Đánh giá khách hàng</h4>
                      <p className="text-sm text-muted-foreground">Chưa có đánh giá</p>
                    </div>

                    {/* Action */}
                    <div className="flex gap-2">
                      <Button className="flex-1">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Thêm vào giỏ
                      </Button>
                      <Button variant="outline">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            <Button size="sm">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Đặt món
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}