"use client"

import React, { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BoxIcon, MoonStar, Moon, Sun, Monitor } from "lucide-react"
import { cn } from "@/lib/utils"

export function ModeToggle({
  className,
  ...props
}: React.ComponentProps<"span"> & {
  className?: string
}) {
  const [layout, setLayout] = useState(1) // Đặt mặc định là 1 để hiển thị dropdown với system
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Tránh hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <span className={cn("", className)} {...props} />
  }

  // Hàm để cycle qua các theme: light -> dark -> system -> light
  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else if (theme === "dark") {
      setTheme("system")
    } else {
      setTheme("light")
    }
  }

  // Icon hiển thị dựa trên theme hiện tại
  const getCurrentIcon = () => {
    if (theme === "system") {
      return <Monitor className="h-[1.2rem] w-[1.2rem]" />
    } else if (theme === "dark" || (theme === "system" && resolvedTheme === "dark")) {
      return <Moon className="h-[1.2rem] w-[1.2rem]" />
    } else {
      return <Sun className="h-[1.2rem] w-[1.2rem]" />
    }
  }

  return (
    <span className={cn("", className)} {...props}>
      {layout === 1 ? (
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            {/* <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" /> */}
            {/* <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" /> */}
            {getCurrentIcon()}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            <Sun className="mr-2 h-4 w-4" />
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            <Moon className="mr-2 h-4 w-4" />
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            <Monitor className="mr-2 h-4 w-4" />
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      ) : layout === 2 ? (
        <Button 
          variant="ghost"
          size="icon" 
          onClick={cycleTheme}
        >
          {/* <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" /> */}
          {/* <MoonStar className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:-rotate-0 dark:scale-100" /> */}
          {/*<Moon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />*/}
          {getCurrentIcon()}
          <span className="sr-only">Toggle theme (Light/Dark/System)</span>
          {/* <span className="sr-only">Toggle theme</span> */}
        </Button>
      ) : (
        <Switch
          checked={theme === "dark"}
          onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="relative"
        />
      )}
    </span>
  )
}
