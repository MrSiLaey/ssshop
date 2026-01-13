import type { Metadata } from 'next'
import { Inter, Orbitron } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

function resolveMetadataBase(): URL {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined)

  const fallback =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://softstopshop.com'

  const raw = fromEnv || fallback
  const withProtocol = raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`
  return new URL(withProtocol)
}

const metadataBase = resolveMetadataBase()

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
})

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: 'Soft Stop Shop - ร้านค้าออนไลน์แบบครบวงจร',
    template: '%s | Soft Stop Shop',
  },
  description: 'ร้านค้าออนไลน์แบบครบวงจร ทั้งสินค้าจัดส่งจริงและสินค้าดิจิทัลพร้อมระบบไลเซนส์',
  keywords: ['e-commerce', 'digital products', 'physical products', 'license', 'Thailand'],
  authors: [{ name: 'Soft Stop Shop' }],
  creator: 'Soft Stop Shop',
  icons: {
    icon: '/images/logo.png',
    shortcut: '/images/logo.png',
    apple: '/images/logo.png',
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    url: metadataBase,
    title: 'Soft Stop Shop - ร้านค้าออนไลน์แบบครบวงจร',
    description: 'ร้านค้าออนไลน์แบบครบวงจร ทั้งสินค้าจัดส่งจริงและสินค้าดิจิทัลพร้อมระบบไลเซนส์',
    siteName: 'Soft Stop Shop',
    images: [
      {
        url: '/images/logo.png',
        width: 512,
        height: 512,
        alt: 'Soft Stop Shop',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Soft Stop Shop - ร้านค้าออนไลน์แบบครบวงจร',
    description: 'ร้านค้าออนไลน์แบบครบวงจร ทั้งสินค้าจัดส่งจริงและสินค้าดิจิทัลพร้อมระบบไลเซนส์',
    images: ['/images/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`${inter.variable} ${orbitron.variable} font-sans antialiased bg-background text-foreground`}>
        <Providers>
          {/* Background Effects - Neon Style */}
          <div className="fixed inset-0 -z-10 overflow-hidden">
            {/* Base Background */}
            <div className="absolute inset-0 bg-background" />
            
            {/* Cyber Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
              style={{
                backgroundImage: `linear-gradient(rgba(168, 85, 247, 0.5) 1px, transparent 1px), 
                                  linear-gradient(90deg, rgba(168, 85, 247, 0.5) 1px, transparent 1px)`,
                backgroundSize: '50px 50px',
              }}
            />
            
            {/* Neon Glow Orbs */}
            <div className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full bg-[#a855f7]/8 dark:bg-[#a855f7]/15 blur-[150px] animate-pulse-neon" style={{ animationDuration: '4s' }} />
            <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-[#00d9ff]/6 dark:bg-[#00d9ff]/12 blur-[150px] animate-pulse-neon" style={{ animationDuration: '5s', animationDelay: '1s' }} />
            <div className="absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-[#ff6b9d]/5 dark:bg-[#ff6b9d]/10 blur-[120px] animate-pulse-neon" style={{ animationDuration: '6s', animationDelay: '2s' }} />
            <div className="absolute bottom-1/4 left-0 h-[350px] w-[350px] rounded-full bg-[#22c55e]/4 dark:bg-[#22c55e]/8 blur-[100px]" />
            
            {/* Subtle Noise Texture */}
            <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]" 
              style={{ 
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` 
              }} 
            />
          </div>

          {children}
        </Providers>
      </body>
    </html>
  )
}
