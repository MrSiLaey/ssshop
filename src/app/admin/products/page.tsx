'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Download,
  Package,
} from 'lucide-react'
import { Card, Badge, Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'

interface Product {
  id: string
  name: string
  slug: string
  sku: string | null
  price: number
  stock: number
  category: { name: string } | null
  productType: string
  isActive: boolean
  _count: { orderItems: number }
}

const statusConfig = {
  true: { label: 'เปิดขาย', variant: 'success' as const },
  false: { label: 'ปิดขาย', variant: 'secondary' as const },
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products?limit=100')
        if (res.ok) {
          const data = await res.json()
          setProducts(data.products || [])
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const filteredProducts = products.filter((product) => {
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (typeFilter !== 'all' && product.productType !== typeFilter) {
      return false
    }
    if (statusFilter !== 'all' && String(product.isActive) !== statusFilter) {
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

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบสินค้านี้?')) return
    
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
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
          <h1 className="text-2xl font-bold text-foreground">จัดการสินค้า</h1>
          <p className="text-muted-foreground">จัดการสินค้าทั้งหมดในระบบ ({products.length} รายการ)</p>
        </div>
        <Link href="/admin/products/create">
          <Button variant="neon">
            <Plus className="w-4 h-4 mr-2" />
            เพิ่มสินค้า
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card variant="glass" className="p-4 mb-6">
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
              <SelectItem value="true">เปิดขาย</SelectItem>
              <SelectItem value="false">ปิดขาย</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Products Table */}
      {filteredProducts.length > 0 ? (
        <Card variant="glass" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === filteredProducts.length}
                      onChange={toggleSelectAll}
                      className="rounded border-border"
                    />
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">สินค้า</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">SKU</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">ราคา</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">คลัง</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">หมวดหมู่</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">ประเภท</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">สถานะ</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">ยอดขาย</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const status = statusConfig[String(product.isActive) as keyof typeof statusConfig]
                  return (
                    <tr key={product.id} className="border-b border-border/50 hover:bg-muted/50">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => toggleSelect(product.id)}
                          className="rounded border-border"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                            <Package className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground font-mono">
                        {product.sku || '-'}
                      </td>
                      <td className="p-4 text-sm text-foreground font-medium">
                        {formatCurrency(Number(product.price))}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {product.stock}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {product.category?.name || '-'}
                      </td>
                      <td className="p-4">
                        <Badge variant={product.productType === 'DIGITAL' ? 'info' : 'secondary'}>
                          {product.productType === 'DIGITAL' ? (
                            <><Download className="w-3 h-3 mr-1" /> ดิจิทัล</>
                          ) : (
                            <><Package className="w-3 h-3 mr-1" /> จัดส่ง</>
                          )}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {product._count?.orderItems || 0}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/shop/${product.slug}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
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
          <h3 className="text-xl font-semibold text-foreground mb-2">ไม่พบสินค้า</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery || typeFilter !== 'all' || statusFilter !== 'all'
              ? 'ลองปรับตัวกรองหรือค้นหาด้วยคำอื่น'
              : 'เริ่มต้นเพิ่มสินค้าแรกของคุณ'
            }
          </p>
          <Link href="/admin/products/create">
            <Button variant="neon">
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มสินค้า
            </Button>
          </Link>
        </Card>
      )}
    </div>
  )
}
