import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  Package, 
  Download, 
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  ArrowLeft
} from 'lucide-react'
import { Header, Footer } from '@/components/layout'
import { Card, Badge, Button } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

interface PageProps {
  searchParams: Promise<{
    status?: string
    page?: string
  }>
}

const statusConfig = {
  COMPLETED: { label: 'สำเร็จ', variant: 'success' as const, icon: CheckCircle2 },
  SHIPPED: { label: 'จัดส่งแล้ว', variant: 'info' as const, icon: Truck },
  PROCESSING: { label: 'กำลังดำเนินการ', variant: 'warning' as const, icon: Clock },
  PENDING: { label: 'รอดำเนินการ', variant: 'secondary' as const, icon: Clock },
  CANCELLED: { label: 'ยกเลิก', variant: 'destructive' as const, icon: XCircle },
}

async function getOrders(userId: string, params: { status?: string; page?: string }) {
  const page = parseInt(params.page || '1')
  const limit = 10
  const skip = (page - 1) * limit

  const where: any = { userId }
  if (params.status && params.status !== 'all') {
    where.status = params.status
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: { select: { name: true, productType: true, slug: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ])

  return {
    orders: orders.map(order => ({
      id: order.orderNumber,
      orderId: order.id,
      date: order.createdAt.toISOString().split('T')[0],
      total: Number(order.total),
      status: order.status,
      paymentStatus: order.paymentStatus,
      trackingNumber: order.trackingNumber,
      items: order.items.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: Number(item.price),
        isDigital: item.product.productType === 'DIGITAL',
      })),
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }
}

export default async function OrdersPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/login?callbackUrl=/dashboard/orders')
  }

  const params = await searchParams
  const { orders, total, page, totalPages } = await getOrders(session.user.id, params)
  const currentStatus = params.status || 'all'

  const buildUrl = (newParams: Record<string, string>) => {
    const p = new URLSearchParams()
    const merged = { ...params, ...newParams }
    Object.entries(merged).forEach(([key, value]) => {
      if (value && value !== 'all') {
        p.set(key, value)
      }
    })
    return `/dashboard/orders${p.toString() ? `?${p.toString()}` : ''}`
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-16 bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Back Link */}
          <Link href="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับไปแดชบอร์ด
          </Link>

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">คำสั่งซื้อของฉัน</h1>
              <p className="text-muted-foreground">ดูและติดตามคำสั่งซื้อทั้งหมดของคุณ ({total} รายการ)</p>
            </div>
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { value: 'all', label: 'ทั้งหมด' },
              { value: 'COMPLETED', label: 'สำเร็จ' },
              { value: 'SHIPPED', label: 'จัดส่งแล้ว' },
              { value: 'PROCESSING', label: 'กำลังดำเนินการ' },
              { value: 'CANCELLED', label: 'ยกเลิก' },
            ].map((filter) => (
              <Link key={filter.value} href={buildUrl({ status: filter.value, page: '1' })}>
                <Button
                  variant={currentStatus === filter.value ? 'neon' : 'outline'}
                  size="sm"
                >
                  {filter.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Orders List */}
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => {
                const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.PENDING
                const StatusIcon = status.icon

                return (
                  <Card key={order.id} variant="glass" className="overflow-hidden">
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                            <Package className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{order.id}</p>
                            <p className="text-sm text-muted-foreground">{order.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="font-bold text-primary text-lg">
                            {formatCurrency(order.total)}
                          </p>
                          <Badge variant={status.variant} className="flex items-center gap-1">
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </Badge>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="border-t border-border pt-4 space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {item.isDigital && (
                                <Download className="w-4 h-4 text-cyan-500" />
                              )}
                              <span className="text-foreground">{item.name}</span>
                              <span className="text-muted-foreground text-sm">x{item.quantity}</span>
                            </div>
                            <span className="text-muted-foreground">{formatCurrency(item.price)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Tracking Number */}
                      {order.trackingNumber && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <p className="text-sm text-muted-foreground">
                            เลขพัสดุ: <span className="text-foreground font-mono">{order.trackingNumber}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                )
              })}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {page > 1 && (
                    <Link href={buildUrl({ page: String(page - 1) })}>
                      <Button variant="outline">ก่อนหน้า</Button>
                    </Link>
                  )}
                  
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(p => p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1))
                      .map((p, idx, arr) => (
                        <span key={`page-${p}`}>
                          {idx > 0 && arr[idx - 1] !== p - 1 && (
                            <span className="text-muted-foreground mx-1">...</span>
                          )}
                          <Link href={buildUrl({ page: String(p) })}>
                            <Button
                              variant={p === page ? 'neon' : 'outline'}
                              size="sm"
                            >
                              {p}
                            </Button>
                          </Link>
                        </span>
                      ))}
                  </div>

                  {page < totalPages && (
                    <Link href={buildUrl({ page: String(page + 1) })}>
                      <Button variant="outline">ถัดไป</Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          ) : (
            <Card variant="glass" className="p-12 text-center">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">ไม่พบคำสั่งซื้อ</h3>
              <p className="text-muted-foreground mb-6">
                {currentStatus !== 'all' 
                  ? 'ไม่มีคำสั่งซื้อในสถานะนี้'
                  : 'คุณยังไม่มีคำสั่งซื้อ เริ่มช้อปปิ้งกันเลย!'
                }
              </p>
              <Link href="/shop">
                <Button variant="neon">เลือกซื้อสินค้า</Button>
              </Link>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
