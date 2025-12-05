'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Lock, LogIn, Chrome, Github, Eye, EyeOff, Crown, Sparkles } from 'lucide-react'
import { Button, Card, Input, Label } from '@/components/ui'
import { useNotificationStore } from '@/stores'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const { addNotification } = useNotificationStore()

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })

      if (result?.error) {
        addNotification({
          type: 'error',
          title: 'เข้าสู่ระบบไม่สำเร็จ',
          message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
        })
      } else {
        addNotification({
          type: 'success',
          title: 'เข้าสู่ระบบสำเร็จ',
          message: 'ยินดีต้อนรับกลับมา!',
        })
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      addNotification({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: 'กรุณาลองใหม่อีกครั้ง',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignIn = (provider: 'google' | 'github') => {
    signIn(provider, { callbackUrl })
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Gold Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <Image
                src="/images/logo.png"
                alt="Soft Stop Shop"
                width={64}
                height={64}
                className="rounded-2xl shadow-2xl shadow-amber-500/30"
              />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center animate-bounce">
                <Sparkles className="w-3 h-3 text-black" />
              </div>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-gradient mb-2">ยินดีต้อนรับกลับมา</h1>
          <p className="text-zinc-400">เข้าสู่ระบบเพื่อจัดการบัญชีของคุณ</p>
        </div>

        {/* Login Card */}
        <Card variant="luxury" className="p-8 backdrop-blur-xl">
          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => handleOAuthSignIn('google')}
              disabled={loading}
              className="border-amber-500/30 hover:border-amber-500/50 hover:bg-amber-500/10"
            >
              <Chrome className="w-5 h-5 mr-2 text-amber-400" />
              <span className="text-amber-100">Google</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOAuthSignIn('github')}
              disabled={loading}
              className="border-amber-500/30 hover:border-amber-500/50 hover:bg-amber-500/10"
            >
              <Github className="w-5 h-5 mr-2 text-amber-400" />
              <span className="text-amber-100">GitHub</span>
            </Button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-amber-500/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-zinc-900 px-3 text-zinc-500">หรือใช้อีเมล</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">อีเมล</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500/50" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 bg-zinc-900/50 border-zinc-800 focus:border-amber-500 text-white placeholder:text-zinc-600"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-zinc-300">รหัสผ่าน</Label>
                <Link href="/auth/forgot-password" className="text-sm text-amber-400 hover:text-amber-300 transition-colors">
                  ลืมรหัสผ่าน?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500/50" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10 bg-zinc-900/50 border-zinc-800 focus:border-amber-500 text-white placeholder:text-zinc-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-amber-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-full"
              isLoading={loading}
            >
              <LogIn className="w-5 h-5 mr-2" />
              เข้าสู่ระบบ
            </Button>
          </form>

          {/* Register Link */}
          <p className="text-center mt-8 text-zinc-400">
            ยังไม่มีบัญชี?{' '}
            <Link href="/auth/register" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
              สมัครสมาชิก
            </Link>
          </p>
        </Card>

        {/* Back to Home */}
        <p className="text-center mt-6">
          <Link href="/" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
            ← กลับหน้าแรก
          </Link>
        </p>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin h-10 w-10 border-4 border-amber-500 rounded-full border-t-transparent" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
