'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { useTheme } from 'next-themes'
import { 
  ShoppingCart, 
  User, 
  Search, 
  Menu, 
  X, 
  LogOut,
  Package,
  Key,
  Settings,
  LayoutDashboard,
  Sun,
  Moon,
  ChevronDown,
  Code,
  Monitor,
  Server,
  Wifi,
  MessageCircle,
  Smartphone
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui'
import { useCartStore, useUIStore } from '@/stores'
import { cn } from '@/lib/utils'

export function Header() {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const [servicesTimeout, setServicesTimeout] = useState<NodeJS.Timeout | null>(null)
  const cartItemCount = useCartStore((state) => state.getItemCount())
  const { toggleCart, toggleSearch } = useUIStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleServicesEnter = () => {
    if (servicesTimeout) clearTimeout(servicesTimeout)
    setIsServicesOpen(true)
  }

  const handleServicesLeave = () => {
    const timeout = setTimeout(() => setIsServicesOpen(false), 150)
    setServicesTimeout(timeout)
  }

  // Services menu data
  const services = [
    {
      title: 'ซอฟต์แวร์',
      slug: 'software',
      icon: Code,
      color: 'purple',
      items: [
        'พัฒนาเว็บไซต์ ระบบหลังบ้าน แอปธุรกิจ',
        'ติดตั้ง / แก้ไข / ลงโปรแกรมเฉพาะทาง',
        'ระบบ API, Cloud, Hosting, DevOps',
      ],
    },
    {
      title: 'ฮาร์ดแวร์',
      slug: 'hardware',
      icon: Monitor,
      color: 'cyan',
      items: [
        'ซ่อมคอม โน้ตบุ๊ค มือถือ เกมมิ่ง',
        'อัปเกรด SSD/RAM/GPU',
        'เปลี่ยนจอ เปลี่ยนแบต ทำความสะอาดเครื่อง',
      ],
    },
    {
      title: 'เซิร์ฟเวอร์',
      slug: 'server',
      icon: Server,
      color: 'green',
      items: [
        'ติดตั้ง ESXi / Proxmox / Windows Server',
        'ทำ AD / DNS / File Server / Backup Server',
        'ออกแบบ Data Center / Storage / RAID / SAN / NAS',
      ],
    },
    {
      title: 'ระบบเครือข่าย',
      slug: 'network',
      icon: Wifi,
      color: 'orange',
      items: [
        'ออกแบบ Network บ้าน-องค์กร',
        'Mikrotik / Cisco / Fortigate / UniFi',
        'เดินสายแลน Wi-Fi / Firewall / VPN',
      ],
    },
    {
      title: 'ให้คำปรึกษา IT',
      slug: 'consulting',
      icon: MessageCircle,
      color: 'pink',
      items: [
        'แก้ปัญหา IT ทุกประเภท',
        'ประเมินและอัปเกรดระบบเก่า',
        'Redesign ระบบให้เสถียร',
      ],
    },
    {
      title: 'มือถือ iPhone',
      slug: 'mobile',
      icon: Smartphone,
      color: 'blue',
      items: [
        'ซ่อมมือถือ แบต จอ บอร์ด',
        'อะไหล่มือถือ iOS / Android',
        'จำหน่ายมือถือ / ระบบผ่อน / แลกเงิน MDM',
      ],
    },
  ]

  const getColorClass = (color: string) => {
    const colors: Record<string, { text: string; bg: string; hover: string }> = {
      purple: { text: 'text-purple-400', bg: 'bg-purple-500/10', hover: 'hover:bg-purple-500/20' },
      cyan: { text: 'text-cyan-400', bg: 'bg-cyan-500/10', hover: 'hover:bg-cyan-500/20' },
      green: { text: 'text-green-400', bg: 'bg-green-500/10', hover: 'hover:bg-green-500/20' },
      orange: { text: 'text-orange-400', bg: 'bg-orange-500/10', hover: 'hover:bg-orange-500/20' },
      pink: { text: 'text-pink-400', bg: 'bg-pink-500/10', hover: 'hover:bg-pink-500/20' },
      blue: { text: 'text-blue-400', bg: 'bg-blue-500/10', hover: 'hover:bg-blue-500/20' },
    }
    return colors[color] || colors.purple
  }

  const navLinks = [
    { href: '/shop', label: 'ร้านค้า' },
    { href: '/shop?type=DIGITAL', label: 'สินค้าดิจิทัล' },
    { href: '/shop?type=PHYSICAL', label: 'สินค้าจัดส่ง' },
    { href: '/about', label: 'เกี่ยวกับเรา' },
    { href: '/contact', label: 'ติดต่อ' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-purple-500/10 bg-background/70 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              {/* Glow effect behind logo */}
              <div className="absolute inset-0 bg-linear-to-r from-purple-500/20 via-cyan-500/10 to-pink-500/20 blur-xl scale-150 group-hover:scale-175 transition-transform duration-500 opacity-0 group-hover:opacity-100" />
              <div className="relative h-14 w-auto flex items-center">
                <span className="text-2xl font-bold text-gradient">Soft Stop Shop</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={handleServicesEnter}
              onMouseLeave={handleServicesLeave}
            >
              <Link
                href="/services"
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-purple-400 transition-colors"
              >
                บริการ
                <ChevronDown className={cn("h-4 w-4 transition-transform", isServicesOpen && "rotate-180")} />
              </Link>

              {/* Mega Menu */}
              {isServicesOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 pt-4 w-[800px]">
                  <div className="relative rounded-2xl border border-purple-500/20 bg-card/95 backdrop-blur-xl p-6 shadow-2xl shadow-purple-500/10">
                  {/* Arrow */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-card border-l border-t border-purple-500/20" />
                  
                  <div className="grid grid-cols-3 gap-4">
                    {services.map((service) => {
                      const colorClass = getColorClass(service.color)
                      const IconComponent = service.icon
                      return (
                        <Link 
                          key={service.title}
                          href={`/services/${service.slug}`}
                          className={cn("block p-4 rounded-xl transition-colors cursor-pointer", colorClass.hover)}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className={cn("p-2 rounded-lg", colorClass.bg)}>
                              <IconComponent className={cn("h-5 w-5", colorClass.text)} />
                            </div>
                            <h3 className={cn("font-semibold", colorClass.text)}>{service.title}</h3>
                          </div>
                          <ul className="space-y-2">
                            {service.items.map((item, idx) => (
                              <li key={idx} className="text-xs text-muted-foreground leading-relaxed">
                                • {item}
                              </li>
                            ))}
                          </ul>
                        </Link>
                      )
                    })}
                  </div>

                  {/* CTA */}
                  <div className="mt-6 pt-4 border-t border-purple-500/20 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      ต้องการบริการ? <span className="text-purple-400">ติดต่อเราได้เลย!</span>
                    </p>
                    <Link href="/contact" className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">
                      ติดต่อขอใบเสนอราคา →
                    </Link>
                  </div>
                </div>
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-purple-400 transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-purple-500 to-cyan-500 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="text-muted-foreground hover:text-purple-400 hover:bg-purple-500/10"
              >
                {theme === 'dark' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>
            )}

            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSearch}
              className="text-muted-foreground hover:text-cyan-400 hover:bg-cyan-500/10"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 rounded-lg text-muted-foreground hover:text-pink-400 hover:bg-pink-500/10 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-r from-purple-500 to-pink-500 text-xs font-bold text-white shadow-lg shadow-purple-500/50">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {session ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="text-muted-foreground hover:text-purple-400 hover:bg-purple-500/10"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="h-8 w-8 rounded-full ring-2 ring-purple-500/50"
                    />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </Button>

                {/* Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-purple-500/20 bg-card/95 backdrop-blur-xl p-2 shadow-xl shadow-purple-500/10">
                    <div className="px-3 py-2 border-b border-purple-500/20 mb-2">
                      <p className="text-sm font-medium text-foreground">{session.user.name}</p>
                      <p className="text-xs text-muted-foreground">{session.user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-purple-500/10 hover:text-purple-400"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>แดชบอร์ด</span>
                    </Link>
                    <Link
                      href="/dashboard/orders"
                      className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-cyan-500/10 hover:text-cyan-400"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Package className="h-4 w-4" />
                      <span>คำสั่งซื้อ</span>
                    </Link>
                    <Link
                      href="/dashboard/licenses"
                      className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-green-500/10 hover:text-green-400"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Key className="h-4 w-4" />
                      <span>ไลเซนส์</span>
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-orange-500/10 hover:text-orange-400"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      <span>ตั้งค่า</span>
                    </Link>
                    {session.user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm text-pink-400 hover:bg-pink-500/10"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <button
                      onClick={() => signOut()}
                      className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>ออกจากระบบ</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-purple-400 hover:bg-purple-500/10">
                    เข้าสู่ระบบ
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm" variant="neon">สมัครสมาชิก</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-muted-foreground hover:text-purple-400 hover:bg-purple-500/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-purple-500/10 bg-background/95 backdrop-blur-xl">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            {/* Services Accordion */}
            <div>
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="w-full flex items-center justify-between rounded-lg px-4 py-2 text-muted-foreground hover:bg-purple-500/10 hover:text-purple-400"
              >
                <span>บริการ</span>
                <ChevronDown className={cn("h-4 w-4 transition-transform", isServicesOpen && "rotate-180")} />
              </button>
              {isServicesOpen && (
                <div className="mt-2 ml-4 space-y-3 pb-2">
                  {services.map((service) => {
                    const colorClass = getColorClass(service.color)
                    const IconComponent = service.icon
                    return (
                      <div key={service.title} className="p-3 rounded-lg bg-card/50">
                        <div className="flex items-center gap-2 mb-2">
                          <IconComponent className={cn("h-4 w-4", colorClass.text)} />
                          <span className={cn("text-sm font-medium", colorClass.text)}>{service.title}</span>
                        </div>
                        <ul className="space-y-1 ml-6">
                          {service.items.map((item, idx) => (
                            <li key={idx} className="text-xs text-muted-foreground">• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-4 py-2 text-muted-foreground hover:bg-purple-500/10 hover:text-purple-400"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!session && (
              <div className="pt-4 border-t border-purple-500/10 space-y-2">
                <Link href="/auth/login" className="block">
                  <Button variant="outline" className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
                    เข้าสู่ระบบ
                  </Button>
                </Link>
                <Link href="/auth/register" className="block">
                  <Button variant="neon" className="w-full">สมัครสมาชิก</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
