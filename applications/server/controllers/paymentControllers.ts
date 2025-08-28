import { Request, Response } from 'express';
import { z } from 'zod';
import {
  getPayments,
  getPaymentById,
  createPayment,
  updatePaymentStatus,
  updatePaymentData,
  createRefund,
  getPaymentAnalytics,
} from '@/services/paymentServices';
import {
  CreatePaymentSchema,
  UpdatePaymentSchema,
  PaymentQuerySchema,
} from '@/schemas/paymentSchemas';

export async function listPayments(req: Request, res: Response) {
  try {
    const query = PaymentQuerySchema.parse({
      ...req.query,
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
    });

    const result = await getPayments({
      page: query.page,
      limit: query.limit,
      order_id: query.order_id,
      method: query.payment_method,
      status: query.status,
      start_date: query.start_date,
      end_date: query.end_date,
      sort_by: query.sort_by,
      sort_order: query.sort_order,
    });

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.error });
    }

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: 'Dữ liệu truy vấn không hợp lệ', errors: error.issues });
    }
    return res.status(500).json({ success: false, message: 'Lỗi lấy danh sách payments' });
  }
}

export async function getPaymentDetail(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = await getPaymentById(id);
    if (!result.success) {
      return res.status(404).json({ success: false, message: result.error });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi lấy chi tiết payment' });
  }
}

export async function createPaymentRecord(req: Request, res: Response) {
  try {
    const body = CreatePaymentSchema.parse(req.body);
    const result = await createPayment({
      order_id: body.order_id,
      amount: body.amount,
      method: body.payment_method as any,
      provider: body.gateway,
      transaction_id: body.transaction_id,
    });
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.error });
    }
    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ', errors: error.issues });
    }
    return res.status(500).json({ success: false, message: 'Lỗi tạo payment' });
  }
}

export async function updatePaymentRecord(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data = UpdatePaymentSchema.parse(req.body);

    // Nếu có status => dùng luồng updatePaymentStatus để đảm bảo xử lý liên quan order
    if (data.status) {
      const result = await updatePaymentStatus(id, data.status, data.gateway_response, data.transaction_id);
      if (!result.success) {
        return res.status(400).json({ success: false, message: result.error });
      }
      return res.status(200).json(result);
    }

    // Nếu không có status, cập nhật các field khác
    const result = await updatePaymentData(id, {
      transaction_id: data.transaction_id,
      gateway_response: data.gateway_response,
    });
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.error });
    }
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ', errors: error.issues });
    }
    return res.status(500).json({ success: false, message: 'Lỗi cập nhật payment' });
  }
}

export async function refundPayment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { amount, reason } = req.body || {};
    const result = await createRefund(id, amount, reason);
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.error });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi refund payment' });
  }
}

export async function paymentAnalytics(req: Request, res: Response) {
  try {
    const filters = {
      restaurant_id: req.query.restaurant_id as string | undefined,
      date_from: req.query.start_date as string | undefined,
      date_to: req.query.end_date as string | undefined,
      method: req.query.method as string | undefined,
      status: req.query.status as string | undefined,
    };
    const result = await getPaymentAnalytics(filters);
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.error });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi thống kê payments' });
  }
}


