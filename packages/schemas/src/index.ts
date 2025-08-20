// ================================
// 🎯 SHARED ZOD SCHEMAS FOR RESTAURANT MANAGEMENT
// ================================
// This file exports all Zod schemas and types for use across
// Next.js, Express, Vite, and Expo applications

// Core schemas with base utilities and enums
export * from './core';

// Order management schemas
export * from './orders';

// Inventory and recipe management schemas  
export * from './inventory';

// Staff management schemas
export * from './staff';

// Analytics, reviews, and support schemas
export * from './analytics';

// Re-export commonly used utilities
export { z } from 'zod';

// ================================
// 🔧 UTILITY FUNCTIONS
// ================================

import { z } from 'zod';

/**
 * Creates a paginated response schema with meta information
 */
export const createPaginatedSchema = <T extends z.ZodTypeAny>(itemSchema: T) => 
  z.object({
    data: z.array(itemSchema),
    meta: z.object({
      page: z.number().int().min(1),
      limit: z.number().int().min(1).max(100),
      total: z.number().int().min(0),
      totalPages: z.number().int().min(0),
      hasNext: z.boolean(),
      hasPrev: z.boolean(),
    }),
  });

/**
 * Creates an API response schema with success/error states
 */
export const createApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.object({
      code: z.string(),
      message: z.string(),
      details: z.any().optional(),
    }).optional(),
    timestamp: z.string().datetime(),
  });

/**
 * Creates a search/filter schema for list endpoints
 */
export const createSearchSchema = (additionalFilters?: z.ZodRawShape) =>
  z.object({
    q: z.string().optional(),
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(20),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    ...additionalFilters,
  });

// ================================
// 🎨 COMMON VALIDATION PATTERNS
// ================================

/**
 * Bulk operation schemas for efficient database operations
 */
export const BulkCreateSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema).min(1).max(100),
  });

export const BulkUpdateSchema = <T extends z.ZodTypeAny>(updateSchema: T) =>
  z.object({
    updates: z.array(
      z.object({
        id: z.string().uuid(),
        data: updateSchema,
      })
    ).min(1).max(100),
  });

export const BulkDeleteSchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(100),
});

/**
 * Common filter schemas for different entity types
 */
export const DateRangeFilterSchema = z.object({
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
});

export const StatusFilterSchema = <T extends readonly [string, ...string[]]>(statuses: T) =>
  z.object({
    status: z.enum(statuses).optional(),
    statuses: z.array(z.enum(statuses)).optional(),
  });

// ================================
// 📱 PLATFORM-SPECIFIC EXPORTS
// ================================

/**
 * Export configurations for different platforms
 */
export const PlatformSchemas = {
  // Next.js specific schemas (client-side)
  nextjs: {
    // Forms with client-side validation
    formSchemas: {
      // Re-export create schemas for forms
    },
  },
  
  // Express API specific schemas (server-side)
  express: {
    // API endpoint schemas
    apiSchemas: {
      // Re-export all CRUD schemas
    },
  },
  
  // Vite admin panel specific schemas
  vite: {
    // Admin interface schemas
    adminSchemas: {
      // Re-export management schemas
    },
  },
  
  // Expo mobile app specific schemas
  expo: {
    // Mobile-optimized schemas
    mobileSchemas: {
      // Re-export simplified schemas for mobile
    },
  },
};

// ================================
// 🏗️ SCHEMA VALIDATION HELPERS
// ================================

/**
 * Validates data against a schema and returns typed result
 */
export const validateSchema = <T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; error: z.ZodError } => {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
};

/**
 * Transforms validation errors into user-friendly messages
 */
export const formatValidationErrors = (error: z.ZodError): Record<string, string> => {
  return error.errors.reduce((acc: Record<string, string>, err: z.ZodIssue) => {
    const path = err.path.join('.');
    acc[path] = err.message;
    return acc;
  }, {} as Record<string, string>);
};

// ================================
// 📝 TYPE HELPERS
// ================================

/**
 * Utility types for working with schemas
 */
export type InferSchemaType<T extends z.ZodTypeAny> = z.infer<T>;

// Helper type for creating schemas without system fields
export type CreateInputType<T> = Omit<T, 'id' | 'created_at' | 'updated_at'>;
export type UpdateInputType<T> = Partial<CreateInputType<T>>;
