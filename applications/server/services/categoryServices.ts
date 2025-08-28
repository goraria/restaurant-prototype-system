import { PrismaClient } from '@prisma/client';
import { 
  CreateCategory, 
  UpdateCategory, 
  CategoryQuery, 
  CategoryTreeNode
} from '@/schemas/categorySchemas';

const prisma = new PrismaClient();

// Helper function to format category data
const formatCategory = (category: any) => {
  return {
    ...category,
    menu_items_count: category._count?.menu_items ?? 0
  };
};

/**
 * Create a new category
 */
export const createCategory = async (data: CreateCategory) => {
  try {
    // Check if slug already exists
    const existingCategory = await prisma.categories.findUnique({
      where: { slug: data.slug }
    });

    if (existingCategory) {
      throw new Error('Category slug already exists');
    }

    // Validate parent category exists if parent_id is provided
    if (data.parent_id) {
      const parentCategory = await prisma.categories.findUnique({
        where: { id: data.parent_id }
      });

      if (!parentCategory) {
        throw new Error('Parent category not found');
      }
    }

    // If display_order not provided, set it as the next order in the same level
    let display_order = data.display_order ?? 0;
    if (display_order === 0) {
      const maxOrder = await prisma.categories.aggregate({
        where: { parent_id: data.parent_id },
        _max: { display_order: true }
      });
      display_order = (maxOrder._max.display_order ?? 0) + 1;
    }

    const category = await prisma.categories.create({
      data: {
        ...data,
        display_order
      },
      include: {
        parent_category: true,
        child_categories: true,
        _count: {
          select: {
            menu_items: true
          }
        }
      }
    });

    return formatCategory(category);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create category: ${error.message}`);
    }
    throw new Error('Failed to create category');
  }
};

/**
 * Get category by ID
 */
export const getCategoryById = async (id: string) => {
  try {
    const category = await prisma.categories.findUnique({
      where: { id },
      include: {
        parent_category: true,
        child_categories: {
          orderBy: {
            display_order: 'asc'
          }
        },
        _count: {
          select: {
            menu_items: true
          }
        }
      }
    });

    if (!category) return null;

    return formatCategory(category);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get category: ${error.message}`);
    }
    throw new Error('Failed to get category');
  }
};

/**
 * Get category by slug
 */
export const getCategoryBySlug = async (slug: string) => {
  try {
    const category = await prisma.categories.findUnique({
      where: { slug },
      include: {
        parent_category: true,
        child_categories: {
          orderBy: {
            display_order: 'asc'
          }
        },
        _count: {
          select: {
            menu_items: true
          }
        }
      }
    });

    if (!category) return null;

    return formatCategory(category);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get category by slug: ${error.message}`);
    }
    throw new Error('Failed to get category by slug');
  }
};

/**
 * Get all categories with filtering and pagination
 */
export const getCategories = async (query: CategoryQuery) => {
  try {
    const {
      parent_id,
      is_active,
      name,
      slug,
      page = 1,
      limit = 10,
      sort_by = 'display_order',
      sort_order = 'asc'
    } = query;

    const where: any = {};

    if (parent_id !== undefined) {
      where.parent_id = parent_id;
    }

    if (is_active !== undefined) {
      where.is_active = is_active;
    }

    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive'
      };
    }

    if (slug) {
      where.slug = {
        contains: slug,
        mode: 'insensitive'
      };
    }

    const total = await prisma.categories.count({ where });

    const categories = await prisma.categories.findMany({
      where,
      include: {
        parent_category: true,
        child_categories: {
          orderBy: {
            display_order: 'asc'
          }
        },
        _count: {
          select: {
            menu_items: true
          }
        }
      },
      orderBy: {
        [sort_by]: sort_order
      },
      skip: (page - 1) * limit,
      take: limit
    });

    const totalPages = Math.ceil(total / limit);

    return {
      categories: categories.map(formatCategory),
      total,
      page,
      limit,
      totalPages
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get categories: ${error.message}`);
    }
    throw new Error('Failed to get categories');
  }
};

/**
 * Get category tree (hierarchical structure)
 */
export const getCategoryTree = async (parent_id: string | null = null): Promise<CategoryTreeNode[]> => {
  try {
    const categories = await prisma.categories.findMany({
      where: {
        parent_id: parent_id,
        is_active: true
      },
      include: {
        _count: {
          select: {
            menu_items: true
          }
        }
      },
      orderBy: {
        display_order: 'asc'
      }
    });

    const tree: CategoryTreeNode[] = [];

    for (const category of categories) {
      const children = await getCategoryTree(category.id);
      
      tree.push({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image_url: category.image_url,
        display_order: category.display_order,
        is_active: category.is_active,
        menu_items_count: category._count.menu_items,
        children: children.length > 0 ? children : undefined
      });
    }

    return tree;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get category tree: ${error.message}`);
    }
    throw new Error('Failed to get category tree');
  }
};

/**
 * Update category
 */
export const updateCategory = async (id: string, data: UpdateCategory) => {
  try {
    // Check if category exists
    const existingCategory = await prisma.categories.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      throw new Error('Category not found');
    }

    // Check if new slug already exists (if slug is being updated)
    if (data.slug && data.slug !== existingCategory.slug) {
      const slugExists = await prisma.categories.findUnique({
        where: { slug: data.slug }
      });

      if (slugExists) {
        throw new Error('Category slug already exists');
      }
    }

    // Validate parent category exists if parent_id is provided
    if (data.parent_id !== undefined && data.parent_id) {
      const parentCategory = await prisma.categories.findUnique({
        where: { id: data.parent_id }
      });

      if (!parentCategory) {
        throw new Error('Parent category not found');
      }

      // Prevent circular reference
      if (data.parent_id === id) {
        throw new Error('Category cannot be its own parent');
      }
    }

    const category = await prisma.categories.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date()
      },
      include: {
        parent_category: true,
        child_categories: true,
        _count: {
          select: {
            menu_items: true
          }
        }
      }
    });

    return formatCategory(category);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to update category: ${error.message}`);
    }
    throw new Error('Failed to update category');
  }
};

/**
 * Delete category (soft delete by setting is_active to false)
 */
export const deleteCategory = async (id: string): Promise<void> => {
  try {
    const existingCategory = await prisma.categories.findUnique({
      where: { id },
      include: {
        child_categories: true,
        _count: {
          select: {
            menu_items: true
          }
        }
      }
    });

    if (!existingCategory) {
      throw new Error('Category not found');
    }

    // Check if category has active children
    const activeChildren = existingCategory.child_categories.filter(child => child.is_active);
    if (activeChildren.length > 0) {
      throw new Error('Cannot delete category with active subcategories. Please delete or move subcategories first.');
    }

    // Check if category has menu items
    if (existingCategory._count.menu_items > 0) {
      throw new Error('Cannot delete category with menu items. Please move or delete menu items first.');
    }

    await prisma.categories.update({
      where: { id },
      data: { 
        is_active: false,
        updated_at: new Date()
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete category: ${error.message}`);
    }
    throw new Error('Failed to delete category');
  }
};

/**
 * Hard delete category (permanently remove from database)
 */
export const hardDeleteCategory = async (id: string): Promise<void> => {
  try {
    const existingCategory = await prisma.categories.findUnique({
      where: { id },
      include: {
        child_categories: true,
        _count: {
          select: {
            menu_items: true
          }
        }
      }
    });

    if (!existingCategory) {
      throw new Error('Category not found');
    }

    // Check if category has children
    if (existingCategory.child_categories.length > 0) {
      throw new Error('Cannot delete category with subcategories. Please delete subcategories first.');
    }

    // Check if category has menu items
    if (existingCategory._count.menu_items > 0) {
      throw new Error('Cannot delete category with menu items. Please delete menu items first.');
    }

    await prisma.categories.delete({
      where: { id }
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to hard delete category: ${error.message}`);
    }
    throw new Error('Failed to hard delete category');
  }
};

/**
 * Reorder categories
 */
export const reorderCategories = async (categories: { id: string; display_order: number }[]): Promise<void> => {
  try {
    await prisma.$transaction(async (tx) => {
      for (const item of categories) {
        await tx.categories.update({
          where: { id: item.id },
          data: { 
            display_order: item.display_order,
            updated_at: new Date()
          }
        });
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to reorder categories: ${error.message}`);
    }
    throw new Error('Failed to reorder categories');
  }
};

/**
 * Move category to different parent
 */
export const moveCategory = async (category_id: string, new_parent_id: string | null, new_display_order?: number) => {
  try {
    // Check if category exists
    const category = await prisma.categories.findUnique({
      where: { id: category_id }
    });

    if (!category) {
      throw new Error('Category not found');
    }

    // Check if new parent exists (if not null)
    if (new_parent_id) {
      const newParent = await prisma.categories.findUnique({
        where: { id: new_parent_id }
      });

      if (!newParent) {
        throw new Error('New parent category not found');
      }

      // Prevent circular reference
      if (new_parent_id === category_id) {
        throw new Error('Category cannot be moved to itself');
      }
    }

    // Calculate new display order if not provided
    let display_order = new_display_order;
    if (display_order === undefined) {
      const maxOrder = await prisma.categories.aggregate({
        where: { parent_id: new_parent_id },
        _max: { display_order: true }
      });
      display_order = (maxOrder._max.display_order ?? 0) + 1;
    }

    const updatedCategory = await prisma.categories.update({
      where: { id: category_id },
      data: {
        parent_id: new_parent_id,
        display_order,
        updated_at: new Date()
      },
      include: {
        parent_category: true,
        child_categories: true,
        _count: {
          select: {
            menu_items: true
          }
        }
      }
    });

    return formatCategory(updatedCategory);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to move category: ${error.message}`);
    }
    throw new Error('Failed to move category');
  }
};

/**
 * Get category breadcrumbs (path from root to category)
 */
export const getCategoryBreadcrumbs = async (id: string) => {
  try {
    const breadcrumbs: { id: string; name: string; slug: string }[] = [];
    let currentId: string | null = id;

    while (currentId) {
      const category: { id: string; name: string; slug: string; parent_id: string | null } | null = await prisma.categories.findUnique({
        where: { id: currentId },
        select: {
          id: true,
          name: true,
          slug: true,
          parent_id: true
        }
      });

      if (!category) break;

      breadcrumbs.unshift({
        id: category.id,
        name: category.name,
        slug: category.slug
      });

      currentId = category.parent_id;
    }

    return breadcrumbs;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get category breadcrumbs: ${error.message}`);
    }
    throw new Error('Failed to get category breadcrumbs');
  }
};
