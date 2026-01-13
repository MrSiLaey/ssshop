'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft,
  Save,
  Package,
  Download,
  Loader2
} from 'lucide-react'
import { Card, Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui'

interface Category {
  id: string
  name: string
  slug: string
}

export default function CreateProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    comparePrice: '',
    stock: '0',
    sku: '',
    productType: 'DIGITAL',
    categoryId: '',
    thumbnail: '',
    isActive: true,
    isFeatured: false,
  })

  useEffect(() => {
    // Fetch categories
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories')
        if (res.ok) {
          const data = await res.json()
          setCategories(data.categories || [])
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }
    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.price) {
      alert('กรุณากรอกชื่อสินค้าและราคา')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
          stock: parseInt(formData.stock) || 0,
          categoryId: formData.categoryId || null,
        }),
      })

      if (res.ok) {
        router.push('/admin/products')
      } else {
        const error = await res.json()
        alert(error.error || 'เกิดข้อผิดพลาดในการสร้างสินค้า')
      }
    } catch (error) {
      console.error('Failed to create product:', error)
      alert('เกิดข้อผิดพลาดในการสร้างสินค้า')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">เพิ่มสินค้าใหม่</h1>
          <p className="text-muted-foreground">กรอกรายละเอียดสินค้า</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card variant="glass" className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">ข้อมูลพื้นฐาน</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>ชื่อสินค้า *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ระบุชื่อสินค้า"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>คำอธิบาย</Label>
                  <textarea
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 resize-none"
                    rows={5}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="อธิบายรายละเอียดสินค้า..."
                  />
                </div>
              </div>
            </Card>

            <Card variant="glass" className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">ราคาและสต็อก</h2>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ราคา (฿) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>ราคาเปรียบเทียบ (฿)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.comparePrice}
                    onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label>จำนวนในคลัง</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label>SKU</Label>
                  <Input
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="รหัสสินค้า"
                  />
                </div>
              </div>
            </Card>

            <Card variant="glass" className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">รูปภาพ</h2>
              
              <div className="space-y-2">
                <Label>URL รูปภาพหลัก</Label>
                <Input
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-muted-foreground">
                  ใส่ URL ของรูปภาพ หรือใช้รูปจาก /public/images
                </p>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card variant="glass" className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">การจัดการ</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>ประเภทสินค้า</Label>
                  <Select 
                    value={formData.productType} 
                    onValueChange={(v) => setFormData({ ...formData, productType: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DIGITAL">
                        <span className="flex items-center gap-2">
                          <Download className="w-4 h-4" /> ดิจิทัล
                        </span>
                      </SelectItem>
                      <SelectItem value="PHYSICAL">
                        <span className="flex items-center gap-2">
                          <Package className="w-4 h-4" /> จัดส่ง
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>หมวดหมู่</Label>
                  <Select 
                    value={formData.categoryId} 
                    onValueChange={(v) => setFormData({ ...formData, categoryId: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกหมวดหมู่" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">ไม่ระบุ</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <Label>เปิดขาย</Label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-yellow-400 peer-checked:to-amber-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <Label>สินค้าแนะนำ</Label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-yellow-400 peer-checked:to-amber-500"></div>
                  </label>
                </div>
              </div>
            </Card>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  กำลังบันทึก...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  บันทึกสินค้า
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
