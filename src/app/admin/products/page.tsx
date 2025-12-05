'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Download,
  Package,
  MoreHorizontal
} from 'lucide-react'
import { Card, Badge, Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'

// Mock data
const products = [
  {
    id: '1',
    name: 'Premium Software License',
    slug: 'premium-software-license',
    sku: 'PSL-001',
    price: 2990,
    stock: 999,
    category: 'Software',
    type: 'DIGITAL',
    status: 'ACTIVE',
    sales: 156,
  },
  {
    id: '2',
    name: 'Developer Toolkit Pro',
    slug: 'developer-toolkit-pro',
    sku: 'DTP-001',
    price: 1490,
    stock: 999,
    category: 'Development',
    type: 'DIGITAL',
    status: 'ACTIVE',
    sales: 98,
  },
  {
    id: '3',
    name: 'Wireless Keyboard RGB',
    slug: 'wireless-keyboard-rgb',
    sku: 'WKR-001',
    price: 2490,
    stock: 45,
    category: 'Hardware',
    type: 'PHYSICAL',
    status: 'ACTIVE',
    sales: 87,
  },
  {
    id: '4',
    name: 'Gaming Mouse Pro',
    slug: 'gaming-mouse-pro',
    sku: 'GMP-001',
    price: 1890,
    stock: 32,
    category: 'Hardware',
    type: 'PHYSICAL',
    status: 'ACTIVE',
    sales: 76,
  },
  {
    id: '5',
    name: 'Cloud Storage 1TB License',
    slug: 'cloud-storage-1tb-license',
    sku: 'CSL-001',
    price: 990,
    stock: 999,
    category: 'Software',
    type: 'DIGITAL',
    status: 'DRAFT',
    sales: 0,
  },
]

const statusConfig = {
  ACTIVE: { label: 'เปิดขาย', variant: 'success' as const },
  DRAFT: { label: 'แบบร่าง', variant: 'secondary' as const },
  ARCHIVED: { label: 'เก็บถาวร', variant: 'destructive' as const },
}

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  const filteredProducts = products.filter((product) => {
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (typeFilter !== 'all' && product.type !== typeFilter) {
      return false
    }
    if (statusFilter !== 'all' && product.status !== statusFilter) {
      return false
    }
    return true
  })

  const toggleSelect = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 text-transparent bg-clip-text mb-2">สินค้า</h1>
          <p className="text-slate-400">จัดการสินค้าทั้งหมดในร้านค้า</p>
        </div>
        <Button className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400">
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มสินค้าใหม่
        </Button>
      </div>

      {/* Filters */}
      <Card variant="glass" className="p-4 border-amber-500/20">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="ค้นหาสินค้า..."
              icon={<Search className="h-4 w-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="ประเภท" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกประเภท</SelectItem>
              <SelectItem value="DIGITAL">ดิจิทัล</SelectItem>
              <SelectItem value="PHYSICAL">จัดส่ง</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="สถานะ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกสถานะ</SelectItem>
              <SelectItem value="ACTIVE">เปิดขาย</SelectItem>
              <SelectItem value="DRAFT">แบบร่าง</SelectItem>
              <SelectItem value="ARCHIVED">เก็บถาวร</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Products Table */}
      <Card variant="glass" className="overflow-hidden border-amber-500/20">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-slate-400 bg-slate-800/50">
                <th className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500"
                  />
                </th>
                <th className="p-4 font-medium">สินค้า</th>
                <th className="p-4 font-medium">SKU</th>
                <th className="p-4 font-medium">ราคา</th>
                <th className="p-4 font-medium">คลัง</th>
                <th className="p-4 font-medium">ประเภท</th>
                <th className="p-4 font-medium">สถานะ</th>
                <th className="p-4 font-medium">ขาย</th>
                <th className="p-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const status = statusConfig[product.status as keyof typeof statusConfig]
                return (
                  <tr key={product.id} className="border-t border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleSelect(product.id)}
                        className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          product.type === 'DIGITAL' 
                            ? 'bg-gradient-to-br from-yellow-500/20 to-amber-500/20' 
                            : 'bg-slate-800'
                        }`}>
                          {product.type === 'DIGITAL' ? (
                            <Download className="w-5 h-5 text-amber-400" />
                          ) : (
                            <Package className="w-5 h-5 text-slate-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white">{product.name}</p>
                          <p className="text-sm text-slate-500">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-slate-400">{product.sku}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-amber-400">{formatCurrency(product.price)}</span>
                    </td>
                    <td className="p-4">
                      <span className={`${
                        product.stock < 10 ? 'text-amber-400' :
                        product.stock < 50 ? 'text-yellow-400' :
                        'text-slate-400'
                      }`}>
                        {product.stock === 999 ? '∞' : product.stock}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge variant={product.type === 'DIGITAL' ? 'gold' : 'secondary'}>
                        {product.type === 'DIGITAL' ? 'ดิจิทัล' : 'จัดส่ง'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </td>
                    <td className="p-4">
                      <span className="text-slate-400">{product.sales}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800">
                          <Trash2 className="w-4 h-4" />
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
        <div className="flex items-center justify-between p-4 border-t border-slate-800">
          <p className="text-sm text-slate-400">
            แสดง {filteredProducts.length} จาก {products.length} รายการ
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
