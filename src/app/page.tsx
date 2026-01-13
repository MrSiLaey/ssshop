import Link from 'next/link'
import { 
  ArrowRight, 
  ShoppingBag, 
  Download, 
  Key, 
  Shield, 
  Zap, 
  Truck,
  ChevronRight,
  Sparkles,
  Code2,
  Gamepad2,
  Palette,
  BookOpen,
  GraduationCap,
  Package
} from 'lucide-react'
import { Header, Footer } from '@/components/layout'
import { Button, Card } from '@/components/ui'
import prisma from '@/lib/db'

// ดึงข้อมูลจากฐานข้อมูล
async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      isFeatured: true,
    },
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
      _count: {
        select: {
          reviews: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 8,
  })

  // Calculate average rating for each product
  const productsWithRating = await Promise.all(
    products.map(async (product) => {
      const avgRating = await prisma.review.aggregate({
        where: { productId: product.id, isApproved: true },
        _avg: { rating: true },
      })
      return {
        ...product,
        rating: avgRating._avg.rating || 0,
        reviewCount: product._count.reviews,
      }
    })
  )

  return productsWithRating
}

async function getCategories() {
  const categories = await prisma.productCategory.findMany({
    where: {
      isActive: true,
      parentId: null,
    },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })

  return categories
}

async function getStats() {
  const [productCount, userCount, orderCount] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.user.count(),
    prisma.order.count({ where: { paymentStatus: 'COMPLETED' } }),
  ])

  return { productCount, userCount, orderCount }
}

// Map category slug to icon and color
const getCategoryMeta = (slug: string) => {
  const meta: Record<string, { icon: any; color: string }> = {
    'software': { icon: Package, color: 'purple' },
    'digital-art': { icon: Palette, color: 'pink' },
    'ebooks': { icon: BookOpen, color: 'cyan' },
    'templates': { icon: Code2, color: 'orange' },
    'courses': { icon: GraduationCap, color: 'green' },
    'games': { icon: Gamepad2, color: 'blue' },
  }
  return meta[slug] || { icon: Package, color: 'purple' }
}

// Map category to product color
const getProductColor = (categorySlug?: string) => {
  const colorMap: Record<string, string> = {
    'software': 'purple',
    'digital-art': 'pink',
    'ebooks': 'cyan',
    'templates': 'orange',
    'courses': 'green',
    'games': 'blue',
  }
  return colorMap[categorySlug || ''] || 'purple'
}

const features = [
  {
    icon: Download,
    title: 'สินค้าดิจิทัล',
    description: 'ดาวน์โหลดได้ทันทีหลังชำระเงิน พร้อมระบบไลเซนส์อัตโนมัติ',
    color: 'cyan',
  },
  {
    icon: Truck,
    title: 'จัดส่งทั่วไทย',
    description: 'ส่งฟรีทั่วประเทศ สำหรับสินค้าที่ต้องจัดส่งจริง',
    color: 'pink',
  },
  {
    icon: Key,
    title: 'ระบบไลเซนส์',
    description: 'จัดการไลเซนส์ได้ง่าย ตรวจสอบสถานะแบบ Real-time',
    color: 'purple',
  },
  {
    icon: Shield,
    title: 'ปลอดภัย 100%',
    description: 'ระบบชำระเงินที่ปลอดภัย รองรับทั้ง Stripe และ PromptPay',
    color: 'green',
  },
]

const getColorClasses = (color: string) => {
  const colors: Record<string, { bg: string; border: string; text: string; glow: string; badge: string }> = {
    purple: {
      bg: 'bg-purple-500/10 dark:bg-purple-500/20',
      border: 'border-purple-500/30 hover:border-purple-500/60',
      text: 'text-purple-500',
      glow: 'group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]',
      badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    },
    cyan: {
      bg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
      border: 'border-cyan-500/30 hover:border-cyan-500/60',
      text: 'text-cyan-500',
      glow: 'group-hover:shadow-[0_0_30px_rgba(0,217,255,0.3)]',
      badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    },
    pink: {
      bg: 'bg-pink-500/10 dark:bg-pink-500/20',
      border: 'border-pink-500/30 hover:border-pink-500/60',
      text: 'text-pink-500',
      glow: 'group-hover:shadow-[0_0_30px_rgba(255,107,157,0.3)]',
      badge: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    },
    green: {
      bg: 'bg-green-500/10 dark:bg-green-500/20',
      border: 'border-green-500/30 hover:border-green-500/60',
      text: 'text-green-500',
      glow: 'group-hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]',
      badge: 'bg-green-500/20 text-green-400 border-green-500/30',
    },
    orange: {
      bg: 'bg-orange-500/10 dark:bg-orange-500/20',
      border: 'border-orange-500/30 hover:border-orange-500/60',
      text: 'text-orange-500',
      glow: 'group-hover:shadow-[0_0_30px_rgba(251,146,60,0.3)]',
      badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    },
    blue: {
      bg: 'bg-blue-500/10 dark:bg-blue-500/20',
      border: 'border-blue-500/30 hover:border-blue-500/60',
      text: 'text-blue-500',
      glow: 'group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]',
      badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    },
  }
  return colors[color] || colors.purple
}

export default async function HomePage() {
  const [featuredProducts, categories, stats] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getStats(),
  ])

  return (
    <>
      <Header />
      <main className="min-h-screen pt-16">
        {/* Hero Section - Neon Style */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-purple-400 font-medium">Premium Collection - New Arrival</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="text-gradient">Soft Stop Shop</span>
                </h1>

                <p className="text-lg text-muted-foreground max-w-xl">
                  ค้นพบสินค้าดิจิทัลและสินค้าจริงที่คุณต้องการ พร้อมระบบไลเซนส์อัตโนมัติ 
                  และการจัดส่งที่รวดเร็ว ทุกการซื้อมาพร้อมความปลอดภัย
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link href="/shop">
                    <Button size="xl" variant="neon" className="group">
                      เริ่มช้อปปิ้ง
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/shop?type=DIGITAL">
                    <Button variant="outline" size="xl" className="border-cyan-500/30 hover:border-cyan-500/60 hover:bg-cyan-500/10">
                      <Download className="mr-2 h-5 w-5 text-cyan-500" />
                      สินค้าดิจิทัล
                    </Button>
                  </Link>
                </div>

                {/* Stats with Neon Colors - Real Data */}
                <div className="flex flex-wrap gap-8 pt-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-cyan-500 glow-text-cyan">{stats.userCount}+</p>
                    <p className="text-sm text-muted-foreground">สมาชิก</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-500 glow-text-purple">{stats.productCount}+</p>
                    <p className="text-sm text-muted-foreground">สินค้า</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-pink-500 glow-text-pink">{stats.orderCount}+</p>
                    <p className="text-sm text-muted-foreground">ออเดอร์สำเร็จ</p>
                  </div>
                </div>
              </div>

              {/* Hero Visual - Neon Orb */}
              <div className="relative">
                <div className="relative z-10">
                  <div className="relative">
                    <Card className="p-8 bg-card/50 backdrop-blur-xl border-purple-500/20 overflow-hidden group hover:border-purple-500/40 transition-all duration-500">
                      <div className="aspect-square rounded-2xl bg-linear-to-br from-purple-500/10 via-cyan-500/5 to-pink-500/10 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="absolute w-48 h-48 rounded-full border-2 border-purple-500/30 animate-ping" style={{ animationDuration: '3s' }} />
                          <div className="absolute w-64 h-64 rounded-full border border-cyan-500/20 animate-ping" style={{ animationDuration: '4s' }} />
                          <div className="absolute w-80 h-80 rounded-full border border-pink-500/10 animate-ping" style={{ animationDuration: '5s' }} />
                        </div>
                        
                        <div className="relative">
                          <div className="absolute inset-0 bg-linear-to-r from-purple-500/40 via-cyan-500/30 to-pink-500/40 blur-3xl scale-150" />
                          <div className="relative w-32 h-32 rounded-full bg-linear-to-br from-purple-500 via-cyan-500 to-pink-500 p-1 animate-float">
                            <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                              <Zap className="w-12 h-12 text-purple-500" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="absolute -top-4 -right-4 animate-float" style={{ animationDelay: '0.5s' }}>
                    <Card className="p-4 bg-card/80 backdrop-blur-xl border-cyan-500/30 shadow-lg shadow-cyan-500/10">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                          <Key className="h-5 w-5 text-cyan-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">License Activated</p>
                          <p className="text-xs text-cyan-500">Just now</p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="absolute -bottom-4 -left-4 animate-float" style={{ animationDelay: '1s' }}>
                    <Card className="p-4 bg-card/80 backdrop-blur-xl border-pink-500/30 shadow-lg shadow-pink-500/10">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                          <Download className="h-5 w-5 text-pink-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Download Ready</p>
                          <p className="text-xs text-pink-500">Premium Software</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section - Real Data */}
        {categories.length > 0 && (
          <section className="py-20 relative">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  <span className="text-gradient">หมวดหมู่สินค้า</span>
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  เลือกชมสินค้าตามหมวดหมู่ที่คุณสนใจ
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => {
                  const meta = getCategoryMeta(category.slug)
                  const colorClass = getColorClasses(meta.color)
                  const IconComponent = meta.icon
                  
                  return (
                    <Link key={category.id} href={`/shop?category=${category.slug}`}>
                      <Card className={`group p-6 bg-card/50 backdrop-blur-sm border ${colorClass.border} ${colorClass.glow} transition-all duration-300 hover:-translate-y-1`}>
                        <div className="flex items-center gap-4">
                          <div className={`h-14 w-14 rounded-xl ${colorClass.bg} flex items-center justify-center`}>
                            <IconComponent className={`h-7 w-7 ${colorClass.text}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground group-hover:text-purple-400 transition-colors">
                              {category.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {category.description || `${category._count.products} สินค้า`}
                            </p>
                          </div>
                          <ChevronRight className={`h-5 w-5 ${colorClass.text} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all`} />
                        </div>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                <span className="text-gradient">ทำไมต้องเลือกเรา</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                เรามุ่งมั่นให้บริการที่ดีที่สุดสำหรับลูกค้าทุกท่าน
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => {
                const colorClass = getColorClasses(feature.color)
                return (
                  <div
                    key={feature.title}
                    className="group text-center p-6 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/50 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ${colorClass.bg} border ${colorClass.border} transition-all duration-300 ${colorClass.glow}`}>
                      <feature.icon className={`h-7 w-7 ${colorClass.text}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mt-4">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Featured Products - Gallery Frame Style - Real Data */}
        {featuredProducts.length > 0 && (
          <section className="py-20 gallery-wall">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-16">
                <div>
                  <h2 className="text-4xl font-bold text-white mb-3 tracking-wide">
                    <span className="text-gradient">LEGENDARY PRODUCTS</span>
                  </h2>
                  <p className="text-gray-400 text-lg">สินค้าคุณภาพระดับตำนาน</p>
                </div>
                <Link href="/shop">
                  <Button variant="ghost" className="group text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 text-lg">
                    ดูทั้งหมด
                    <ChevronRight className="ml-1 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {featuredProducts.map((product) => {
                  const productColor = getProductColor(product.category?.slug)
                  const colorClass = getColorClasses(productColor)
                  const glowColorClass = `frame-glow-${productColor}`
                  const price = Number(product.price)
                  const comparePrice = product.comparePrice ? Number(product.comparePrice) : null
                  
                  return (
                    <Link key={product.id} href={`/shop/${product.slug}`} className="block group">
                      <div className="relative pt-8">
                        {/* Spotlight */}
                        <div className="spotlight">
                          <div className="spotlight-fixture" />
                          <div className="spotlight-beam" />
                        </div>
                        
                        {/* Gallery Frame */}
                        <div className="gallery-frame transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-[1.02]">
                          <div className="gallery-inner aspect-square">
                            <div className={`frame-glow ${glowColorClass}`} />
                            
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                              <div className={`relative ${colorClass.text} neon-icon`}>
                                <ShoppingBag className="w-20 h-20" />
                              </div>
                              
                              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                <div className="gallery-stat">
                                  <span className={`gallery-stat-value ${colorClass.text}`}>
                                    {product.rating > 0 ? product.rating.toFixed(1) : '-'}
                                  </span>
                                  <span className="gallery-stat-label text-gray-400">Rating</span>
                                </div>
                                
                                <div className="gallery-stat">
                                  <span className={`gallery-stat-value ${colorClass.text}`}>
                                    {product.reviewCount}
                                  </span>
                                  <span className="gallery-stat-label text-gray-400">Reviews</span>
                                </div>
                              </div>
                              
                              {product.category && (
                                <div className="absolute top-4 right-4">
                                  <span className={`gallery-badge ${colorClass.text} border-current`}>
                                    {product.category.name}
                                  </span>
                                </div>
                              )}
                              
                              {product.productType === 'DIGITAL' && (
                                <div className="absolute top-4 left-4">
                                  <span className="gallery-badge text-cyan-400 border-cyan-400/30">
                                    <Download className="w-3 h-3 inline mr-1" />
                                    Digital
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="product-info-card p-4 mt-0">
                          <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors line-clamp-1 mb-2 text-center">
                            {product.name}
                          </h3>
                          
                          <div className="flex items-center justify-center gap-3">
                            <span className={`text-xl font-bold ${colorClass.text}`}>
                              ฿{price.toLocaleString()}
                            </span>
                            {comparePrice && (
                              <>
                                <span className="text-sm text-gray-500 line-through">
                                  ฿{comparePrice.toLocaleString()}
                                </span>
                                <span className="text-xs text-red-400 font-semibold">
                                  -{Math.round((1 - price / comparePrice) * 100)}%
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
              
              <div className="mt-20 text-center">
                <Link href="/shop">
                  <Button className="bg-purple-600 hover:bg-purple-500 text-white px-10 py-6 text-lg rounded-full shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105">
                    View all Products
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Empty State if no products */}
        {featuredProducts.length === 0 && (
          <section className="py-20">
            <div className="container mx-auto px-4 text-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">ยังไม่มีสินค้าแนะนำ</h2>
              <p className="text-muted-foreground mb-6">กรุณาเพิ่มสินค้าในระบบ</p>
              <Link href="/admin/products">
                <Button variant="neon">จัดการสินค้า</Button>
              </Link>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <Card className="relative overflow-hidden bg-card/50 backdrop-blur-xl border-purple-500/20">
              <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-[100px]" />
              </div>
              
              <div className="relative p-8 md:p-12 lg:p-16 text-center">
                <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  <span className="text-gradient">พร้อมเริ่มต้นแล้วหรือยัง?</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  สมัครสมาชิกวันนี้ รับส่วนลดพิเศษทันที 10% สำหรับการสั่งซื้อครั้งแรก
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/auth/register">
                    <Button size="xl" variant="neon" className="glow-purple">
                      <Sparkles className="mr-2 h-5 w-5" />
                      สมัครสมาชิกฟรี
                    </Button>
                  </Link>
                  <Link href="/shop">
                    <Button size="xl" variant="outline" className="border-cyan-500/30 hover:border-cyan-500/60 hover:bg-cyan-500/10">
                      เลือกซื้อสินค้า
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
