import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Zap } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-purple-500/10 bg-background relative overflow-hidden">
      {/* Neon Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-purple-500/20 to-transparent" />
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-r from-purple-500/20 via-cyan-500/20 to-pink-500/20 blur-lg scale-150 group-hover:scale-175 transition-transform" />
                <div className="relative w-12 h-12 rounded-xl bg-linear-to-br from-purple-500 to-cyan-500 p-0.5">
                  <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
                    <Zap className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
              </div>
              <span className="text-xl font-bold text-gradient">
                Soft Stop Shop
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              ร้านค้าออนไลน์แบบครบวงจร ทั้งสินค้าจัดส่งจริงและสินค้าดิจิทัลพร้อมระบบไลเซนส์
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-purple-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-cyan-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-pink-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-green-400 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-4">
              ลิงก์ด่วน
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="text-sm text-muted-foreground hover:text-purple-400 transition-colors">
                  ร้านค้า
                </Link>
              </li>
              <li>
                <Link href="/shop?type=DIGITAL" className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors">
                  สินค้าดิจิทัล
                </Link>
              </li>
              <li>
                <Link href="/shop?type=PHYSICAL" className="text-sm text-muted-foreground hover:text-pink-400 transition-colors">
                  สินค้าจัดส่ง
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-green-400 transition-colors">
                  เกี่ยวกับเรา
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-4">
              ช่วยเหลือ
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors">
                  คำถามที่พบบ่อย
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors">
                  การจัดส่ง
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors">
                  การคืนสินค้า
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors">
                  นโยบายความเป็นส่วนตัว
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors">
                  เงื่อนไขการใช้งาน
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-pink-400 uppercase tracking-wider mb-4">
              ติดต่อเรา
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-pink-400 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  123 ถนนสุขุมวิท กรุงเทพมหานคร 10110
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-green-400" />
                <span className="text-sm text-muted-foreground">02-123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-purple-400" />
                <span className="text-sm text-muted-foreground">support@softstopshop.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-purple-500/10 relative z-10">
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
