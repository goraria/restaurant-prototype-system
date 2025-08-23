import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// ZaloPay configuration
const ZALO_APP_ID = process.env.ZALO_APP_ID || '2553'
const ZALO_KEY1 = process.env.ZALO_KEY1 || 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL'
const ZALO_ENDPOINT = process.env.ZALO_ENDPOINT || 'https://sb-openapi.zalopay.vn/v2/create'

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

    const transID = Date.now().toString()
    const embedData = JSON.stringify({
      redirecturl: `${process.env.NEXT_PUBLIC_BASE_URL}/customer/payment/zalopay/callback`
    })

    const items = JSON.stringify([{
      itemid: "food_item",
      itemname: description || "Đơn hàng",
      itemprice: amount,
      itemquantity: 1
    }])

    const order: Record<string, string> = {
      app_id: ZALO_APP_ID,
      app_trans_id: `${new Date().toISOString().slice(0, 6).replace(/-/g, '')}_${transID}`,
      app_user: "user123",
      app_time: Date.now().toString(),
      amount: amount.toString(),
      description: description || `Thanh toán đơn hàng ${orderId}`,
      bank_code: "",
      item: items,
      embed_data: embedData,
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/zalopay/callback`
    }

    // Create MAC
    const data = `${order.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`
    order.mac = crypto.createHmac('sha256', ZALO_KEY1).update(data).digest('hex')

    // Make request to ZaloPay
    const response = await fetch(ZALO_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(order)
    })

    const result = await response.json()

    if (result.return_code === 1) {
      return NextResponse.json({
        success: true,
        paymentUrl: result.order_url,
        orderId,
        amount,
        zaloTransId: order.app_trans_id
      })
    } else {
      return NextResponse.json(
        { error: 'ZaloPay order creation failed', details: result },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('ZaloPay payment creation error:', error)
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
