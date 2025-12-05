'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { 
  Search, 
  Filter, 
  ShoppingBag, 
  Download, 
  Star, 
  Grid, 
  List,
  SlidersHorizontal,
  X
} from 'lucide-react'
import { Header, Footer } from '@/components/layout'
import { 
  Button, 
  Card, 
  CardContent, 
  Badge, 
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui'
import { useProductFilterStore } from '@/stores'
import { formatCurrency } from '@/lib/utils'

// Mock products data
const mockProducts = [
  {
    id: '1',
    name: 'Premium Software License',
    slug: 'premium-software-license',
    price: 2990,
    comparePrice: 3990,
    category: { name: 'Software', slug: 'software' },
    productType: 'DIGITAL',
    thumbnail: null,
    rating: 4.8,
    reviewCount: 124,
  },
  {
    id: '2',
    name: 'Developer Toolkit Pro',
    slug: 'developer-toolkit-pro',
    price: 1490,
    category: { name: 'Development', slug: 'development' },
    productType: 'DIGITAL',
    thumbnail: null,
    rating: 4.9,
    reviewCount: 89,
  },
  {
    id: '3',
    name: 'Wireless Keyboard RGB',
    slug: 'wireless-keyboard-rgb',
    price: 2490,
    comparePrice: 2990,
    category: { name: 'Hardware', slug: 'hardware' },
    productType: 'PHYSICAL',
    thumbnail: null,
    rating: 4.7,
    reviewCount: 256,
  },
  {
    id: '4',
    name: 'Gaming Mouse Pro',
    slug: 'gaming-mouse-pro',
    price: 1890,
    category: { name: 'Hardware', slug: 'hardware' },
    productType: 'PHYSICAL',
    thumbnail: null,
    rating: 4.6,
    reviewCount: 178,
  },
  {
    id: '5',
    name: 'Cloud Storage 1TB License',
    slug: 'cloud-storage-1tb-license',
    price: 990,
    category: { name: 'Software', slug: 'software' },
    productType: 'DIGITAL',
    thumbnail: null,
    rating: 4.5,
    reviewCount: 312,
  },
  {
    id: '6',
    name: 'Mechanical Keyboard TKL',
    slug: 'mechanical-keyboard-tkl',
    price: 3490,
    category: { name: 'Hardware', slug: 'hardware' },
    productType: 'PHYSICAL',
    thumbnail: null,
    rating: 4.9,
    reviewCount: 156,
  },
]

const categories = [
  { name: 'ทั้งหมด', slug: '' },
  { name: 'Software', slug: 'software' },
  { name: 'Development', slug: 'development' },
  { name: 'Hardware', slug: 'hardware' },
]

function ShopContent() {
  const searchParams = useSearchParams()
  const typeFromUrl = searchParams.get('type')
  
  const { filters, setCategory, setSearch, setType, setSort, resetFilters } = useProductFilterStore()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  // Set type from URL
  useEffect(() => {
    if (typeFromUrl === 'DIGITAL' || typeFromUrl === 'PHYSICAL') {
      setType(typeFromUrl)
    }
  }, [typeFromUrl, setType])

  // Filter products
  const filteredProducts = mockProducts.filter((product) => {
    // Type filter
    if (filters.type !== 'ALL' && product.productType !== filters.type) {
      return false
    }

    // Category filter
    if (filters.category && product.category.slug !== filters.category) {
      return false
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      if (!product.name.toLowerCase().includes(searchLower)) {
        return false
      }
    }

    // Price filter
    if (filters.minPrice && product.price < filters.minPrice) {
      return false
    }
    if (filters.maxPrice && product.price > filters.maxPrice) {
      return false
    }

    return true
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (filters.sortBy === 'price') {
      return filters.sortOrder === 'asc' ? a.price - b.price : b.price - a.price
    }
    if (filters.sortBy === 'name') {
      return filters.sortOrder === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name)
    }
    return 0
  })

  return (
    <>
      <Header />
      <main className="min-h-screen pt-16">
        {/* Page Header */}
        <section className="py-12 border-b border-stone-800">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-white mb-4">ร้านค้า</h1>
            <p className="text-slate-400">
              ค้นหาสินค้าที่คุณต้องการจากคอลเลกชันของเรา
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <Card variant="glass" className="p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-white">ตัวกรอง</h3>
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    รีเซ็ต
                  </Button>
                </div>

                {/* Product Type */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-slate-300 mb-3">ประเภทสินค้า</h4>
                  <div className="space-y-2">
                    {['ALL', 'DIGITAL', 'PHYSICAL'].map((type) => (
                      <label key={type} className="flex items-center space-x-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="type"
                          checked={filters.type === type}
                          onChange={() => setType(type as any)}
                          className="w-4 h-4 text-amber-500 bg-stone-800 border-stone-600 focus:ring-amber-500"
                        />
                        <span className="text-sm text-slate-400 group-hover:text-white transition-colors">
                          {type === 'ALL' ? 'ทั้งหมด' : type === 'DIGITAL' ? 'สินค้าดิจิทัล' : 'สินค้าจัดส่ง'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-slate-300 mb-3">หมวดหมู่</h4>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() => setCategory(cat.slug || null)}
                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          filters.category === (cat.slug || null)
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'text-slate-400 hover:bg-stone-800 hover:text-white'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {/* Search */}
                <div className="flex-1">
                  <Input
                    placeholder="ค้นหาสินค้า..."
                    icon={<Search className="h-4 w-4" />}
                    value={filters.search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                {/* Sort */}
                <Select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onValueChange={(value) => {
                    const [sortBy, sortOrder] = value.split('-') as [any, any]
                    setSort(sortBy, sortOrder)
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="เรียงตาม" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt-desc">ล่าสุด</SelectItem>
                    <SelectItem value="price-asc">ราคา: ต่ำ - สูง</SelectItem>
                    <SelectItem value="price-desc">ราคา: สูง - ต่ำ</SelectItem>
                    <SelectItem value="name-asc">ชื่อ: A - Z</SelectItem>
                    <SelectItem value="name-desc">ชื่อ: Z - A</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Toggle */}
                <div className="hidden sm:flex items-center border border-stone-700 rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                {/* Mobile Filter Toggle */}
                <Button
                  variant="outline"
                  className="lg:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  ตัวกรอง
                </Button>
              </div>

              {/* Active Filters */}
              {(filters.type !== 'ALL' || filters.category || filters.search) && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {filters.type !== 'ALL' && (
                    <Badge variant="secondary" className="pl-3">
                      {filters.type === 'DIGITAL' ? 'สินค้าดิจิทัล' : 'สินค้าจัดส่ง'}
                      <button onClick={() => setType('ALL')} className="ml-2">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {filters.category && (
                    <Badge variant="secondary" className="pl-3">
                      {categories.find((c) => c.slug === filters.category)?.name}
                      <button onClick={() => setCategory(null)} className="ml-2">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {filters.search && (
                    <Badge variant="secondary" className="pl-3">
                      "{filters.search}"
                      <button onClick={() => setSearch('')} className="ml-2">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                </div>
              )}

              {/* Results Count */}
              <p className="text-sm text-slate-400 mb-6">
                พบ {sortedProducts.length} สินค้า
              </p>

              {/* Product Grid */}
              {sortedProducts.length > 0 ? (
                <div className={viewMode === 'grid' 
                  ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
                }>
                  {sortedProducts.map((product) => (
                    <Link key={product.id} href={`/shop/${product.slug}`}>
                      <Card 
                        variant="glass" 
                        className={`group overflow-hidden card-hover shine ${
                          viewMode === 'list' ? 'flex' : ''
                        }`}
                      >
                        {/* Product Image */}
                        <div className={`relative overflow-hidden bg-stone-800 ${
                          viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-square'
                        }`}>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ShoppingBag className="w-16 h-16 text-stone-600 group-hover:text-amber-500/50 transition-colors" />
                          </div>
                          
                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {product.productType === 'DIGITAL' && (
                              <Badge variant="gold" className="text-xs">
                                <Download className="w-3 h-3 mr-1" />
                                ดิจิทัล
                              </Badge>
                            )}
                            {product.comparePrice && (
                              <Badge variant="destructive" className="text-xs">
                                ลด {Math.round((1 - product.price / product.comparePrice) * 100)}%
                              </Badge>
                            )}
                          </div>
                        </div>

                        <CardContent className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                          <p className="text-xs text-amber-400 mb-1">{product.category.name}</p>
                          <h3 className="font-semibold text-white group-hover:text-amber-400 transition-colors line-clamp-2 mb-2">
                            {product.name}
                          </h3>
                          
                          {/* Rating */}
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                              <span className="text-sm text-white ml-1">{product.rating}</span>
                            </div>
                            <span className="text-xs text-slate-500">({product.reviewCount})</span>
                          </div>

                          {/* Price */}
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-amber-400">
                              {formatCurrency(product.price)}
                            </span>
                            {product.comparePrice && (
                              <span className="text-sm text-slate-500 line-through">
                                {formatCurrency(product.comparePrice)}
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <Card variant="glass" className="p-12 text-center">
                  <ShoppingBag className="w-16 h-16 text-stone-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">ไม่พบสินค้า</h3>
                  <p className="text-slate-400 mb-6">ลองปรับตัวกรองหรือค้นหาด้วยคำอื่น</p>
                  <Button variant="outline" onClick={resetFilters}>
                    รีเซ็ตตัวกรอง
                  </Button>
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

export default function ShopPage() {
  return (
    <Suspense fallback={
      <>
        <Header />
        <main className="min-h-screen py-16 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-2 border-amber-500 rounded-full border-t-transparent" />
        </main>
        <Footer />
      </>
    }>
      <ShopContent />
    </Suspense>
  )
}
