"use client"

import { useEffect, useState } from 'react'

interface UseCounterAnimationProps {
  end: number
  start?: number
  duration?: number
  delay?: number
}

export function useCounterAnimation({ 
  end, 
  start = 0, 
  duration = 2000, 
  delay = 0 
}: UseCounterAnimationProps) {
  const [count, setCount] = useState(start)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    let startTime: number
    let animationId: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp + delay

      if (timestamp < startTime) {
        animationId = requestAnimationFrame(animate)
        return
      }

      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      // Sử dụng easing function để tạo hiệu ứng mượt mà
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = start + (end - start) * easeOutQuart

      setCount(Math.floor(currentCount))

      if (progress < 1) {
        animationId = requestAnimationFrame(animate)
      } else {
        setCount(end)
        setIsAnimating(false)
      }
    }

    setIsAnimating(true)
    animationId = requestAnimationFrame(animate)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [end, start, duration, delay])

  return { count, isAnimating }
}

// Hook để format số tiền Việt Nam
export function useAnimatedCurrency(value: number, delay?: number) {
  const { count } = useCounterAnimation({ end: value, delay })
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('₫', '₫')
  }

  return formatCurrency(count)
}

// Hook để format số nguyên với dấu phẩy
export function useAnimatedNumber(value: number, delay?: number) {
  const { count } = useCounterAnimation({ end: value, delay })
  
  return new Intl.NumberFormat('vi-VN').format(count)
}

// Hook để format phần trăm
export function useAnimatedPercentage(value: number, decimals = 1, delay?: number) {
  const { count } = useCounterAnimation({ 
    end: value * 100, 
    delay 
  })
  
  return (count / 100).toFixed(decimals) + '%'
}

// Hook để format rating
export function useAnimatedRating(value: number, delay?: number) {
  const { count } = useCounterAnimation({ 
    end: value * 10, 
    delay 
  })
  
  return (count / 10).toFixed(1)
}
