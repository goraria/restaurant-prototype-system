import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ================================
// 🛠️ UTILITY FUNCTIONS
// ================================

/**
 * Send success response
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = 'Thành công',
  statusCode: number = 200
): void => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data
  };

  res.status(statusCode).json(response);
};

/**
 * Send paginated success response
 */
export const sendPaginatedSuccess = <T>(
  res: Response,
  data: T[],
  pagination: any,
  message: string = 'Thành công',
  statusCode: number = 200
): void => {
  const response: ApiResponse<T[]> = {
    success: true,
    message,
    data,
    pagination
  };

  res.status(statusCode).json(response);
};

/**
 * Send error response
 */
export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 400,
  errors?: string[]
): void => {
  const response: ApiResponse = {
    success: false,
    message,
    errors
  };

  res.status(statusCode).json(response);
};

/**
 * Handle async controller methods
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Validate request body with Zod schema
 */
export const validateBody = <T>(
  req: Request,
  schema: any
): T => {
  try {
    return schema.parse(req.body);
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`);
      throw new ValidationError('Dữ liệu không hợp lệ', errors);
    }
    throw error;
  }
};

/**
 * Validate request params with Zod schema
 */
export const validateParams = <T>(
  req: Request,
  schema: any
): T => {
  try {
    return schema.parse(req.params);
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`);
      throw new ValidationError('Tham số không hợp lệ', errors);
    }
    throw error;
  }
};

/**
 * Validate request query with Zod schema
 */
export const validateQuery = <T>(
  req: Request,
  schema: any
): T => {
  try {
    return schema.parse(req.query);
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`);
      throw new ValidationError('Query parameters không hợp lệ', errors);
    }
    throw error;
  }
};

/**
 * Get current user from request
 */
export const getCurrentUser = (req: Request): any => {
  return (req as any).user;
};

/**
 * Get current user ID from request
 */
export const getCurrentUserId = (req: Request): string => {
  const user = getCurrentUser(req);
  if (!user || !user.id) {
    throw new AuthError('Không tìm thấy thông tin user');
  }
  return user.id;
};

/**
 * Parse pagination from query
 */
export const parsePagination = (req: Request) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
  const sortBy = req.query.sortBy as string || 'created_at';
  const sortOrder = (req.query.sortOrder as string) === 'asc' ? 'asc' as const : 'desc' as const;

  return { page, limit, sortBy, sortOrder };
};

/**
 * Parse filters from query
 */
export const parseFilters = (req: Request, allowedFilters: string[] = []): Record<string, any> => {
  const filters: Record<string, any> = {};

  allowedFilters.forEach(filter => {
    const value = req.query[filter];
    if (value !== undefined && value !== null && value !== '') {
      // Handle array values
      if (typeof value === 'string' && value.includes(',')) {
        filters[filter] = value.split(',').map(v => v.trim());
      }
      // Handle boolean values
      else if (value === 'true' || value === 'false') {
        filters[filter] = value === 'true';
      }
      // Handle numeric values
      else if (!isNaN(Number(value))) {
        filters[filter] = Number(value);
      }
      // Handle date values
      else if (filter.includes('_from') || filter.includes('_to')) {
        filters[filter] = new Date(value as string);
      }
      else {
        filters[filter] = value;
      }
    }
  });

  return filters;
};

/**
 * Validate UUID format
 */
export const validateUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

/**
 * Validate required UUID param
 */
export const validateIdParam = (req: Request, paramName: string = 'id'): string => {
  const id = req.params[paramName];
  
  if (!id) {
    throw new ValidationError(`Thiếu tham số ${paramName}`);
  }

  if (!validateUUID(id)) {
    throw new ValidationError(`${paramName} không hợp lệ`);
  }

  return id;
};

// ================================
// ❌ CUSTOM ERROR CLASSES
// ================================

// Custom Error Classes - Giữ nguyên vì cần kế thừa từ Error
export class ValidationError extends Error {
  constructor(message: string, public errors?: string[]) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenError';
  }
}
