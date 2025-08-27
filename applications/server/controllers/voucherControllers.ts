import { Request, Response } from 'express';
import {
  createVoucher as createVoucherService,
  getVoucherById as getVoucherByIdService,
  getVoucherByCode as getVoucherByCodeService,
  getVouchers as getVouchersService,
  updateVoucher as updateVoucherService,
  deleteVoucher as deleteVoucherService,
  validateVoucher as validateVoucherService,
  applyVoucher as applyVoucherService,
  getVoucherStats as getVoucherStatsService
} from '../services/voucherServices';
import { 
  CreateVoucherSchema, 
  UpdateVoucherSchema, 
  VoucherQuerySchema, 
  ApplyVoucherSchema 
} from '../schemas/voucherSchemas';
import { z } from 'zod';

/**
 * Create a new voucher
 */
export async function createVoucher(req: Request, res: Response): Promise<void> {
  try {
    // Parse and validate request body
    const validatedData = CreateVoucherSchema.parse({
      ...req.body,
      start_date: new Date(req.body.start_date),
      end_date: new Date(req.body.end_date),
    });

    const voucher = await createVoucherService(validatedData);
    
    res.status(201).json({
      success: true,
      message: 'Voucher created successfully',
      data: voucher
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.issues
      });
      return;
    }
    
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * Get voucher by ID
 */
export async function getVoucherById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Voucher ID is required'
      });
      return;
    }

    const voucher = await getVoucherByIdService(id);
    
    if (!voucher) {
      res.status(404).json({
        success: false,
        message: 'Voucher not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: voucher
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * Get voucher by code
 */
export async function getVoucherByCode(req: Request, res: Response): Promise<void> {
  try {
    const { code } = req.params;
    
    if (!code) {
      res.status(400).json({
        success: false,
        message: 'Voucher code is required'
      });
      return;
    }

    const voucher = await getVoucherByCodeService(code);
    
    if (!voucher) {
      res.status(404).json({
        success: false,
        message: 'Voucher not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: voucher
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * Get all vouchers with filtering and pagination
 */
export async function getVouchers(req: Request, res: Response): Promise<void> {
  try {
    // Parse and validate query parameters
    const query = VoucherQuerySchema.parse({
      ...req.query,
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      is_active: req.query.is_active === 'true' ? true : req.query.is_active === 'false' ? false : undefined
    });

    const result = await getVouchersService(query);
    
    res.status(200).json({
      success: true,
      data: result.vouchers,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.issues
      });
      return;
    }
    
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * Update voucher
 */
export async function updateVoucher(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Voucher ID is required'
      });
      return;
    }

    // Parse and validate request body
    const updateData: any = { ...req.body };
    
    // Convert date strings to Date objects if provided
    if (updateData.start_date) {
      updateData.start_date = new Date(updateData.start_date);
    }
    if (updateData.end_date) {
      updateData.end_date = new Date(updateData.end_date);
    }

    const validatedData = UpdateVoucherSchema.parse(updateData);

    const voucher = await updateVoucherService(id, validatedData);
    
    res.status(200).json({
      success: true,
      message: 'Voucher updated successfully',
      data: voucher
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.issues
      });
      return;
    }
    
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * Delete voucher (soft delete)
 */
export async function deleteVoucher(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Voucher ID is required'
      });
      return;
    }

    await deleteVoucherService(id);
    
    res.status(200).json({
      success: true,
      message: 'Voucher deleted successfully'
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * Hard delete voucher (permanent deletion)
 */
export async function hardDeleteVoucher(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Voucher ID is required'
      });
      return;
    }

    // Hard delete is handled automatically in deleteVoucherService
    await deleteVoucherService(id);
    
    res.status(200).json({
      success: true,
      message: 'Voucher permanently deleted'
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * Validate voucher for order
 */
export async function validateVoucher(req: Request, res: Response): Promise<void> {
  try {
    const validatedData = ApplyVoucherSchema.parse(req.body);

    const result = await validateVoucherService(validatedData);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.issues
      });
      return;
    }
    
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * Use voucher (record usage)
 */
export async function useVoucher(req: Request, res: Response): Promise<void> {
  try {
    const { voucher_id, user_id, order_id } = req.body;
    
    if (!voucher_id || !user_id) {
      res.status(400).json({
        success: false,
        message: 'Voucher ID and User ID are required'
      });
      return;
    }

    await applyVoucherService(voucher_id, user_id);
    
    res.status(200).json({
      success: true,
      message: 'Voucher used successfully'
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * Get voucher usage history
 */
export async function getVoucherUsageHistory(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Voucher ID is required'
      });
      return;
    }

    const stats = await getVoucherStatsService(id);
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * Get active vouchers for a restaurant
 */
export async function getActiveVouchersForRestaurant(req: Request, res: Response): Promise<void> {
  try {
    const { restaurant_id } = req.params;
    
    if (!restaurant_id) {
      res.status(400).json({
        success: false,
        message: 'Restaurant ID is required'
      });
      return;
    }

    // Get active vouchers for a specific restaurant
    const vouchers = await getVouchersService({ 
      restaurant_id, 
      is_active: true 
    });
    
    res.status(200).json({
      success: true,
      data: vouchers
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}