"use client"

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Gift } from "lucide-react";

export default function CartPage() {
  return (
    <>
      <div className="grid grid-cols-3 gap-6">
        <div className="flex flex-col col-span-2 gap-6">
          <Card>

          </Card>
          <Card>

          </Card>
        </div>
        <div className="flex flex-col col-span-1 gap-6">
          <Card>
            <CardHeader className="">
              <CardTitle>
                Thông tin đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="flex justify-between">
                <p>Nhà hàng</p>
                <Link href="/" className="font-medium hover:text-professional-main">
                  Waddles Restaurant
                </Link>
              </div>
              <div className="flex justify-between">
                <p>Bàn ăn</p>
                <p className="font-medium">01</p>
              </div>
              <div className="flex justify-between">
                <p>Số món ăn đã gọi</p>
                <p className="font-medium">21</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <CardTitle>
                Tổng cộng
              </CardTitle>
              <CardTitle>
                1000000000
              </CardTitle>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="">
              <CardTitle>
                Khuyến mãi
              </CardTitle>
            </CardHeader>
            {/*<Separator/>*/}
            <CardContent>
              <Button className="w-full gap-2">
                <Gift className="h-4 w-4"/>
                Chọn hoặc nhập khuyến mãi
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="">
              <CardTitle>
                Tóm tắt đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Tạm tính</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <CardTitle>
                Tổng cộng
              </CardTitle>
              <CardTitle className="">
                1000000000
              </CardTitle>
            </CardFooter>
          </Card>
          <Button>
            Thanh toán
          </Button>
        </div>
      </div>
    </>
  )
}