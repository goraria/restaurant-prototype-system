import { Router } from 'express';
import {
  createCategory,
  getCategoryById,
  getCategoryBySlug,
  getCategories,
  getCategoryTree,
  updateCategory,
  deleteCategory,
  hardDeleteCategory,
  reorderCategories,
  moveCategory,
  getCategoryBreadcrumbs
} from '@/controllers/categoryControllers';

const router = Router();

// Category CRUD operations
router.post('/', createCategory);
router.get('/', getCategories);
router.get('/tree', getCategoryTree);
router.get('/:id', getCategoryById);
router.get('/slug/:slug', getCategoryBySlug);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);
router.delete('/:id/hard', hardDeleteCategory);

// Category management operations
router.put('/reorder', reorderCategories);
router.put('/:id/move', moveCategory);
router.get('/:id/breadcrumbs', getCategoryBreadcrumbs);

export default router;
