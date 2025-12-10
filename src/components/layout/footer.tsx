import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-background relative overflow-hidden">
      {/* Gold Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/20 blur-lg scale-150 group-hover:scale-175 transition-transform" />
                <Image
                  src="/images/logo.png"
                  alt="Soft Stop Shop"
                  width={48}
                  height={48}
                  className="relative rounded-xl drop-shadow-[0_0_10px_rgba(252,211,77,0.4)] group-hover:drop-shadow-[0_0_15px_rgba(252,211,77,0.6)] transition-all"
                />
              </div>
              <span className="text-xl font-bold text-primary drop-shadow-[0_0_20px_rgba(252,211,77,0.3)]">
                Soft Stop Shop
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              ร้านค้าออนไลน์แบบครบวงจร ทั้งสินค้าจัดส่งจริงและสินค้าดิจิทัลพร้อมระบบไลเซนส์
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              ลิงก์ด่วน
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  ร้านค้า
                </Link>
              </li>
              <li>
                <Link href="/shop?type=DIGITAL" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  สินค้าดิจิทัล
                </Link>
              </li>
              <li>
                <Link href="/shop?type=PHYSICAL" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  สินค้าจัดส่ง
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  เกี่ยวกับเรา
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              ช่วยเหลือ
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  คำถามที่พบบ่อย
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  การจัดส่ง
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  การคืนสินค้า
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  นโยบายความเป็นส่วนตัว
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  เงื่อนไขการใช้งาน
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              ติดต่อเรา
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  123 ถนนสุขุมวิท กรุงเทพมหานคร 10110
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">02-123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">support@softstopshop.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-border relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Soft Stop Shop. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-muted-foreground px-2 py-1 rounded bg-muted border border-border">Visa</span>
              <span className="text-xs text-muted-foreground px-2 py-1 rounded bg-muted border border-border">Mastercard</span>
              <span className="text-xs text-muted-foreground px-2 py-1 rounded bg-muted border border-border">PromptPay</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
