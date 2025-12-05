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
        <main className="min-h-screen pt-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-400">กำลังโหลดข้อมูลคำสั่งซื้อ...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            {/* Success Icon */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6 animate-float">
                <Check className="w-10 h-10 text-emerald-400" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">ชำระเงินสำเร็จ!</h1>
              <p className="text-slate-400">ขอบคุณสำหรับการสั่งซื้อ</p>
            </div>

            {/* Order Details */}
            <Card variant="glass" className="p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-slate-400">หมายเลขคำสั่งซื้อ</p>
                  <p className="text-lg font-mono font-bold text-white">{order?.id}</p>
                </div>
                <Badge variant="success">ชำระเงินแล้ว</Badge>
              </div>

              <div className="border-t border-slate-800 pt-6">
                <h3 className="font-semibold text-white mb-4">รายการสินค้า</h3>
                <div className="space-y-4">
                  {order?.items.map((item: any) => (
                    <div key={item.id} className="p-4 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center">
                            {item.isDigital ? (
                              <Download className="w-5 h-5 text-violet-400" />
                            ) : (
                              <Package className="w-5 h-5 text-slate-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-white">{item.name}</p>
                            <p className="text-sm text-slate-500">x{item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-semibold text-white">
                          {formatCurrency(item.price)}
                        </span>
                      </div>

                      {/* License Key */}
                      {item.isDigital && item.licenseKey && (
                        <div className="mt-4 p-3 bg-violet-500/10 border border-violet-500/30 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Key className="w-4 h-4 text-violet-400" />
                            <span className="text-sm font-medium text-violet-400">License Key</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <code className="text-sm font-mono text-white">{item.licenseKey}</code>
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

              <div className="border-t border-slate-800 pt-4 mt-6">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">ยอดรวมทั้งหมด</span>
                  <span className="text-xl font-bold text-white">
                    {formatCurrency(order?.total)}
                  </span>
                </div>
              </div>
            </Card>

            {/* Info Notice */}
            <Card variant="luxury" className="p-4 mb-8">
              <p className="text-sm text-slate-300">
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
        <main className="min-h-screen py-16 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-2 border-violet-500 rounded-full border-t-transparent" />
        </main>
        <Footer />
      </>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  )
}
