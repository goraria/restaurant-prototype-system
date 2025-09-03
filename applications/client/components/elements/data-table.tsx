"use client"

import React, { useState } from "react"
import Image from "next/image"
import {
  Table as TanStackTable,
  Column,
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  getFacetedRowModel,
  getFacetedUniqueValues,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Card,
  CardHeader,
  CardFooter,
  CardContent
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

import {
  MoreHorizontal,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Settings2,
  Check,
  PlusCircle,
  X,
  Ellipsis,
  Search,
  Download,
  Plus,
  Filter,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Generic Types
export interface DataTableConfig {
  enableRowSelection?: boolean
  enableSorting?: boolean
  enableFiltering?: boolean
  enableColumnResizing?: boolean
  enablePagination?: boolean
  enableSearch?: boolean
  searchPlaceholder?: string
  rowHeight?: "compact" | "normal" | "comfortable"
  variant?: "default" | "card" | "minimal"
  showHeader?: boolean
  showFooter?: boolean
  pageSize?: number
  pageSizeOptions?: number[]
}

export interface DataTableAction<TData> {
  label: string
  icon?: React.ComponentType<{ className?: string }>
  onClick: (row: TData) => void
  variant?: "default" | "destructive" | "secondary"
  show?: (row: TData) => boolean
}

export interface DataTableFilterOption {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  config?: DataTableConfig
  className?: string
  onRowClick?: (row: TData) => void
  actions?: DataTableAction<TData>[]
  filters?: {
    column: string
    title: string
    options: DataTableFilterOption[]
  }[]
  searchColumns?: string[]
  loading?: boolean
  error?: string
  emptyMessage?: string
}

// Helper Components
export function DataTableSortButton<TData, TValue>({
  column,
  title,
  className,
}: {
  column: Column<TData, TValue>
  title: string
  className?: string
}) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  const handleSort = () => {
    const currentSort = column.getIsSorted()
    
    if (currentSort === false) {
      column.toggleSorting(false)
    } else if (currentSort === "asc") {
      column.toggleSorting(true)
    } else {
      column.clearSorting()
    }
  }

  return (
    <Button
      variant="ghost"
      onClick={handleSort}
      className={cn("h-auto p-0 font-medium", className)}
    >
      <span>{title}</span>
      {column.getIsSorted() === "desc" ? (
        <ArrowDown className="ml-2 h-4 w-4" />
      ) : column.getIsSorted() === "asc" ? (
        <ArrowUp className="ml-2 h-4 w-4" />
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4" />
      )}
    </Button>
  )
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: {
  column: Column<TData, TValue>
  title: string
  className?: string
}) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn("h-auto p-0 font-medium data-[state=open]:bg-accent", className)}
        >
          <span>{title}</span>
          {column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => column.clearSorting()}>
          <ChevronsUpDown className="mr-2 h-4 w-4" />
          No sorting
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
          <ArrowUp className="mr-2 h-4 w-4" />
          Ascending
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
          <ArrowDown className="mr-2 h-4 w-4" />
          Descending
        </DropdownMenuItem>
        {column.getCanHide() && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
              <EyeOff className="mr-2 h-4 w-4" />
              Hide column
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: {
  column?: Column<TData, TValue>
  title?: string
  options: DataTableFilterOption[]
}) {
  const facets = column?.getFacetedUniqueValues()
  const selectedValues = new Set(column?.getFilterValue() as string[])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircle className="mr-2 h-4 w-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value)
                      } else {
                        selectedValues.add(option.value)
                      }
                      const filterValues = Array.from(selectedValues)
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined
                      )
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check className={cn("h-4 w-4")} />
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export function DataTableViewOptions<TData>({
  table,
}: {
  table: TanStackTable<TData>
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <Settings2 className="mr-2 h-4 w-4" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function DataTablePagination<TData>({ table, config }: {
  table: TanStackTable<TData>
  config?: DataTableConfig
}) {
  const currentPage = table.getState().pagination.pageIndex + 1
  const totalPages = table.getPageCount()
  
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 3) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex items-center justify-between">
      <div className="flex text-sm text-muted-foreground">
        <div>
          Showing {currentPage === 1 ? 1 : (currentPage - 1) * table.getState().pagination.pageSize + 1} to{" "}
          {Math.min(currentPage * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} of{" "}
          {table.getFilteredRowModel().rows.length} entries
        </div>
        {config?.enableRowSelection && (
          <div className="ml-4">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {(config?.pageSizeOptions || [10, 20, 30, 40, 50]).map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {pageNumbers.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <Button variant="outline" size="sm" disabled>
                  <Ellipsis className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => table.setPageIndex((page as number) - 1)}
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Main DataTable Component
export function DataTable<TData, TValue>({
  columns,
  data,
  config = {},
  className,
  onRowClick,
  actions,
  filters,
  searchColumns,
  loading = false,
  error,
  emptyMessage = "No data available.",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")

  // Default config
  const defaultConfig: DataTableConfig = {
    enableRowSelection: false,
    enableSorting: true,
    enableFiltering: true,
    enableColumnResizing: false,
    enablePagination: true,
    enableSearch: true,
    searchPlaceholder: "Search...",
    rowHeight: "normal",
    variant: "default",
    showHeader: true,
    showFooter: true,
    pageSize: 10,
    pageSizeOptions: [10, 20, 30, 40, 50],
    ...config,
  }

  // Prepare columns with selection if enabled
  const processedColumns = React.useMemo(() => {
    const cols = [...columns]
    
    // Add selection column if enabled
    if (defaultConfig.enableRowSelection) {
      cols.unshift({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 40,
      })
    }
    
    // Add actions column if provided
    if (actions && actions.length > 0) {
      cols.push({
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {actions.map((action, index) => {
                const shouldShow = action.show ? action.show(row.original) : true
                if (!shouldShow) return null
                
                return (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => action.onClick(row.original)}
                    className={action.variant === "destructive" ? "text-destructive" : ""}
                  >
                    {action.icon && <action.icon className="mr-2 h-4 w-4" />}
                    {action.label}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        enableSorting: false,
        enableHiding: false,
        size: 40,
      })
    }
    
    return cols
  }, [columns, defaultConfig.enableRowSelection, actions])

  const table = useReactTable({
    data,
    columns: processedColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: defaultConfig.enablePagination ? getPaginationRowModel() : undefined,
    onSortingChange: defaultConfig.enableSorting ? setSorting : undefined,
    getSortedRowModel: defaultConfig.enableSorting ? getSortedRowModel() : undefined,
    onColumnFiltersChange: defaultConfig.enableFiltering ? setColumnFilters : undefined,
    getFilteredRowModel: defaultConfig.enableFiltering ? getFilteredRowModel() : undefined,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: defaultConfig.enableRowSelection ? setRowSelection : undefined,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    enableColumnResizing: defaultConfig.enableColumnResizing,
    columnResizeMode: 'onChange',
    initialState: {
      pagination: {
        pageSize: defaultConfig.pageSize || 10,
      },
    },
    state: {
      sorting: defaultConfig.enableSorting ? sorting : [],
      columnFilters: defaultConfig.enableFiltering ? columnFilters : [],
      columnVisibility,
      rowSelection: defaultConfig.enableRowSelection ? rowSelection : {},
      globalFilter,
    },
  })

  const isFiltered = table.getState().columnFilters.length > 0 || globalFilter !== ""

  // Row height classes
  const rowHeightClass = {
    compact: "h-10",
    normal: "h-12",
    comfortable: "h-16",
  }[defaultConfig.rowHeight || "normal"]

  // Render content based on variant
  const renderTable = () => (
    <div className="rounded-md border">
      <Table className={cn(
        "w-full",
        defaultConfig.enableColumnResizing && "table-fixed"
      )}>
        {defaultConfig.showHeader && (
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{
                      width: defaultConfig.enableColumnResizing ? header.getSize() : undefined,
                    }}
                    className={cn(rowHeightClass)}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
        )}
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={processedColumns.length} className="h-24 text-center">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="ml-2">Loading...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={processedColumns.length} className="h-24 text-center text-destructive">
                {error}
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={cn(
                  onRowClick && "cursor-pointer hover:bg-muted/50",
                  rowHeightClass
                )}
                onClick={() => onRowClick?.(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    style={{
                      width: defaultConfig.enableColumnResizing ? cell.column.getSize() : undefined,
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={processedColumns.length} className="h-24 text-center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )

  const renderHeader = () => {
    if (!defaultConfig.showHeader) return null
    
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {defaultConfig.enableSearch && (
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={defaultConfig.searchPlaceholder}
                value={globalFilter ?? ""}
                onChange={(event) => setGlobalFilter(String(event.target.value))}
                className="pl-8 max-w-sm"
              />
            </div>
          )}
          
          {filters?.map((filter) => (
            <DataTableFacetedFilter
              key={filter.column}
              column={table.getColumn(filter.column)}
              title={filter.title}
              options={filter.options}
            />
          ))}
          
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => {
                table.resetColumnFilters()
                setGlobalFilter("")
              }}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <DataTableViewOptions table={table} />
        </div>
      </div>
    )
  }

  const renderFooter = () => {
    if (!defaultConfig.showFooter || !defaultConfig.enablePagination) return null
    
    return <DataTablePagination table={table} config={defaultConfig} />
  }

  // Render based on variant
  switch (defaultConfig.variant) {
    case "card":
      return (
        <Card className={className}>
          {defaultConfig.showHeader && (
            <CardHeader>
              {renderHeader()}
            </CardHeader>
          )}
          <CardContent className="p-0">
            {renderTable()}
          </CardContent>
          {defaultConfig.showFooter && (
            <CardFooter>
              {renderFooter()}
            </CardFooter>
          )}
        </Card>
      )
    
    case "minimal":
      return (
        <div className={cn("space-y-4", className)}>
          {renderHeader()}
          {renderTable()}
          {renderFooter()}
        </div>
      )
    
    default:
      return (
        <div className={cn("space-y-4", className)}>
          {renderHeader()}
          {renderTable()}
          {renderFooter()}
        </div>
      )
  }
}

// Export helper functions for column creation
export const createColumn = {
  text: <TData,>(accessorKey: string, header: string): ColumnDef<TData> => ({
    accessorKey,
    header,
  }),
  
  sortable: <TData,>(accessorKey: string, header: string): ColumnDef<TData> => ({
    accessorKey,
    header: ({ column }) => (
      <DataTableSortButton column={column} title={header} />
    ),
  }),
  
  dropdown: <TData,>(accessorKey: string, header: string): ColumnDef<TData> => ({
    accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={header} />
    ),
  }),
  
  badge: <TData,>(
    accessorKey: string, 
    header: string, 
    badgeVariants: Record<string, "default" | "secondary" | "destructive" | "outline">
  ): ColumnDef<TData> => ({
    accessorKey,
    header,
    cell: ({ row }) => {
      const value = row.getValue(accessorKey) as string
      return (
        <Badge variant={badgeVariants[value] || "default"}>
          {value}
        </Badge>
      )
    },
  }),
  
  avatar: <TData,>(
    accessorKey: string,
    header: string,
    nameKey?: string,
    emailKey?: string
  ): ColumnDef<TData> => ({
    accessorKey,
    header,
    cell: ({ row }) => {
      const avatarUrl = row.getValue(accessorKey) as string
      const name = nameKey ? row.getValue(nameKey) as string : ""
      const email = emailKey ? row.getValue(emailKey) as string : ""
      
      return (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            {avatarUrl ? (
              <Image
                className="h-8 w-8 rounded-full object-cover"
                src={avatarUrl}
                alt="avatar"
                width={32}
                height={32}
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {name ? name.charAt(0).toUpperCase() : "?"}
                </span>
              </div>
            )}
          </div>
          {(name || email) && (
            <div className="min-w-0 flex-1">
              {name && (
                <div className="truncate font-medium text-sm">{name}</div>
              )}
              {email && (
                <div className="truncate text-xs text-muted-foreground">{email}</div>
              )}
            </div>
          )}
        </div>
      )
    },
  }),
  
  currency: <TData,>(accessorKey: string, header: string, currency = "USD"): ColumnDef<TData> => ({
    accessorKey,
    header: () => <div className="text-right">{header}</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue(accessorKey))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
      }).format(amount)
      
      return <div className="text-right font-medium">{formatted}</div>
    },
  }),
  
  date: <TData,>(accessorKey: string, header: string): ColumnDef<TData> => ({
    accessorKey,
    header,
    cell: ({ row }) => {
      const date = row.getValue(accessorKey) as string | Date
      const formatted = new Intl.DateTimeFormat("en-US", {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(typeof date === 'string' ? new Date(date) : date)
      
      return <div className="text-sm">{formatted}</div>
    },
  }),
}
