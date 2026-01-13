'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { SpinWheel } from './SpinWheel'
import { Gift } from 'lucide-react'

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

interface WheelData {
  id: string
  name: string
  description?: string
  showOnPopup: boolean
  popupDelay: number
  prizes: Prize[]
}

export function SpinWheelPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [wheelData, setWheelData] = useState<WheelData | null>(null)
  const [canSpin, setCanSpin] = useState(false)
  const [showTrigger, setShowTrigger] = useState(false)
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

  const checkSpinStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/spin-wheel/check', {
        headers: {
          'x-session-id': sessionId,
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setCanSpin(data.canSpin)
        
        if (data.canSpin && data.showPopup) {
          // Fetch wheel data
          const wheelResponse = await fetch('/api/spin-wheel')
          if (wheelResponse.ok) {
            const wheel = await wheelResponse.json()
            setWheelData(wheel)
            setShowTrigger(true)
            
            // Auto show popup after delay
            const hasShownPopup = sessionStorage.getItem('spin-popup-shown')
            if (!hasShownPopup) {
              setTimeout(() => {
                setIsOpen(true)
                sessionStorage.setItem('spin-popup-shown', 'true')
              }, (data.popupDelay || 3) * 1000)
            }
          }
        } else if (data.wheel) {
          // มี wheel แต่หมุนไม่ได้แล้ว - ยังแสดง trigger button
          const wheelResponse = await fetch('/api/spin-wheel')
          if (wheelResponse.ok) {
            const wheel = await wheelResponse.json()
            setWheelData(wheel)
            setShowTrigger(true)
          }
        }
      }
    } catch (error) {
      console.error('Error checking spin status:', error)
    }
  }, [sessionId])

  useEffect(() => {
    checkSpinStatus()
  }, [checkSpinStatus])

  const handleClose = () => {
    setIsOpen(false)
    checkSpinStatus() // Refresh status after closing
  }

  if (!showTrigger || !wheelData) {
    return null
  }

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-40 bg-linear-to-r from-orange-500 to-red-500 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform animate-bounce"
        title="วงล้อนำโชค"
      >
        <Gift size={28} />
        {canSpin && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-ping" />
        )}
      </button>

      {/* Spin wheel modal */}
      {isOpen && wheelData.prizes.length > 0 && (
        <SpinWheel
          prizes={wheelData.prizes}
          wheelName={wheelData.name}
          wheelDescription={wheelData.description}
          onClose={handleClose}
        />
      )}
    </>
  )
}

export default SpinWheelPopup
