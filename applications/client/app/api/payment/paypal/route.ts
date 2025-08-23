import { NextRequest, NextResponse } from 'next/server'

// PayPal configuration
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || 'demo_client_id'
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || 'demo_client_secret'
const PAYPAL_BASE_URL = process.env.PAYPAL_BASE_URL || 'https://api.sandbox.paypal.com'

async function getPayPalAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64')
  
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  })

  const data = await response.json()
  return data.access_token
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, amount, description, currency = 'USD' } = body

    // Validate required fields
    if (!orderId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId, amount' },
        { status: 400 }
      )
    }

    // Convert VND to USD for PayPal (approximate rate: 1 USD = 24000 VND)
    const usdAmount = currency === 'VND' ? (amount / 24000).toFixed(2) : amount.toFixed(2)

    // Get access token
    const accessToken = await getPayPalAccessToken()

    const order = {
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: orderId,
        amount: {
          currency_code: 'USD',
          value: usdAmount
        },
        description: description || `Payment for order ${orderId}`
      }],
      application_context: {
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/customer/payment/paypal/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/customer/payment/paypal/cancel`,
        brand_name: 'Restaurant',
        locale: 'en-US',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW'
      }
    }

    // Create PayPal order
    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(order)
    })

    const result = await response.json()

    if (result.status === 'CREATED') {
      const approveLink = result.links.find((link: { rel: string }) => link.rel === 'approve')
      
      return NextResponse.json({
        success: true,
        paymentUrl: approveLink.href,
        orderId,
        amount: usdAmount,
        paypalOrderId: result.id
      })
    } else {
      return NextResponse.json(
        { error: 'PayPal order creation failed', details: result },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('PayPal payment creation error:', error)
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
