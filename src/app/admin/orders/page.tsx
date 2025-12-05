'use client'

import { useState } from 'react'
import { 
  Search, 
  Filter, 
  Eye,
  Download,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  MoreHorizontal
} from 'lucide-react'
import { Card, Badge, Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'

// Mock data
const orders = [
  {
    id: 'ORD-2024-001234',
    customer: { name: 'สมชาย ใจดี', email: 'somchai@email.com' },
    total: 2990,
    status: 'COMPLETED',
    paymentStatus: 'PAID',
    items: 1,
    date: '2024-01-15 14:30',
    hasDigital: true,
  },
  {
    id: 'ORD-2024-001233',
    customer: { name: 'สมหญิง ดีใจ', email: 'somying@email.com' },
    total: 4980,
    status: 'SHIPPED',
    paymentStatus: 'PAID',
    items: 2,
    date: '2024-01-15 12:15',
    hasDigital: false,
  },
  {
    id: 'ORD-2024-001232',
    customer: { name: 'ประพนธ์ มั่นคง', email: 'prapon@email.com' },
    total: 1490,
    status: 'PROCESSING',
    paymentStatus: 'PAID',
    items: 1,
    date: '2024-01-15 10:00',
    hasDigital: true,
  },
  {
    id: 'ORD-2024-001231',
    customer: { name: 'นารี สุขใจ', email: 'naree@email.com' },
    total: 990,
    status: 'PENDING',
    paymentStatus: 'PENDING',
    items: 1,
    date: '2024-01-15 09:30',
    hasDigital: true,
  },
  {
    id: 'ORD-2024-001230',
    customer: { name: 'วิชัย ดีมาก', email: 'wichai@email.com' },
    total: 5980,
    status: 'CANCELLED',
    paymentStatus: 'REFUNDED',
    items: 3,
    date: '2024-01-14 16:45',
    hasDigital: false,
  },
]

const statusConfig = {
  COMPLETED: { label: 'สำเร็จ', variant: 'success' as const, icon: CheckCircle2 },
  SHIPPED: { label: 'จัดส่งแล้ว', variant: 'info' as const, icon: Truck },
  PROCESSING: { label: 'กำลังดำเนินการ', variant: 'warning' as const, icon: Clock },
  PENDING: { label: 'รอดำเนินการ', variant: 'secondary' as const, icon: Clock },
  CANCELLED: { label: 'ยกเลิก', variant: 'destructive' as const, icon: XCircle },
}

const paymentConfig = {
  PAID: { label: 'ชำระแล้ว', variant: 'success' as const },
  PENDING: { label: 'รอชำระ', variant: 'warning' as const },
  REFUNDED: { label: 'คืนเงินแล้ว', variant: 'secondary' as const },
}

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

  const filteredOrders = orders.filter((order) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        order.id.toLowerCase().includes(query) ||
        order.customer.name.toLowerCase().includes(query) ||
        order.customer.email.toLowerCase().includes(query)
      )
    }
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false
    }
    return true
  })

  const toggleSelect = (id: string) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(filteredOrders.map((o) => o.id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 text-transparent bg-clip-text mb-2">คำสั่งซื้อ</h1>
        <p className="text-slate-400">จัดการคำสั่งซื้อทั้งหมด</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        {Object.entries(statusConfig).slice(0, 4).map(([key, config]) => {
          const count = orders.filter((o) => o.status === key).length
          return (
            <Card key={key} variant="glass" className="p-4 border-amber-500/20">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  config.variant === 'success' ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/20' :
                  config.variant === 'warning' ? 'bg-gradient-to-br from-amber-500/20 to-yellow-500/20' :
                  config.variant === 'info' ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/20' :
                  'bg-slate-800'
                }`}>
                  <config.icon className={`w-6 h-6 ${
                    config.variant === 'success' ? 'text-emerald-400' :
                    config.variant === 'warning' ? 'text-amber-400' :
                    config.variant === 'info' ? 'text-blue-400' :
                    'text-slate-400'
                  }`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{count}</p>
                  <p className="text-sm text-slate-400">{config.label}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Filters */}
      <Card variant="glass" className="p-4 border-amber-500/20">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="ค้นหาหมายเลข, ชื่อ หรืออีเมล..."
              icon={<Search className="h-4 w-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="สถานะทั้งหมด" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">สถานะทั้งหมด</SelectItem>
              <SelectItem value="COMPLETED">สำเร็จ</SelectItem>
              <SelectItem value="SHIPPED">จัดส่งแล้ว</SelectItem>
              <SelectItem value="PROCESSING">กำลังดำเนินการ</SelectItem>
              <SelectItem value="PENDING">รอดำเนินการ</SelectItem>
              <SelectItem value="CANCELLED">ยกเลิก</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Orders Table */}
      <Card variant="glass" className="overflow-hidden border-amber-500/20">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-slate-400 bg-slate-800/50">
                <th className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500"
                  />
                </th>
                <th className="p-4 font-medium">หมายเลข</th>
                <th className="p-4 font-medium">ลูกค้า</th>
                <th className="p-4 font-medium">ยอดรวม</th>
                <th className="p-4 font-medium">สถานะ</th>
                <th className="p-4 font-medium">การชำระ</th>
                <th className="p-4 font-medium">ประเภท</th>
                <th className="p-4 font-medium">วันที่</th>
                <th className="p-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const status = statusConfig[order.status as keyof typeof statusConfig]
                const payment = paymentConfig[order.paymentStatus as keyof typeof paymentConfig]
                return (
                  <tr key={order.id} className="border-t border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => toggleSelect(order.id)}
                        className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500"
                      />
                    </td>
                    <td className="p-4">
                      <span className="font-mono font-medium text-amber-400">{order.id}</span>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-white font-medium">{order.customer.name}</p>
                        <p className="text-sm text-slate-500">{order.customer.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-white">{formatCurrency(order.total)}</span>
                    </td>
                    <td className="p-4">
                      <Badge variant={status.variant}>
                        <status.icon className="w-3 h-3 mr-1" />
                        {status.label}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={payment.variant}>{payment.label}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        {order.hasDigital && (
                          <span title="สินค้าดิจิทัล"><Download className="w-4 h-4 text-amber-400" /></span>
                        )}
                        {!order.hasDigital && (
                          <span title="สินค้าจัดส่ง"><Package className="w-4 h-4 text-slate-400" /></span>
                        )}
                        <span className="text-slate-500 text-sm">×{order.items}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-slate-400 text-sm">{order.date}</span>
                    </td>
                    <td className="p-4">
                      <Button variant="ghost" size="icon" className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-slate-800">
          <p className="text-sm text-slate-400">
            แสดง {filteredOrders.length} จาก {orders.length} รายการ
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled className="border-slate-700">ก่อนหน้า</Button>
            <Button variant="outline" size="sm" disabled className="border-slate-700">ถัดไป</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
