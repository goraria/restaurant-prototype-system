import { PrismaClient } from '@prisma/client';
import prisma from '@/config/prisma';

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export abstract class BaseService<T = any> {
  protected readonly prisma: PrismaClient;
  protected abstract readonly modelName: string;

  constructor() {
    this.prisma = prisma;
  }

  /**
   * Tạo pagination result
   */
  protected createPaginatedResult<T>(
    data: T[],
    total: number,
    page: number,
    limit: number
  ): PaginatedResult<T> {
    const totalPages = Math.ceil(total / limit);
    
    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }

  /**
   * Parse pagination options
   */
  protected parsePaginationOptions(options: PaginationOptions = {}) {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 10));
    const skip = (page - 1) * limit;
    const sortBy = options.sortBy || 'created_at';
    const sortOrder = options.sortOrder || 'desc';

    return { page, limit, skip, sortBy, sortOrder };
  }

  /**
   * Build where clause từ filters
   */
  protected buildWhereClause(filters: Record<string, any> = {}) {
    const where: Record<string, any> = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        // Handle string search
        if (typeof value === 'string' && key.includes('search')) {
          where[key.replace('_search', '')] = {
            contains: value,
            mode: 'insensitive'
          };
        }
        // Handle array filters
        else if (Array.isArray(value) && value.length > 0) {
          where[key] = { in: value };
        }
        // Handle date ranges
        else if (key.includes('_from') || key.includes('_to')) {
          const field = key.replace('_from', '').replace('_to', '');
          if (!where[field]) where[field] = {};
          
          if (key.includes('_from')) {
            where[field].gte = value;
          } else {
            where[field].lte = value;
          }
        }
        // Handle exact matches
        else {
          where[key] = value;
        }
      }
    });

    return where;
  }

  /**
   * Format error messages
   */
  protected formatError(error: any): Error {
    if (error.code === 'P2002') {
      return new Error('Dữ liệu đã tồn tại trong hệ thống');
    }
    if (error.code === 'P2025') {
      return new Error('Không tìm thấy dữ liệu');
    }
    if (error.code === 'P2003') {
      return new Error('Không thể thực hiện do ràng buộc dữ liệu');
    }
    return error;
  }

  /**
   * Validate UUID format
   */
  protected validateUUID(id: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }

  /**
   * Check if record exists
   */
  protected async exists(id: string): Promise<boolean> {
    if (!this.validateUUID(id)) return false;
    
    try {
      const model = (this.prisma as any)[this.modelName];
      const count = await model.count({ where: { id } });
      return count > 0;
    } catch {
      return false;
    }
  }
}
