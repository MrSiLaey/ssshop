'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Key, 
  Copy, 
  Check, 
  Calendar,
  Monitor,
  ArrowLeft,
  Search,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react'
import { Header, Footer } from '@/components/layout'
import { Card, Badge, Button, Input } from '@/components/ui'

interface License {
  id: string
  productName: string
  key: string
  status: string
  createdAt: string
  expiresAt: string | null
  activations: number
  maxActivations: number
}

const statusConfig = {
  ACTIVE: { label: 'ใช้งานอยู่', variant: 'success' as const },
  EXPIRED: { label: 'หมดอายุ', variant: 'destructive' as const },
  REVOKED: { label: 'ถูกยกเลิก', variant: 'secondary' as const },
}

export default function LicensesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [licenses, setLicenses] = useState<License[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/dashboard/licenses')
    }
  }, [status, router])

  useEffect(() => {
    async function fetchLicenses() {
      try {
        const res = await fetch('/api/licenses')
        if (res.ok) {
          const data = await res.json()
          setLicenses(data)
        }
      } catch (error) {
        console.error('Failed to fetch licenses:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session?.user) {
      fetchLicenses()
    }
  }, [session])

  const filteredLicenses = licenses.filter((license) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        license.productName.toLowerCase().includes(query) ||
        license.key.toLowerCase().includes(query)
      )
    }
    return true
  })

  const toggleKeyVisibility = (id: string) => {
    const newVisible = new Set(visibleKeys)
    if (newVisible.has(id)) {
      newVisible.delete(id)
    } else {
      newVisible.add(id)
    }
    setVisibleKeys(newVisible)
  }

  const copyToClipboard = async (key: string, id: string) => {
    await navigator.clipboard.writeText(key)
    setCopiedKey(id)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const maskKey = (key: string) => {
    const parts = key.split('-')
    return parts.map((part, index) => (index === 0 ? part : '****')).join('-')
  }

  if (status === 'loading' || loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-16 bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-20">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-muted-foreground">กำลังโหลด...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-16 bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Back Link */}
          <Link href="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับไปแดชบอร์ด
          </Link>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">ไลเซนส์ของฉัน</h1>
            <p className="text-muted-foreground">จัดการและติดตามไลเซนส์ทั้งหมดของคุณ ({licenses.length} รายการ)</p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <Input
              placeholder="ค้นหาไลเซนส์หรือชื่อสินค้า..."
              icon={<Search className="h-4 w-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          {/* Licenses List */}
          {filteredLicenses.length > 0 ? (
            <div className="space-y-4">
              {filteredLicenses.map((license) => {
                const licenseStatus = statusConfig[license.status as keyof typeof statusConfig] || statusConfig.ACTIVE
                const isVisible = visibleKeys.has(license.id)
                const isCopied = copiedKey === license.id
                const daysUntilExpiry = license.expiresAt
                  ? Math.ceil((new Date(license.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                  : null

                return (
                  <Card key={license.id} variant="glass" className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                            <Key className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-foreground truncate">
                                {license.productName}
                              </h3>
                              <Badge variant={licenseStatus.variant}>{licenseStatus.label}</Badge>
                            </div>

                            {/* License Key */}
                            <div className="flex items-center gap-2 mb-4 p-3 bg-muted/50 rounded-lg">
                              <code className="flex-1 font-mono text-sm text-foreground truncate">
                                {isVisible ? license.key : maskKey(license.key)}
                              </code>
                              <button
                                onClick={() => toggleKeyVisibility(license.id)}
                                className="p-1.5 hover:bg-muted rounded transition-colors"
                                title={isVisible ? 'ซ่อน' : 'แสดง'}
                              >
                                {isVisible ? (
                                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                                ) : (
                                  <Eye className="w-4 h-4 text-muted-foreground" />
                                )}
                              </button>
                              <button
                                onClick={() => copyToClipboard(license.key, license.id)}
                                className="p-1.5 hover:bg-muted rounded transition-colors"
                                title="คัดลอก"
                              >
                                {isCopied ? (
                                  <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Copy className="w-4 h-4 text-muted-foreground" />
                                )}
                              </button>
                            </div>

                            {/* Stats */}
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1.5">
                                <Monitor className="w-4 h-4" />
                                <span>ใช้งาน: {license.activations}/{license.maxActivations}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                <span>เริ่มใช้งาน: {license.createdAt}</span>
                              </div>
                              {license.expiresAt && (
                                <div className="flex items-center gap-1.5">
                                  {daysUntilExpiry && daysUntilExpiry <= 30 && daysUntilExpiry > 0 ? (
                                    <AlertCircle className="w-4 h-4 text-orange-500" />
                                  ) : (
                                    <Calendar className="w-4 h-4" />
                                  )}
                                  <span className={daysUntilExpiry && daysUntilExpiry <= 30 && daysUntilExpiry > 0 ? 'text-orange-500' : ''}>
                                    หมดอายุ: {license.expiresAt}
                                    {daysUntilExpiry && daysUntilExpiry > 0 && ` (อีก ${daysUntilExpiry} วัน)`}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card variant="glass" className="p-12 text-center">
              <Key className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {searchQuery ? 'ไม่พบไลเซนส์' : 'ยังไม่มีไลเซนส์'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? 'ลองค้นหาด้วยคำอื่น'
                  : 'เมื่อคุณซื้อสินค้าดิจิทัล ไลเซนส์จะปรากฏที่นี่'
                }
              </p>
              {!searchQuery && (
                <Link href="/shop">
                  <Button variant="neon">เลือกซื้อสินค้า</Button>
                </Link>
              )}
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
