import { ComponentProps } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { LucideIcon } from "lucide-react";

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: { title: string; url: string }[];
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: { title: string; url: string }[];
}

export interface AppSidebarUser {
  name?: string | null;
  email?: string | null;
  avatar?: string | null;
}

export interface AppSidebarUserProps {
  user: AppSidebarUser;
}

export interface AppSidebarProps extends ComponentProps<typeof Sidebar> {
  sidebar: {
    role: string;
    navMain: NavMainItem[];
    projects: { name: string; url: string; icon: LucideIcon }[];
    user: { name: string; email: string; avatar: string };
  };
  global: {
    name: string;
    description: string;
  };
  user: AppSidebarUser;
}

///////////////////////////////////////////////////////////////////////////////

export interface MenuItem {
  id: string
  restaurant_id?: string
  menu_id: string
  category_id?: string
  name: string
  description?: string
  price: number | string
  image_url?: string
  preparation_time?: number
  calories?: number
  allergens?: string[]
  dietary_info?: string[]
  is_vegetarian?: boolean
  is_vegan?: boolean
  is_available: boolean
  is_featured?: boolean
  display_order: number
  created_at: string
  updated_at: string
  menus?: {
    id: string
    name: string
    restaurant_id?: string
  }
  categories?: {
    id: string
    name: string
    slug?: string
  }
}
