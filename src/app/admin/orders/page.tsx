'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Eye,
  Download,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Truck
} from 'lucide-react'
import { Card, Badge, Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'

interface Order {
  id: string
  orderNumber: string
  user: { name: string | null; email: string }
  total: number
  status: string
  paymentStatus: string
  _count: { items: number }
  createdAt: string
  items: Array<{ product: { productType: string } }>
}

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
  FAILED: { label: 'ล้มเหลว', variant: 'destructive' as const },
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders?limit=100')
        if (res.ok) {
          const data = await res.json()
          setOrders(data.orders || [])
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const filteredOrders = orders.filter((order) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        order.orderNumber.toLowerCase().includes(query) ||
        (order.user.name?.toLowerCase().includes(query)) ||
        order.user.email.toLowerCase().includes(query)
      )
    }
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false
    }
    return true
  })

  const toggleSelect = (id: string) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(filteredOrders.map((o) => o.id))
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setOrders(orders.map(o => 
          o.id === orderId ? { ...o, status: newStatus } : o
        ))
      }
    } catch (error) {
      console.error('Failed to update order status:', error)
    }
  }

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

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">จัดการคำสั่งซื้อ</h1>
          <p className="text-muted-foreground">จัดการคำสั่งซื้อทั้งหมดในระบบ ({orders.length} รายการ)</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          ส่งออก
        </Button>
      </div>

      {/* Filters */}
      <Card variant="glass" className="p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="ค้นหาคำสั่งซื้อ หรือชื่อลูกค้า..."
              icon={<Search className="h-4 w-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="สถานะ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกสถานะ</SelectItem>
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
      {filteredOrders.length > 0 ? (
        <Card variant="glass" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === filteredOrders.length}
                      onChange={toggleSelectAll}
                      className="rounded border-border"
                    />
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">หมายเลข</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">ลูกค้า</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">ยอดรวม</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">รายการ</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">สถานะ</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">การชำระ</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">วันที่</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.PENDING
                  const payment = paymentConfig[order.paymentStatus as keyof typeof paymentConfig] || paymentConfig.PENDING
                  const hasDigital = order.items?.some(item => item.product?.productType === 'DIGITAL')
                  const StatusIcon = status.icon
                  const date = new Date(order.createdAt)

                  return (
                    <tr key={order.id} className="border-b border-border/50 hover:bg-muted/50">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => toggleSelect(order.id)}
                          className="rounded border-border"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{order.orderNumber}</span>
                          {hasDigital && (
                            <Download className="w-4 h-4 text-cyan-500" />
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-foreground">{order.user.name || 'ไม่ระบุชื่อ'}</p>
                          <p className="text-xs text-muted-foreground">{order.user.email}</p>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-foreground">
                        {formatCurrency(Number(order.total))}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {order._count?.items || 0} รายการ
                      </td>
                      <td className="p-4">
                        <Badge variant={status.variant} className="flex items-center gap-1 w-fit">
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant={payment.variant}>{payment.label}</Badge>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {date.toLocaleDateString('th-TH')} {date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Select 
                            value={order.status} 
                            onValueChange={(newStatus) => updateOrderStatus(order.id, newStatus)}
                          >
                            <SelectTrigger className="w-[140px] h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PENDING">รอดำเนินการ</SelectItem>
                              <SelectItem value="PROCESSING">กำลังดำเนินการ</SelectItem>
                              <SelectItem value="SHIPPED">จัดส่งแล้ว</SelectItem>
                              <SelectItem value="COMPLETED">สำเร็จ</SelectItem>
                              <SelectItem value="CANCELLED">ยกเลิก</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card variant="glass" className="p-12 text-center">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">ไม่พบคำสั่งซื้อ</h3>
          <p className="text-muted-foreground">
            {searchQuery || statusFilter !== 'all'
              ? 'ลองปรับตัวกรองหรือค้นหาด้วยคำอื่น'
              : 'ยังไม่มีคำสั่งซื้อในระบบ'
            }
          </p>
        </Card>
      )}
    </div>
  )
}
