import { Router } from 'express';
import { restaurantController } from '@/controllers/restaurantController';

const router = Router();
const restaurantControllerInstance = new restaurantController();

// Chain routes
router.get('/:chainId/restaurants', restaurantControllerInstance.getRestaurantsByChain);

export default router;
