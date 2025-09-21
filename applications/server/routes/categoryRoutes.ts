import { Router } from 'express';
import {
  createCategory,
  getCategoryById,
  getCategoryBySlug,
  getCategories,
  getCategoryTree,
  updateCategory,
  updateStatusCategory,
  deleteCategory,
  hardDeleteCategory,
  reorderCategories,
  moveCategory,
  getCategoryBreadcrumbs,
  getAllCategories
} from '@/controllers/categoryControllers';

const router = Router();

router.get('/', getAllCategories);

// Category CRUD operations
// Pass
router.post('/', createCategory);
// Unknown
router.get('/page', getCategories);
// Unknown
router.get('/tree', getCategoryTree);
// Pass
router.get('/:id', getCategoryById);
// Unknown
router.get('/slug/:slug', getCategoryBySlug);
// Pass
router.put('/:id', updateCategory);
// Unknown
router.patch('/:id', updateStatusCategory);
// Pass
router.delete('/:id', deleteCategory);
// Pass
router.delete('/hard/:id', hardDeleteCategory);

// Category management operations
router.put('/reorder', reorderCategories);
router.put('/:id/move', moveCategory);
router.get('/:id/breadcrumbs', getCategoryBreadcrumbs);

export default router;
