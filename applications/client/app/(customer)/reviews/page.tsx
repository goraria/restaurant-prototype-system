"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, MessageCircle, ThumbsUp, Filter, Calendar, User } from "lucide-react"

interface Review {
  id: string
  customerName: string
  rating: number
  title: string
  comment: string
  date: string
  verified: boolean
  helpful: number
  category: string
  photos?: string[]
  response?: {
    author: string
    message: string
    date: string
  }
}

export default function ReviewsPage() {
  const [sortBy, setSortBy] = useState("latest")
  const [filterRating, setFilterRating] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: "",
    comment: "",
    category: ""
  })

  const reviews: Review[] = [
    {
      id: "1",
      customerName: "Nguyễn Văn A",
      rating: 5,
      title: "Món ăn tuyệt vời, phục vụ chu đáo",
      comment: "Đã đến nhà hàng nhiều lần và lần nào cũng rất hài lòng. Phở bò đặc biệt ngon tuyệt, nước dùng đậm đà, thịt bò tươi ngon. Nhân viên phục vụ nhiệt tình, thân thiện. Sẽ tiếp tục ủng hộ!",
      date: "2025-08-20",
      verified: true,
      helpful: 23,
      category: "Món ăn",
      photos: ["/images/reviews/review-1.jpg"],
      response: {
        author: "Quản lý nhà hàng",
        message: "Cảm ơn anh đã ủng hộ nhà hàng! Chúng tôi rất vui khi anh hài lòng với dịch vụ.",
        date: "2025-08-21"
      }
    },
    {
      id: "2",
      customerName: "Trần Thị B",
      rating: 4,
      title: "Không gian đẹp, giá cả hợp lý",
      comment: "Nhà hàng có không gian rất đẹp, trang trí theo phong cách truyền thống Việt Nam. Món ăn ngon, giá cả phải chăng. Chỉ có điều hơi ồn vào giờ cao điểm, nhưng nhìn chung rất tốt.",
      date: "2025-08-18",
      verified: true,
      helpful: 15,
      category: "Không gian",
      photos: ["/images/reviews/review-2.jpg", "/images/reviews/review-2b.jpg"]
    },
    {
      id: "3",
      customerName: "Lê Minh C",
      rating: 5,
      title: "Dịch vụ xuất sắc!",
      comment: "Lần đầu đến nhà hàng để tổ chức sinh nhật cho con. Đội ngũ nhân viên rất chu đáo, hỗ trợ trang trí bàn rất đẹp. Con rất thích không gian và món ăn. Chắc chắn sẽ quay lại!",
      date: "2025-08-15",
      verified: true,
      helpful: 31,
      category: "Dịch vụ",
      response: {
        author: "Chef Nguyễn",
        message: "Cảm ơn chú đã tin tương và chọn nhà hàng cho buổi sinh nhật của bé! Chúc bé luôn khỏe mạnh và hạnh phúc!",
        date: "2025-08-16"
      }
    },
    {
      id: "4",
      customerName: "Phạm Văn D",
      rating: 3,
      title: "Món ăn ngon nhưng chờ hơi lâu",
      comment: "Gọi món chờ khoảng 25 phút mới có, hơi lâu so với mong đợi. Tuy nhiên món ăn khi ra thì rất ngon, nóng hổi. Có lẽ do giờ cao điểm nên bếp hơi bận.",
      date: "2025-08-12",
      verified: false,
      helpful: 8,
      category: "Món ăn",
      response: {
        author: "Quản lý nhà hàng",
        message: "Cảm ơn anh đã góp ý. Chúng tôi sẽ cải thiện tốc độ phục vụ trong giờ cao điểm.",
        date: "2025-08-13"
      }
    },
    {
      id: "5",
      customerName: "Hoàng Thị E",
      rating: 5,
      title: "Quán cà phê yêu thích",
      comment: "Cà phê sữa đá ở đây ngon nhất quận! Vị đậm đà, thơm ngon đúng chuẩn cà phê phin truyền thống. Giá cả hợp lý, nhân viên dễ thương. Sẽ giới thiệu bạn bè đến thử.",
      date: "2025-08-10",
      verified: true,
      helpful: 19,
      category: "Đồ uống"
    }
  ]

  const categories = ["Tất cả", "Món ăn", "Dịch vụ", "Không gian", "Đồ uống", "Giá cả"]
  
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(review => review.rating === rating).length,
    percentage: (reviews.filter(review => review.rating === rating).length / reviews.length) * 100
  }))

  const filteredReviews = reviews.filter(review => {
    const matchesRating = filterRating === "all" || review.rating.toString() === filterRating
    const matchesCategory = filterCategory === "all" || review.category === filterCategory
    return matchesRating && matchesCategory
  })

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case "latest":
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case "highest":
        return b.rating - a.rating
      case "lowest":
        return a.rating - b.rating
      case "helpful":
        return b.helpful - a.helpful
      default:
        return 0
    }
  })

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    // Logic submit review
    console.log("New review:", newReview)
    // Reset form
    setNewReview({ rating: 0, title: "", comment: "", category: "" })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Đánh Giá Khách Hàng</h1>
          <p className="text-xl opacity-90">
            Chia sẻ trải nghiệm của bạn và đọc những đánh giá thật từ khách hàng khác
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Review Summary */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-orange-600 mb-2">
                      {averageRating.toFixed(1)}
                    </div>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-6 w-6 ${i < Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground">
                      Dựa trên {reviews.length} đánh giá
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    {ratingDistribution.map(({ rating, count, percentage }) => (
                      <div key={rating} className="flex items-center gap-2">
                        <span className="w-4 text-sm">{rating}</span>
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-8 text-sm text-muted-foreground">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Mới nhất</SelectItem>
                  <SelectItem value="oldest">Cũ nhất</SelectItem>
                  <SelectItem value="highest">Đánh giá cao nhất</SelectItem>
                  <SelectItem value="lowest">Đánh giá thấp nhất</SelectItem>
                  <SelectItem value="helpful">Hữu ích nhất</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Số sao" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="5">5 sao</SelectItem>
                  <SelectItem value="4">4 sao</SelectItem>
                  <SelectItem value="3">3 sao</SelectItem>
                  <SelectItem value="2">2 sao</SelectItem>
                  <SelectItem value="1">1 sao</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category === "Tất cả" ? "all" : category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {sortedReviews.map((review) => (
                <Card key={review.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{review.customerName}</span>
                            {review.verified && (
                              <Badge variant="secondary" className="text-xs">
                                Đã xác thực
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{new Date(review.date).toLocaleDateString('vi-VN')}</span>
                            <Badge variant="outline" className="text-xs">
                              {review.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>

                    <h3 className="font-bold text-lg mb-3">{review.title}</h3>
                    <p className="text-muted-foreground mb-4">{review.comment}</p>

                    {/* Photos */}
                    {review.photos && review.photos.length > 0 && (
                      <div className="flex gap-2 mb-4">
                        {review.photos.map((photo, index) => (
                          <div key={index} className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                            <MessageCircle className="h-6 w-6 text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Hữu ích ({review.helpful})
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Trả lời
                      </Button>
                    </div>

                    {/* Response */}
                    {review.response && (
                      <div className="mt-4 p-4 bg-muted/50 rounded-lg border-l-4 border-orange-500">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-sm">{review.response.author}</span>
                          <Badge variant="secondary" className="text-xs">Phản hồi</Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(review.response.date).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        <p className="text-sm">{review.response.message}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <Button variant="outline">Xem thêm đánh giá</Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Write Review */}
            <Card>
              <CardHeader>
                <CardTitle>Viết đánh giá</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Đánh giá</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Button
                          key={rating}
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="p-1"
                          onClick={() => setNewReview({...newReview, rating})}
                        >
                          <Star 
                            className={`h-6 w-6 ${rating <= newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                          />
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Danh mục</label>
                    <Select value={newReview.category} onValueChange={(value) => setNewReview({...newReview, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Tiêu đề</label>
                    <Input
                      placeholder="Tóm tắt trải nghiệm của bạn"
                      value={newReview.title}
                      onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Nội dung</label>
                    <Textarea
                      placeholder="Chia sẻ chi tiết về trải nghiệm..."
                      value={newReview.comment}
                      onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                      rows={4}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Gửi đánh giá
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Thống kê nhanh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tổng đánh giá:</span>
                  <span className="font-medium">{reviews.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Đã xác thực:</span>
                  <span className="font-medium">{reviews.filter(r => r.verified).length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Có phản hồi:</span>
                  <span className="font-medium">{reviews.filter(r => r.response).length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Có hình ảnh:</span>
                  <span className="font-medium">{reviews.filter(r => r.photos?.length).length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Review Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle>Hướng dẫn đánh giá</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Chia sẻ trải nghiệm thật của bạn</p>
                <p>• Đánh giá công bằng và khách quan</p>
                <p>• Tránh ngôn từ thô tục, xúc phạm</p>
                <p>• Có thể đính kèm hình ảnh</p>
                <p>• Đánh giá sẽ được duyệt trước khi hiển thị</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
