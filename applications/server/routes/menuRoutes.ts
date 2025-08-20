import { Router } from 'express';
import { menuController } from '@/controllers/menuController';
// Import middleware (tạm thời comment để không lỗi)
// import { authMiddleware, managerMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const menuControllerInstance = new menuController();

// Public routes
router.get('/menu-items/featured', menuControllerInstance.getFeaturedMenuItems);
router.get('/menu-items/search', menuControllerInstance.searchMenuItems);
router.get('/menu-items/stats', menuControllerInstance.getMenuItemStats);
router.get('/menu-items', menuControllerInstance.getMenuItems);
router.get('/menu-items/:id', menuControllerInstance.getMenuItemById);

// Menu routes
router.get('/:id', menuControllerInstance.getMenuById);
router.get('/', menuControllerInstance.getMenus);

// Protected routes (cần auth)
// router.use(authMiddleware); // Uncomment khi có auth middleware

// Menu CRUD
router.post('/', menuControllerInstance.createMenu);
router.put('/:id', menuControllerInstance.updateMenu);
router.delete('/:id', menuControllerInstance.deleteMenu);

// Menu items CRUD
router.post('/menu-items', menuControllerInstance.createMenuItem);
router.put('/menu-items/:id', menuControllerInstance.updateMenuItem);
router.delete('/menu-items/:id', menuControllerInstance.deleteMenuItem);

// Menu items relations
router.get('/:menuId/items', menuControllerInstance.getMenuItemsByMenu);

// Bulk operations
// router.use(managerMiddleware); // Uncomment khi có manager middleware
router.put('/menu-items/bulk/availability', menuControllerInstance.updateItemsAvailability);

export default router;
