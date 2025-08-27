import { Router } from 'express';
import {
  createVoucher,
  getVoucherById,
  getVoucherByCode,
  getVouchers,
  updateVoucher,
  deleteVoucher,
  hardDeleteVoucher,
  validateVoucher,
  useVoucher,
  getVoucherUsageHistory,
  getActiveVouchersForRestaurant
} from '../controllers/voucherControllers';

const router = Router();

// Create a new voucher
router.post('/', createVoucher);

// Get all vouchers with filtering and pagination
router.get('/', getVouchers);

// Get voucher by ID
router.get('/:id', getVoucherById);

// Get voucher by code
router.get('/code/:code', getVoucherByCode);

// Update voucher
router.put('/:id', updateVoucher);

// Delete voucher (soft delete)
router.delete('/:id', deleteVoucher);

// Hard delete voucher (permanent deletion)
router.delete('/:id/hard', hardDeleteVoucher);

// Validate voucher for order
router.post('/validate', validateVoucher);

// Use voucher (record usage)
router.post('/use', useVoucher);

// Get voucher usage history
router.get('/:id/usage', getVoucherUsageHistory);

// Get active vouchers for a restaurant
router.get('/restaurant/:restaurant_id/active', getActiveVouchersForRestaurant);

export default router;
