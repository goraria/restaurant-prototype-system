"use client"

import React from "react"
import { 
  DataTable, 
  createColumn,
  type DataTableAction,
  type DataTableFilterOption
} from "@/components/elements/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Package,
  Star,
  Trash2,
  Edit,
  Eye,
  Download
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

// 1. User Data
interface UserData {
  id: string
  avatar?: string
  name: string
  email: string
  role: "admin" | "user" | "moderator"
  status: "active" | "inactive" | "pending"
  lastLogin: Date
  joinDate: Date
}

const userData: UserData[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    status: "active",
    lastLogin: new Date("2024-01-15"),
    joinDate: new Date("2023-01-01"),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com", 
    role: "user",
    status: "inactive",
    lastLogin: new Date("2024-01-10"),
    joinDate: new Date("2023-02-15"),
  },
  {
    id: "3",
    name: "Bob Wilson",
    email: "bob@example.com",
    role: "moderator",
    status: "pending",
    lastLogin: new Date("2024-01-12"),
    joinDate: new Date("2023-03-20"),
  },
]

const userColumns: ColumnDef<UserData>[] = [
  createColumn.avatar("avatar", "User", "name", "email"),
  createColumn.sortable("name", "Name"),
  createColumn.badge("role", "Role", {
    admin: "destructive",
    moderator: "default", 
    user: "secondary"
  }),
  createColumn.badge("status", "Status", {
    active: "default",
    inactive: "secondary",
    pending: "outline"
  }),
  createColumn.date("lastLogin", "Last Login"),
]

// 2. Product Data
interface ProductData {
  id: string
  name: string
  category: "electronics" | "clothing" | "books" | "home"
  price: number
  stock: number
  rating: number
  status: "in_stock" | "out_of_stock" | "discontinued"
  image?: string
}

const productData: ProductData[] = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    category: "electronics",
    price: 999.99,
    stock: 45,
    rating: 4.8,
    status: "in_stock",
  },
  {
    id: "2", 
    name: "Nike Air Max",
    category: "clothing",
    price: 129.99,
    stock: 0,
    rating: 4.5,
    status: "out_of_stock",
  },
  {
    id: "3",
    name: "The Great Gatsby",
    category: "books", 
    price: 12.99,
    stock: 150,
    rating: 4.2,
    status: "in_stock",
  },
]

const productColumns: ColumnDef<ProductData>[] = [
  createColumn.text("name", "Product"),
  createColumn.dropdown("category", "Category"),
  createColumn.currency("price", "Price", "USD"),
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => {
      const stock = row.getValue("stock") as number
      return (
        <div className={`text-sm font-medium ${stock === 0 ? 'text-destructive' : stock < 20 ? 'text-yellow-600' : 'text-green-600'}`}>
          {stock} units
        </div>
      )
    },
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      const rating = row.getValue("rating") as number
      return (
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="text-sm">{rating}</span>
        </div>
      )
    },
  },
  createColumn.badge("status", "Status", {
    in_stock: "default",
    out_of_stock: "destructive", 
    discontinued: "secondary"
  }),
]

// 3. Order Data
interface OrderData {
  id: string
  customerName: string
  customerEmail: string
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  orderDate: Date
  items: number
}

const orderData: OrderData[] = [
  {
    id: "ORD-001",
    customerName: "Alice Johnson",
    customerEmail: "alice@example.com",
    total: 299.97,
    status: "delivered",
    orderDate: new Date("2024-01-10"),
    items: 3,
  },
  {
    id: "ORD-002", 
    customerName: "Mike Brown",
    customerEmail: "mike@example.com",
    total: 156.50,
    status: "processing",
    orderDate: new Date("2024-01-12"),
    items: 2,
  },
  {
    id: "ORD-003",
    customerName: "Sarah Davis",
    customerEmail: "sarah@example.com", 
    total: 89.99,
    status: "cancelled",
    orderDate: new Date("2024-01-08"),
    items: 1,
  },
]

const orderColumns: ColumnDef<OrderData>[] = [
  createColumn.sortable("id", "Order ID"),
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("customerName")}</div>
        <div className="text-xs text-muted-foreground">{row.original.customerEmail}</div>
      </div>
    ),
  },
  createColumn.currency("total", "Total", "USD"),
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ComponentType<{ className?: string }> }> = {
        pending: { variant: "outline", icon: Clock },
        processing: { variant: "default", icon: AlertTriangle },
        shipped: { variant: "secondary", icon: Package },
        delivered: { variant: "default", icon: CheckCircle },
        cancelled: { variant: "destructive", icon: XCircle },
      }
      const config = variants[status]
      const Icon = config.icon
      
      return (
        <Badge variant={config.variant} className="gap-1">
          <Icon className="h-3 w-3" />
          {status}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  createColumn.date("orderDate", "Order Date"),
  createColumn.text("items", "Items"),
]

// 4. Analytics Data
interface AnalyticsData {
  id: string
  metric: string
  value: number
  change: number
  period: "daily" | "weekly" | "monthly"
  category: "traffic" | "sales" | "users" | "revenue"
}

const analyticsData: AnalyticsData[] = [
  {
    id: "1",
    metric: "Page Views",
    value: 12500,
    change: 12.5,
    period: "daily",
    category: "traffic",
  },
  {
    id: "2",
    metric: "Revenue",
    value: 45000,
    change: -5.2,
    period: "monthly", 
    category: "revenue",
  },
  {
    id: "3",
    metric: "New Users",
    value: 890,
    change: 25.8,
    period: "weekly",
    category: "users",
  },
]

const analyticsColumns: ColumnDef<AnalyticsData>[] = [
  createColumn.text("metric", "Metric"),
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => {
      const value = row.getValue("value") as number
      return <div className="font-mono">{value.toLocaleString()}</div>
    },
  },
  {
    accessorKey: "change",
    header: "Change %",
    cell: ({ row }) => {
      const change = row.getValue("change") as number
      return (
        <div className={`font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change >= 0 ? '+' : ''}{change}%
        </div>
      )
    },
  },
  createColumn.badge("period", "Period", {
    daily: "outline",
    weekly: "secondary",
    monthly: "default"
  }),
  createColumn.badge("category", "Category", {
    traffic: "default",
    sales: "secondary",
    users: "outline", 
    revenue: "destructive"
  }),
]

// 5. Task Data
interface TaskData {
  id: string
  title: string
  assignee: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "todo" | "in_progress" | "review" | "done"
  dueDate: Date
  tags: string[]
}

const taskData: TaskData[] = [
  {
    id: "TASK-1",
    title: "Implement user authentication",
    assignee: "John Doe",
    priority: "high", 
    status: "in_progress",
    dueDate: new Date("2024-02-01"),
    tags: ["backend", "security"],
  },
  {
    id: "TASK-2",
    title: "Design dashboard UI",
    assignee: "Jane Smith",
    priority: "medium",
    status: "review",
    dueDate: new Date("2024-01-25"),
    tags: ["frontend", "ui"],
  },
  {
    id: "TASK-3",
    title: "Write API documentation", 
    assignee: "Bob Wilson",
    priority: "low",
    status: "todo",
    dueDate: new Date("2024-02-10"),
    tags: ["documentation"],
  },
]

const taskColumns: ColumnDef<TaskData>[] = [
  createColumn.sortable("title", "Task"),
  createColumn.text("assignee", "Assignee"),
  createColumn.badge("priority", "Priority", {
    low: "secondary",
    medium: "outline",
    high: "default",
    urgent: "destructive"
  }),
  createColumn.badge("status", "Status", {
    todo: "outline", 
    in_progress: "default",
    review: "secondary",
    done: "default"
  }),
  createColumn.date("dueDate", "Due Date"),
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => {
      const tags = row.getValue("tags") as string[]
      return (
        <div className="flex gap-1 flex-wrap">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )
    },
  },
]

// Filter options
const statusOptions: DataTableFilterOption[] = [
  { label: "Active", value: "active", icon: CheckCircle },
  { label: "Inactive", value: "inactive", icon: XCircle },
  { label: "Pending", value: "pending", icon: Clock },
]

const priorityOptions: DataTableFilterOption[] = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" }, 
  { label: "High", value: "high" },
  { label: "Critical", value: "critical" },
]

// Common actions
const createActions = <T,>(entity: string): DataTableAction<T>[] => [
  {
    label: "View",
    icon: Eye,
    onClick: (row) => console.log(`View ${entity}:`, row),
  },
  {
    label: "Edit", 
    icon: Edit,
    onClick: (row) => console.log(`Edit ${entity}:`, row),
  },
  {
    label: "Download",
    icon: Download,
    onClick: (row) => console.log(`Download ${entity}:`, row),
  },
  {
    label: "Delete",
    icon: Trash2,
    onClick: (row) => console.log(`Delete ${entity}:`, row),
    variant: "destructive",
  },
]

export default function TestTablePage() {
  return (
    <div className="container mx-auto py-8 space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">DataTable Test Suite</h1>
        <p className="text-muted-foreground">
          Testing different data types, configurations, and layouts for the flexible DataTable component.
        </p>
      </div>

      {/* 1. Users Table - Card variant with row selection */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">1. Users Management</h2>
        <DataTable
          columns={userColumns}
          data={userData}
          config={{
            variant: "card",
            enableRowSelection: true,
            rowHeight: "comfortable",
            searchPlaceholder: "Search users...",
          }}
          actions={createActions("user")}
          filters={[
            { column: "status", title: "Status", options: statusOptions }
          ]}
          onRowClick={(user) => console.log("User clicked:", user)}
        />
      </section>

      {/* 2. Products Table - Minimal variant with column resizing */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">2. Product Catalog</h2>
        <DataTable
          columns={productColumns}
          data={productData}
          config={{
            variant: "minimal",
            enableColumnResizing: true,
            rowHeight: "normal",
            pageSize: 5,
          }}
          actions={createActions("product")}
        />
      </section>

      {/* 3. Orders Table - Default variant with custom filters */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">3. Order Management</h2>
        <DataTable
          columns={orderColumns}
          data={orderData}
          config={{
            variant: "default",
            rowHeight: "compact",
            pageSizeOptions: [5, 10, 15, 20],
          }}
          filters={[
            { 
              column: "status", 
              title: "Order Status", 
              options: [
                { label: "Pending", value: "pending", icon: Clock },
                { label: "Processing", value: "processing", icon: AlertTriangle },
                { label: "Shipped", value: "shipped", icon: Package },
                { label: "Delivered", value: "delivered", icon: CheckCircle },
                { label: "Cancelled", value: "cancelled", icon: XCircle },
              ]
            }
          ]}
          actions={createActions("order")}
        />
      </section>

      {/* 4. Analytics Table - No header/footer */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">4. Analytics Dashboard</h2>
        <DataTable
          columns={analyticsColumns}
          data={analyticsData}
          config={{
            variant: "card",
            showHeader: false,
            showFooter: false,
            enablePagination: false,
            enableSearch: false,
          }}
        />
      </section>

      {/* 5. Tasks Table - Complete feature set */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">5. Task Management</h2>
        <DataTable
          columns={taskColumns}
          data={taskData}
          loading={false}
          config={{
            variant: "default",
            enableRowSelection: true,
          }}
          filters={[
            { column: "priority", title: "Priority", options: priorityOptions }
          ]}
          actions={createActions("task")}
        />
      </section>
    </div>
  )
}
