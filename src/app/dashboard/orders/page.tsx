'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Package, 
  Eye, 
  Download, 
  Filter,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  ArrowLeft
} from 'lucide-react'
import { Header, Footer } from '@/components/layout'
import { Card, Badge, Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'

// Mock data
const orders = [
  {
    id: 'ORD-2024-001234',
    date: '2024-01-15',
    total: 2990,
    status: 'COMPLETED',
    paymentStatus: 'PAID',
    items: [
      { name: 'Premium Software License', quantity: 1, price: 2990, isDigital: true },
    ],
  },
  {
    id: 'ORD-2024-001233',
    date: '2024-01-10',
    total: 4980,
    status: 'SHIPPED',
    paymentStatus: 'PAID',
    trackingNumber: 'TH12345678901',
    items: [
      { name: 'Wireless Keyboard RGB', quantity: 1, price: 2490, isDigital: false },
      { name: 'Gaming Mouse Pro', quantity: 1, price: 2490, isDigital: false },
    ],
  },
  {
    id: 'ORD-2024-001232',
    date: '2024-01-05',
    total: 1490,
    status: 'PROCESSING',
    paymentStatus: 'PAID',
    items: [
      { name: 'Developer Toolkit Pro', quantity: 1, price: 1490, isDigital: true },
    ],
  },
  {
    id: 'ORD-2024-001231',
    date: '2024-01-01',
    total: 990,
    status: 'CANCELLED',
    paymentStatus: 'REFUNDED',
    items: [
      { name: 'Cloud Storage 1TB License', quantity: 1, price: 990, isDigital: true },
    ],
  },
]

const statusConfig = {
  COMPLETED: { label: 'สำเร็จ', variant: 'success' as const, icon: CheckCircle2 },
  SHIPPED: { label: 'จัดส่งแล้ว', variant: 'info' as const, icon: Truck },
  PROCESSING: { label: 'กำลังดำเนินการ', variant: 'warning' as const, icon: Clock },
  PENDING: { label: 'รอดำเนินการ', variant: 'secondary' as const, icon: Clock },
  CANCELLED: { label: 'ยกเลิก', variant: 'destructive' as const, icon: XCircle },
}

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  const filteredOrders = orders.filter((order) => {
    if (searchQuery && !order.id.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false
    }
    return true
  })

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
              <p className="text-muted-foreground">ดูและติดตามคำสั่งซื้อทั้งหมดของคุณ</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="ค้นหาหมายเลขคำสั่งซื้อ..."
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
                <SelectItem value="CANCELLED">ยกเลิก</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orders List */}
          {filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const status = statusConfig[order.status as keyof typeof statusConfig]
                const isExpanded = expandedOrder === order.id

                return (
                  <Card key={order.id} variant="glass" className="overflow-hidden">
                    {/* Order Header */}
                    <div
                      className="p-6 cursor-pointer"
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                            <Package className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-mono font-semibold text-foreground">{order.id}</p>
                            <p className="text-sm text-muted-foreground">{order.date} • {order.items.length} รายการ</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-bold text-foreground">{formatCurrency(order.total)}</p>
                            <Badge variant={status.variant} className="mt-1">
                              <status.icon className="w-3 h-3 mr-1" />
                              {status.label}
                            </Badge>
                          </div>
                          <Eye className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                    </div>

                    {/* Order Details (Expandable) */}
                    {isExpanded && (
                      <div className="border-t border-border p-6 bg-muted/50">
                        {/* Items */}
                        <h4 className="font-medium text-foreground mb-4">รายการสินค้า</h4>
                        <div className="space-y-3 mb-6">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                                  {item.isDigital ? (
                                    <Download className="w-5 h-5 text-primary" />
                                  ) : (
                                    <Package className="w-5 h-5 text-muted-foreground" />
                                  )}
                                </div>
                                <div>
                                  <p className="text-foreground">{item.name}</p>
                                  <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                                </div>
                              </div>
                              <span className="font-medium text-foreground">{formatCurrency(item.price)}</span>
                            </div>
                          ))}
                        </div>

                        {/* Tracking Number */}
                        {order.trackingNumber && (
                          <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg mb-4">
                            <div className="flex items-center gap-2">
                              <Truck className="w-4 h-4 text-primary" />
                              <span className="text-sm text-muted-foreground">หมายเลขพัสดุ:</span>
                              <span className="font-mono text-foreground">{order.trackingNumber}</span>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3">
                          {order.status === 'COMPLETED' && order.items.some((i) => i.isDigital) && (
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              ดาวน์โหลด
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            ดูรายละเอียด
                          </Button>
                        </div>
                      </div>
                    )}
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card variant="glass" className="p-12 text-center">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">ไม่พบคำสั่งซื้อ</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || statusFilter !== 'all'
                  ? 'ลองปรับตัวกรองหรือค้นหาด้วยคำอื่น'
                  : 'คุณยังไม่มีคำสั่งซื้อใดๆ'}
              </p>
              <Link href="/shop">
                <Button>ไปยังร้านค้า</Button>
              </Link>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
