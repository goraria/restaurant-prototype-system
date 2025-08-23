import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// VNPay configuration
const VNP_TMN_CODE = process.env.VNP_TMN_CODE || 'DEMO123'
const VNP_HASH_SECRET = process.env.VNP_HASH_SECRET || 'DEMO_HASH_SECRET'
const VNP_URL = process.env.VNP_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'
const VNP_RETURN_URL = process.env.VNP_RETURN_URL || 'http://localhost:3000/customer/payment/vnpay/callback'

function sortObject(obj: Record<string, string | number>) {
  const sorted: Record<string, string | number> = {}
  const str = []
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key))
    }
  }
  str.sort()
  for (let key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+')
  }
  return sorted
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, amount, orderDescription, bankCode } = body

    // Validate required fields
    if (!orderId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId, amount' },
        { status: 400 }
      )
    }

    // VNPay parameters
    const date = new Date()
    const createDate = date.toISOString().replace(/[-T:]/g, '').split('.')[0]
    const expireDate = new Date(date.getTime() + 15 * 60 * 1000).toISOString().replace(/[-T:]/g, '').split('.')[0]

    let vnp_Params: Record<string, string | number> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: VNP_TMN_CODE,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderDescription || `Thanh toan don hang ${orderId}`,
      vnp_OrderType: 'other',
      vnp_Amount: amount * 100, // VNPay requires amount in VND cents
      vnp_ReturnUrl: VNP_RETURN_URL,
      vnp_IpAddr: request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') || 
                  '127.0.0.1',
      vnp_CreateDate: createDate,
      vnp_ExpireDate: expireDate
    }

    if (bankCode && bankCode !== '') {
      vnp_Params['vnp_BankCode'] = bankCode
    }

    // Sort parameters
    vnp_Params = sortObject(vnp_Params)

    // Create query string
    let signData = ''
    const querystring = []
    for (const key in vnp_Params) {
      querystring.push(key + '=' + vnp_Params[key])
      signData += key + '=' + vnp_Params[key] + '&'
    }
    signData = signData.slice(0, -1) // Remove last &

    // Create secure hash
    const hmac = crypto.createHmac('sha512', VNP_HASH_SECRET)
    const vnpSecureHash = hmac.update(signData, 'utf-8').digest('hex')
    querystring.push('vnp_SecureHash=' + vnpSecureHash)

    // Final payment URL
    const paymentUrl = VNP_URL + '?' + querystring.join('&')

    return NextResponse.json({
      success: true,
      paymentUrl,
      orderId,
      amount
    })

  } catch (error) {
    console.error('VNPay payment creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
