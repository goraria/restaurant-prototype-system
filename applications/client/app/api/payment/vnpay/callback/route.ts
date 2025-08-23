import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// VNPay callback handler
const VNP_HASH_SECRET = process.env.VNP_HASH_SECRET || 'DEMO_HASH_SECRET'

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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const vnp_Params: Record<string, string> = {}

    // Extract all VNPay parameters
    searchParams.forEach((value, key) => {
      vnp_Params[key] = value
    })

    const secureHash = vnp_Params['vnp_SecureHash']
    delete vnp_Params['vnp_SecureHash']
    delete vnp_Params['vnp_SecureHashType']

    // Sort parameters
    const sortedParams = sortObject(vnp_Params)

    // Create verification string
    let signData = ''
    for (const key in sortedParams) {
      signData += key + '=' + sortedParams[key] + '&'
    }
    signData = signData.slice(0, -1) // Remove last &

    // Verify secure hash
    const hmac = crypto.createHmac('sha512', VNP_HASH_SECRET)
    const checkSum = hmac.update(signData, 'utf-8').digest('hex')

    const orderId = vnp_Params['vnp_TxnRef']
    const amount = parseInt(vnp_Params['vnp_Amount']) / 100 // Convert from VND cents
    const responseCode = vnp_Params['vnp_ResponseCode']

    if (secureHash === checkSum) {
      // Signature is valid
      if (responseCode === '00') {
        // Payment successful
        return NextResponse.redirect(
          new URL(`/customer/payment/success?orderId=${orderId}&amount=${amount}&method=VNPay`, request.url)
        )
      } else {
        // Payment failed
        const errorCode = getErrorCode(responseCode)
        return NextResponse.redirect(
          new URL(`/customer/payment/failure?orderId=${orderId}&amount=${amount}&error=${errorCode}`, request.url)
        )
      }
    } else {
      // Invalid signature
      return NextResponse.redirect(
        new URL(`/customer/payment/failure?orderId=${orderId}&amount=${amount}&error=invalid_signature`, request.url)
      )
    }

  } catch (error) {
    console.error('VNPay callback error:', error)
    return NextResponse.redirect(
      new URL('/customer/payment/failure?error=callback_error', request.url)
    )
  }
}

function getErrorCode(vnpResponseCode: string): string {
  const errorMap: Record<string, string> = {
    '00': 'success',
    '07': 'insufficient_funds',
    '09': 'invalid_card',
    '10': 'invalid_card',
    '11': 'timeout',
    '12': 'invalid_card',
    '13': 'invalid_amount',
    '24': 'cancelled',
    '51': 'insufficient_funds',
    '65': 'transaction_limit',
    '75': 'invalid_card',
    '79': 'timeout',
    '99': 'unknown'
  }
  
  return errorMap[vnpResponseCode] || 'unknown'
}
