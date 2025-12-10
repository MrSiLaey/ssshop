'use client'

import { useState } from 'react'
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
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
  PieChart,
  Activity
} from 'lucide-react'
import { Card, Badge, Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'

// Mock data
const revenueData = {
  today: 45890,
  yesterday: 38750,
  thisWeek: 285400,
  lastWeek: 256800,
  thisMonth: 1245800,
  lastMonth: 1156200,
}

const orderStats = {
  total: 1247,
  completed: 1089,
  pending: 98,
  cancelled: 60,
}

const topCategories = [
  { name: 'Software', revenue: 685400, percentage: 55, orders: 458 },
  { name: 'Hardware', revenue: 324500, percentage: 26, orders: 234 },
  { name: 'Licenses', revenue: 156800, percentage: 13, orders: 312 },
  { name: 'Services', revenue: 79100, percentage: 6, orders: 89 },
]

const recentActivity = [
  { type: 'order', message: 'คำสั่งซื้อใหม่ #ORD-2024-001234', time: '5 นาทีที่แล้ว', amount: 2990 },
  { type: 'payment', message: 'ชำระเงินสำเร็จ #PAY-2024-005678', time: '12 นาทีที่แล้ว', amount: 4980 },
  { type: 'customer', message: 'ลูกค้าใหม่ลงทะเบียน', time: '25 นาทีที่แล้ว', amount: null },
  { type: 'order', message: 'คำสั่งซื้อจัดส่งแล้ว #ORD-2024-001230', time: '1 ชั่วโมงที่แล้ว', amount: 5980 },
  { type: 'review', message: 'รีวิวสินค้าใหม่ ⭐⭐⭐⭐⭐', time: '2 ชั่วโมงที่แล้ว', amount: null },
]

const monthlyData = [
  { month: 'ม.ค.', revenue: 980000, orders: 245 },
  { month: 'ก.พ.', revenue: 1120000, orders: 289 },
  { month: 'มี.ค.', revenue: 1045000, orders: 267 },
  { month: 'เม.ย.', revenue: 1280000, orders: 312 },
  { month: 'พ.ค.', revenue: 1156000, orders: 298 },
  { month: 'มิ.ย.', revenue: 1345000, orders: 334 },
]

export default function AdminReportsPage() {
  const [timeRange, setTimeRange] = useState('thisMonth')

  const revenueChange = ((revenueData.thisMonth - revenueData.lastMonth) / revenueData.lastMonth) * 100

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
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
                revenueChange > 0 ? 'bg-emerald-500/20 text-emerald-500' : 'bg-muted text-muted-foreground'
              }`}>
                {revenueChange > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {Math.abs(revenueChange).toFixed(1)}%
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">รายได้รวม</p>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(revenueData.thisMonth)}</p>
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
              <div className="flex items-center gap-1 px-2 py-1 rounded-full text-sm bg-emerald-500/20 text-emerald-500">
                <ArrowUpRight className="w-4 h-4" />
                8.5%
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">คำสั่งซื้อทั้งหมด</p>
            <p className="text-2xl font-bold text-foreground">{orderStats.total.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-2">{orderStats.completed} สำเร็จ</p>
          </div>
        </Card>

        <Card variant="glass" className="p-6 border-amber-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-full blur-2xl" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full text-sm bg-emerald-500/20 text-emerald-500">
                <ArrowUpRight className="w-4 h-4" />
                12%
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">สินค้าขายได้</p>
            <p className="text-2xl font-bold text-foreground">2,847</p>
            <p className="text-xs text-muted-foreground mt-2">156 สินค้าในคลัง</p>
          </div>
        </Card>

        <Card variant="glass" className="p-6 border-amber-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-amber-400/20 rounded-full blur-2xl" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-400 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full text-sm bg-emerald-500/20 text-emerald-500">
                <ArrowUpRight className="w-4 h-4" />
                5.2%
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">ลูกค้าทั้งหมด</p>
            <p className="text-2xl font-bold text-foreground">1,589</p>
            <p className="text-xs text-muted-foreground mt-2">48 ลูกค้าใหม่เดือนนี้</p>
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
            <Button variant="ghost" size="sm" className="text-amber-500 hover:text-amber-400">
              ดูเพิ่มเติม
            </Button>
          </div>
          
          {/* Simple Bar Chart */}
          <div className="space-y-4">
            {monthlyData.map((data, index) => (
              <div key={data.month} className="flex items-center gap-4">
                <span className="w-12 text-sm text-muted-foreground">{data.month}</span>
                <div className="flex-1 h-8 bg-muted rounded-lg overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 rounded-lg transition-all duration-500"
                    style={{ width: `${(data.revenue / 1400000) * 100}%` }}
                  />
                </div>
                <span className="w-24 text-sm text-foreground text-right">{formatCurrency(data.revenue)}</span>
              </div>
            ))}
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
            {topCategories.map((category, index) => (
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
            ))}
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
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.type === 'order' ? 'bg-amber-500/20 text-amber-500' :
                  activity.type === 'payment' ? 'bg-emerald-500/20 text-emerald-500' :
                  activity.type === 'customer' ? 'bg-blue-500/20 text-blue-500' :
                  'bg-yellow-500/20 text-yellow-500'
                }`}>
                  {activity.type === 'order' ? <ShoppingCart className="w-5 h-5" /> :
                   activity.type === 'payment' ? <DollarSign className="w-5 h-5" /> :
                   activity.type === 'customer' ? <Users className="w-5 h-5" /> :
                   <Flame className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <p className="text-foreground">{activity.message}</p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
                {activity.amount && (
                  <span className="text-amber-500 font-semibold">{formatCurrency(activity.amount)}</span>
                )}
              </div>
            ))}
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
                <span className="text-2xl font-bold text-foreground">{orderStats.completed}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${(orderStats.completed / orderStats.total) * 100}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-amber-500">รอดำเนินการ</span>
                <span className="text-2xl font-bold text-foreground">{orderStats.pending}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${(orderStats.pending / orderStats.total) * 100}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-muted/50 border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">ยกเลิก</span>
                <span className="text-2xl font-bold text-foreground">{orderStats.cancelled}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-muted-foreground rounded-full"
                  style={{ width: `${(orderStats.cancelled / orderStats.total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
