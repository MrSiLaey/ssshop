'use client'

import { useState } from 'react'
import { 
  Key, 
  Search, 
  Copy,
  Check,
  Eye,
  EyeOff,
  AlertTriangle,
  Ban,
  RefreshCw
} from 'lucide-react'
import { Card, Badge, Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui'

// Mock data
const licenses = [
  {
    id: '1',
    key: 'SSS-PREM-XXXX-YYYY-ZZZZ',
    productName: 'Premium Software License',
    customer: { name: 'สมชาย ใจดี', email: 'somchai@email.com' },
    status: 'ACTIVE',
    createdAt: '2024-01-15',
    expiresAt: '2025-01-15',
    activations: 2,
    maxActivations: 3,
    orderId: 'ORD-2024-001234',
  },
  {
    id: '2',
    key: 'SSS-DEVT-AAAA-BBBB-CCCC',
    productName: 'Developer Toolkit Pro',
    customer: { name: 'สมหญิง ดีใจ', email: 'somying@email.com' },
    status: 'ACTIVE',
    createdAt: '2024-01-10',
    expiresAt: '2025-01-10',
    activations: 1,
    maxActivations: 2,
    orderId: 'ORD-2024-001233',
  },
  {
    id: '3',
    key: 'SSS-CLOD-DDDD-EEEE-FFFF',
    productName: 'Cloud Storage 1TB License',
    customer: { name: 'ประพนธ์ มั่นคง', email: 'prapon@email.com' },
    status: 'EXPIRED',
    createdAt: '2023-01-01',
    expiresAt: '2024-01-01',
    activations: 3,
    maxActivations: 3,
    orderId: 'ORD-2024-001232',
  },
  {
    id: '4',
    key: 'SSS-PREM-GGGG-HHHH-IIII',
    productName: 'Premium Software License',
    customer: { name: 'นารี สุขใจ', email: 'naree@email.com' },
    status: 'REVOKED',
    createdAt: '2024-01-05',
    expiresAt: '2025-01-05',
    activations: 0,
    maxActivations: 3,
    orderId: 'ORD-2024-001231',
  },
]

const statusConfig = {
  ACTIVE: { label: 'ใช้งานอยู่', variant: 'success' as const },
  EXPIRED: { label: 'หมดอายุ', variant: 'warning' as const },
  REVOKED: { label: 'ถูกยกเลิก', variant: 'destructive' as const },
}

export default function AdminLicensesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const filteredLicenses = licenses.filter((license) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        license.key.toLowerCase().includes(query) ||
        license.productName.toLowerCase().includes(query) ||
        license.customer.name.toLowerCase().includes(query) ||
        license.customer.email.toLowerCase().includes(query)
      )
    }
    if (statusFilter !== 'all' && license.status !== statusFilter) {
      return false
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

  // Stats
  const stats = {
    total: licenses.length,
    active: licenses.filter((l) => l.status === 'ACTIVE').length,
    expired: licenses.filter((l) => l.status === 'EXPIRED').length,
    revoked: licenses.filter((l) => l.status === 'REVOKED').length,
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 text-transparent bg-clip-text mb-2">ไลเซนส์</h1>
        <p className="text-slate-400">จัดการไลเซนส์ทั้งหมดในระบบ</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card variant="glass" className="p-4 border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
              <Key className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-sm text-slate-400">ทั้งหมด</p>
            </div>
          </div>
        </Card>
        <Card variant="glass" className="p-4 border-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400">{stats.active}</p>
              <p className="text-sm text-slate-400">ใช้งานอยู่</p>
            </div>
          </div>
        </Card>
        <Card variant="glass" className="p-4 border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-400">{stats.expired}</p>
              <p className="text-sm text-slate-400">หมดอายุ</p>
            </div>
          </div>
        </Card>
        <Card variant="glass" className="p-4 border-zinc-500/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-500 to-zinc-600 flex items-center justify-center">
              <Ban className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-400">{stats.revoked}</p>
              <p className="text-sm text-slate-400">ถูกยกเลิก</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card variant="glass" className="p-4 border-amber-500/20">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="ค้นหาไลเซนส์, สินค้า หรือลูกค้า..."
              icon={<Search className="h-4 w-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="สถานะทั้งหมด" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">สถานะทั้งหมด</SelectItem>
              <SelectItem value="ACTIVE">ใช้งานอยู่</SelectItem>
              <SelectItem value="EXPIRED">หมดอายุ</SelectItem>
              <SelectItem value="REVOKED">ถูกยกเลิก</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Licenses Table */}
      <Card variant="glass" className="overflow-hidden border-amber-500/20">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-slate-400 bg-slate-800/50">
                <th className="p-4 font-medium">License Key</th>
                <th className="p-4 font-medium">สินค้า</th>
                <th className="p-4 font-medium">ลูกค้า</th>
                <th className="p-4 font-medium">สถานะ</th>
                <th className="p-4 font-medium">การใช้งาน</th>
                <th className="p-4 font-medium">หมดอายุ</th>
                <th className="p-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filteredLicenses.map((license) => {
                const status = statusConfig[license.status as keyof typeof statusConfig]
                const isVisible = visibleKeys.has(license.id)
                const isCopied = copiedKey === license.id
                const daysUntilExpiry = Math.ceil(
                  (new Date(license.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                )

                return (
                  <tr key={license.id} className="border-t border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-amber-400" />
                        <code className="font-mono text-amber-400">
                          {isVisible ? license.key : maskKey(license.key)}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-slate-400 hover:text-amber-400"
                          onClick={() => toggleKeyVisibility(license.id)}
                        >
                          {isVisible ? (
                            <EyeOff className="w-3 h-3" />
                          ) : (
                            <Eye className="w-3 h-3" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-slate-400 hover:text-amber-400"
                          onClick={() => copyToClipboard(license.key, license.id)}
                        >
                          {isCopied ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-white font-medium">{license.productName}</p>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-white">{license.customer.name}</p>
                        <p className="text-sm text-slate-500">{license.customer.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Badge variant={status.variant}>{status.label}</Badge>
                        {license.status === 'ACTIVE' && daysUntilExpiry <= 30 && daysUntilExpiry > 0 && (
                          <span title={`หมดอายุใน ${daysUntilExpiry} วัน`}><AlertTriangle className="w-4 h-4 text-amber-400" /></span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`${
                        license.activations >= license.maxActivations ? 'text-amber-400' : 'text-slate-400'
                      }`}>
                        {license.activations}/{license.maxActivations}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-slate-400">{license.expiresAt}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {license.status === 'ACTIVE' && (
                          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800" title="ยกเลิกไลเซนส์">
                            <Ban className="w-4 h-4" />
                          </Button>
                        )}
                        {license.status === 'EXPIRED' && (
                          <Button variant="ghost" size="icon" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10" title="ต่ออายุไลเซนส์">
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-slate-800">
          <p className="text-sm text-slate-400">
            แสดง {filteredLicenses.length} จาก {licenses.length} รายการ
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled className="border-slate-700">ก่อนหน้า</Button>
            <Button variant="outline" size="sm" disabled className="border-slate-700">ถัดไป</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
