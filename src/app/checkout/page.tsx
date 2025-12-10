'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  CreditCard, 
  QrCode, 
  Lock, 
  ShieldCheck,
  Package,
  Download,
  Check
} from 'lucide-react'
import { Header, Footer } from '@/components/layout'
import { Button, Card, CardContent, Input, Label, Badge } from '@/components/ui'
import { useCartStore, useNotificationStore } from '@/stores'
import { formatCurrency } from '@/lib/utils'

type PaymentMethod = 'card' | 'promptpay'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCartStore()
  const { addNotification } = useNotificationStore()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    address: '',
  })

  const hasPhysicalProducts = items.some((item) => !item.isDigital)
  const hasDigitalProducts = items.some((item) => item.isDigital)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create order via API
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          shippingAddress: hasPhysicalProducts ? formData.address : undefined,
          phone: formData.phone,
        }),
      })

      if (!orderRes.ok) throw new Error('Failed to create order')

      const order = await orderRes.json()

      // Create payment session
      const paymentRes = await fetch('/api/payment/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          method: paymentMethod,
        }),
      })

      if (!paymentRes.ok) throw new Error('Failed to create payment session')

      const payment = await paymentRes.json()

      // Redirect to Stripe checkout or show QR code
      if (payment.url) {
        clearCart()
        window.location.href = payment.url
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถดำเนินการชำระเงินได้ กรุณาลองใหม่อีกครั้ง',
      })
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-16 bg-background">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">ชำระเงิน</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Contact Information */}
                <Card variant="glass" className="p-6">
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
                  <Card variant="glass" className="p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
                      <Package className="w-5 h-5 mr-2 text-primary" />
                      ที่อยู่จัดส่ง
                    </h2>
                    
                    <div>
                      <Label htmlFor="address">ที่อยู่ *</Label>
                      <textarea
                        id="address"
                        name="address"
                        placeholder="กรอกที่อยู่จัดส่งสินค้า"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      />
                    </div>
                  </Card>
                )}

                {/* Digital Products Notice */}
                {hasDigitalProducts && (
                  <Card variant="luxury" className="p-4">
                    <div className="flex items-start gap-3">
                      <Download className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">สินค้าดิจิทัล</p>
                        <p className="text-sm text-muted-foreground">
                          คุณมีสินค้าดิจิทัลในตะกร้า ลิงก์ดาวน์โหลดและไลเซนส์จะถูกส่งไปยังอีเมลของคุณทันทีหลังชำระเงินสำเร็จ
                        </p>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Payment Method */}
                <Card variant="glass" className="p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6">วิธีการชำระเงิน</h2>
                  
                  <div className="space-y-4">
                    {/* Credit Card */}
                    <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      paymentMethod === 'card'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-muted-foreground'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${
                        paymentMethod === 'card'
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground'
                      }`}>
                        {paymentMethod === 'card' && <Check className="w-3 h-3 text-primary-foreground" />}
                      </div>
                      <CreditCard className="w-6 h-6 text-primary mr-3" />
                      <div>
                        <p className="font-medium text-foreground">บัตรเครดิต / เดบิต</p>
                        <p className="text-sm text-muted-foreground">Visa, Mastercard, JCB</p>
                      </div>
                    </label>

                    {/* PromptPay */}
                    <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      paymentMethod === 'promptpay'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-muted-foreground'
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
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground'
                      }`}>
                        {paymentMethod === 'promptpay' && <Check className="w-3 h-3 text-primary-foreground" />}
                      </div>
                      <QrCode className="w-6 h-6 text-primary mr-3" />
                      <div>
                        <p className="font-medium text-foreground">พร้อมเพย์ (PromptPay)</p>
                        <p className="text-sm text-muted-foreground">สแกน QR Code เพื่อชำระเงิน</p>
                      </div>
                    </label>
                  </div>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card variant="glass" className="p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-foreground mb-6">สรุปคำสั่งซื้อ</h2>

                  {/* Items */}
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.productId} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-muted flex-shrink-0 flex items-center justify-center">
                          {item.isDigital ? (
                            <Download className="w-5 h-5 text-primary/50" />
                          ) : (
                            <Package className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                        </div>
                        <span className="text-sm text-primary">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 mb-6 border-t border-border pt-4">
                    <div className="flex justify-between text-muted-foreground">
                      <span>รวมสินค้า</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>ค่าจัดส่ง</span>
                      <span className="text-primary">ฟรี</span>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-foreground">ยอดรวมทั้งหมด</span>
                      <span className="text-2xl font-bold text-primary">{formatCurrency(total)}</span>
                    </div>
                  </div>

                  <Button type="submit" variant="gold" className="w-full" size="lg" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        กำลังดำเนินการ...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5 mr-2" />
                        ชำระเงิน {formatCurrency(total)}
                      </>
                    )}
                  </Button>

                  {/* Security Badge */}
                  <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span>การชำระเงินปลอดภัย 100% ด้วย SSL</span>
                  </div>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
