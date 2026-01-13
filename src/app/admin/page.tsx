'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users,
  TrendingUp,
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

interface DashboardStats {
  todayRevenue: number
  yesterdayRevenue: number
  todayOrders: number
  yesterdayOrders: number
  totalProducts: number
  newCustomers: number
  previousNewCustomers: number
}

interface RecentOrder {
  id: string
  orderNumber: string
  user: { name: string | null; email: string }
  total: number
  status: string
  createdAt: string
}

interface TopProduct {
  id: string
  name: string
  sales: number
  revenue: number
}

const statusConfig = {
  COMPLETED: { label: 'สำเร็จ', variant: 'success' as const },
  PROCESSING: { label: 'กำลังดำเนินการ', variant: 'warning' as const },
  PENDING: { label: 'รอดำเนินการ', variant: 'secondary' as const },
  SHIPPED: { label: 'จัดส่งแล้ว', variant: 'info' as const },
  CANCELLED: { label: 'ยกเลิก', variant: 'destructive' as const },
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'เมื่อสักครู่'
  if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`
  if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`
  return `${diffDays} วันที่แล้ว`
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch orders for stats and recent orders
        const ordersRes = await fetch('/api/orders?limit=100')
        const ordersData = ordersRes.ok ? await ordersRes.json() : { orders: [] }
        
        // Fetch products
        const productsRes = await fetch('/api/products?limit=100')
        const productsData = productsRes.ok ? await productsRes.json() : { products: [] }
        
        // Fetch users
        const usersRes = await fetch('/api/users?limit=100')
        const usersData = usersRes.ok ? await usersRes.json() : { users: [] }
        
        const orders = ordersData.orders || []
        const products = productsData.products || []
        const users = usersData.users || []
        
        // Calculate stats
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        const weekAgo = new Date(today)
        weekAgo.setDate(weekAgo.getDate() - 7)
        
        const todayOrders = orders.filter((o: RecentOrder) => new Date(o.createdAt) >= today)
        const yesterdayOrders = orders.filter((o: RecentOrder) => {
          const date = new Date(o.createdAt)
          return date >= yesterday && date < today
        })
        
        const todayRevenue = todayOrders.reduce((sum: number, o: RecentOrder) => sum + Number(o.total), 0)
        const yesterdayRevenue = yesterdayOrders.reduce((sum: number, o: RecentOrder) => sum + Number(o.total), 0)
        
        const newCustomers = users.filter((u: {createdAt: string}) => new Date(u.createdAt) >= weekAgo).length
        const previousNewCustomers = users.filter((u: {createdAt: string}) => {
          const date = new Date(u.createdAt)
          const twoWeeksAgo = new Date(weekAgo)
          twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 7)
          return date >= twoWeeksAgo && date < weekAgo
        }).length
        
        setStats({
          todayRevenue,
          yesterdayRevenue,
          todayOrders: todayOrders.length,
          yesterdayOrders: yesterdayOrders.length,
          totalProducts: products.length,
          newCustomers,
          previousNewCustomers,
        })
        
        // Recent orders (last 5)
        setRecentOrders(orders.slice(0, 5))
        
        // Calculate top products from order items
        const productSales: Record<string, { name: string; sales: number; revenue: number }> = {}
        products.forEach((p: { id: string; name: string; price: number; _count?: { orderItems: number } }) => {
          const salesCount = p._count?.orderItems || 0
          productSales[p.id] = {
            name: p.name,
            sales: salesCount,
            revenue: salesCount * Number(p.price),
          }
        })
        
        const sortedProducts = Object.entries(productSales)
          .map(([id, data]) => ({ id, ...data }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5)
        
        setTopProducts(sortedProducts)
        
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  const revenueChange = stats?.yesterdayRevenue 
    ? ((stats.todayRevenue - stats.yesterdayRevenue) / stats.yesterdayRevenue) * 100 
    : 0
  const ordersChange = stats?.yesterdayOrders 
    ? ((stats.todayOrders - stats.yesterdayOrders) / stats.yesterdayOrders) * 100 
    : 0
  const customersChange = stats?.previousNewCustomers 
    ? ((stats.newCustomers - stats.previousNewCustomers) / stats.previousNewCustomers) * 100 
    : 0

  const statCards = [
    {
      title: 'รายได้วันนี้',
      value: stats?.todayRevenue || 0,
      change: revenueChange,
      isRevenue: true,
      icon: DollarSign,
      gradient: 'from-yellow-400 to-amber-500',
      bgGradient: 'from-yellow-400/20 to-amber-500/20',
    },
    {
      title: 'คำสั่งซื้อวันนี้',
      value: stats?.todayOrders || 0,
      change: ordersChange,
      isRevenue: false,
      icon: ShoppingCart,
      gradient: 'from-amber-500 to-yellow-600',
      bgGradient: 'from-amber-500/20 to-yellow-600/20',
    },
    {
      title: 'สินค้าทั้งหมด',
      value: stats?.totalProducts || 0,
      change: 0,
      isRevenue: false,
      icon: Package,
      gradient: 'from-yellow-500 to-amber-400',
      bgGradient: 'from-yellow-500/20 to-amber-400/20',
    },
    {
      title: 'ลูกค้าใหม่ (7 วัน)',
      value: stats?.newCustomers || 0,
      change: customersChange,
      isRevenue: false,
      icon: Users,
      gradient: 'from-amber-400 to-yellow-500',
      bgGradient: 'from-amber-400/20 to-yellow-500/20',
    },
  ]

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
          <Link href="/admin/reports">
            <Button variant="outline" className="border-amber-500/30 text-amber-500 hover:bg-amber-500/10">
              <Activity className="w-4 h-4 mr-2" />
              รายงาน
            </Button>
          </Link>
          <Link href="/admin/orders">
            <Button className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-white">
              <Zap className="w-4 h-4 mr-2" />
              ดูคำสั่งซื้อ
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} variant="glass" className="p-6 relative overflow-hidden group hover:border-amber-500/40 transition-all duration-300">
            {/* Background Glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                {stat.change !== 0 && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
                    stat.change > 0 
                      ? 'bg-emerald-500/20 text-emerald-500' 
                      : 'bg-red-500/20 text-red-500'
                  }`}>
                    {stat.change > 0 ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    <span>{Math.abs(stat.change).toFixed(1)}%</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-foreground">
                {stat.isRevenue ? formatCurrency(stat.value) : stat.value.toLocaleString()}
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
            <Link href="/admin/reports">
              <Button variant="ghost" size="sm" className="text-amber-500 hover:text-amber-400">ดูทั้งหมด</Button>
            </Link>
          </div>
          <div className="h-64 flex items-center justify-center border border-dashed border-amber-500/30 rounded-xl bg-gradient-to-br from-yellow-500/5 to-amber-500/5">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400/20 to-amber-500/20 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-amber-500" />
              </div>
              <p className="text-amber-500 font-medium">กราฟรายได้</p>
              <p className="text-sm text-muted-foreground mt-1">รายได้วันนี้: {formatCurrency(stats?.todayRevenue || 0)}</p>
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
            <Link href="/admin/products">
              <Button variant="ghost" size="sm" className="text-amber-500 hover:text-amber-400">ดูทั้งหมด</Button>
            </Link>
          </div>
          <div className="space-y-4">
            {topProducts.length > 0 ? topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
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
            )) : (
              <div className="text-center py-8 text-muted-foreground">
                ยังไม่มีข้อมูลการขาย
              </div>
            )}
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
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm" className="text-amber-500 hover:text-amber-400">ดูทั้งหมด</Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          {recentOrders.length > 0 ? (
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
                  const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.PENDING
                  return (
                    <tr key={order.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-4">
                        <span className="font-mono text-amber-500">{order.orderNumber}</span>
                      </td>
                      <td className="py-4">
                        <div>
                          <p className="text-foreground font-medium">{order.user?.name || 'ไม่ระบุชื่อ'}</p>
                          <p className="text-sm text-muted-foreground">{order.user?.email}</p>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="font-semibold text-foreground">{formatCurrency(order.total)}</span>
                      </td>
                      <td className="py-4">
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </td>
                      <td className="py-4">
                        <span className="text-muted-foreground">{formatTimeAgo(order.createdAt)}</span>
                      </td>
                      <td className="py-4">
                        <Link href={`/admin/orders?id=${order.id}`}>
                          <Button variant="ghost" size="icon" className="text-amber-500 hover:text-amber-400 hover:bg-amber-500/10">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              ยังไม่มีคำสั่งซื้อ
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
