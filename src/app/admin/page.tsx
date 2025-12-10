'use client'

import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Flame,
  Zap,
  Target,
  Activity
} from 'lucide-react'
import { Card, Badge, Button } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'

// Mock data
const stats = [
  {
    title: 'รายได้วันนี้',
    value: 45890,
    change: 12.5,
    trend: 'up' as const,
    icon: DollarSign,
    gradient: 'from-yellow-400 to-amber-500',
    bgGradient: 'from-yellow-400/20 to-amber-500/20',
  },
  {
    title: 'คำสั่งซื้อใหม่',
    value: 24,
    change: 8.2,
    trend: 'up' as const,
    icon: ShoppingCart,
    gradient: 'from-amber-500 to-yellow-600',
    bgGradient: 'from-amber-500/20 to-yellow-600/20',
  },
  {
    title: 'สินค้าทั้งหมด',
    value: 156,
    change: 3,
    trend: 'up' as const,
    icon: Package,
    gradient: 'from-yellow-500 to-amber-400',
    bgGradient: 'from-yellow-500/20 to-amber-400/20',
  },
  {
    title: 'ลูกค้าใหม่',
    value: 48,
    change: -2.4,
    trend: 'down' as const,
    icon: Users,
    gradient: 'from-amber-400 to-yellow-500',
    bgGradient: 'from-amber-400/20 to-yellow-500/20',
  },
]

const recentOrders = [
  {
    id: 'ORD-2024-001234',
    customer: 'สมชาย ใจดี',
    email: 'somchai@email.com',
    total: 2990,
    status: 'COMPLETED',
    date: '10 นาทีที่แล้ว',
  },
  {
    id: 'ORD-2024-001233',
    customer: 'สมหญิง ดีใจ',
    email: 'somying@email.com',
    total: 4980,
    status: 'PROCESSING',
    date: '25 นาทีที่แล้ว',
  },
  {
    id: 'ORD-2024-001232',
    customer: 'ประพนธ์ มั่นคง',
    email: 'prapon@email.com',
    total: 1490,
    status: 'PENDING',
    date: '1 ชั่วโมงที่แล้ว',
  },
  {
    id: 'ORD-2024-001231',
    customer: 'นารี สุขใจ',
    email: 'naree@email.com',
    total: 990,
    status: 'SHIPPED',
    date: '2 ชั่วโมงที่แล้ว',
  },
]

const topProducts = [
  { name: 'Premium Software License', sales: 156, revenue: 466440 },
  { name: 'Developer Toolkit Pro', sales: 98, revenue: 146020 },
  { name: 'Wireless Keyboard RGB', sales: 87, revenue: 216630 },
  { name: 'Gaming Mouse Pro', sales: 76, revenue: 143640 },
  { name: 'Cloud Storage 1TB License', sales: 65, revenue: 64350 },
]

const statusConfig = {
  COMPLETED: { label: 'สำเร็จ', variant: 'success' as const },
  PROCESSING: { label: 'กำลังดำเนินการ', variant: 'warning' as const },
  PENDING: { label: 'รอดำเนินการ', variant: 'secondary' as const },
  SHIPPED: { label: 'จัดส่งแล้ว', variant: 'info' as const },
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 text-transparent bg-clip-text">แดชบอร์ด</h1>
              <p className="text-muted-foreground">ภาพรวมร้านค้าของคุณในวันนี้</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-amber-500/30 text-amber-500 hover:bg-amber-500/10">
            <Activity className="w-4 h-4 mr-2" />
            รายงานสด
          </Button>
          <Button className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-white">
            <Zap className="w-4 h-4 mr-2" />
            Quick Actions
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={stat.title} variant="glass" className="p-6 relative overflow-hidden group hover:border-amber-500/40 transition-all duration-300">
            {/* Background Glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
                  stat.trend === 'up' 
                    ? 'bg-emerald-500/20 text-emerald-500' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span>{Math.abs(stat.change)}%</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-foreground">
                {stat.title.includes('รายได้') ? formatCurrency(stat.value) : stat.value.toLocaleString()}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart Placeholder */}
        <Card variant="glass" className="p-6 border-amber-500/20 hover:border-amber-500/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">รายได้รายสัปดาห์</h2>
            </div>
            <Button variant="ghost" size="sm" className="text-amber-500 hover:text-amber-400">ดูทั้งหมด</Button>
          </div>
          <div className="h-64 flex items-center justify-center border border-dashed border-amber-500/30 rounded-xl bg-gradient-to-br from-yellow-500/5 to-amber-500/5">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400/20 to-amber-500/20 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-amber-500" />
              </div>
              <p className="text-amber-500 font-medium">กราฟรายได้ (Recharts)</p>
              <p className="text-sm text-muted-foreground mt-1">ติดตั้ง recharts เพื่อแสดงกราฟ</p>
            </div>
          </div>
        </Card>

        {/* Top Products */}
        <Card variant="glass" className="p-6 border-amber-500/20 hover:border-amber-500/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">สินค้าขายดี</h2>
            </div>
            <Button variant="ghost" size="sm" className="text-amber-500 hover:text-amber-400">ดูทั้งหมด</Button>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                <span className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  index === 0 ? 'bg-gradient-to-br from-yellow-500 to-amber-500 text-white shadow-lg shadow-amber-500/30' :
                  index === 1 ? 'bg-gradient-to-br from-slate-400 to-slate-500 text-white' :
                  index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-medium truncate">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.sales} ขาย</p>
                </div>
                <span className="text-amber-500 font-semibold">
                  {formatCurrency(product.revenue)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card variant="glass" className="p-6 border-amber-500/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">คำสั่งซื้อล่าสุด</h2>
          </div>
          <Button variant="ghost" size="sm" className="text-amber-500 hover:text-amber-400">ดูทั้งหมด</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-muted-foreground border-b border-border">
                <th className="pb-4 font-medium">หมายเลข</th>
                <th className="pb-4 font-medium">ลูกค้า</th>
                <th className="pb-4 font-medium">ยอดรวม</th>
                <th className="pb-4 font-medium">สถานะ</th>
                <th className="pb-4 font-medium">เวลา</th>
                <th className="pb-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => {
                const status = statusConfig[order.status as keyof typeof statusConfig]
                return (
                  <tr key={order.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-4">
                      <span className="font-mono text-amber-500">{order.id}</span>
                    </td>
                    <td className="py-4">
                      <div>
                        <p className="text-foreground font-medium">{order.customer}</p>
                        <p className="text-sm text-muted-foreground">{order.email}</p>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="font-semibold text-foreground">{formatCurrency(order.total)}</span>
                    </td>
                    <td className="py-4">
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </td>
                    <td className="py-4">
                      <span className="text-muted-foreground">{order.date}</span>
                    </td>
                    <td className="py-4">
                      <Button variant="ghost" size="icon" className="text-amber-500 hover:text-amber-400 hover:bg-amber-500/10">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
