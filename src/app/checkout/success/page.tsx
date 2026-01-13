'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Check, Download, Package, ArrowRight, Copy, Key, Truck, Clock, Mail } from 'lucide-react'
import { Button, Card, Badge } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'

interface OrderItem {
  id: string
  productName: string
  price: number
  quantity: number
  total: number
  isDigital: boolean
  product?: {
    slug: string
    thumbnail?: string
  }
}

interface License {
  id: string
  key: string
  productId: string
}

interface Order {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  subtotal: number
  discount: number
  tax: number
  shippingCost: number
  total: number
  shippingAddress?: string
  customerNote?: string
  createdAt: string
  items: OrderItem[]
  licenseKeys?: License[]
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setError('ไม่พบหมายเลขคำสั่งซื้อ')
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`/api/orders/${orderId}`)
        if (!res.ok) {
          throw new Error('ไม่สามารถโหลดข้อมูลคำสั่งซื้อได้')
        }
        const data = await res.json()
        setOrder(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(text)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">กำลังโหลดข้อมูลคำสั่งซื้อ...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">เกิดข้อผิดพลาด</h1>
          <p className="text-muted-foreground mb-6">{error || 'ไม่พบข้อมูลคำสั่งซื้อ'}</p>
          <Link href="/shop">
            <Button variant="neon">กลับไปหน้าร้านค้า</Button>
          </Link>
        </div>
      </div>
    )
  }

  const hasDigitalItems = order.items.some(item => item.isDigital)
  const hasPhysicalItems = order.items.some(item => !item.isDigital)

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Check className="w-10 h-10 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">สั่งซื้อสำเร็จ!</h1>
            <p className="text-muted-foreground">ขอบคุณสำหรับการสั่งซื้อ</p>
          </div>

          {/* Order Details */}
          <Card className="p-6 mb-6 border border-purple-500/20 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-muted-foreground">หมายเลขคำสั่งซื้อ</p>
                <p className="text-lg font-mono font-bold text-foreground">{order.orderNumber}</p>
              </div>
              <Badge className={order.paymentStatus === 'COMPLETED' 
                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
              }>
                {order.paymentStatus === 'COMPLETED' ? 'ชำระเงินแล้ว' : 'รอชำระเงิน'}
              </Badge>
            </div>

            {/* Payment Instructions */}
            {order.paymentStatus !== 'COMPLETED' && (
              <div className="mb-6 p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
                <h3 className="font-semibold text-foreground mb-3 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-yellow-400" />
                  รอการชำระเงิน
                </h3>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>กรุณาโอนเงินจำนวน <span className="font-bold text-purple-400">{formatCurrency(Number(order.total))}</span> ไปยังบัญชี:</p>
                  <div className="p-3 rounded bg-background/50">
                    <p><strong>ธนาคาร:</strong> กสิกรไทย</p>
                    <p><strong>ชื่อบัญชี:</strong> Soft Stop Shop</p>
                    <p><strong>เลขที่บัญชี:</strong> XXX-X-XXXXX-X</p>
                  </div>
                  <p className="text-yellow-400">⚠️ กรุณาโอนเงินภายใน 24 ชั่วโมง</p>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="border-t border-purple-500/20 pt-6">
              <h3 className="font-semibold text-foreground mb-4">รายการสินค้า</h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="p-4 bg-background/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          {item.isDigital ? (
                            <Download className="w-5 h-5 text-purple-400" />
                          ) : (
                            <Package className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{item.productName}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(Number(item.price))} x {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-purple-400">
                        {formatCurrency(Number(item.total))}
                      </span>
                    </div>

                    {/* License Key for Digital Products */}
                    {item.isDigital && order.licenseKeys?.find(l => l.productId === item.id) && (
                      <div className="mt-3 p-3 rounded bg-purple-500/10 border border-purple-500/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Key className="w-4 h-4 text-purple-400" />
                            <span className="text-sm text-muted-foreground">License Key:</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(order.licenseKeys?.find(l => l.productId === item.id)?.key || '')}
                            className="text-purple-400 hover:text-purple-300"
                          >
                            {copiedKey === order.licenseKeys?.find(l => l.productId === item.id)?.key ? (
                              <>
                                <Check className="w-4 h-4 mr-1" />
                                คัดลอกแล้ว
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 mr-1" />
                                คัดลอก
                              </>
                            )}
                          </Button>
                        </div>
                        <p className="font-mono text-sm text-purple-400 mt-1 break-all">
                          {order.licenseKeys?.find(l => l.productId === item.id)?.key}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t border-purple-500/20 mt-6 pt-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>รวมสินค้า</span>
                  <span>{formatCurrency(Number(order.subtotal))}</span>
                </div>
                {Number(order.discount) > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>ส่วนลด</span>
                    <span>-{formatCurrency(Number(order.discount))}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>ค่าจัดส่ง</span>
                  <span>{Number(order.shippingCost) > 0 ? formatCurrency(Number(order.shippingCost)) : 'ฟรี'}</span>
                </div>
              </div>
              <div className="flex justify-between mt-4 pt-4 border-t border-purple-500/20">
                <span className="font-semibold text-foreground">ยอดรวมทั้งหมด</span>
                <span className="text-xl font-bold text-purple-400">{formatCurrency(Number(order.total))}</span>
              </div>
            </div>

            {/* Shipping Address */}
            {hasPhysicalItems && order.shippingAddress && (
              <div className="border-t border-purple-500/20 mt-6 pt-6">
                <h3 className="font-semibold text-foreground mb-3 flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-purple-400" />
                  ที่อยู่จัดส่ง
                </h3>
                <p className="text-muted-foreground">{order.shippingAddress}</p>
              </div>
            )}
          </Card>

          {/* Email Notice */}
          <Card className="p-4 mb-6 border border-cyan-500/30 bg-cyan-500/10">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">ตรวจสอบอีเมลของคุณ</p>
                <p className="text-sm text-muted-foreground">
                  เราได้ส่งรายละเอียดคำสั่งซื้อไปยังอีเมลของคุณแล้ว
                  {hasDigitalItems && ' รวมถึง License Key และลิงก์ดาวน์โหลดสำหรับสินค้าดิจิทัล'}
                </p>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard/orders">
              <Button variant="outline" className="w-full sm:w-auto border-purple-500/30">
                ดูประวัติคำสั่งซื้อ
              </Button>
            </Link>
            <Link href="/shop">
              <Button variant="neon" className="w-full sm:w-auto">
                เลือกซื้อสินค้าต่อ
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  )
}
