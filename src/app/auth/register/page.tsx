'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, UserPlus, Chrome, Github, Eye, EyeOff, Check, Crown } from 'lucide-react'
import { Button, Card, Input, Label } from '@/components/ui'
import { useNotificationStore } from '@/stores'

export default function RegisterPage() {
  const router = useRouter()
  const { addNotification } = useNotificationStore()

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
  }

  const passwordRequirements = [
    { label: 'อย่างน้อย 8 ตัวอักษร', met: formData.password.length >= 8 },
    { label: 'มีตัวอักษรพิมพ์ใหญ่', met: /[A-Z]/.test(formData.password) },
    { label: 'มีตัวเลข', met: /[0-9]/.test(formData.password) },
  ]

  const isPasswordValid = passwordRequirements.every((r) => r.met)
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isPasswordValid) {
      addNotification({
        type: 'error',
        title: 'รหัสผ่านไม่ถูกต้อง',
        message: 'กรุณาตั้งรหัสผ่านตามเงื่อนไขที่กำหนด',
      })
      return
    }

    if (!passwordsMatch) {
      addNotification({
        type: 'error',
        title: 'รหัสผ่านไม่ตรงกัน',
        message: 'กรุณาตรวจสอบรหัสผ่านอีกครั้ง',
      })
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Registration failed')
      }

      addNotification({
        type: 'success',
        title: 'สมัครสมาชิกสำเร็จ',
        message: 'กรุณาเข้าสู่ระบบด้วยบัญชีใหม่ของคุณ',
      })

      router.push('/auth/login')
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'สมัครสมาชิกไม่สำเร็จ',
        message: error.message === 'User already exists' ? 'อีเมลนี้มีผู้ใช้งานแล้ว' : 'กรุณาลองใหม่อีกครั้ง',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center space-x-3">
            <Image
              src="/images/logo.png"
              alt="Soft Stop Shop"
              width={48}
              height={48}
              className="rounded-xl shadow-lg shadow-amber-500/30"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-transparent bg-clip-text">
              Soft Stop Shop
            </span>
          </Link>
        </div>

        <Card variant="luxury" className="p-8 border border-primary/20">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">สมัครสมาชิก</h1>
            <p className="text-muted-foreground">สร้างบัญชีใหม่เพื่อเริ่มช็อปปิ้ง</p>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button variant="outline" disabled={loading}>
              <Chrome className="w-5 h-5 mr-2" />
              Google
            </Button>
            <Button variant="outline" disabled={loading}>
              <Github className="w-5 h-5 mr-2" />
              GitHub
            </Button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-card text-muted-foreground">หรือ</span>
            </div>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">ชื่อ-นามสกุล</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="กรอกชื่อของคุณ"
                icon={<User className="h-4 w-4" />}
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">อีเมล</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                icon={<Mail className="h-4 w-4" />}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">รหัสผ่าน</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  icon={<Lock className="h-4 w-4" />}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              {/* Password Requirements */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        req.met ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                      }`}>
                        {req.met && <Check className="w-3 h-3" />}
                      </div>
                      <span className={req.met ? 'text-primary' : 'text-muted-foreground'}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                icon={<Lock className="h-4 w-4" />}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              {formData.confirmPassword && !passwordsMatch && (
                <p className="text-xs text-red-400 mt-1">รหัสผ่านไม่ตรงกัน</p>
              )}
            </div>

            <div className="flex items-start gap-3">
              <input
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={handleChange}
                required
                className="mt-1 w-4 h-4 rounded border-border bg-input text-primary focus:ring-primary"
              />
              <label htmlFor="acceptTerms" className="text-sm text-muted-foreground">
                ฉันยอมรับ{' '}
                <Link href="/terms" className="text-primary hover:underline">
                  ข้อกำหนดการใช้งาน
                </Link>{' '}
                และ{' '}
                <Link href="/privacy" className="text-primary hover:underline">
                  นโยบายความเป็นส่วนตัว
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              variant="gold"
              disabled={loading || !formData.acceptTerms || !isPasswordValid || !passwordsMatch}
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  กำลังสมัครสมาชิก...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  สมัครสมาชิก
                </>
              )}
            </Button>
          </form>

          {/* Login Link */}
          <p className="text-center mt-6 text-muted-foreground">
            มีบัญชีอยู่แล้ว?{' '}
            <Link href="/auth/login" className="text-primary hover:text-primary/80 font-medium">
              เข้าสู่ระบบ
            </Link>
          </p>
        </Card>

        {/* Back to Home */}
        <p className="text-center mt-6">
          <Link href="/" className="text-muted-foreground hover:text-foreground text-sm">
            ← กลับหน้าแรก
          </Link>
        </p>
      </div>
    </main>
  )
}
