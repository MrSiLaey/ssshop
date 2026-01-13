import Link from 'next/link'
import { 
  ShoppingBag, 
  Download, 
  Star
} from 'lucide-react'
import { Header, Footer } from '@/components/layout'
import { Button, Card, CardContent, Badge } from '@/components/ui'
import prisma from '@/lib/db'
import { formatCurrency } from '@/lib/utils'

interface PageProps {
  searchParams: Promise<{
    type?: string
    category?: string
    search?: string
    sortBy?: string
    sortOrder?: string
    page?: string
  }>
}

async function getProducts(searchParams: {
  type?: string
  category?: string
  search?: string
  sortBy?: string
  sortOrder?: string
  page?: string
}) {
  const page = parseInt(searchParams.page || '1')
  const limit = 12
  const skip = (page - 1) * limit

  // Build where clause
  const where: any = {
    isActive: true,
  }

  if (searchParams.type && searchParams.type !== 'ALL') {
    where.productType = searchParams.type
  }

  if (searchParams.category) {
    where.category = { slug: searchParams.category }
  }

  if (searchParams.search) {
    where.OR = [
      { name: { contains: searchParams.search } },
      { description: { contains: searchParams.search } },
    ]
  }

  const sortBy = searchParams.sortBy || 'createdAt'
  const sortOrder = searchParams.sortOrder || 'desc'

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
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
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ])

  // Get ratings for each product
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

  return {
    products: productsWithRating,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }
}

async function getCategories() {
  return prisma.productCategory.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  })
}

// Color classes for categories
const getCategoryColor = (slug: string) => {
  const colors: Record<string, string> = {
    'software': 'purple',
    'digital-art': 'pink',
    'ebooks': 'cyan',
    'templates': 'orange',
    'courses': 'green',
    'games': 'blue',
  }
  return colors[slug] || 'purple'
}

const getColorClasses = (color: string) => {
  const colors: Record<string, { text: string; badge: string }> = {
    purple: { text: 'text-purple-500', badge: 'bg-purple-500/20 text-purple-400' },
    cyan: { text: 'text-cyan-500', badge: 'bg-cyan-500/20 text-cyan-400' },
    pink: { text: 'text-pink-500', badge: 'bg-pink-500/20 text-pink-400' },
    green: { text: 'text-green-500', badge: 'bg-green-500/20 text-green-400' },
    orange: { text: 'text-orange-500', badge: 'bg-orange-500/20 text-orange-400' },
    blue: { text: 'text-blue-500', badge: 'bg-blue-500/20 text-blue-400' },
  }
  return colors[color] || colors.purple
}

export default async function ShopPage({ searchParams }: PageProps) {
  const params = await searchParams
  const [{ products, total, page, totalPages }, categories] = await Promise.all([
    getProducts(params),
    getCategories(),
  ])

  const currentType = params.type || 'ALL'
  const currentCategory = params.category || ''
  const currentSearch = params.search || ''
  const currentSort = `${params.sortBy || 'createdAt'}-${params.sortOrder || 'desc'}`

  // Build URL helper
  const buildUrl = (newParams: Record<string, string>) => {
    const p = new URLSearchParams()
    const merged = { ...params, ...newParams }
    Object.entries(merged).forEach(([key, value]) => {
      if (value && value !== 'ALL' && value !== '') {
        p.set(key, value)
      }
    })
    return `/shop${p.toString() ? `?${p.toString()}` : ''}`
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-16 bg-background">
        {/* Page Header */}
        <section className="py-12 border-b border-border">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              <span className="text-gradient">ร้านค้า</span>
            </h1>
            <p className="text-muted-foreground">
              ค้นหาสินค้าที่คุณต้องการจากคอลเลกชันของเรา
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-64 shrink-0">
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-foreground">ตัวกรอง</h3>
                  {(currentType !== 'ALL' || currentCategory || currentSearch) && (
                    <Link href="/shop">
                      <Button variant="ghost" size="sm">รีเซ็ต</Button>
                    </Link>
                  )}
                </div>

                {/* Product Type */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">ประเภทสินค้า</h4>
                  <div className="space-y-2">
                    {[
                      { value: 'ALL', label: 'ทั้งหมด' },
                      { value: 'DIGITAL', label: 'สินค้าดิจิทัล' },
                      { value: 'PHYSICAL', label: 'สินค้าจัดส่ง' },
                    ].map((type) => (
                      <Link
                        key={type.value}
                        href={buildUrl({ type: type.value, page: '1' })}
                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          currentType === type.value
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        {type.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                {categories.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">หมวดหมู่</h4>
                    <div className="space-y-2">
                      <Link
                        href={buildUrl({ category: '', page: '1' })}
                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          !currentCategory
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        ทั้งหมด
                      </Link>
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={buildUrl({ category: cat.slug, page: '1' })}
                          className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            currentCategory === cat.slug
                              ? 'bg-purple-500/20 text-purple-400'
                              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                          }`}
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sort */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">เรียงตาม</h4>
                  <div className="space-y-2">
                    {[
                      { value: 'createdAt-desc', label: 'ล่าสุด' },
                      { value: 'price-asc', label: 'ราคา: ต่ำ - สูง' },
                      { value: 'price-desc', label: 'ราคา: สูง - ต่ำ' },
                      { value: 'name-asc', label: 'ชื่อ: A - Z' },
                    ].map((sort) => {
                      const [sortBy, sortOrder] = sort.value.split('-')
                      return (
                        <Link
                          key={sort.value}
                          href={buildUrl({ sortBy, sortOrder, page: '1' })}
                          className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            currentSort === sort.value
                              ? 'bg-purple-500/20 text-purple-400'
                              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                          }`}
                        >
                          {sort.label}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </Card>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Results Count */}
              <p className="text-sm text-muted-foreground mb-6">
                พบ {total} สินค้า
              </p>

              {/* Product Grid */}
              {products.length > 0 ? (
                <>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => {
                      const color = getCategoryColor(product.category?.slug || '')
                      const colorClass = getColorClasses(color)
                      const price = Number(product.price)
                      const comparePrice = product.comparePrice ? Number(product.comparePrice) : null

                      return (
                        <Link key={product.id} href={`/shop/${product.slug}`}>
                          <Card className="group overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1">
                            {/* Product Image */}
                            <div className="aspect-square relative overflow-hidden bg-linear-to-br from-muted/50 to-muted">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <ShoppingBag className={`w-16 h-16 text-muted-foreground/30 group-hover:${colorClass.text} transition-colors`} />
                              </div>
                              
                              {/* Badges */}
                              <div className="absolute top-3 left-3 flex flex-col gap-2">
                                {product.productType === 'DIGITAL' && (
                                  <Badge className="text-xs bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                                    <Download className="w-3 h-3 mr-1" />
                                    ดิจิทัล
                                  </Badge>
                                )}
                                {comparePrice && (
                                  <Badge className="text-xs bg-red-500/20 text-red-400 border-red-500/30">
                                    ลด {Math.round((1 - price / comparePrice) * 100)}%
                                  </Badge>
                                )}
                              </div>

                              {/* Category Badge */}
                              {product.category && (
                                <div className="absolute top-3 right-3">
                                  <Badge className={`text-xs ${colorClass.badge}`}>
                                    {product.category.name}
                                  </Badge>
                                </div>
                              )}
                            </div>

                            <CardContent className="p-4">
                              <h3 className="font-semibold text-foreground group-hover:text-purple-400 transition-colors line-clamp-2 mb-2">
                                {product.name}
                              </h3>
                              
                              {/* Rating */}
                              <div className="flex items-center gap-2 mb-3">
                                <div className="flex items-center">
                                  <Star className={`w-4 h-4 ${colorClass.text} fill-current`} />
                                  <span className="text-sm text-foreground ml-1">
                                    {product.rating > 0 ? product.rating.toFixed(1) : '-'}
                                  </span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  ({product.reviewCount} รีวิว)
                                </span>
                              </div>

                              {/* Price */}
                              <div className="flex items-center gap-2">
                                <span className={`text-lg font-bold ${colorClass.text}`}>
                                  {formatCurrency(price)}
                                </span>
                                {comparePrice && (
                                  <span className="text-sm text-muted-foreground line-through">
                                    {formatCurrency(comparePrice)}
                                  </span>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      )
                    })}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                      {page > 1 && (
                        <Link href={buildUrl({ page: String(page - 1) })}>
                          <Button variant="outline">ก่อนหน้า</Button>
                        </Link>
                      )}
                      
                      <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(p => p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1))
                          .map((p, idx, arr) => (
                            <>
                              {idx > 0 && arr[idx - 1] !== p - 1 && (
                                <span key={`ellipsis-${p}`} className="text-muted-foreground">...</span>
                              )}
                              <Link key={p} href={buildUrl({ page: String(p) })}>
                                <Button
                                  variant={p === page ? 'neon' : 'outline'}
                                  size="sm"
                                >
                                  {p}
                                </Button>
                              </Link>
                            </>
                          ))}
                      </div>

                      {page < totalPages && (
                        <Link href={buildUrl({ page: String(page + 1) })}>
                          <Button variant="outline">ถัดไป</Button>
                        </Link>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <Card className="p-12 text-center bg-card/50 backdrop-blur-sm">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">ไม่พบสินค้า</h3>
                  <p className="text-muted-foreground mb-6">ลองปรับตัวกรองหรือค้นหาด้วยคำอื่น</p>
                  <Link href="/shop">
                    <Button variant="outline">รีเซ็ตตัวกรอง</Button>
                  </Link>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
