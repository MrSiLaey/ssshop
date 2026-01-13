'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
  PieChart,
  Activity
} from 'lucide-react'
import { Card, Badge, Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'

interface Order {
  id: string
  orderNumber: string
  total: number
  status: string
  paymentStatus: string
  createdAt: string
  items?: Array<{ quantity: number; product?: { categoryId?: string } }>
}

interface Product {
  id: string
  name: string
  price: number
  categoryId?: string
  _count?: { orderItems: number }
}

interface User {
  id: string
  createdAt: string
}

interface Category {
  id: string
  name: string
  _count?: { products: number }
}

interface ReportStats {
  thisMonthRevenue: number
  lastMonthRevenue: number
  totalOrders: number
  completedOrders: number
  pendingOrders: number
  cancelledOrders: number
  totalProducts: number
  productsSold: number
  totalCustomers: number
  newCustomers: number
}

interface MonthlyData {
  month: string
  revenue: number
  orders: number
}

interface CategoryData {
  name: string
  revenue: number
  percentage: number
  orders: number
}

interface ActivityItem {
  type: 'order' | 'payment' | 'customer'
  message: string
  time: string
  amount?: number
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

const MONTH_NAMES = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']

export default function AdminReportsPage() {
  const [timeRange, setTimeRange] = useState('thisMonth')
  const [stats, setStats] = useState<ReportStats | null>(null)
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [categoryData, setCategoryData] = useState<CategoryData[]>([])
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReportData() {
      try {
        // Fetch all data
        const [ordersRes, productsRes, usersRes, categoriesRes] = await Promise.all([
          fetch('/api/orders?limit=500'),
          fetch('/api/products?limit=500'),
          fetch('/api/users?limit=500'),
          fetch('/api/products?categories=true'),
        ])
        
        const ordersData = ordersRes.ok ? await ordersRes.json() : { orders: [] }
        const productsData = productsRes.ok ? await productsRes.json() : { products: [] }
        const usersData = usersRes.ok ? await usersRes.json() : { users: [] }
        
        const orders: Order[] = ordersData.orders || []
        const products: Product[] = productsData.products || []
        const users: User[] = usersData.users || []
        const categories: Category[] = productsData.categories || []
        
        // Calculate date ranges
        const now = new Date()
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
        
        // Filter orders by month
        const thisMonthOrders = orders.filter(o => new Date(o.createdAt) >= thisMonthStart)
        const lastMonthOrders = orders.filter(o => {
          const date = new Date(o.createdAt)
          return date >= lastMonthStart && date <= lastMonthEnd
        })
        
        // Calculate revenue
        const thisMonthRevenue = thisMonthOrders.reduce((sum, o) => sum + Number(o.total), 0)
        const lastMonthRevenue = lastMonthOrders.reduce((sum, o) => sum + Number(o.total), 0)
        
        // Order status counts
        const completedOrders = orders.filter(o => o.status === 'COMPLETED').length
        const pendingOrders = orders.filter(o => o.status === 'PENDING' || o.status === 'PROCESSING').length
        const cancelledOrders = orders.filter(o => o.status === 'CANCELLED').length
        
        // Products sold
        const productsSold = products.reduce((sum, p) => sum + (p._count?.orderItems || 0), 0)
        
        // New customers this month
        const newCustomers = users.filter(u => new Date(u.createdAt) >= thisMonthStart).length
        
        setStats({
          thisMonthRevenue,
          lastMonthRevenue,
          totalOrders: orders.length,
          completedOrders,
          pendingOrders,
          cancelledOrders,
          totalProducts: products.length,
          productsSold,
          totalCustomers: users.length,
          newCustomers,
        })
        
        // Calculate monthly data (last 6 months)
        const monthly: MonthlyData[] = []
        for (let i = 5; i >= 0; i--) {
          const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
          const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
          const monthOrders = orders.filter(o => {
            const date = new Date(o.createdAt)
            return date >= monthStart && date <= monthEnd
          })
          monthly.push({
            month: MONTH_NAMES[monthStart.getMonth()],
            revenue: monthOrders.reduce((sum, o) => sum + Number(o.total), 0),
            orders: monthOrders.length,
          })
        }
        setMonthlyData(monthly)
        
        // Calculate category data
        const categoryRevenue: Record<string, { name: string; revenue: number; orders: number }> = {}
        
        // Initialize categories
        categories.forEach(cat => {
          categoryRevenue[cat.id] = { name: cat.name, revenue: 0, orders: 0 }
        })
        
        // Calculate from products
        products.forEach(p => {
          if (p.categoryId && categoryRevenue[p.categoryId]) {
            const salesCount = p._count?.orderItems || 0
            categoryRevenue[p.categoryId].revenue += salesCount * Number(p.price)
            categoryRevenue[p.categoryId].orders += salesCount
          }
        })
        
        // Convert to array and calculate percentages
        const totalCategoryRevenue = Object.values(categoryRevenue).reduce((sum, c) => sum + c.revenue, 0)
        const categoryArray = Object.values(categoryRevenue)
          .filter(c => c.revenue > 0)
          .map(c => ({
            ...c,
            percentage: totalCategoryRevenue > 0 ? Math.round((c.revenue / totalCategoryRevenue) * 100) : 0,
          }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 4)
        
        setCategoryData(categoryArray)
        
        // Recent activity from orders
        const activity: ActivityItem[] = orders.slice(0, 5).map(order => ({
          type: order.paymentStatus === 'PAID' ? 'payment' as const : 'order' as const,
          message: order.paymentStatus === 'PAID' 
            ? `ชำระเงินสำเร็จ #${order.orderNumber}` 
            : `คำสั่งซื้อใหม่ #${order.orderNumber}`,
          time: formatTimeAgo(order.createdAt),
          amount: Number(order.total),
        }))
        
        // Add new customer activity
        const recentUsers = users.slice(0, 2)
        recentUsers.forEach(user => {
          activity.push({
            type: 'customer',
            message: 'ลูกค้าใหม่ลงทะเบียน',
            time: formatTimeAgo(user.createdAt),
          })
        })
        
        setRecentActivity(activity.slice(0, 5))
        
      } catch (error) {
        console.error('Failed to fetch report data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchReportData()
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

  const revenueChange = stats?.lastMonthRevenue 
    ? ((stats.thisMonthRevenue - stats.lastMonthRevenue) / stats.lastMonthRevenue) * 100 
    : 0

  const maxMonthlyRevenue = Math.max(...monthlyData.map(m => m.revenue), 1)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 text-transparent bg-clip-text mb-2">รายงาน</h1>
          <p className="text-muted-foreground">วิเคราะห์ข้อมูลและประสิทธิภาพร้านค้า</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="ช่วงเวลา" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">วันนี้</SelectItem>
              <SelectItem value="thisWeek">สัปดาห์นี้</SelectItem>
              <SelectItem value="thisMonth">เดือนนี้</SelectItem>
              <SelectItem value="thisYear">ปีนี้</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-amber-500/30 text-amber-500 hover:bg-amber-500/10">
            <Download className="w-4 h-4 mr-2" />
            ดาวน์โหลด
          </Button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="glass" className="p-6 border-amber-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-amber-500/20 rounded-full blur-2xl" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              {revenueChange !== 0 && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
                  revenueChange > 0 ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'
                }`}>
                  {revenueChange > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {Math.abs(revenueChange).toFixed(1)}%
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-1">รายได้เดือนนี้</p>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(stats?.thisMonthRevenue || 0)}</p>
            <p className="text-xs text-muted-foreground mt-2">เทียบกับเดือนที่แล้ว</p>
          </div>
        </Card>

        <Card variant="glass" className="p-6 border-amber-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/20 to-yellow-600/20 rounded-full blur-2xl" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">คำสั่งซื้อทั้งหมด</p>
            <p className="text-2xl font-bold text-foreground">{(stats?.totalOrders || 0).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-2">{stats?.completedOrders || 0} สำเร็จ</p>
          </div>
        </Card>

        <Card variant="glass" className="p-6 border-amber-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-full blur-2xl" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">สินค้าขายได้</p>
            <p className="text-2xl font-bold text-foreground">{(stats?.productsSold || 0).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-2">{stats?.totalProducts || 0} สินค้าในคลัง</p>
          </div>
        </Card>

        <Card variant="glass" className="p-6 border-amber-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-amber-400/20 rounded-full blur-2xl" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-400 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">ลูกค้าทั้งหมด</p>
            <p className="text-2xl font-bold text-foreground">{(stats?.totalCustomers || 0).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-2">{stats?.newCustomers || 0} ลูกค้าใหม่เดือนนี้</p>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card variant="glass" className="p-6 border-amber-500/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">รายได้รายเดือน</h2>
            </div>
          </div>
          
          {/* Simple Bar Chart */}
          <div className="space-y-4">
            {monthlyData.length > 0 ? monthlyData.map((data) => (
              <div key={data.month} className="flex items-center gap-4">
                <span className="w-12 text-sm text-muted-foreground">{data.month}</span>
                <div className="flex-1 h-8 bg-muted rounded-lg overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 rounded-lg transition-all duration-500"
                    style={{ width: `${(data.revenue / maxMonthlyRevenue) * 100}%` }}
                  />
                </div>
                <span className="w-24 text-sm text-foreground text-right">{formatCurrency(data.revenue)}</span>
              </div>
            )) : (
              <div className="text-center py-8 text-muted-foreground">ยังไม่มีข้อมูล</div>
            )}
          </div>
        </Card>

        {/* Categories Chart */}
        <Card variant="glass" className="p-6 border-amber-500/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
                <PieChart className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">หมวดหมู่ยอดนิยม</h2>
            </div>
          </div>
          
          <div className="space-y-4">
            {categoryData.length > 0 ? categoryData.map((category, index) => (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-yellow-400' :
                      index === 1 ? 'bg-amber-500' :
                      index === 2 ? 'bg-yellow-600' :
                      'bg-amber-400'
                    }`} />
                    <span className="text-foreground font-medium">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-amber-500 font-semibold">{formatCurrency(category.revenue)}</span>
                    <span className="text-muted-foreground text-sm ml-2">({category.percentage}%)</span>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      index === 0 ? 'bg-yellow-400' :
                      index === 1 ? 'bg-amber-500' :
                      index === 2 ? 'bg-yellow-600' :
                      'bg-amber-400'
                    }`}
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{category.orders} คำสั่งซื้อ</p>
              </div>
            )) : (
              <div className="text-center py-8 text-muted-foreground">ยังไม่มีข้อมูล</div>
            )}
          </div>
        </Card>
      </div>

      {/* Activity & Quick Stats */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card variant="glass" className="p-6 border-amber-500/20 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">กิจกรรมล่าสุด</h2>
            </div>
            <Badge variant="gold" className="animate-pulse">Live</Badge>
          </div>
          
          <div className="space-y-4">
            {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.type === 'order' ? 'bg-amber-500/20 text-amber-500' :
                  activity.type === 'payment' ? 'bg-emerald-500/20 text-emerald-500' :
                  'bg-blue-500/20 text-blue-500'
                }`}>
                  {activity.type === 'order' ? <ShoppingCart className="w-5 h-5" /> :
                   activity.type === 'payment' ? <DollarSign className="w-5 h-5" /> :
                   <Users className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <p className="text-foreground">{activity.message}</p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
                {activity.amount && (
                  <span className="text-amber-500 font-semibold">{formatCurrency(activity.amount)}</span>
                )}
              </div>
            )) : (
              <div className="text-center py-8 text-muted-foreground">ยังไม่มีกิจกรรม</div>
            )}
          </div>
        </Card>

        {/* Order Status */}
        <Card variant="glass" className="p-6 border-amber-500/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">สถานะคำสั่งซื้อ</h2>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-emerald-500">สำเร็จ</span>
                <span className="text-2xl font-bold text-foreground">{stats?.completedOrders || 0}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${stats?.totalOrders ? (stats.completedOrders / stats.totalOrders) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-amber-500">รอดำเนินการ</span>
                <span className="text-2xl font-bold text-foreground">{stats?.pendingOrders || 0}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${stats?.totalOrders ? (stats.pendingOrders / stats.totalOrders) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-muted/50 border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">ยกเลิก</span>
                <span className="text-2xl font-bold text-foreground">{stats?.cancelledOrders || 0}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-muted-foreground rounded-full"
                  style={{ width: `${stats?.totalOrders ? (stats.cancelledOrders / stats.totalOrders) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
