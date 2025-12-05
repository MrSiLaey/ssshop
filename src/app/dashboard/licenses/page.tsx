'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Key, 
  Copy, 
  Check, 
  AlertTriangle,
  Calendar,
  Monitor,
  RefreshCw,
  ArrowLeft,
  Search,
  Eye,
  EyeOff
} from 'lucide-react'
import { Header, Footer } from '@/components/layout'
import { Card, Badge, Button, Input } from '@/components/ui'

// Mock data
const licenses = [
  {
    id: '1',
    productName: 'Premium Software License',
    productSlug: 'premium-software-license',
    key: 'SSS-PREM-XXXX-YYYY-ZZZZ',
    status: 'ACTIVE',
    createdAt: '2024-01-15',
    expiresAt: '2025-01-15',
    activations: 2,
    maxActivations: 3,
    activationHistory: [
      { id: '1', deviceName: 'MacBook Pro', activatedAt: '2024-01-15', ipAddress: '192.168.1.100' },
      { id: '2', deviceName: 'Windows Desktop', activatedAt: '2024-01-16', ipAddress: '192.168.1.101' },
    ],
  },
  {
    id: '2',
    productName: 'Developer Toolkit Pro',
    productSlug: 'developer-toolkit-pro',
    key: 'SSS-DEVT-AAAA-BBBB-CCCC',
    status: 'ACTIVE',
    createdAt: '2024-01-10',
    expiresAt: '2025-01-10',
    activations: 1,
    maxActivations: 2,
    activationHistory: [
      { id: '3', deviceName: 'Work Laptop', activatedAt: '2024-01-10', ipAddress: '10.0.0.50' },
    ],
  },
  {
    id: '3',
    productName: 'Cloud Storage 1TB License',
    productSlug: 'cloud-storage-1tb-license',
    key: 'SSS-CLOD-DDDD-EEEE-FFFF',
    status: 'EXPIRED',
    createdAt: '2023-01-01',
    expiresAt: '2024-01-01',
    activations: 3,
    maxActivations: 3,
    activationHistory: [],
  },
]

const statusConfig = {
  ACTIVE: { label: 'ใช้งานอยู่', variant: 'success' as const },
  EXPIRED: { label: 'หมดอายุ', variant: 'destructive' as const },
  REVOKED: { label: 'ถูกยกเลิก', variant: 'secondary' as const },
}

export default function LicensesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedLicense, setExpandedLicense] = useState<string | null>(null)
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

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

  return (
    <>
      <Header />
      <main className="min-h-screen pt-16 bg-slate-950">
        <div className="container mx-auto px-4 py-8">
          {/* Back Link */}
          <Link href="/dashboard" className="inline-flex items-center text-slate-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับไปแดชบอร์ด
          </Link>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">ไลเซนส์ของฉัน</h1>
            <p className="text-slate-400">จัดการและติดตามไลเซนส์ทั้งหมดของคุณ</p>
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
                const status = statusConfig[license.status as keyof typeof statusConfig]
                const isExpanded = expandedLicense === license.id
                const isVisible = visibleKeys.has(license.id)
                const isCopied = copiedKey === license.id
                const daysUntilExpiry = Math.ceil(
                  (new Date(license.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                )

                return (
                  <Card key={license.id} variant="glass" className="overflow-hidden">
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-violet-500/20 flex items-center justify-center">
                            <Key className="w-6 h-6 text-violet-400" />
                          </div>
                          <div>
                            <Link 
                              href={`/shop/${license.productSlug}`}
                              className="font-semibold text-white hover:text-violet-400 transition-colors"
                            >
                              {license.productName}
                            </Link>
                            <p className="text-sm text-slate-500">ซื้อเมื่อ {license.createdAt}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={status.variant}>{status.label}</Badge>
                          {license.status === 'ACTIVE' && daysUntilExpiry <= 30 && (
                            <Badge variant="warning" className="flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              หมดอายุใน {daysUntilExpiry} วัน
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* License Key */}
                      <div className="flex items-center gap-2 p-3 bg-slate-800/50 rounded-lg mb-4">
                        <Key className="w-4 h-4 text-violet-400" />
                        <code className="flex-1 font-mono text-white">
                          {isVisible ? license.key : maskKey(license.key)}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => toggleKeyVisibility(license.id)}
                        >
                          {isVisible ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => copyToClipboard(license.key, license.id)}
                        >
                          {isCopied ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="p-3 bg-slate-800/30 rounded-lg">
                          <div className="flex items-center gap-2 text-slate-400 mb-1">
                            <Monitor className="w-4 h-4" />
                            <span className="text-xs">การใช้งาน</span>
                          </div>
                          <p className="font-semibold text-white">
                            {license.activations}/{license.maxActivations}
                          </p>
                        </div>
                        <div className="p-3 bg-slate-800/30 rounded-lg">
                          <div className="flex items-center gap-2 text-slate-400 mb-1">
                            <Calendar className="w-4 h-4" />
                            <span className="text-xs">หมดอายุ</span>
                          </div>
                          <p className="font-semibold text-white">{license.expiresAt}</p>
                        </div>
                        <div className="col-span-2 sm:col-span-2 flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => setExpandedLicense(isExpanded ? null : license.id)}
                          >
                            <Monitor className="w-4 h-4 mr-2" />
                            ดูอุปกรณ์
                          </Button>
                          {license.status === 'EXPIRED' && (
                            <Button size="sm" className="flex-1">
                              <RefreshCw className="w-4 h-4 mr-2" />
                              ต่ออายุ
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Activation History */}
                      {isExpanded && license.activationHistory.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-800">
                          <h4 className="font-medium text-white mb-3">อุปกรณ์ที่ใช้งาน</h4>
                          <div className="space-y-2">
                            {license.activationHistory.map((activation) => (
                              <div
                                key={activation.id}
                                className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <Monitor className="w-4 h-4 text-slate-400" />
                                  <div>
                                    <p className="text-white">{activation.deviceName}</p>
                                    <p className="text-xs text-slate-500">{activation.ipAddress}</p>
                                  </div>
                                </div>
                                <span className="text-sm text-slate-400">{activation.activatedAt}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card variant="glass" className="p-12 text-center">
              <Key className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">ไม่พบไลเซนส์</h3>
              <p className="text-slate-400 mb-6">
                {searchQuery ? 'ลองค้นหาด้วยคำอื่น' : 'คุณยังไม่มีไลเซนส์ใดๆ'}
              </p>
              <Link href="/shop?type=DIGITAL">
                <Button>ซื้อสินค้าดิจิทัล</Button>
              </Link>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
