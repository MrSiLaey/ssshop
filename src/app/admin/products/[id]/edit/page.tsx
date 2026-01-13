'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft,
  Save,
  Package,
  Download,
  Loader2,
  Trash2
} from 'lucide-react'
import { Card, Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui'

interface Category {
  id: string
  name: string
  slug: string
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EditProductPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [fetching, setFetching] = useState(true)
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
    async function fetchData() {
      try {
        // Fetch product and categories in parallel
        const [productRes, categoriesRes] = await Promise.all([
          fetch(`/api/products/${id}`),
          fetch('/api/categories'),
        ])

        if (productRes.ok) {
          const product = await productRes.json()
          setFormData({
            name: product.name || '',
            description: product.description || '',
            price: product.price?.toString() || '',
            comparePrice: product.comparePrice?.toString() || '',
            stock: product.stock?.toString() || '0',
            sku: product.sku || '',
            productType: product.productType || 'DIGITAL',
            categoryId: product.categoryId || '',
            thumbnail: product.thumbnail || '',
            isActive: product.isActive ?? true,
            isFeatured: product.isFeatured ?? false,
          })
        }

        if (categoriesRes.ok) {
          const catData = await categoriesRes.json()
          setCategories(catData.categories || [])
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setFetching(false)
      }
    }
    fetchData()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.price) {
      alert('กรุณากรอกชื่อสินค้าและราคา')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
          stock: parseInt(formData.stock) || 0,
          sku: formData.sku || null,
          productType: formData.productType,
          categoryId: formData.categoryId || null,
          thumbnail: formData.thumbnail || null,
          isActive: formData.isActive,
          isFeatured: formData.isFeatured,
        }),
      })

      if (res.ok) {
        router.push('/admin/products')
      } else {
        const error = await res.json()
        alert(error.error || 'เกิดข้อผิดพลาดในการอัปเดตสินค้า')
      }
    } catch (error) {
      console.error('Failed to update product:', error)
      alert('เกิดข้อผิดพลาดในการอัปเดตสินค้า')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบสินค้านี้?')) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (res.ok) {
        router.push('/admin/products')
      } else {
        alert('เกิดข้อผิดพลาดในการลบสินค้า')
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
      alert('เกิดข้อผิดพลาดในการลบสินค้า')
    } finally {
      setDeleting(false)
    }
  }

  if (fetching) {
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">แก้ไขสินค้า</h1>
            <p className="text-muted-foreground">{formData.name}</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="text-red-500 border-red-500/30 hover:bg-red-500/10"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Trash2 className="w-4 h-4 mr-2" />
              ลบสินค้า
            </>
          )}
        </Button>
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
                  บันทึกการเปลี่ยนแปลง
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
