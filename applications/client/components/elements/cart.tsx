import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export function CartNavItem() {}

export function CartItem() {
  return (
    <>

    </>
  )
}

export function CartButton() {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white">
              {99}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Giỏ hàng</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="max-h-[360px] overflow-auto">
            <DropdownMenuItem className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">New Message</span>
                <span className="text-xs text-muted-foreground">1h ago</span>
              </div>
              <p className="text-sm text-muted-foreground">You have new message from Natalie</p>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">New Message</span>
                <span className="text-xs text-muted-foreground">1h ago</span>
              </div>
              <p className="text-sm text-muted-foreground">You have new message from Natalie</p>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">New Message</span>
                <span className="text-xs text-muted-foreground">1h ago</span>
              </div>
              <p className="text-sm text-muted-foreground">You have new message from Natalie</p>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">New Message</span>
                <span className="text-xs text-muted-foreground">1h ago</span>
              </div>
              <p className="text-sm text-muted-foreground">You have new message from Natalie</p>
            </DropdownMenuItem>
            {/* Add more notification items */}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}