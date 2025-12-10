'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Key,
  BarChart3,
  Settings,
  Menu,
  LogOut,
  Bell,
  ChevronDown,
  Crown,
  Store
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui'

interface AdminLayoutProps {
  children: React.ReactNode
}

const navItems = [
  { icon: LayoutDashboard, label: 'ภาพรวม', href: '/admin' },
  { icon: Package, label: 'สินค้า', href: '/admin/products' },
  { icon: ShoppingCart, label: 'คำสั่งซื้อ', href: '/admin/orders' },
  { icon: Users, label: 'ลูกค้า', href: '/admin/customers' },
  { icon: Key, label: 'ไลเซนส์', href: '/admin/licenses' },
  { icon: BarChart3, label: 'รายงาน', href: '/admin/reports' },
  { icon: Settings, label: 'ตั้งค่า', href: '/admin/settings' },
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Gold Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-card/95 backdrop-blur-xl border-r border-primary/20 transform transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-primary/20">
          <Link href="/admin" className="flex items-center space-x-3 group">
            <Image
              src="/images/logo.png"
              alt="Admin Panel"
              width={48}
              height={48}
              className="rounded-xl shadow-lg shadow-primary/20"
            />
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-transparent bg-clip-text">Admin Panel</span>
              <p className="text-xs text-muted-foreground">Soft Stop Shop</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  active 
                    ? 'bg-gradient-to-r from-primary/20 to-primary/20 text-primary border border-primary/30 shadow-lg shadow-primary/10'
                    : 'text-muted-foreground hover:text-primary hover:bg-muted/50 border border-transparent'
                }`}
              >
                <item.icon className={`w-5 h-5 ${active ? 'text-primary' : ''}`} />
                <span className="font-medium">{item.label}</span>
                {active && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Stats Card */}
        <div className="mx-4 mt-6 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/10 border border-primary/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-black" />
            </div>
            <div>
              <p className="text-sm text-primary font-medium">รายได้วันนี้</p>
              <p className="text-lg font-bold text-foreground">฿45,890</p>
            </div>
          </div>
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-3/4 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">75% ของเป้าหมาย</p>
        </div>

        {/* Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-primary/20">
          <Link
            href="/"
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-primary hover:bg-muted/50 transition-all duration-300"
          >
            <Store className="w-5 h-5" />
            <span>กลับหน้าร้าน</span>
          </Link>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Bar */}
        <header className="h-20 bg-card/80 backdrop-blur-xl border-b border-primary/20 flex items-center justify-between px-6 sticky top-0 z-30">
          <button
            className="lg:hidden text-muted-foreground hover:text-primary transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <input 
                type="text"
                placeholder="ค้นหา..."
                className="w-full px-4 py-2 pl-10 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative hover:bg-muted/50">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full border-2 border-card"></span>
            </Button>

            {/* User Menu */}
            <div className="flex items-center space-x-3 cursor-pointer px-3 py-2 rounded-xl hover:bg-muted/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-black font-bold text-sm">A</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-foreground">Admin</p>
                <p className="text-xs text-muted-foreground">ผู้ดูแลระบบ</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 relative">
          {children}
        </main>
      </div>
    </div>
  )
}
