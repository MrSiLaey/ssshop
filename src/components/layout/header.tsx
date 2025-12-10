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
  Moon
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
  const cartItemCount = useCartStore((state) => state.getItemCount())
  const { toggleCart, toggleSearch } = useUIStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  const navLinks = [
    { href: '/shop', label: 'ร้านค้า' },
    { href: '/shop?type=DIGITAL', label: 'สินค้าดิจิทัล' },
    { href: '/shop?type=PHYSICAL', label: 'สินค้าจัดส่ง' },
    { href: '/about', label: 'เกี่ยวกับเรา' },
    { href: '/contact', label: 'ติดต่อ' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              {/* Glow effect behind logo */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary/20 to-primary/30 blur-xl scale-150 group-hover:scale-175 transition-transform duration-500" />
              <div className="relative h-14 w-auto flex items-center">
                <span className="text-2xl font-bold text-primary">Soft Stop Shop</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
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
                className="text-muted-foreground hover:text-primary"
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
              className="text-muted-foreground hover:text-primary"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCart}
              className="relative text-muted-foreground hover:text-primary"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {cartItemCount}
                </span>
              )}
            </Button>

            {/* User Menu */}
            {session ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="text-muted-foreground hover:text-primary"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="h-8 w-8 rounded-full ring-2 ring-primary/50"
                    />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </Button>

                {/* Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-popover/95 backdrop-blur-xl p-2 shadow-xl">
                    <div className="px-3 py-2 border-b border-border mb-2">
                      <p className="text-sm font-medium text-foreground">{session.user.name}</p>
                      <p className="text-xs text-muted-foreground">{session.user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-primary/10 hover:text-primary"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>แดชบอร์ด</span>
                    </Link>
                    <Link
                      href="/dashboard/orders"
                      className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-primary/10 hover:text-primary"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Package className="h-4 w-4" />
                      <span>คำสั่งซื้อ</span>
                    </Link>
                    <Link
                      href="/dashboard/licenses"
                      className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-primary/10 hover:text-primary"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Key className="h-4 w-4" />
                      <span>ไลเซนส์</span>
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-primary/10 hover:text-primary"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      <span>ตั้งค่า</span>
                    </Link>
                    {session.user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm text-primary hover:bg-primary/10"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <button
                      onClick={() => signOut()}
                      className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
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
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                    เข้าสู่ระบบ
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">สมัครสมาชิก</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-muted-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-4 py-2 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!session && (
              <div className="pt-4 border-t border-border space-y-2">
                <Link href="/auth/login" className="block">
                  <Button variant="outline" className="w-full border-primary/30 text-primary">
                    เข้าสู่ระบบ
                  </Button>
                </Link>
                <Link href="/auth/register" className="block">
                  <Button className="w-full bg-primary text-primary-foreground">สมัครสมาชิก</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
