'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ShoppingCart, 
  Download, 
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
import { Button, Card, CardContent, Badge } from '@/components/ui'
import { useCartStore, useNotificationStore } from '@/stores'
import { formatCurrency } from '@/lib/utils'

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  shortDescription: string | null
  price: number
  comparePrice: number | null
  category: { id: string; name: string; slug: string } | null
  productType: string
  thumbnail: string | null
  images: string | null
  rating: number
  reviewCount: number
  stock: number
  digitalAssets: Array<{
    id: string
    name: string
    fileName: string
    fileSize: number | null
    version: string | null
  }>
  features: string | null
  reviews: Array<{
    id: string
    user: { name: string | null }
    rating: number
    comment: string
    createdAt: string
  }>
}

interface RelatedProduct {
  id: string
  name: string
  slug: string
  price: number
  thumbnail: string | null
  productType: string
}

interface Props {
  product: Product
  relatedProducts: RelatedProduct[]
}

export default function ProductDetailClient({ product, relatedProducts }: Props) {
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description')
  const { addItem, getItem } = useCartStore()
  const { addNotification } = useNotificationStore()

  const isDigital = product.productType === 'DIGITAL'
  const cartItem = getItem(product.id)
  const isInCart = !!cartItem

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.thumbnail || undefined,
      isDigital,
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

  const featuresList = product.features 
    ? (typeof product.features === 'string' ? JSON.parse(product.features) : product.features)
    : []

  return (
    <>
      <Header />
      <main className="min-h-screen pt-16 bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Back Link */}
          <Link href="/shop" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับไปร้านค้า
          </Link>

          {/* Product Detail */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-2xl bg-linear-to-br from-muted/50 to-muted overflow-hidden flex items-center justify-center">
                {product.thumbnail ? (
                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : isDigital ? (
                  <Download className="w-24 h-24 text-primary/30" />
                ) : (
                  <Package className="w-24 h-24 text-muted-foreground/30" />
                )}
              </div>
            </div>

            {/* Product Info */}
            <div>
              {/* Category & Type */}
              <div className="flex items-center gap-3 mb-4">
                {product.category && (
                  <Link href={`/shop?category=${product.category.slug}`}>
                    <Badge variant="secondary" className="hover:bg-muted">
                      {product.category.name}
                    </Badge>
                  </Link>
                )}
                {isDigital && (
                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                    <Download className="w-3 h-3 mr-1" />
                    ดิจิทัล
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-foreground mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(product.rating)
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-foreground font-medium">
                  {product.rating > 0 ? product.rating.toFixed(1) : '-'}
                </span>
                <span className="text-muted-foreground">
                  ({product.reviewCount} รีวิว)
                </span>
              </div>

              {/* Description */}
              {product.shortDescription && (
                <p className="text-muted-foreground mb-6">{product.shortDescription}</p>
              )}

              {/* Price */}
              <div className="flex items-center gap-4 mb-8">
                <span className="text-4xl font-bold text-primary">
                  {formatCurrency(product.price)}
                </span>
                {product.comparePrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      {formatCurrency(product.comparePrice)}
                    </span>
                    <Badge variant="destructive">ลด {discountPercent}%</Badge>
                  </>
                )}
              </div>

              {/* Features */}
              {Array.isArray(featuresList) && featuresList.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold text-foreground mb-3">คุณสมบัติ</h3>
                  <ul className="space-y-2">
                    {featuresList.map((feature: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-muted-foreground">
                        <Check className="w-4 h-4 text-green-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Digital Assets Preview */}
              {isDigital && product.digitalAssets.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold text-foreground mb-3">ไฟล์ที่จะได้รับ</h3>
                  <div className="space-y-2">
                    {product.digitalAssets.map((asset) => (
                      <div
                        key={asset.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Download className="w-4 h-4 text-primary" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{asset.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {asset.version && `v${asset.version}`}
                              {asset.fileSize && ` • ${Math.round(asset.fileSize / 1024 / 1024)}MB`}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="flex items-center gap-4 mb-6">
                {!isDigital && !isInCart && (
                  <div className="flex items-center border border-border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-medium text-foreground">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                {isInCart ? (
                  <Link href="/cart" className="flex-1">
                    <Button variant="outline" size="lg" className="w-full border-green-500/50 text-green-400 hover:bg-green-500/10">
                      <Check className="w-5 h-5 mr-2" />
                      อยู่ในตะกร้าแล้ว ({cartItem.quantity} ชิ้น) - ดูตะกร้า
                    </Button>
                  </Link>
                ) : (
                  <Button variant="neon" size="lg" className="flex-1" onClick={handleAddToCart}>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    เพิ่มลงตะกร้า
                  </Button>
                )}
                <Button variant="outline" size="icon">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="text-center">
                  <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">ปลอดภัย 100%</p>
                </div>
                <div className="text-center">
                  <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">
                    {isDigital ? 'ได้รับทันที' : 'จัดส่งเร็ว'}
                  </p>
                </div>
                <div className="text-center">
                  <Download className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">
                    {isDigital ? 'ดาวน์โหลดได้เลย' : 'ติดตามพัสดุ'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-16">
            <div className="flex border-b border-border mb-8">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === 'description'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                รายละเอียด
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === 'reviews'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                รีวิว ({product.reviewCount})
              </button>
            </div>

            {activeTab === 'description' ? (
              <div 
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description || 'ไม่มีรายละเอียด' }}
              />
            ) : (
              <div className="space-y-6">
                {product.reviews.length > 0 ? (
                  product.reviews.map((review) => (
                    <Card key={review.id} variant="glass" className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-primary font-medium">
                              {review.user.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{review.user.name}</p>
                            <p className="text-sm text-muted-foreground">{review.createdAt}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">ยังไม่มีรีวิว</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-foreground mb-8">สินค้าที่เกี่ยวข้อง</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link key={relatedProduct.id} href={`/shop/${relatedProduct.slug}`}>
                    <Card className="group overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-purple-500/30 transition-all duration-300">
                      <div className="aspect-square relative overflow-hidden bg-linear-to-br from-muted/50 to-muted flex items-center justify-center">
                        {relatedProduct.thumbnail ? (
                          <img
                            src={relatedProduct.thumbnail}
                            alt={relatedProduct.name}
                            className="w-full h-full object-cover"
                          />
                        ) : relatedProduct.productType === 'DIGITAL' ? (
                          <Download className="w-12 h-12 text-primary/30" />
                        ) : (
                          <Package className="w-12 h-12 text-muted-foreground/30" />
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-foreground group-hover:text-purple-400 transition-colors line-clamp-2 mb-2">
                          {relatedProduct.name}
                        </h3>
                        <p className="text-lg font-bold text-primary">
                          {formatCurrency(relatedProduct.price)}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
