'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Check, Download, Package, ArrowRight, Copy, Key } from 'lucide-react'
import { Header, Footer } from '@/components/layout'
import { Button, Card, Badge } from '@/components/ui'
import { useCartStore } from '@/stores'
import { formatCurrency } from '@/lib/utils'

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { clearCart } = useCartStore()

  useEffect(() => {
    // Clear cart on success
    clearCart()

    // In real app, fetch order details from API using session_id
    // For demo, we'll use mock data
    setOrder({
      id: 'ORD-2024-001234',
      items: [
        {
          id: '1',
          name: 'Premium Software License',
          price: 2990,
          quantity: 1,
          isDigital: true,
          licenseKey: 'SSS-PREM-XXXX-YYYY-ZZZZ',
          downloadUrl: '#',
        },
      ],
      total: 2990,
      createdAt: new Date().toISOString(),
    })
    setLoading(false)
  }, [clearCart])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-16 flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">กำลังโหลดข้อมูลคำสั่งซื้อ...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-16 bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            {/* Success Icon */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6 animate-float">
                <Check className="w-10 h-10 text-emerald-400" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">ชำระเงินสำเร็จ!</h1>
              <p className="text-muted-foreground">ขอบคุณสำหรับการสั่งซื้อ</p>
            </div>

            {/* Order Details */}
            <Card variant="glass" className="p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">หมายเลขคำสั่งซื้อ</p>
                  <p className="text-lg font-mono font-bold text-foreground">{order?.id}</p>
                </div>
                <Badge variant="success">ชำระเงินแล้ว</Badge>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-semibold text-foreground mb-4">รายการสินค้า</h3>
                <div className="space-y-4">
                  {order?.items.map((item: any) => (
                    <div key={item.id} className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                            {item.isDigital ? (
                              <Download className="w-5 h-5 text-primary" />
                            ) : (
                              <Package className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{item.name}</p>
                            <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-semibold text-foreground">
                          {formatCurrency(item.price)}
                        </span>
                      </div>

                      {/* License Key */}
                      {item.isDigital && item.licenseKey && (
                        <div className="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Key className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-primary">License Key</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <code className="text-sm font-mono text-foreground">{item.licenseKey}</code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(item.licenseKey)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Download Button */}
                      {item.isDigital && item.downloadUrl && (
                        <Button variant="outline" className="w-full mt-3">
                          <Download className="w-4 h-4 mr-2" />
                          ดาวน์โหลดไฟล์
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4 mt-6">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">ยอดรวมทั้งหมด</span>
                  <span className="text-xl font-bold text-foreground">
                    {formatCurrency(order?.total)}
                  </span>
                </div>
              </div>
            </Card>

            {/* Info Notice */}
            <Card variant="luxury" className="p-4 mb-8">
              <p className="text-sm text-muted-foreground">
                📧 รายละเอียดคำสั่งซื้อและไลเซนส์ได้ถูกส่งไปยังอีเมลของคุณแล้ว 
                หากไม่พบอีเมล กรุณาตรวจสอบในโฟลเดอร์ Spam
              </p>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard/orders" className="flex-1">
                <Button variant="outline" className="w-full">
                  ดูคำสั่งซื้อของฉัน
                </Button>
              </Link>
              <Link href="/shop" className="flex-1">
                <Button className="w-full">
                  ซื้อสินค้าต่อ
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <>
        <Header />
        <main className="min-h-screen py-16 flex items-center justify-center bg-background">
          <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent" />
        </main>
        <Footer />
      </>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  )
}
