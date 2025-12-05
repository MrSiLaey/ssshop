'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  ShoppingCart, 
  Download, 
  Key, 
  Star, 
  Check, 
  Shield, 
  Clock,
  Package,
  ArrowLeft,
  Plus,
  Minus,
  Heart
} from 'lucide-react'
import { Header, Footer } from '@/components/layout'
import { Button, Card, CardContent, Badge, Input } from '@/components/ui'
import { useCartStore, useNotificationStore } from '@/stores'
import { formatCurrency } from '@/lib/utils'

// Mock product data - replace with API call
const mockProduct = {
  id: '1',
  name: 'Premium Software License',
  slug: 'premium-software-license',
  description: `
    <p>ซอฟต์แวร์พรีเมียมคุณภาพสูงสำหรับนักพัฒนาและผู้ใช้งานมืออาชีพ</p>
    <h3>คุณสมบัติหลัก</h3>
    <ul>
      <li>รองรับการใช้งานบน Windows, Mac และ Linux</li>
      <li>อัปเดตฟรีตลอดอายุไลเซนส์</li>
      <li>ซัพพอร์ตทางอีเมลตลอด 24/7</li>
      <li>ไม่จำกัดจำนวนโปรเจค</li>
    </ul>
    <h3>ความต้องการของระบบ</h3>
    <ul>
      <li>Windows 10/11, macOS 12+, Ubuntu 20.04+</li>
      <li>RAM 8GB ขึ้นไป</li>
      <li>พื้นที่ว่าง 2GB</li>
    </ul>
  `,
  shortDescription: 'ซอฟต์แวร์พรีเมียมคุณภาพสูง รองรับหลายแพลตฟอร์ม พร้อมอัปเดตฟรีตลอดอายุไลเซนส์',
  price: 2990,
  comparePrice: 3990,
  category: { name: 'Software', slug: 'software' },
  productType: 'DIGITAL',
  thumbnail: null,
  images: [],
  rating: 4.8,
  reviewCount: 124,
  quantity: 100,
  isDigital: true,
  digitalAssets: [
    { id: '1', name: 'Premium Software v2.0', fileName: 'premium-software-v2.0.zip', fileSize: 256000000, version: '2.0.1' },
    { id: '2', name: 'Documentation', fileName: 'documentation.pdf', fileSize: 5000000, version: '2.0' },
  ],
  features: [
    'รองรับหลายแพลตฟอร์ม',
    'อัปเดตฟรีตลอดอายุไลเซนส์',
    'ซัพพอร์ต 24/7',
    'ไลเซนส์ 1 ปี',
  ],
  reviews: [
    { id: '1', user: { name: 'สมชาย ใจดี' }, rating: 5, comment: 'ใช้งานดีมาก คุ้มค่ากับราคา', createdAt: '2024-01-15' },
    { id: '2', user: { name: 'สมหญิง ดีใจ' }, rating: 4, comment: 'โปรแกรมทำงานได้ดี แนะนำครับ', createdAt: '2024-01-10' },
  ],
}

export default function ProductPage() {
  const params = useParams()
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description')
  const { addItem } = useCartStore()
  const { addNotification } = useNotificationStore()

  // In real app, fetch product by slug
  const product = mockProduct

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.thumbnail || undefined,
      isDigital: product.isDigital,
    })

    addNotification({
      type: 'success',
      title: 'เพิ่มลงตะกร้าแล้ว',
      message: `${product.name} x ${quantity}`,
    })
  }

  const discountPercent = product.comparePrice
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : 0

  return (
    <>
      <Header />
      <main className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-slate-400 mb-8">
            <Link href="/" className="hover:text-white transition-colors">หน้าแรก</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-white transition-colors">ร้านค้า</Link>
            <span>/</span>
            <Link href={`/shop?category=${product.category.slug}`} className="hover:text-white transition-colors">
              {product.category.name}
            </Link>
            <span>/</span>
            <span className="text-white">{product.name}</span>
          </nav>

          {/* Back Button */}
          <Link href="/shop" className="inline-flex items-center text-slate-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับไปร้านค้า
          </Link>

          {/* Product Details */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Product Image */}
            <div>
              <Card variant="glass" className="aspect-square relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                  {product.isDigital ? (
                    <Download className="w-32 h-32 text-violet-500/50" />
                  ) : (
                    <Package className="w-32 h-32 text-slate-600" />
                  )}
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isDigital && (
                    <Badge variant="gold" className="text-sm">
                      <Download className="w-4 h-4 mr-1" />
                      สินค้าดิจิทัล
                    </Badge>
                  )}
                  {discountPercent > 0 && (
                    <Badge variant="destructive" className="text-sm">
                      ลด {discountPercent}%
                    </Badge>
                  )}
                </div>

                {/* Wishlist Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 bg-slate-900/50 hover:bg-slate-900"
                >
                  <Heart className="w-5 h-5" />
                </Button>
              </Card>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <Badge variant="secondary" className="mb-3">
                  {product.category.name}
                </Badge>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.round(product.rating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    ))}
                    <span className="text-white ml-2">{product.rating}</span>
                  </div>
                  <span className="text-slate-400">({product.reviewCount} รีวิว)</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-white">
                  {formatCurrency(product.price)}
                </span>
                {product.comparePrice && (
                  <span className="text-xl text-slate-500 line-through">
                    {formatCurrency(product.comparePrice)}
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="text-slate-400">{product.shortDescription}</p>

              {/* Features */}
              <div className="space-y-3">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-emerald-400" />
                    </div>
                    <span className="text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Digital Assets Preview */}
              {product.isDigital && product.digitalAssets.length > 0 && (
                <Card variant="luxury" className="p-4">
                  <h3 className="text-sm font-medium text-white mb-3 flex items-center">
                    <Download className="w-4 h-4 mr-2 text-violet-400" />
                    ไฟล์ที่จะได้รับ
                  </h3>
                  <div className="space-y-2">
                    {product.digitalAssets.map((asset) => (
                      <div key={asset.id} className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">{asset.name}</span>
                        <span className="text-slate-500">v{asset.version}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4">
                {!product.isDigital && (
                  <div className="flex items-center border border-slate-700 rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center text-white">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  เพิ่มลงตะกร้า
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800">
                <div className="text-center">
                  <Shield className="w-6 h-6 text-violet-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">ปลอดภัย 100%</p>
                </div>
                <div className="text-center">
                  <Clock className="w-6 h-6 text-violet-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">ซัพพอร์ต 24/7</p>
                </div>
                <div className="text-center">
                  <Key className="w-6 h-6 text-violet-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">ไลเซนส์แท้</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-slate-800 mb-8">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-4 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === 'description'
                    ? 'text-violet-400 border-violet-400'
                    : 'text-slate-400 border-transparent hover:text-white'
                }`}
              >
                รายละเอียดสินค้า
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-4 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === 'reviews'
                    ? 'text-violet-400 border-violet-400'
                    : 'text-slate-400 border-transparent hover:text-white'
                }`}
              >
                รีวิว ({product.reviewCount})
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mb-16">
            {activeTab === 'description' && (
              <Card variant="glass" className="p-8">
                <div 
                  className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-slate-400 prose-li:text-slate-400"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </Card>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {product.reviews.map((review) => (
                  <Card key={review.id} variant="glass" className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-medium text-white">{review.user.name}</p>
                        <p className="text-sm text-slate-500">{review.createdAt}</p>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-300">{review.comment}</p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
