import { Router } from 'express';
import { getOrders, syncOrders } from '../controllers/orderController';

const router = Router();

router.get('/orders', getOrders);
router.post('/orders/sync', syncOrders);

export default router;
