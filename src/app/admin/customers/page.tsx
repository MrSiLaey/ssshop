'use client'

import { useState } from 'react'
import { 
  Search, 
  Filter, 
  Eye,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Calendar,
  MoreHorizontal,
  UserPlus,
  Download,
  Crown,
  Star,
  TrendingUp
} from 'lucide-react'
import { Card, Badge, Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'

// Mock data
const customers = [
  {
    id: '1',
    name: 'สมชาย ใจดี',
    email: 'somchai@email.com',
    phone: '081-234-5678',
    address: 'กรุงเทพมหานคร',
    totalOrders: 12,
    totalSpent: 45890,
    status: 'VIP',
    joinDate: '2023-06-15',
    lastOrder: '2024-01-15',
    avatar: 'S',
  },
  {
    id: '2',
    name: 'สมหญิง ดีใจ',
    email: 'somying@email.com',
    phone: '082-345-6789',
    address: 'เชียงใหม่',
    totalOrders: 8,
    totalSpent: 28450,
    status: 'REGULAR',
    joinDate: '2023-09-20',
    lastOrder: '2024-01-14',
    avatar: 'S',
  },
  {
    id: '3',
    name: 'ประพนธ์ มั่นคง',
    email: 'prapon@email.com',
    phone: '083-456-7890',
    address: 'ภูเก็ต',
    totalOrders: 5,
    totalSpent: 15980,
    status: 'REGULAR',
    joinDate: '2023-11-10',
    lastOrder: '2024-01-10',
    avatar: 'P',
  },
  {
    id: '4',
    name: 'นารี สุขใจ',
    email: 'naree@email.com',
    phone: '084-567-8901',
    address: 'ขอนแก่น',
    totalOrders: 3,
    totalSpent: 8790,
    status: 'NEW',
    joinDate: '2024-01-01',
    lastOrder: '2024-01-12',
    avatar: 'N',
  },
  {
    id: '5',
    name: 'วิชัย ดีมาก',
    email: 'wichai@email.com',
    phone: '085-678-9012',
    address: 'ชลบุรี',
    totalOrders: 15,
    totalSpent: 68500,
    status: 'VIP',
    joinDate: '2023-03-25',
    lastOrder: '2024-01-13',
    avatar: 'W',
  },
]

const statusConfig = {
  VIP: { label: 'VIP', variant: 'warning' as const, icon: Crown },
  REGULAR: { label: 'ลูกค้าประจำ', variant: 'success' as const, icon: Star },
  NEW: { label: 'ลูกค้าใหม่', variant: 'info' as const, icon: TrendingUp },
}

export default function AdminCustomersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])

  const filteredCustomers = customers.filter((customer) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phone.includes(query)
      )
    }
    if (statusFilter !== 'all' && customer.status !== statusFilter) {
      return false
    }
    return true
  })

  const toggleSelect = (id: string) => {
    setSelectedCustomers((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([])
    } else {
      setSelectedCustomers(filteredCustomers.map((c) => c.id))
    }
  }

  // Stats
  const totalCustomers = customers.length
  const vipCustomers = customers.filter(c => c.status === 'VIP').length
  const newCustomers = customers.filter(c => c.status === 'NEW').length
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 text-transparent bg-clip-text mb-2">ลูกค้า</h1>
          <p className="text-slate-400">จัดการข้อมูลลูกค้าทั้งหมด</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10">
            <Download className="w-4 h-4 mr-2" />
            ส่งออก
          </Button>
          <Button className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400">
            <UserPlus className="w-4 h-4 mr-2" />
            เพิ่มลูกค้า
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card variant="glass" className="p-4 border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalCustomers}</p>
              <p className="text-sm text-slate-400">ลูกค้าทั้งหมด</p>
            </div>
          </div>
        </Card>
        <Card variant="glass" className="p-4 border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{vipCustomers}</p>
              <p className="text-sm text-slate-400">ลูกค้า VIP</p>
            </div>
          </div>
        </Card>
        <Card variant="glass" className="p-4 border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{newCustomers}</p>
              <p className="text-sm text-slate-400">ลูกค้าใหม่</p>
            </div>
          </div>
        </Card>
        <Card variant="glass" className="p-4 border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-400 flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalRevenue)}</p>
              <p className="text-sm text-slate-400">รายได้รวม</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card variant="glass" className="p-4 border-amber-500/20">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="ค้นหาชื่อ, อีเมล หรือเบอร์โทร..."
              icon={<Search className="h-4 w-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="ประเภทลูกค้า" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทั้งหมด</SelectItem>
              <SelectItem value="VIP">VIP</SelectItem>
              <SelectItem value="REGULAR">ลูกค้าประจำ</SelectItem>
              <SelectItem value="NEW">ลูกค้าใหม่</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Customers Table */}
      <Card variant="glass" className="overflow-hidden border-amber-500/20">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-slate-400 bg-slate-800/50">
                <th className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500"
                  />
                </th>
                <th className="p-4 font-medium">ลูกค้า</th>
                <th className="p-4 font-medium">ติดต่อ</th>
                <th className="p-4 font-medium">คำสั่งซื้อ</th>
                <th className="p-4 font-medium">ยอดสั่งซื้อรวม</th>
                <th className="p-4 font-medium">ประเภท</th>
                <th className="p-4 font-medium">สั่งซื้อล่าสุด</th>
                <th className="p-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => {
                const status = statusConfig[customer.status as keyof typeof statusConfig]
                const StatusIcon = status.icon
                return (
                  <tr key={customer.id} className="border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={() => toggleSelect(customer.id)}
                        className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
                          customer.status === 'VIP' 
                            ? 'bg-gradient-to-br from-yellow-500 to-amber-500' 
                            : customer.status === 'NEW'
                            ? 'bg-gradient-to-br from-amber-500 to-yellow-600'
                            : 'bg-gradient-to-br from-slate-600 to-slate-700'
                        }`}>
                          {customer.avatar}
                        </div>
                        <div>
                          <p className="text-white font-medium">{customer.name}</p>
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <MapPin className="w-3 h-3" />
                            {customer.address}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Mail className="w-4 h-4 text-slate-500" />
                          {customer.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Phone className="w-4 h-4 text-slate-500" />
                          {customer.phone}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-white font-medium">{customer.totalOrders} รายการ</span>
                    </td>
                    <td className="p-4">
                      <span className="text-amber-400 font-semibold">{formatCurrency(customer.totalSpent)}</span>
                    </td>
                    <td className="p-4">
                      <Badge variant={status.variant} className="flex items-center gap-1 w-fit">
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="text-slate-400 text-sm">{customer.lastOrder}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-300">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between">
          <p className="text-sm text-slate-400">
            แสดง {filteredCustomers.length} จาก {customers.length} ลูกค้า
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled className="border-slate-700">
              ก่อนหน้า
            </Button>
            <Button variant="outline" size="sm" className="border-amber-500/30 text-amber-400">
              1
            </Button>
            <Button variant="outline" size="sm" disabled className="border-slate-700">
              ถัดไป
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
