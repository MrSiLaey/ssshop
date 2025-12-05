import type { Metadata } from 'next'
import { Inter, Orbitron } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
})

export const metadata: Metadata = {
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
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    url: 'https://softstopshop.com',
    title: 'Soft Stop Shop - ร้านค้าออนไลน์แบบครบวงจร',
    description: 'ร้านค้าออนไลน์แบบครบวงจร ทั้งสินค้าจัดส่งจริงและสินค้าดิจิทัลพร้อมระบบไลเซนส์',
    siteName: 'Soft Stop Shop',
    images: ['/images/logo.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Soft Stop Shop - ร้านค้าออนไลน์แบบครบวงจร',
    description: 'ร้านค้าออนไลน์แบบครบวงจร ทั้งสินค้าจัดส่งจริงและสินค้าดิจิทัลพร้อมระบบไลเซนส์',
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
    <html lang="th" className="dark">
      <body className={`${inter.variable} ${orbitron.variable} font-sans antialiased bg-black text-white`}>
        <Providers>
          {/* Background Effects */}
          <div className="fixed inset-0 -z-10">
            {/* Gradient Background - Black with subtle gold */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-950 to-black" />
            
            {/* Circuit Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `linear-gradient(rgba(252,211,77,0.3) 1px, transparent 1px), 
                                  linear-gradient(90deg, rgba(252,211,77,0.3) 1px, transparent 1px)`,
                backgroundSize: '60px 60px',
              }}
            />
            
            {/* Gold Glow Effects */}
            <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-yellow-500/10 blur-[150px]" />
            <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-amber-500/8 blur-[150px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-yellow-600/5 blur-[180px]" />
          </div>

          {children}
        </Providers>
      </body>
    </html>
  )
}
