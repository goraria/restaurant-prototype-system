import { Router } from 'express';
import { restaurantController } from '@/controllers/restaurantController';

const router = Router();
const restaurantControllerInstance = new restaurantController();

// Organization routes
router.get('/:organizationId/restaurants', restaurantControllerInstance.getRestaurantsByOrganization);
router.get('/:organizationId/restaurants/code/:code', restaurantControllerInstance.getRestaurantByCode);

export default router;
