import { Router } from 'express';
import { restaurantControllers } from '@controllers/restaurantControllers';

const router = Router();
const restaurantControllerInstance = new restaurantControllers();

// Organization routes
router.get('/:organizationId/restaurants', restaurantControllerInstance.getRestaurantsByOrganization);
router.get('/:organizationId/restaurants/code/:code', restaurantControllerInstance.getRestaurantByCode);

export default router;
