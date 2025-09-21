import { z } from 'zod';

// Interface
// export interface Category {
//   id: string;
//   parent_id: string | null;
//   name: string;
//   slug: string;
//   description: string | null;
//   image_url: string | null;
//   display_order: number;
//   is_active: boolean;
//   created_at: Date;
//   updated_at: Date;
// }

// Base category schema
export const CategorySchema = z.object({
  id: z.string().uuid(),
  parent_id: z.string().uuid().nullable(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(120),
  description: z.string().optional(),
  image_url: z.string().url().optional(),
  display_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
  created_at: z.date(),
  updated_at: z.date(),
});

// Create category schema (without auto-generated fields)
export const CreateCategorySchema = z.object({
  parent_id: z.string().uuid().nullable().optional(),
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  slug: z.string().min(1, "Slug is required").max(120, "Slug must be less than 120 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only"),
  description: z.string().optional(),
  image_url: z.string().url("Invalid URL format").optional(),
  display_order: z.number().int().min(0).default(0).optional(),
  is_active: z.boolean().default(true).optional(),
}).refine(async (data) => {
  // Custom validation can be added here
  return true;
}, {
  message: "Invalid category data",
});

// Update category schema (partial update)
export const UpdateCategorySchema = z.object({
  parent_id: z.string().uuid().nullable().optional(),
  name: z.string().min(1).max(100).optional(),
  slug: z.string().min(1).max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only").optional(),
  description: z.string().optional(),
  image_url: z.string().url("Invalid URL format").optional(),
  display_order: z.number().int().min(0).optional(),
  is_active: z.boolean().optional(),
});

// Query params for filtering categories
export const CategoryQuerySchema = z.object({
  parent_id: z.string().uuid().optional(),
  is_active: z.boolean().optional(),
  name: z.string().optional(),
  slug: z.string().optional(),
  page: z.number().int().positive().default(1).optional(),
  limit: z.number().int().positive().max(100).default(10).optional(),
  sort_by: z.enum(['created_at', 'name', 'display_order', 'updated_at']).default('display_order').optional(),
  sort_order: z.enum(['asc', 'desc']).default('asc').optional(),
  include_children: z.boolean().default(false).optional(),
  include_parent: z.boolean().default(false).optional(),
});

// Category with hierarchy schema
export const CategoryWithHierarchySchema = CategorySchema.extend({
  parent_category: CategorySchema.nullable().optional(),
  child_categories: z.array(CategorySchema).optional(),
  menu_items_count: z.number().int().min(0).optional(),
});

// Category tree node schema (for hierarchical display)
export const CategoryTreeNodeSchema: z.ZodType<CategoryTreeNode> = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  image_url: z.string().optional(),
  display_order: z.number().int(),
  is_active: z.boolean(),
  children: z.array(z.lazy(() => CategoryTreeNodeSchema)).optional(),
  menu_items_count: z.number().int().min(0).optional(),
});

// Define type first for recursive reference
export type CategoryTreeNode = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  display_order: number;
  is_active: boolean;
  children?: CategoryTreeNode[];
  menu_items_count?: number;
};

// Bulk operation schemas
export const BulkUpdateCategorySchema = z.object({
  ids: z.array(z.string().uuid()).min(1, "At least one category ID is required"),
  updates: UpdateCategorySchema.omit({ parent_id: true }), // Prevent bulk parent changes
});

export const BulkDeleteCategorySchema = z.object({
  ids: z.array(z.string().uuid()).min(1, "At least one category ID is required"),
  force: z.boolean().default(false), // Force delete even if has children/menu items
});

// Category reorder schema
export const ReorderCategorySchema = z.object({
  categories: z.array(z.object({
    id: z.string().uuid(),
    display_order: z.number().int().min(0),
  })).min(1, "At least one category is required"),
});

// Move category schema
export const MoveCategorySchema = z.object({
  category_id: z.string().uuid(),
  new_parent_id: z.string().uuid().nullable(),
  new_display_order: z.number().int().min(0).optional(),
}).refine((data) => {
  // Prevent moving category to itself
  return data.category_id !== data.new_parent_id;
}, {
  message: "Cannot move category to itself",
  path: ["new_parent_id"],
});

// Export type definitions
export type Category = z.infer<typeof CategorySchema>;
export type CreateCategory = z.infer<typeof CreateCategorySchema>;
export type UpdateCategory = z.infer<typeof UpdateCategorySchema>;
export type CategoryQuery = z.infer<typeof CategoryQuerySchema>;
export type CategoryWithHierarchy = z.infer<typeof CategoryWithHierarchySchema>;
export type BulkUpdateCategory = z.infer<typeof BulkUpdateCategorySchema>;
export type BulkDeleteCategory = z.infer<typeof BulkDeleteCategorySchema>;
export type ReorderCategory = z.infer<typeof ReorderCategorySchema>;
export type MoveCategory = z.infer<typeof MoveCategorySchema>;
