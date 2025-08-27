import crypto from 'crypto';
import axios from 'axios';
import moment from 'moment';
import qs from 'qs';
import { PrismaClient } from '@prisma/client';
import { 
  createPayment, 
  updatePaymentStatus, 
  generateOrderId, 
  validateSignature,
  formatAmount 
} from './paymentServices';

const prisma = new PrismaClient();

// ================================
// 🎯 E-WALLET SERVICES
// ================================

// Types for better type safety
interface PaymentResult {
  success: boolean;
  data?: any;
  error?: string;
}

interface CallbackResult {
  success: boolean;
  data?: {
    orderId: string;
    transactionId?: string;
    status: 'completed' | 'failed';
    amount: number;
    gatewayResponse: any;
    message?: string;
    resultCode?: any;
    responseCode?: any;
  };
  error?: string;
}

// ================================
// 🎯 MOMO SERVICES
// ================================

/**
 * Tạo payment request tới MoMo
 */
export async function createMomoPayment(data: {
  orderId: string;
  amount: number;
  orderInfo: string;
  extraData?: string;
}): Promise<PaymentResult> {
  try {
    const { orderId, amount, orderInfo, extraData = '' } = data;
    
    const accessKey = process.env.MOMO_ACCESS_KEY!;
    const secretKey = process.env.MOMO_SECRET_KEY!;
    const partnerCode = process.env.MOMO_PARTNER_CODE!;
    const partnerName = process.env.MOMO_PARTNER_NAME!;
    const redirectUrl = process.env.MOMO_REDIRECT_URL!;
    const ipnUrl = process.env.MOMO_IPN_URL!;
    const endpoint = 'https://test-payment.momo.vn/v2/gateway/api/create';
    
    const requestId = generateOrderId('MOMO');
    const requestType = "payWithMethod";
    const lang = 'vi';

    // Tạo signature
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    const requestBody = {
      partnerCode: partnerCode,
      partnerName: partnerName,
      storeId: "RestaurantStore",
      requestId: requestId,
      amount: formatAmount(amount),
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: true,
      extraData: extraData,
      signature: signature
    };

    const response = await axios.post(endpoint, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return {
      success: true,
      data: {
        payUrl: response.data.payUrl,
        deeplink: response.data.deeplink,
        qrCodeUrl: response.data.qrCodeUrl,
        requestId: requestId,
        orderId: orderId
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi tạo MoMo payment'
    };
  }
}

/**
 * Xử lý callback từ MoMo
 */
export async function handleMomoCallback(callbackData: any): Promise<CallbackResult> {
  try {
    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature
    } = callbackData;

    const accessKey = process.env.MOMO_ACCESS_KEY!;
    const secretKey = process.env.MOMO_SECRET_KEY!;

    // Validate signature
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
    
    const expectedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    if (signature !== expectedSignature) {
      throw new Error('Invalid signature');
    }

    // Xử lý kết quả thanh toán
    const status = resultCode === 0 ? 'completed' : 'failed';
    
    return {
      success: true,
      data: {
        orderId,
        transactionId: transId,
        status,
        amount: parseFloat(amount),
        message,
        resultCode,
        gatewayResponse: callbackData
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi xử lý MoMo callback'
    };
  }
}

/**
 * Kiểm tra trạng thái giao dịch MoMo
 */
export async function queryMomoTransaction(orderId: string): Promise<PaymentResult> {
  try {
    const accessKey = process.env.MOMO_ACCESS_KEY!;
    const secretKey = process.env.MOMO_SECRET_KEY!;
    const partnerCode = process.env.MOMO_PARTNER_CODE!;
    
    const requestId = orderId;
    const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${requestId}`;
    
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    const requestBody = {
      partnerCode: partnerCode,
      requestId: requestId,
      orderId: orderId,
      signature: signature,
      lang: 'vi'
    };

    const response = await axios.post(
      'https://test-payment.momo.vn/v2/gateway/api/query',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi query MoMo transaction'
    };
  }
}

// ================================
// 🎯 ZALOPAY SERVICES
// ================================

/**
 * Tạo payment request tới ZaloPay
 */
export async function createZaloPayPayment(data: {
  orderId: string;
  amount: number;
  description: string;
  userId?: string;
}): Promise<PaymentResult> {
  try {
    const { orderId, amount, description, userId = 'customer' } = data;
    
    const appId = process.env.ZLP_MERCHANT_APP_ID!;
    const key1 = process.env.ZLP_MERCHANT_KEY1!;
    const endpoint = process.env.ZLP_MERCHANT_ENDPOINT!;
    const callbackUrl = process.env.ZLP_MERCHANT_CALLBACK_URL!;
    const redirectUrl = process.env.ZLP_REDIRECT_URL!;
    
    const transID = Math.floor(Math.random() * 1000000);
    const appTransId = `${moment().format('YYMMDD')}_${transID}`;

    const embedData = {
      redirecturl: redirectUrl,
      orderId: orderId
    };

    const order = {
      app_id: appId,
      app_trans_id: appTransId,
      app_user: userId,
      app_time: Date.now(),
      item: JSON.stringify([]),
      embed_data: JSON.stringify(embedData),
      amount: formatAmount(amount),
      callback_url: callbackUrl,
      description: description,
      bank_code: '',
      mac: ""
    };

    // Tạo MAC
    const dataStr = `${appId}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
    order.mac = crypto
      .createHmac('sha256', key1)
      .update(dataStr)
      .digest('hex');

    const response = await axios.post(endpoint, null, { 
      params: order 
    });

    return {
      success: true,
      data: {
        orderUrl: response.data.order_url,
        appTransId: appTransId,
        orderId: orderId,
        qrCode: response.data.qr_code
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi tạo ZaloPay payment'
    };
  }
}

/**
 * Xử lý callback từ ZaloPay
 */
export async function handleZaloPayCallback(callbackData: any): Promise<CallbackResult> {
  try {
    const { data, mac } = callbackData;
    const key2 = process.env.ZLP_MERCHANT_KEY2!;

    if (!data || !mac) {
      throw new Error('Missing required data or mac');
    }

    // Validate MAC
    const expectedMac = crypto
      .createHmac('sha256', key2)
      .update(data)
      .digest('hex');

    if (mac !== expectedMac) {
      throw new Error('Invalid MAC signature');
    }

    // Parse data
    const result = JSON.parse(data);
    const embedData = JSON.parse(result.embed_data);
    
    return {
      success: true,
      data: {
        orderId: embedData.orderId,
        transactionId: result.app_trans_id,
        amount: result.amount,
        status: 'completed',
        gatewayResponse: callbackData
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi xử lý ZaloPay callback'
    };
  }
}

/**
 * Kiểm tra trạng thái giao dịch ZaloPay
 */
export async function queryZaloPayTransaction(appTransId: string): Promise<PaymentResult> {
  try {
    const appId = process.env.ZLP_MERCHANT_APP_ID!;
    const key1 = process.env.ZLP_MERCHANT_KEY1!;
    
    const data = `${appId}|${appTransId}|${key1}`;
    const mac = crypto
      .createHmac('sha256', key1)
      .update(data)
      .digest('hex');

    const params = {
      app_id: appId,
      app_trans_id: appTransId,
      mac: mac
    };

    const response = await axios.post(
      'https://sb-openapi.zalopay.vn/v2/query',
      qs.stringify(params),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi query ZaloPay transaction'
    };
  }
}

// ================================
// 🎯 VNPAY SERVICES
// ================================

/**
 * Tạo payment request tới VNPay
 */
export async function createVNPayPayment(data: {
  orderId: string;
  amount: number;
  orderInfo: string;
  ipAddr: string;
}): Promise<PaymentResult> {
  try {
    const { orderId, amount, orderInfo, ipAddr } = data;
    
    const tmnCode = process.env.VNP_TMN_CODE!;
    const secretKey = process.env.VNP_HASH_SECRET!;
    const url = process.env.VNP_URL!;
    const returnUrl = process.env.VNP_RETURN_URL!;
    
    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');
    const expireDate = moment(date).add(15, 'minutes').format('YYYYMMDDHHmmss');

    let vnpParams: any = {
      'vnp_Version': '2.1.0',
      'vnp_Command': 'pay',
      'vnp_TmnCode': tmnCode,
      'vnp_Locale': 'vn',
      'vnp_CurrCode': 'VND',
      'vnp_TxnRef': orderId,
      'vnp_OrderInfo': orderInfo,
      'vnp_OrderType': 'other',
      'vnp_Amount': formatAmount(amount) * 100, // VNPay yêu cầu * 100
      'vnp_ReturnUrl': returnUrl,
      'vnp_IpAddr': ipAddr,
      'vnp_CreateDate': createDate,
      'vnp_ExpireDate': expireDate
    };

    // Sắp xếp params và tạo signature
    const sortedParams = sortObject(vnpParams);
    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    
    vnpParams['vnp_SecureHash'] = signed;
    const paymentUrl = url + '?' + qs.stringify(vnpParams, { encode: false });

    return {
      success: true,
      data: {
        paymentUrl: paymentUrl,
        orderId: orderId
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi tạo VNPay payment'
    };
  }
}

/**
 * Xử lý callback từ VNPay
 */
export async function handleVNPayCallback(callbackData: any): Promise<CallbackResult> {
  try {
    const secretKey = process.env.VNP_HASH_SECRET!;
    const vnpParams = { ...callbackData };
    const secureHash = vnpParams['vnp_SecureHash'];
    
    delete vnpParams['vnp_SecureHash'];
    delete vnpParams['vnp_SecureHashType'];

    const sortedParams = sortObject(vnpParams);
    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash !== signed) {
      throw new Error('Invalid signature');
    }

    const status = vnpParams['vnp_ResponseCode'] === '00' ? 'completed' : 'failed';

    return {
      success: true,
      data: {
        orderId: vnpParams['vnp_TxnRef'],
        transactionId: vnpParams['vnp_TransactionNo'],
        amount: parseInt(vnpParams['vnp_Amount']) / 100, // Chia 100 để về VND
        status: status,
        responseCode: vnpParams['vnp_ResponseCode'],
        gatewayResponse: callbackData
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi xử lý VNPay callback'
    };
  }
}

// ================================
// 🎯 UNIFIED WALLET FUNCTIONS
// ================================

/**
 * Tạo payment dựa theo provider
 */
export async function createWalletPayment(
  provider: 'momo' | 'zalopay' | 'vnpay',
  orderData: {
    orderId: string;
    amount: number;
    description: string;
    userId?: string;
    ipAddr?: string;
  }
): Promise<PaymentResult> {
  try {
    // Tạo payment record trong database trước
    const paymentRecord = await createPayment({
      order_id: orderData.orderId,
      amount: orderData.amount,
      method: provider,
      provider: provider
    });

    if (!paymentRecord.success) {
      throw new Error(paymentRecord.error);
    }

    let result;
    switch (provider) {
      case 'momo':
        result = await createMomoPayment({
          orderId: orderData.orderId,
          amount: orderData.amount,
          orderInfo: orderData.description
        });
        break;
      case 'zalopay':
        result = await createZaloPayPayment({
          orderId: orderData.orderId,
          amount: orderData.amount,
          description: orderData.description,
          userId: orderData.userId
        });
        break;
      case 'vnpay':
        result = await createVNPayPayment({
          orderId: orderData.orderId,
          amount: orderData.amount,
          orderInfo: orderData.description,
          ipAddr: orderData.ipAddr || '127.0.0.1'
        });
        break;
      default:
        throw new Error('Provider không được hỗ trợ');
    }

    if (!result.success) {
      // Cập nhật payment thành failed nếu tạo request thất bại
      await updatePaymentStatus(paymentRecord.data!.id, 'failed', {
        error: result.error
      });
      throw new Error(result.error);
    }

    return {
      success: true,
      data: {
        payment_id: paymentRecord.data!.id,
        ...result.data
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi tạo wallet payment'
    };
  }
}

/**
 * Xử lý callback thống nhất
 */
export async function handleWalletCallback(
  provider: 'momo' | 'zalopay' | 'vnpay',
  callbackData: any
): Promise<PaymentResult> {
  try {
    let result: CallbackResult;
    switch (provider) {
      case 'momo':
        result = await handleMomoCallback(callbackData);
        break;
      case 'zalopay':
        result = await handleZaloPayCallback(callbackData);
        break;
      case 'vnpay':
        result = await handleVNPayCallback(callbackData);
        break;
      default:
        throw new Error('Provider không được hỗ trợ');
    }

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Callback processing failed');
    }

    // Cập nhật payment status trong database
    const { orderId, status, gatewayResponse, transactionId } = result.data;
    
    // Tìm payment theo order_id
    const payments = await prisma.payments.findMany({
      where: { order_id: orderId },
      orderBy: { created_at: 'desc' }
    });

    if (payments.length === 0) {
      throw new Error('Payment không tồn tại');
    }

    const payment = payments[0];
    const updateResult = await updatePaymentStatus(
      payment.id,
      status,
      gatewayResponse,
      transactionId
    );

    return {
      success: true,
      data: {
        payment_updated: updateResult.success,
        callback_data: result.data
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi xử lý callback'
    };
  }
}

// ================================
// 🔧 HELPER FUNCTIONS
// ================================

function sortObject(obj: any): any {
  const sorted: any = {};
  const keys = Object.keys(obj).sort();
  keys.forEach(key => {
    sorted[key] = obj[key];
  });
  return sorted;
}
