'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { 
  CreditCard, 
  QrCode, 
  Lock, 
  ShieldCheck,
  Package,
  Download,
  Check,
  Wallet,
  Banknote,
  AlertCircle
} from 'lucide-react'
import { Button, Card, Input, Label, Badge } from '@/components/ui'
import { useCartStore, useNotificationStore } from '@/stores'
import { formatCurrency } from '@/lib/utils'

type PaymentMethod = 'transfer' | 'promptpay' | 'cod'

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { items, clearCart } = useCartStore()
  const { addNotification } = useNotificationStore()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('transfer')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    address: '',
    district: '',
    province: '',
    postalCode: '',
    note: '',
  })

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const hasPhysicalProducts = items.some((item) => !item.isDigital)
  const hasDigitalProducts = items.some((item) => item.isDigital)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (status !== 'authenticated') {
      addNotification({
        type: 'error',
        title: 'กรุณาเข้าสู่ระบบ',
        message: 'คุณต้องเข้าสู่ระบบก่อนทำการสั่งซื้อ',
      })
      router.push('/auth/login?redirect=/checkout')
      return
    }

    setLoading(true)

    try {
      // Build shipping address for physical products
      const shippingAddress = hasPhysicalProducts 
        ? `${formData.address}, ${formData.district}, ${formData.province} ${formData.postalCode}`
        : null

      // Create order via API
      const orderRes = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
            isDigital: item.isDigital,
          })),
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          shippingAddress,
          paymentMethod,
          note: formData.note,
          subtotal: total,
        }),
      })

      if (!orderRes.ok) {
        const error = await orderRes.json()
        throw new Error(error.error || 'Failed to create order')
      }

      const order = await orderRes.json()

      // Clear cart after successful order
      clearCart()

      // Redirect to success page
      router.push(`/checkout/success?order_id=${order.id}`)

    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: error.message || 'ไม่สามารถดำเนินการสั่งซื้อได้ กรุณาลองใหม่อีกครั้ง',
      })
    } finally {
      setLoading(false)
    }
  }

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">ไม่มีสินค้าในตะกร้า</h1>
          <p className="text-muted-foreground mb-6">กรุณาเลือกสินค้าก่อนทำการชำระเงิน</p>
          <Link href="/shop">
            <Button variant="neon">ไปยังร้านค้า</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Prompt login if not authenticated
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">กรุณาเข้าสู่ระบบ</h1>
          <p className="text-muted-foreground mb-6">คุณต้องเข้าสู่ระบบก่อนทำการชำระเงิน</p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/login?redirect=/checkout">
              <Button variant="neon">เข้าสู่ระบบ</Button>
            </Link>
            <Link href="/auth/register?redirect=/checkout">
              <Button variant="outline" className="border-purple-500/30">สมัครสมาชิก</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-foreground mb-8">ชำระเงิน</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <Card className="p-6 border border-purple-500/20 bg-card/50 backdrop-blur-sm">
                <h2 className="text-xl font-semibold text-foreground mb-6">ข้อมูลติดต่อ</h2>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">อีเมล *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">ชื่อ-นามสกุล *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="กรอกชื่อ-นามสกุล"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="phone">เบอร์โทรศัพท์ *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="08X-XXX-XXXX"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </Card>

              {/* Shipping Address (for physical products) */}
              {hasPhysicalProducts && (
                <Card className="p-6 border border-purple-500/20 bg-card/50 backdrop-blur-sm">
                  <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-purple-400" />
                    ที่อยู่จัดส่ง
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">ที่อยู่ (บ้านเลขที่, ซอย, ถนน) *</Label>
                      <textarea
                        id="address"
                        name="address"
                        placeholder="กรอกที่อยู่จัดส่งสินค้า"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        rows={2}
                        className="w-full px-4 py-3 bg-background border border-purple-500/20 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                      />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="district">เขต/อำเภอ *</Label>
                        <Input
                          id="district"
                          name="district"
                          placeholder="เขต/อำเภอ"
                          value={formData.district}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="province">จังหวัด *</Label>
                        <Input
                          id="province"
                          name="province"
                          placeholder="จังหวัด"
                          value={formData.province}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">รหัสไปรษณีย์ *</Label>
                        <Input
                          id="postalCode"
                          name="postalCode"
                          placeholder="10XXX"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Digital Products Notice */}
              {hasDigitalProducts && (
                <Card className="p-4 border border-cyan-500/30 bg-cyan-500/10">
                  <div className="flex items-start gap-3">
                    <Download className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">สินค้าดิจิทัล</p>
                      <p className="text-sm text-muted-foreground">
                        คุณมีสินค้าดิจิทัลในตะกร้า ลิงก์ดาวน์โหลดและ License Key จะถูกส่งไปยังอีเมลของคุณทันทีหลังชำระเงินสำเร็จ
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Payment Method */}
              <Card className="p-6 border border-purple-500/20 bg-card/50 backdrop-blur-sm">
                <h2 className="text-xl font-semibold text-foreground mb-6">วิธีการชำระเงิน</h2>
                
                <div className="space-y-4">
                  {/* Bank Transfer */}
                  <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    paymentMethod === 'transfer'
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-purple-500/20 hover:border-purple-500/40'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transfer"
                      checked={paymentMethod === 'transfer'}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${
                      paymentMethod === 'transfer'
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-muted-foreground'
                    }`}>
                      {paymentMethod === 'transfer' && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <Banknote className="w-6 h-6 text-purple-400 mr-3" />
                    <div>
                      <p className="font-medium text-foreground">โอนเงินผ่านธนาคาร</p>
                      <p className="text-sm text-muted-foreground">โอนเงินแล้วแจ้งสลิป</p>
                    </div>
                  </label>

                  {/* PromptPay */}
                  <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    paymentMethod === 'promptpay'
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-purple-500/20 hover:border-purple-500/40'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="promptpay"
                      checked={paymentMethod === 'promptpay'}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${
                      paymentMethod === 'promptpay'
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-muted-foreground'
                    }`}>
                      {paymentMethod === 'promptpay' && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <QrCode className="w-6 h-6 text-purple-400 mr-3" />
                    <div>
                      <p className="font-medium text-foreground">พร้อมเพย์ (PromptPay)</p>
                      <p className="text-sm text-muted-foreground">สแกน QR Code เพื่อชำระเงิน</p>
                    </div>
                  </label>

                  {/* Cash on Delivery (only for physical) */}
                  {hasPhysicalProducts && !hasDigitalProducts && (
                    <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      paymentMethod === 'cod'
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-purple-500/20 hover:border-purple-500/40'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${
                        paymentMethod === 'cod'
                          ? 'border-purple-500 bg-purple-500'
                          : 'border-muted-foreground'
                      }`}>
                        {paymentMethod === 'cod' && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <Wallet className="w-6 h-6 text-purple-400 mr-3" />
                      <div>
                        <p className="font-medium text-foreground">เก็บเงินปลายทาง (COD)</p>
                        <p className="text-sm text-muted-foreground">ชำระเงินเมื่อได้รับสินค้า</p>
                      </div>
                    </label>
                  )}
                </div>
              </Card>

              {/* Order Note */}
              <Card className="p-6 border border-purple-500/20 bg-card/50 backdrop-blur-sm">
                <h2 className="text-xl font-semibold text-foreground mb-4">หมายเหตุ (ถ้ามี)</h2>
                <textarea
                  name="note"
                  placeholder="ข้อความถึงร้านค้า เช่น เวลาที่สะดวกรับของ, คำแนะนำพิเศษ ฯลฯ"
                  value={formData.note}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-background border border-purple-500/20 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                />
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24 border border-purple-500/20 bg-card/50 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-foreground mb-6">สรุปคำสั่งซื้อ</h2>

                {/* Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.productId} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-muted shrink-0 flex items-center justify-center">
                        {item.isDigital ? (
                          <Download className="w-5 h-5 text-purple-400" />
                        ) : (
                          <Package className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                      </div>
                      <span className="text-sm text-purple-400">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-6 border-t border-purple-500/20 pt-4">
                  <div className="flex justify-between text-muted-foreground">
                    <span>รวมสินค้า</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>ค่าจัดส่ง</span>
                    <span className="text-green-400">ฟรี</span>
                  </div>
                </div>

                <div className="border-t border-purple-500/20 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-foreground">ยอดรวมทั้งหมด</span>
                    <span className="text-2xl font-bold text-purple-400">{formatCurrency(total)}</span>
                  </div>
                </div>

                <Button type="submit" variant="neon" className="w-full" size="lg" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      กำลังดำเนินการ...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      ยืนยันคำสั่งซื้อ
                    </>
                  )}
                </Button>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 text-green-400" />
                  <span>ข้อมูลของคุณปลอดภัย 100%</span>
                </div>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
