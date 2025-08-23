import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// MoMo configuration
const MOMO_PARTNER_CODE = process.env.MOMO_PARTNER_CODE || 'MOMO'
const MOMO_ACCESS_KEY = process.env.MOMO_ACCESS_KEY || 'F8BBA842ECF85'
const MOMO_SECRET_KEY = process.env.MOMO_SECRET_KEY || 'K951B6PE1waDMi640xX08PD3vg6EkVlz'
const MOMO_ENDPOINT = process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/create'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, amount, description } = body

    // Validate required fields
    if (!orderId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId, amount' },
        { status: 400 }
      )
    }

    const requestId = orderId + '_' + Date.now()
    const orderInfo = description || `Thanh toán đơn hàng ${orderId}`
    const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/customer/payment/momo/callback`
    const ipnUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/momo/callback`
    const requestType = "payWithATM"
    const extraData = ""

    // Create signature
    const rawSignature = `accessKey=${MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${MOMO_PARTNER_CODE}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`
    
    const signature = crypto
      .createHmac('sha256', MOMO_SECRET_KEY)
      .update(rawSignature)
      .digest('hex')

    const requestBody = {
      partnerCode: MOMO_PARTNER_CODE,
      partnerName: "Restaurant",
      storeId: "MomoTestStore",
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: "vi",
      requestType: requestType,
      autoCapture: true,
      extraData: extraData,
      signature: signature
    }

    // Make request to MoMo
    const response = await fetch(MOMO_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    const result = await response.json()

    if (result.resultCode === 0) {
      return NextResponse.json({
        success: true,
        paymentUrl: result.payUrl,
        orderId,
        amount,
        momoRequestId: requestId
      })
    } else {
      return NextResponse.json(
        { error: 'MoMo order creation failed', details: result },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('MoMo payment creation error:', error)
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
