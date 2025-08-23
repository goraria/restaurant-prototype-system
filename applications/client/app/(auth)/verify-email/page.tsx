"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Mail, RefreshCw, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading')
  const [isResending, setIsResending] = useState(false)
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    if (token) {
      // Simulate email verification
      setTimeout(() => {
        // Random success/error for demo
        const success = Math.random() > 0.3
        setStatus(success ? 'success' : 'error')
      }, 2000)
    } else {
      setStatus('error')
    }
  }, [token])

  const handleResendEmail = async () => {
    setIsResending(true)
    // Simulate API call
    setTimeout(() => {
      setIsResending(false)
      // Could show a toast notification here
    }, 2000)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle>Đang xác thực email...</CardTitle>
            <CardDescription>
              Vui lòng đợi trong giây lát
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle>Email đã được xác thực!</CardTitle>
            <CardDescription>
              Tài khoản của bạn đã được kích hoạt thành công
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Bây giờ bạn có thể đăng nhập và sử dụng tất cả tính năng của hệ thống.
              </AlertDescription>
            </Alert>
            
            <Button asChild className="w-full">
              <Link href="/sign-in">Đăng nhập ngay</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle>Xác thực thất bại</CardTitle>
          <CardDescription>
            {status === 'expired' 
              ? "Liên kết xác thực đã hết hạn" 
              : "Không thể xác thực email của bạn"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {status === 'expired' 
                ? "Liên kết xác thực chỉ có hiệu lực trong 24 giờ. Vui lòng yêu cầu liên kết mới."
                : "Có lỗi xảy ra khi xác thực email. Vui lòng thử lại hoặc liên hệ hỗ trợ."
              }
            </AlertDescription>
          </Alert>
          
          <div className="space-y-3">
            <Button 
              onClick={handleResendEmail}
              disabled={isResending}
              className="w-full"
            >
              {isResending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                "Gửi lại email xác thực"
              )}
            </Button>
            
            <Button asChild variant="outline" className="w-full">
              <Link href="/sign-in">Quay lại đăng nhập</Link>
            </Button>
            
            <div className="text-center">
              <Link 
                href="/contact" 
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Cần hỗ trợ? Liên hệ với chúng tôi
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
