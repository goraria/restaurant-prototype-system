import { Request, Response } from 'express';
import {
  createCategory as createCategoryService,
  getCategoryById as getCategoryByIdService,
  getCategoryBySlug as getCategoryBySlugService,
  getCategories as getCategoriesService,
  // getCategoryTree as getCategoryTreeService,
  updateCategory as updateCategoryService,
  deleteCategory as deleteCategoryService,
  hardDeleteCategory as hardDeleteCategoryService,
  reorderCategories as reorderCategoriesService,
  moveCategory as moveCategoryService,
  getCategoryBreadcrumbs as getCategoryBreadcrumbsService,
  getAllCategories as getAllCategoriesService,
} from '@/services/categoryServices';
import { 
  CreateCategorySchema, 
  UpdateCategorySchema, 
  CategoryQuerySchema 
} from '@/schemas/categorySchemas';

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await getAllCategoriesService();

    res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully',
      data: categories.data,
      total: categories.total,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get categories';
    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};

/**
 * Create a new category
 */
export const createCategory = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const result = CreateCategorySchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: result.error.issues
      });
    }

    const category = await createCategoryService(result.data);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create category';
    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};

/**
 * Get category by ID
 */
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Category ID is required'
      });
    }

    const category = await getCategoryByIdService(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category found',
      data: category,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get category';
    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};

/**
 * Get category by slug
 */
export const getCategoryBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: 'Category slug is required'
      });
    }

    const category = await getCategoryBySlugService(slug);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category found',
      data: category
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get category by slug';
    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};

/**
 * Get all categories with filtering and pagination
 */
export const getCategories = async (req: Request, res: Response) => {
  try {
    // Validate query parameters
    const result = CategoryQuerySchema.safeParse(req.query);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: result.error.issues
      });
    }

    const response = await getCategoriesService(result.data);

    res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully',
      data: response
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get categories';
    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};

/**
 * Get category tree (hierarchical structure)
 */
export const getCategoryTree = async (req: Request, res: Response) => {
  // try {
  //   const { parent_id } = req.query;
  //
  //   const tree = await getCategoryTreeService(
  //     parent_id ? String(parent_id) : null
  //   );
  //
  //   res.status(200).json({
  //     success: true,
  //     message: 'Category tree retrieved successfully',
  //     data: tree
  //   });
  // } catch (error) {
  //   const errorMessage = error instanceof Error ? error.message : 'Failed to get category tree';
  //   res.status(500).json({
  //     success: false,
  //     message: errorMessage
  //   });
  // }
};

/**
 * Update category
 */
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Category ID is required'
      });
    }

    // Validate request body
    const result = UpdateCategorySchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: result.error.issues
      });
    }

    const category = await updateCategoryService(id, result.data);

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update category';
    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};

/**
 * Delete category (soft delete)
 */
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Category ID is required'
      });
    }

    await deleteCategoryService(id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete category';
    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};

/**
 * Hard delete category (permanently remove)
 */
export const hardDeleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Category ID is required'
      });
    }

    await hardDeleteCategoryService(id);

    res.status(200).json({
      success: true,
      message: 'Category permanently deleted'
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to permanently delete category';
    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};

/**
 * Reorder categories
 */
export const reorderCategories = async (req: Request, res: Response) => {
  try {
    const { categories } = req.body;

    if (!Array.isArray(categories)) {
      return res.status(400).json({
        success: false,
        message: 'Categories array is required'
      });
    }

    // Validate each category item
    const isValid = categories.every(item => 
      typeof item === 'object' && 
      typeof item.id === 'string' && 
      typeof item.display_order === 'number'
    );

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Each category must have id (string) and display_order (number)'
      });
    }

    await reorderCategoriesService(categories);

    res.status(200).json({
      success: true,
      message: 'Categories reordered successfully'
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to reorder categories';
    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};

/**
 * Move category to different parent
 */
export const moveCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { new_parent_id, new_display_order } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Category ID is required'
      });
    }

    const category = await moveCategoryService(
      id, 
      new_parent_id || null, 
      new_display_order
    );

    res.status(200).json({
      success: true,
      message: 'Category moved successfully',
      data: category
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to move category';
    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};

/**
 * Get category breadcrumbs
 */
export const getCategoryBreadcrumbs = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Category ID is required'
      });
    }

    const breadcrumbs = await getCategoryBreadcrumbsService(id);

    res.status(200).json({
      success: true,
      message: 'Breadcrumbs retrieved successfully',
      data: breadcrumbs
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get breadcrumbs';
    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};
