'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Eye,
  Mail,
  ShoppingBag,
  Calendar,
  UserPlus,
  Crown,
  Star,
  TrendingUp,
  User
} from 'lucide-react'
import { Card, Badge, Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'

interface Customer {
  id: string
  name: string | null
  email: string
  phone: string | null
  role: string
  createdAt: string
  _count: { orders: number }
  orders: Array<{ total: number; createdAt: string }>
}

const statusConfig = {
  VIP: { label: 'VIP', variant: 'warning' as const, icon: Crown },
  REGULAR: { label: 'ลูกค้าประจำ', variant: 'success' as const, icon: Star },
  NEW: { label: 'ลูกค้าใหม่', variant: 'info' as const, icon: TrendingUp },
}

function getCustomerStatus(ordersCount: number, totalSpent: number) {
  if (totalSpent >= 50000 || ordersCount >= 10) return 'VIP'
  if (ordersCount >= 3) return 'REGULAR'
  return 'NEW'
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await fetch('/api/users?limit=100')
        if (res.ok) {
          const data = await res.json()
          setCustomers(data.users || [])
        }
      } catch (error) {
        console.error('Failed to fetch customers:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCustomers()
  }, [])

  const processedCustomers = customers.map(customer => {
    const totalSpent = customer.orders?.reduce((sum, o) => sum + Number(o.total), 0) || 0
    const lastOrder = customer.orders?.[0]?.createdAt
    return {
      ...customer,
      totalSpent,
      lastOrder,
      customerStatus: getCustomerStatus(customer._count?.orders || 0, totalSpent),
    }
  })

  const filteredCustomers = processedCustomers.filter((customer) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        customer.name?.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phone?.toLowerCase().includes(query)
      )
    }
    if (statusFilter !== 'all' && customer.customerStatus !== statusFilter) {
      return false
    }
    return true
  })

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
          <h1 className="text-2xl font-bold text-foreground">จัดการลูกค้า</h1>
          <p className="text-muted-foreground">จัดการลูกค้าทั้งหมดในระบบ ({customers.length} คน)</p>
        </div>
        <Button variant="neon">
          <UserPlus className="w-4 h-4 mr-2" />
          เพิ่มลูกค้า
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <Crown className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ลูกค้า VIP</p>
              <p className="text-xl font-bold text-foreground">
                {processedCustomers.filter(c => c.customerStatus === 'VIP').length}
              </p>
            </div>
          </div>
        </Card>
        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Star className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ลูกค้าประจำ</p>
              <p className="text-xl font-bold text-foreground">
                {processedCustomers.filter(c => c.customerStatus === 'REGULAR').length}
              </p>
            </div>
          </div>
        </Card>
        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-cyan-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ลูกค้าใหม่</p>
              <p className="text-xl font-bold text-foreground">
                {processedCustomers.filter(c => c.customerStatus === 'NEW').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card variant="glass" className="p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="ค้นหาลูกค้า..."
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
              <SelectItem value="VIP">VIP</SelectItem>
              <SelectItem value="REGULAR">ลูกค้าประจำ</SelectItem>
              <SelectItem value="NEW">ลูกค้าใหม่</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Customers Table */}
      {filteredCustomers.length > 0 ? (
        <Card variant="glass" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">ลูกค้า</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">อีเมล</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">เบอร์โทร</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">คำสั่งซื้อ</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">ยอดซื้อรวม</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">สถานะ</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">สมัครเมื่อ</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => {
                  const status = statusConfig[customer.customerStatus as keyof typeof statusConfig]
                  const StatusIcon = status.icon
                  const joinDate = new Date(customer.createdAt)

                  return (
                    <tr key={customer.id} className="border-b border-border/50 hover:bg-muted/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-primary font-medium">
                              {customer.name?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
                            </span>
                          </div>
                          <span className="font-medium text-foreground">
                            {customer.name || 'ไม่ระบุชื่อ'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          {customer.email}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {customer.phone || '-'}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <ShoppingBag className="w-4 h-4" />
                          {customer._count?.orders || 0}
                        </div>
                      </td>
                      <td className="p-4 font-medium text-foreground">
                        {formatCurrency(customer.totalSpent)}
                      </td>
                      <td className="p-4">
                        <Badge variant={status.variant} className="flex items-center gap-1 w-fit">
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {joinDate.toLocaleDateString('th-TH')}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
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
          <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">ไม่พบลูกค้า</h3>
          <p className="text-muted-foreground">
            {searchQuery || statusFilter !== 'all'
              ? 'ลองปรับตัวกรองหรือค้นหาด้วยคำอื่น'
              : 'ยังไม่มีลูกค้าในระบบ'
            }
          </p>
        </Card>
      )}
    </div>
  )
}
