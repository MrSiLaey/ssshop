import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  Package, 
  Key, 
  Download,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { Header, Footer } from '@/components/layout'
import { Card, Badge, Button } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

const statusConfig = {
  COMPLETED: { label: 'สำเร็จ', variant: 'success' as const, icon: CheckCircle2 },
  PROCESSING: { label: 'กำลังดำเนินการ', variant: 'warning' as const, icon: Clock },
  PENDING: { label: 'รอดำเนินการ', variant: 'secondary' as const, icon: AlertCircle },
  SHIPPED: { label: 'จัดส่งแล้ว', variant: 'info' as const, icon: Package },
  CANCELLED: { label: 'ยกเลิก', variant: 'destructive' as const, icon: AlertCircle },
}

async function getDashboardData(userId: string) {
  const [ordersCount, licensesCount, recentOrders, licenses] = await Promise.all([
    prisma.order.count({
      where: { userId },
    }),
    prisma.licenseKey.count({
      where: { userId, status: 'ACTIVE' },
    }),
    prisma.order.findMany({
      where: { userId },
      include: {
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
    prisma.licenseKey.findMany({
      where: { userId, status: 'ACTIVE' },
      include: {
        product: { select: { name: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
  ])

  // Count digital downloads (license keys count as downloads)
  const downloadsCount = await prisma.licenseKey.count({
    where: { userId },
  })

  return {
    stats: {
      orders: ordersCount,
      licenses: licensesCount,
      downloads: downloadsCount,
    },
    recentOrders: recentOrders.map(order => ({
      id: order.orderNumber,
      date: order.createdAt.toISOString().split('T')[0],
      total: Number(order.total),
      status: order.status,
      items: order._count.items,
    })),
    licenses: licenses.map(license => ({
      id: license.id,
      productName: license.product.name,
      key: license.key,
      status: license.status,
      expiresAt: license.expiresAt?.toISOString().split('T')[0] || null,
      activations: license.activationsCount,
      maxActivations: license.activationsLimit,
    })),
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/login?callbackUrl=/dashboard')
  }

  const { stats, recentOrders, licenses } = await getDashboardData(session.user.id)

  const dashboardCards = [
    { title: 'คำสั่งซื้อทั้งหมด', value: String(stats.orders), icon: Package, href: '/dashboard/orders' },
    { title: 'ไลเซนส์ที่ใช้งาน', value: String(stats.licenses), icon: Key, href: '/dashboard/licenses' },
    { title: 'ไฟล์ดาวน์โหลด', value: String(stats.downloads), icon: Download, href: '/dashboard/licenses' },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen pt-16 bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">แดชบอร์ด</h1>
            <p className="text-muted-foreground">
              ยินดีต้อนรับกลับมา, {session.user.name || session.user.email}!
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid sm:grid-cols-3 gap-6 mb-8">
            {dashboardCards.map((card) => (
              <Link key={card.title} href={card.href}>
                <Card variant="glass" className="p-6 card-hover shine">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{card.title}</p>
                      <p className="text-3xl font-bold text-foreground">{card.value}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                      <card.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <Card variant="glass" className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">คำสั่งซื้อล่าสุด</h2>
                <Link href="/dashboard/orders">
                  <Button variant="ghost" size="sm">ดูทั้งหมด</Button>
                </Link>
              </div>

              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => {
                    const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.PENDING
                    return (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{order.id}</p>
                            <p className="text-sm text-muted-foreground">{order.items} รายการ • {order.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary mb-1">
                            {formatCurrency(order.total)}
                          </p>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">ยังไม่มีคำสั่งซื้อ</p>
                  <Link href="/shop">
                    <Button variant="neon" className="mt-4">เลือกซื้อสินค้า</Button>
                  </Link>
                </div>
              )}
            </Card>

            {/* Active Licenses */}
            <Card variant="glass" className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">ไลเซนส์ของฉัน</h2>
                <Link href="/dashboard/licenses">
                  <Button variant="ghost" size="sm">ดูทั้งหมด</Button>
                </Link>
              </div>

              {licenses.length > 0 ? (
                <div className="space-y-4">
                  {licenses.map((license) => (
                    <div
                      key={license.id}
                      className="p-4 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-foreground">{license.productName}</p>
                          <p className="text-sm text-muted-foreground font-mono">
                            {license.key.substring(0, 8)}****
                          </p>
                        </div>
                        <Badge variant="success">ใช้งานอยู่</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>
                          ใช้งาน: {license.activations}/{license.maxActivations}
                        </span>
                        {license.expiresAt && (
                          <span>หมดอายุ: {license.expiresAt}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Key className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">ยังไม่มีไลเซนส์</p>
                  <Link href="/shop">
                    <Button variant="neon" className="mt-4">เลือกซื้อสินค้า</Button>
                  </Link>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
