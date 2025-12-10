'use client'

import Link from 'next/link'
import { 
  Package, 
  Key, 
  Settings, 
  User, 
  Download,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { Header, Footer } from '@/components/layout'
import { Card, CardContent, Badge, Button } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'

// Mock data
const recentOrders = [
  {
    id: 'ORD-2024-001234',
    date: '2024-01-15',
    total: 2990,
    status: 'COMPLETED',
    items: 1,
  },
  {
    id: 'ORD-2024-001233',
    date: '2024-01-10',
    total: 4980,
    status: 'PROCESSING',
    items: 2,
  },
]

const licenses = [
  {
    id: '1',
    productName: 'Premium Software License',
    key: 'SSS-PREM-XXXX-YYYY-ZZZZ',
    status: 'ACTIVE',
    expiresAt: '2025-01-15',
    activations: 2,
    maxActivations: 3,
  },
]

const dashboardCards = [
  { title: 'คำสั่งซื้อทั้งหมด', value: '12', icon: Package, href: '/dashboard/orders' },
  { title: 'ไลเซนส์ที่ใช้งาน', value: '5', icon: Key, href: '/dashboard/licenses' },
  { title: 'ไฟล์ดาวน์โหลด', value: '8', icon: Download, href: '/dashboard/downloads' },
]

const statusConfig = {
  COMPLETED: { label: 'สำเร็จ', variant: 'success' as const, icon: CheckCircle2 },
  PROCESSING: { label: 'กำลังดำเนินการ', variant: 'warning' as const, icon: Clock },
  PENDING: { label: 'รอดำเนินการ', variant: 'secondary' as const, icon: AlertCircle },
}

export default function DashboardPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-16 bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">แดชบอร์ด</h1>
            <p className="text-muted-foreground">ยินดีต้อนรับกลับมา! จัดการบัญชีและคำสั่งซื้อของคุณ</p>
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
                    const status = statusConfig[order.status as keyof typeof statusConfig]
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
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-medium text-foreground">{license.productName}</p>
                        <Badge variant={license.status === 'ACTIVE' ? 'success' : 'secondary'}>
                          {license.status === 'ACTIVE' ? 'ใช้งานอยู่' : 'หมดอายุ'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-background/50 rounded font-mono text-sm text-muted-foreground mb-3">
                        <Key className="w-4 h-4 text-primary" />
                        {license.key}
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>ใช้งาน: {license.activations}/{license.maxActivations}</span>
                        <span>หมดอายุ: {license.expiresAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Key className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">ยังไม่มีไลเซนส์</p>
                </div>
              )}
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/shop">
              <Card variant="glass" className="p-4 card-hover text-center">
                <ShoppingBag className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-sm text-foreground">ซื้อสินค้าเพิ่ม</p>
              </Card>
            </Link>
            <Link href="/dashboard/orders">
              <Card variant="glass" className="p-4 card-hover text-center">
                <Package className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-sm text-foreground">ดูคำสั่งซื้อ</p>
              </Card>
            </Link>
            <Link href="/dashboard/licenses">
              <Card variant="glass" className="p-4 card-hover text-center">
                <Key className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-sm text-foreground">จัดการไลเซนส์</p>
              </Card>
            </Link>
            <Link href="/dashboard/settings">
              <Card variant="glass" className="p-4 card-hover text-center">
                <Settings className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-sm text-foreground">ตั้งค่าบัญชี</p>
              </Card>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
