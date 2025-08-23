import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Mail, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 2000)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle>Kiểm tra email của bạn</CardTitle>
            <CardDescription>
              Chúng tôi đã gửi liên kết đặt lại mật khẩu đến email của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                Nếu không thấy email, hãy kiểm tra thư mục spam hoặc thử lại sau vài phút.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/sign-in">Quay lại đăng nhập</Link>
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setIsSubmitted(false)}
              >
                Gửi lại email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Button asChild variant="ghost" size="sm" className="w-fit -ml-3 mb-2">
            <Link href="/sign-in">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Link>
          </Button>
          <CardTitle>Quên mật khẩu?</CardTitle>
          <CardDescription>
            Nhập email của bạn và chúng tôi sẽ gửi liên kết đặt lại mật khẩu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading || !email}
            >
              {isLoading ? "Đang gửi..." : "Gửi liên kết đặt lại"}
            </Button>
            
            <div className="text-center">
              <span className="text-sm text-muted-foreground">
                Nhớ mật khẩu rồi?{" "}
                <Link href="/sign-in" className="font-medium text-primary hover:underline">
                  Đăng nhập
                </Link>
              </span>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
