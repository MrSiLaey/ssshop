'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { X, Gift, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui'

interface Prize {
  id: string
  name: string
  description?: string
  type: string
  value: number
  color: string
  textColor: string
  icon?: string
}

interface SpinWheelProps {
  prizes: Prize[]
  onClose?: () => void
  wheelName?: string
  wheelDescription?: string
}

export function SpinWheel({ prizes, onClose, wheelName, wheelDescription }: SpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState<{
    prize: Prize | null
    couponCode: string | null
    couponExpiresAt: string | null
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('spin-session-id')
      if (!id) {
        id = 'session-' + Math.random().toString(36).substring(2, 15)
        localStorage.setItem('spin-session-id', id)
      }
      return id
    }
    return ''
  })

  const segmentAngle = 360 / prizes.length

  // วาดวงล้อ
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || prizes.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 10

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw segments
    prizes.forEach((prize, index) => {
      const startAngle = (index * segmentAngle - 90) * (Math.PI / 180)
      const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180)

      // Draw segment
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = prize.color
      ctx.fill()

      // Draw border
      ctx.strokeStyle = '#333'
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw text
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(startAngle + (segmentAngle * Math.PI) / 360)
      ctx.textAlign = 'right'
      ctx.fillStyle = prize.textColor
      ctx.font = 'bold 14px sans-serif'
      
      // Format prize text
      let prizeText = prize.name
      if (prize.type === 'DISCOUNT_FIXED' || prize.type === 'CASHBACK') {
        prizeText = `฿${prize.value}`
      } else if (prize.type === 'DISCOUNT_PERCENT') {
        prizeText = `${prize.value}%`
      }
      
      ctx.fillText(prizeText, radius - 20, 5)
      ctx.restore()
    })

    // Draw center circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, 40, 0, 2 * Math.PI)
    ctx.fillStyle = '#1a1a2e'
    ctx.fill()
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 3
    ctx.stroke()

    // Draw center text
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 16px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('หมุน', centerX, centerY)

  }, [prizes, segmentAngle])

  const spin = useCallback(async () => {
    if (isSpinning) return
    
    setIsSpinning(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/spin-wheel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId,
        },
        body: JSON.stringify({ sessionId }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 429) {
          setError(data.error)
          if (data.remainingSeconds) {
            setCountdown(data.remainingSeconds)
          }
        } else {
          setError(data.error || 'เกิดข้อผิดพลาด')
        }
        setIsSpinning(false)
        return
      }

      // คำนวณมุมหมุน
      const prizeIndex = data.prizeIndex
      const extraSpins = 5 + Math.floor(Math.random() * 3) // หมุน 5-7 รอบ
      const targetAngle = 360 - (prizeIndex * segmentAngle + segmentAngle / 2)
      const totalRotation = extraSpins * 360 + targetAngle
      
      setRotation(prev => prev + totalRotation)

      // รอ animation เสร็จ
      setTimeout(() => {
        setIsSpinning(false)
        setResult({
          prize: data.prize,
          couponCode: data.couponCode,
          couponExpiresAt: data.couponExpiresAt,
        })
      }, 5000)

    } catch (err) {
      console.error('Spin error:', err)
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ')
      setIsSpinning(false)
    }
  }, [isSpinning, segmentAngle, sessionId])

  // Countdown timer
  useEffect(() => {
    if (countdown === null || countdown <= 0) return
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer)
          return null
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const copyCode = () => {
    if (result?.couponCode) {
      navigator.clipboard.writeText(result.couponCode)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative max-w-lg w-full mx-4 bg-linear-to-b from-gray-900 to-black rounded-2xl p-6 shadow-2xl border border-gray-700">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="text-yellow-400" size={24} />
            <h2 className="text-2xl font-bold text-yellow-400">
              {wheelName || 'วงล้อนำโชค'}
            </h2>
            <Sparkles className="text-yellow-400" size={24} />
          </div>
          <p className="text-gray-300">
            {wheelDescription || 'หมุนเพื่อรับส่วนลดพิเศษ!'}
          </p>
        </div>

        {/* Result Modal */}
        {result && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/90 rounded-2xl">
            <div className="text-center p-8">
              {result.prize && result.prize.type !== 'NO_PRIZE' ? (
                <>
                  <div className="mb-4">
                    <Gift className="w-16 h-16 text-yellow-400 mx-auto animate-bounce" />
                  </div>
                  <h3 className="text-2xl font-bold text-yellow-400 mb-2">
                    🎉 ยินดีด้วย! 🎉
                  </h3>
                  <p className="text-xl text-white mb-4">
                    คุณได้รับ {result.prize.name}
                  </p>
                  {result.couponCode && (
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                      <p className="text-gray-400 text-sm mb-2">รหัสคูปอง:</p>
                      <div className="flex items-center justify-center gap-2">
                        <code className="text-xl font-mono text-orange-400 bg-gray-900 px-4 py-2 rounded">
                          {result.couponCode}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={copyCode}
                          className="text-white border-white"
                        >
                          คัดลอก
                        </Button>
                      </div>
                      {result.couponExpiresAt && (
                        <p className="text-gray-500 text-sm mt-2">
                          หมดอายุ: {new Date(result.couponExpiresAt).toLocaleDateString('th-TH')}
                        </p>
                      )}
                    </div>
                  )}
                  <Button onClick={onClose} className="bg-orange-500 hover:bg-orange-600 text-white">
                    ใช้เลย!
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-gray-400 mb-4">
                    เสียใจด้วย 😢
                  </h3>
                  <p className="text-gray-300 mb-4">
                    ไม่ถูกรางวัลในรอบนี้<br />ลองใหม่ในครั้งหน้านะ!
                  </p>
                  <Button onClick={onClose} variant="outline" className="text-white border-white">
                    ปิด
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Wheel Container */}
        <div className="relative flex justify-center mb-6">
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
            <div className="w-0 h-0 border-l-15 border-l-transparent border-r-15 border-r-transparent border-t-30 border-t-orange-500 drop-shadow-lg" />
          </div>

          {/* Wheel */}
          <div
            className="transition-transform duration-5000 ease-out"
            style={{
              transform: `rotate(${rotation}deg)`,
              transitionDuration: isSpinning ? '5s' : '0s',
              transitionTimingFunction: 'cubic-bezier(0.17, 0.67, 0.12, 0.99)',
            }}
          >
            <canvas
              ref={canvasRef}
              width={320}
              height={320}
              className="rounded-full shadow-lg border-4 border-gray-600"
            />
          </div>

          {/* Center button overlay */}
          <button
            onClick={spin}
            disabled={isSpinning || countdown !== null}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-linear-to-b from-gray-700 to-gray-900 border-4 border-gray-500 flex items-center justify-center text-white font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
          >
            หมุน
          </button>
        </div>

        {/* Error / Countdown */}
        {error && (
          <div className="text-center mb-4">
            <p className="text-red-400">{error}</p>
            {countdown !== null && (
              <p className="text-yellow-400 text-lg font-mono mt-2">
                หมุนได้อีกใน: {formatTime(countdown)}
              </p>
            )}
          </div>
        )}

        {/* Spin Button */}
        <Button
          onClick={spin}
          disabled={isSpinning || countdown !== null}
          className="w-full bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 text-lg disabled:opacity-50 rounded-full shadow-lg"
        >
          {isSpinning ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">🎡</span>
              กำลังหมุน...
            </span>
          ) : countdown !== null ? (
            `หมุนได้อีกใน ${formatTime(countdown)}`
          ) : (
            'หมุนเลย!'
          )}
        </Button>

        {/* Terms */}
        <p className="text-center text-gray-500 text-xs mt-4">
          เพื่อการอธิบายเท่านั้น ทุกคนสามารถได้รับผลลัพธ์ที่ดีที่สุด
        </p>
      </div>
    </div>
  )
}

export default SpinWheel
