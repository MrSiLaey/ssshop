import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowRight, 
  ShoppingBag, 
  Download, 
  Key, 
  Shield, 
  Zap, 
  Truck,
  Star,
  ChevronRight,
  Crown
} from 'lucide-react'
import { Header, Footer } from '@/components/layout'
import { Button, Card, CardContent, Badge } from '@/components/ui'

// Mock featured products - replace with real data
const featuredProducts = [
  {
    id: '1',
    name: 'Premium Software License',
    slug: 'premium-software-license',
    price: 2990,
    comparePrice: 3990,
    image: '/images/products/software-1.jpg',
    category: 'Software',
    type: 'DIGITAL',
    rating: 4.8,
    reviewCount: 124,
  },
  {
    id: '2',
    name: 'Developer Toolkit Pro',
    slug: 'developer-toolkit-pro',
    price: 1490,
    image: '/images/products/software-2.jpg',
    category: 'Development',
    type: 'DIGITAL',
    rating: 4.9,
    reviewCount: 89,
  },
  {
    id: '3',
    name: 'Wireless Keyboard RGB',
    slug: 'wireless-keyboard-rgb',
    price: 2490,
    comparePrice: 2990,
    image: '/images/products/keyboard-1.jpg',
    category: 'Hardware',
    type: 'PHYSICAL',
    rating: 4.7,
    reviewCount: 256,
  },
  {
    id: '4',
    name: 'Gaming Mouse Pro',
    slug: 'gaming-mouse-pro',
    price: 1890,
    image: '/images/products/mouse-1.jpg',
    category: 'Hardware',
    type: 'PHYSICAL',
    rating: 4.6,
    reviewCount: 178,
  },
]

const features = [
  {
    icon: Download,
    title: 'สินค้าดิจิทัล',
    description: 'ดาวน์โหลดได้ทันทีหลังชำระเงิน พร้อมระบบไลเซนส์อัตโนมัติ',
  },
  {
    icon: Truck,
    title: 'จัดส่งทั่วไทย',
    description: 'ส่งฟรีทั่วประเทศ สำหรับสินค้าที่ต้องจัดส่งจริง',
  },
  {
    icon: Key,
    title: 'ระบบไลเซนส์',
    description: 'จัดการไลเซนส์ได้ง่าย ตรวจสอบสถานะแบบ Real-time',
  },
  {
    icon: Shield,
    title: 'ปลอดภัย 100%',
    description: 'ระบบชำระเงินที่ปลอดภัย รองรับทั้ง Stripe และ PromptPay',
  },
]

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div className="space-y-8">
                <Badge variant="gold" className="text-sm px-4 py-2">
                  <Crown className="w-4 h-4 mr-2" />
                  Premium Collection - New Arrival
                </Badge>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="text-gradient">Soft Stop Shop</span>
                </h1>

                <p className="text-lg text-muted-foreground max-w-xl">
                  ค้นพบสินค้าดิจิทัลและสินค้าจริงที่คุณต้องการ พร้อมระบบไลเซนส์อัตโนมัติ 
                  และการจัดส่งที่รวดเร็ว ทุกการซื้อมาพร้อมความปลอดภัย
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link href="/shop">
                    <Button size="xl" className="group">
                      เริ่มช้อปปิ้ง
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/shop?type=DIGITAL">
                    <Button variant="outline" size="xl">
                      <Download className="mr-2 h-5 w-5" />
                      สินค้าดิจิทัล
                    </Button>
                  </Link>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-8 pt-4">
                  <div>
                    <p className="text-3xl font-bold text-primary">10K+</p>
                    <p className="text-sm text-muted-foreground">ลูกค้าที่ไว้วางใจ</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-primary">500+</p>
                    <p className="text-sm text-muted-foreground">สินค้าคุณภาพ</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-primary">99%</p>
                    <p className="text-sm text-muted-foreground">ความพึงพอใจ</p>
                  </div>
                </div>
              </div>

              {/* Hero Image/Animation */}
              <div className="relative">
                <div className="relative z-10">
                  {/* 3D Card Effect with Large Logo */}
                  <div className="relative perspective-1000">
                    <div className="relative transform-gpu hover:rotate-y-6 transition-transform duration-500">
                      <Card variant="luxury" className="p-8 card-hover">
                        <div className="aspect-square rounded-xl bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-amber-600/20 flex items-center justify-center border border-amber-500/20 relative overflow-hidden">
                          {/* Animated glow rings */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="absolute w-64 h-64 rounded-full border border-amber-500/30 animate-ping" style={{ animationDuration: '3s' }} />
                            <div className="absolute w-80 h-80 rounded-full border border-yellow-500/20 animate-ping" style={{ animationDuration: '4s' }} />
                          </div>
                          {/* Logo with glow */}
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/40 via-amber-500/30 to-yellow-400/40 blur-2xl scale-150" />
                            <Image
                              src="/images/logo.png"
                              alt="Soft Stop Shop"
                              width={200}
                              height={200}
                              className="relative w-40 h-40 object-contain drop-shadow-[0_0_40px_rgba(252,211,77,0.8)] animate-float"
                            />
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 animate-float" style={{ animationDelay: '0.5s' }}>
                    <Card variant="glass" className="p-4 border-primary/20">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <Key className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">License Activated</p>
                          <p className="text-xs text-muted-foreground">Just now</p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="absolute -bottom-4 -left-4 animate-float" style={{ animationDelay: '1s' }}>
                    <Card variant="glass" className="p-4 border-primary/20">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <Download className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Download Ready</p>
                          <p className="text-xs text-muted-foreground">Premium Software</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Background Glow */}
                <div className="absolute inset-0 -z-10">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-amber-500/20 blur-[100px]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 border-y border-border">
          <div className="container mx-auto px-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center space-y-4">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">สินค้าแนะนำ</h2>
                <p className="text-muted-foreground">คัดสรรสินค้าคุณภาพเพื่อคุณ</p>
              </div>
              <Link href="/shop">
                <Button variant="ghost" className="group">
                  ดูทั้งหมด
                  <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Link key={product.id} href={`/shop/${product.slug}`}>
                  <Card variant="luxury" className="group overflow-hidden card-hover shine">
                    {/* Product Image */}
                    <div className="aspect-square relative overflow-hidden bg-muted">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ShoppingBag className="w-20 h-20 text-muted-foreground/30 group-hover:text-primary/50 transition-colors" />
                      </div>
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.type === 'DIGITAL' && (
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

                    <CardContent className="p-4">
                      <p className="text-xs text-primary mb-1">{product.category}</p>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                        {product.name}
                      </h3>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-primary fill-primary" />
                          <span className="text-sm text-foreground ml-1">{product.rating}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary">฿{product.price.toLocaleString()}</span>
                        {product.comparePrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ฿{product.comparePrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <Card variant="luxury" className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10" />
              <div className="relative p-8 md:p-12 lg:p-16 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  พร้อมเริ่มต้นแล้วหรือยัง?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  สมัครสมาชิกวันนี้ รับส่วนลดพิเศษทันที 10% สำหรับการสั่งซื้อครั้งแรก
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/auth/register">
                    <Button size="xl" variant="gold">
                      <Crown className="mr-2 h-5 w-5" />
                      สมัครสมาชิกฟรี
                    </Button>
                  </Link>
                  <Link href="/shop">
                    <Button size="xl" variant="outline">
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
