import { Router } from 'express';
import {
  listPayments,
  getPaymentDetail,
  createPaymentRecord,
  updatePaymentRecord,
  refundPayment,
  paymentAnalytics,
} from '@/controllers/paymentControllers';

const router = Router();

// List + query payments
router.get('/', listPayments);

// Create a manual payment record (admin)
router.post('/', createPaymentRecord);

// Payment analytics
router.get('/analytics', paymentAnalytics);

// Payment detail
router.get('/:id', getPaymentDetail);

// Update payment
router.put('/:id', updatePaymentRecord);

// Refund
router.post('/:id/refund', refundPayment);

export default router;


