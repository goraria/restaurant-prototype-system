import { Request, Response } from "express";
import crypto from "crypto"
import moment from "moment";
import qs from "qs";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config()

export async function momoPayment(
  req: Request,
  res: Response
) {
  //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
  //parameters
  const accessKey = process.env.MOMO_ACCESS_KEY!;
  const secretKey = process.env.MOMO_SECRET_KEY!;
  const orderInfo = 'Japtor';
  const partnerCode = process.env.MOMO_PARTNER_CODE!;
  const partnerName = process.env.MOMO_PARTNER_NAME!;
  const redirectUrl = process.env.MOMO_REDIRECT_URL!;
  const ipnUrl = 'https://e09874c04a05.ngrok-free.app/payment/momo/callback';
  const requestType = "payWithMethod";
  const amount = '50000';
  const orderId = partnerCode + new Date().getTime();
  const requestId = orderId;
  const extraData = '';
  const paymentCode = process.env.MOMO_PAYMENT_CODE!;
  const orderGroupId = '';
  const autoCapture = true;
  const lang = 'vi';

  //before sign HMAC SHA256 with format
  //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
  // const rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
  //puts raw signature
  console.log("--------------------RAW SIGNATURE----------------")
  console.log(rawSignature)
  //signature
  // const crypto = require('crypto');
  const signature = crypto.createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');
  console.log("--------------------SIGNATURE----------------")
  console.log(signature)

  //json object send to MoMo endpoint // JSON.stringify
  const requestBody = {
    partnerCode: partnerCode,
    partnerName: partnerName,
    storeId: "MomoTestStore",
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData: extraData,
    orderGroupId: orderGroupId,
    signature: signature
  };

  const options = {
    method: 'POST',
    // port: 443,
    // hostname: 'test-payment.momo.vn',
    // path: '/v3/gateway/api/create',
    url: 'https://test-payment.momo.vn/v2/gateway/api/create',
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Length': Buffer.byteLength(JSON.stringify(requestBody))
    },
    data: requestBody
  }

  try {
    const result = await axios(options)
    return res.status(200).json(result.data)
  } catch (error) {
    return res.status(500).json(error)
  }
}

export async function momoCallback(
  req: Request,
  res: Response
) {
  console.log("Momo Callback")
  console.log(req.body)
  return res.status(200).json(req.body)
}

export async function momoTransactionStatus(
  req: Request,
  res: Response
) {
  const { orderId } = req.body;
  const accessKey = process.env.MOMO_ACCESS_KEY!;
  const secretKey = process.env.MOMO_SECRET_KEY!;
  const partnerCode = process.env.MOMO_PARTNER_CODE!;
  const partnerName = process.env.MOMO_PARTNER_NAME!;

  const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${orderId}`

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = {
    partnerCode,
    requestId: orderId,
    orderId,
    signature,
    lang: "vi"
  }

  const option = {
    method: 'POST',
    url: "https://test-payment.momo.vn/v2/gateway/api/query",
    headers: {
      'Content-Type': 'application/json',
    },
    data: requestBody
  }

  try {
    const result = await axios(option)
    return res.status(200).json(result.data)
  } catch (error) {
    return res.status(500).json(error)
  }
}

export async function zalopayPayment(
  req: Request,
  res: Response
) {
  const app_id = process.env.ZLP_MERCHANT_APP_ID;
  const key1 = process.env.ZLP_MERCHANT_KEY1;
  const key2 = process.env.ZLP_MERCHANT_KEY2;
  const endpoint = process.env.ZLP_MERCHANT_ENDPOINT;
  const gateway_endpoint = process.env.ZLP_MERCHANT_GATEWAY_ENDPOINT;
  const callback_url = process.env.ZLP_MERCHANT_CALLBACK_URL;
  const redirect_url = process.env.ZLP_REDIRECT_URL;

  const embed_data = {
    //sau khi hoàn tất thanh toán sẽ đi vào link này (thường là link web thanh toán thành công của mình)
    redirecturl: 'https://japtor.vn',
  };

  const items: never[] = [];
  const transID = Math.floor(Math.random() * 1000000);

  const order = {
    app_id: app_id,
    app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
    app_user: 'user123',
    app_time: Date.now(), // miliseconds
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    amount: Math.floor(Math.random() * 1000000),
    //khi thanh toán xong, zalopay server sẽ POST đến url này để thông báo cho server của mình
    //Chú ý: cần dùng ngrok để public url thì Zalopay Server mới call đến được
    callback_url: 'https://b074-1-53-37-194.ngrok-free.app/callback',
    description: `#${transID}`,
    bank_code: '',
    mac: ""
  };


  // appid|app_trans_id|appuser|amount|apptime|embeddata|item
  // const data =
  //   config.app_id +
  //   '|' +
  //   order.app_trans_id +
  //   '|' +
  //   order.app_user +
  //   '|' +
  //   order.amount +
  //   '|' +
  //   order.app_time +
  //   '|' +
  //   order.embed_data +
  //   '|' +
  //   order.item;
  const dataStr = `${app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
  // order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
  order.mac = crypto
    .createHmac('sha256', key1!)
    .update(dataStr)
    .digest('hex');

  try {
    const result = await axios.post(process.env.ZLP_MERCHANT_ENDPOINT!, null, { params: order });

    return res.status(200).json(result.data);
  } catch (error) {
    console.log(error);
  }
}

export async function zalopayCallback(
  req: Request,
  res: Response
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  const app_id = process.env.ZLP_MERCHANT_APP_ID;
  const key1 = process.env.ZLP_MERCHANT_KEY1;
  const key2 = process.env.ZLP_MERCHANT_KEY2;
  const endpoint = process.env.ZLP_MERCHANT_ENDPOINT;
  const gateway_endpoint = process.env.ZLP_MERCHANT_GATEWAY_ENDPOINT;

  let result = {
    return_code: -1,
    return_message: '',
  };
  
  console.log(req.body);
  
  try {
    const dataStr: string = req.body.data;
    const reqMac: string = req.body.mac;

    // Validate required fields
    if (!dataStr || !reqMac) {
      result.return_code = -1;
      result.return_message = 'Missing required data or mac';
      return res.json(result);
    }

    // Create MAC for verification
    const mac = crypto
      .createHmac('sha256', key2!)
      .update(dataStr)
      .digest('hex');
    console.log('mac =', mac);

    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.return_code = -1;
      result.return_message = 'mac not equal';
    } else {
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng ở đây
      const dataJson = JSON.parse(dataStr);
      console.log(
        "update order's status = success where app_trans_id =",
        dataJson['app_trans_id'],
      );

      result.return_code = 1;
      result.return_message = 'success';
    }
  } catch (error: any) {
    console.log('lỗi:::' + error);
    result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.return_message = error?.message || 'Unknown error';
  }

  // thông báo kết quả cho ZaloPay server
  res.json(result);
}

export async function zalopayCheckStatus(
  req: Request,
  res: Response
) {
  const app_trans_id = req.params.id;
  // const { app_trans_id } = req.body;

  const app_id = process.env.ZLP_MERCHANT_APP_ID;
  const key1 = process.env.ZLP_MERCHANT_KEY1;
  const key2 = process.env.ZLP_MERCHANT_KEY2;
  const endpoint = process.env.ZLP_MERCHANT_ENDPOINT;
  const gateway_endpoint = process.env.ZLP_MERCHANT_GATEWAY_ENDPOINT;

  let postData = {
    app_id,
    app_trans_id, // Input your app_trans_id
    mac: ""
  };

  // let data = postData.app_id + '|' + postData.app_trans_id + '|' + config.key1; // appid|app_trans_id|key1
  let dataStr = postData.app_id + '|' + postData.app_trans_id + '|' + key1; // appid|app_trans_id|key1
  // postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
  postData.mac = crypto
    .createHmac('sha256', key1!)
    .update(dataStr)
    .digest('hex');

  let postConfig = {
    method: 'post',
    url: gateway_endpoint!,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify(postData),
  };

  try {
    // const result = await axios(postConfig);
    const result = await axios(postConfig);
    console.log(result.data);
    return res.status(200).json(result.data);
    /**
     * kết quả mẫu
     {
     "return_code": 1, // 1 : Thành công, 2 : Thất bại, 3 : Đơn hàng chưa thanh toán hoặc giao dịch đang xử lý
     "return_message": "",
     "sub_return_code": 1,
     "sub_return_message": "",
     "is_processing": false,
     "amount": 50000,
     "zp_trans_id": 240331000000175,
     "server_time": 1711857138483,
     "discount_amount": 0
     }
     */
  } catch (error) {
    console.log('lỗi');
    console.log(error);
  }
}

export async function vnpayPayment(
  req: Request,
  res: Response
) {
  try {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    
    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');
    
    const ipAddr = req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.ip || 
      '127.0.0.1';

    const tmnCode = process.env.VNPAY_TMN_CODE!;
    const secretKey = process.env.VNPAY_HASH_SECRET!;
    const vnpUrl = process.env.VNPAY_URL!;
    const returnUrl = process.env.VNPAY_RETURN_URL!;
    
    // Validate required environment variables
    if (!tmnCode || !secretKey || !vnpUrl || !returnUrl) {
      return res.status(500).json({
        success: false,
        message: 'Missing VNPay configuration'
      });
    }
    
    const orderId = moment(date).format('DDHHmmss');
    const amount = req.body.amount || 100000;
    const bankCode = req.body.bankCode || '';
    const orderInfo = req.body.orderInfo || 'Thanh toan don hang';
    const orderType = req.body.orderType || 'other';
    const locale = req.body.language || 'vn';
    const currCode = 'VND';
    
    let vnp_Params: { [key: string]: string } = {
      'vnp_Version': '2.1.0',
      'vnp_Command': 'pay',
      'vnp_TmnCode': tmnCode,
      'vnp_Locale': locale,
      'vnp_CurrCode': currCode,
      'vnp_TxnRef': orderId,
      'vnp_OrderInfo': orderInfo,
      'vnp_OrderType': orderType,
      'vnp_Amount': (amount * 100).toString(),
      'vnp_ReturnUrl': returnUrl,
      'vnp_IpAddr': ipAddr as string,
      'vnp_CreateDate': createDate
    };

    // Chỉ thêm vnp_BankCode nếu có giá trị và không rỗng
    if (bankCode && bankCode.trim() !== '') {
      vnp_Params['vnp_BankCode'] = bankCode.trim();
    }

    // Sắp xếp parameters theo alphabet
    const sortedParams = Object.keys(vnp_Params).sort();
    
    let hashData = [];
    let signData = [];
    
    for (let key of sortedParams) {
      const value = vnp_Params[key];
      // signData cho signature (raw values)
      signData.push(key + '=' + value);
      // hashData cho URL (encoded values)  
      hashData.push(key + '=' + encodeURIComponent(value!));
    }

    // Tạo chữ ký với raw data (không encode)
    const signString = signData.join('&');
    const signed = crypto
      .createHmac('sha512', secretKey)
      .update(signString)
      .digest('hex');
    
    const queryString = hashData.join('&');
    const paymentUrl = vnpUrl + '?' + queryString + '&vnp_SecureHash=' + signed;
    
    res.status(200).json({
      success: true,
      paymentUrl: paymentUrl,
      orderId: orderId,
      amount: amount
    });
    
  } catch (error: any) {
    console.error('VNPay Payment Error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi tạo thanh toán VNPay',
      error: error.message
    });
  }
}

export async function vnpayCallback(
  req: Request,
  res: Response
) {
  try {
    let vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    // Sắp xếp parameters theo alphabet
    const sortedParams = Object.keys(vnp_Params).sort();
    
    let signData = [];
    for (let key of sortedParams) {
      // Sử dụng raw values (không encode) để tạo signature như lúc tạo payment
      signData.push(key + '=' + vnp_Params[key]);
    }

    const secretKey = process.env.VNPAY_HASH_SECRET!;
    const signString = signData.join('&');
    const signed = crypto
      .createHmac('sha512', secretKey)
      .update(signString)
      .digest('hex');

    const rspCode = vnp_Params['vnp_ResponseCode'];
    const txnRef = vnp_Params['vnp_TxnRef'];
    const amount = vnp_Params['vnp_Amount'];

    // Xác thực checksum
    if (secureHash === signed) {
      // Kiểm tra kết quả thanh toán
      if (rspCode === '00') {
        // Thanh toán thành công
        console.log('VNPay Payment Success:', {
          orderId: txnRef,
          amount: amount,
          transactionNo: vnp_Params['vnp_TransactionNo']
        });

        // TODO: Cập nhật trạng thái đơn hàng trong database
        
        res.status(200).json({
          success: true,
          message: 'Thanh toán thành công',
          data: {
            orderId: txnRef,
            amount: amount,
            transactionNo: vnp_Params['vnp_TransactionNo'],
            bankCode: vnp_Params['vnp_BankCode'],
            cardType: vnp_Params['vnp_CardType']
          }
        });
      } else {
        // Thanh toán thất bại
        console.log('VNPay Payment Failed:', {
          orderId: txnRef,
          responseCode: rspCode,
          message: getVNPayResponseMessage(rspCode as string)
        });

        res.status(400).json({
          success: false,
          message: 'Thanh toán thất bại',
          responseCode: rspCode,
          error: getVNPayResponseMessage(rspCode as string)
        });
      }
    } else {
      // Checksum không hợp lệ
      console.log('VNPay Invalid Checksum:', {
        expected: signed,
        received: secureHash
      });

      res.status(400).json({
        success: false,
        message: 'Chữ ký không hợp lệ'
      });
    }
  } catch (error: any) {
    console.error('VNPay Callback Error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi xử lý callback VNPay',
      error: error.message
    });
  }
}

// Helper function để map response code thành message
function getVNPayResponseMessage(responseCode: string): string {
  const messages: { [key: string]: string } = {
    '00': 'Giao dịch thành công',
    '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
    '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
    '10': 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
    '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
    '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
    '13': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.',
    '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
    '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
    '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
    '75': 'Ngân hàng thanh toán đang bảo trì.',
    '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch',
    '99': 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)'
  };
  
  return messages[responseCode] || 'Lỗi không xác định';
}