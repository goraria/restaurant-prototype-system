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
