'use client'

import { useState, useEffect } from 'react'
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

interface License {
  id: string
  licenseKey: string
  product: { name: string }
  user: { name: string | null; email: string } | null
  status: string
  createdAt: string
  expiresAt: string | null
  activations: Array<{ id: string }>
  maxActivations: number
  order: { orderNumber: string } | null
}

const statusConfig = {
  ACTIVE: { label: 'ใช้งานอยู่', variant: 'success' as const },
  EXPIRED: { label: 'หมดอายุ', variant: 'warning' as const },
  REVOKED: { label: 'ถูกยกเลิก', variant: 'destructive' as const },
  UNUSED: { label: 'ยังไม่ใช้งาน', variant: 'secondary' as const },
}

export default function AdminLicensesPage() {
  const [licenses, setLicenses] = useState<License[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLicenses() {
      try {
        const res = await fetch('/api/licenses?limit=100')
        if (res.ok) {
          const data = await res.json()
          setLicenses(data.licenses || [])
        }
      } catch (error) {
        console.error('Failed to fetch licenses:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchLicenses()
  }, [])

  const filteredLicenses = licenses.filter((license) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        license.licenseKey.toLowerCase().includes(query) ||
        license.product.name.toLowerCase().includes(query) ||
        license.user?.name?.toLowerCase().includes(query) ||
        license.user?.email.toLowerCase().includes(query)
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

  const maskKey = (key: string | undefined | null) => {
    if (!key) return '****-****-****-****'
    const parts = key.split('-')
    return parts.map((part, index) => (index === 0 ? part : '****')).join('-')
  }

  const handleRevoke = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะยกเลิกไลเซนส์นี้?')) return
    
    try {
      const res = await fetch(`/api/licenses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REVOKED' }),
      })
      if (res.ok) {
        setLicenses(licenses.map(l => 
          l.id === id ? { ...l, status: 'REVOKED' } : l
        ))
      }
    } catch (error) {
      console.error('Failed to revoke license:', error)
    }
  }

  const handleActivate = async (id: string) => {
    try {
      const res = await fetch(`/api/licenses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ACTIVE' }),
      })
      if (res.ok) {
        setLicenses(licenses.map(l => 
          l.id === id ? { ...l, status: 'ACTIVE' } : l
        ))
      }
    } catch (error) {
      console.error('Failed to activate license:', error)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">จัดการไลเซนส์</h1>
          <p className="text-muted-foreground">จัดการไลเซนส์ทั้งหมดในระบบ ({licenses.length} รายการ)</p>
        </div>
        <Button variant="neon">
          <Key className="w-4 h-4 mr-2" />
          สร้างไลเซนส์
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-4 gap-4 mb-6">
        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Key className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ใช้งานอยู่</p>
              <p className="text-xl font-bold text-foreground">
                {licenses.filter(l => l.status === 'ACTIVE').length}
              </p>
            </div>
          </div>
        </Card>
        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">หมดอายุ</p>
              <p className="text-xl font-bold text-foreground">
                {licenses.filter(l => l.status === 'EXPIRED').length}
              </p>
            </div>
          </div>
        </Card>
        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <Ban className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ถูกยกเลิก</p>
              <p className="text-xl font-bold text-foreground">
                {licenses.filter(l => l.status === 'REVOKED').length}
              </p>
            </div>
          </div>
        </Card>
        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-500/20 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ยังไม่ใช้งาน</p>
              <p className="text-xl font-bold text-foreground">
                {licenses.filter(l => l.status === 'UNUSED').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card variant="glass" className="p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="ค้นหาไลเซนส์ หรือชื่อสินค้า..."
              icon={<Search className="h-4 w-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="สถานะ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกสถานะ</SelectItem>
              <SelectItem value="ACTIVE">ใช้งานอยู่</SelectItem>
              <SelectItem value="EXPIRED">หมดอายุ</SelectItem>
              <SelectItem value="REVOKED">ถูกยกเลิก</SelectItem>
              <SelectItem value="UNUSED">ยังไม่ใช้งาน</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Licenses Table */}
      {filteredLicenses.length > 0 ? (
        <Card variant="glass" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">ไลเซนส์</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">สินค้า</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">ลูกค้า</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">สถานะ</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">การใช้งาน</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">สร้างเมื่อ</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">หมดอายุ</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredLicenses.map((license) => {
                  const status = statusConfig[license.status as keyof typeof statusConfig] || statusConfig.ACTIVE
                  const isVisible = visibleKeys.has(license.id)
                  const isCopied = copiedKey === license.id
                  const createdDate = new Date(license.createdAt)
                  const expiresDate = license.expiresAt ? new Date(license.expiresAt) : null

                  return (
                    <tr key={license.id} className="border-b border-border/50 hover:bg-muted/50">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <code className="font-mono text-sm text-foreground">
                            {isVisible ? license.licenseKey : maskKey(license.licenseKey)}
                          </code>
                          <button
                            onClick={() => toggleKeyVisibility(license.id)}
                            className="p-1 hover:bg-muted rounded"
                          >
                            {isVisible ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                          </button>
                          <button
                            onClick={() => copyToClipboard(license.licenseKey, license.id)}
                            className="p-1 hover:bg-muted rounded"
                          >
                            {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                          </button>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-foreground">
                        {license.product.name}
                      </td>
                      <td className="p-4">
                        {license.user ? (
                          <div>
                            <p className="text-sm text-foreground">{license.user.name || 'ไม่ระบุชื่อ'}</p>
                            <p className="text-xs text-muted-foreground">{license.user.email}</p>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {license.activations?.length || 0}/{license.maxActivations}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {createdDate.toLocaleDateString('th-TH')}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {expiresDate ? expiresDate.toLocaleDateString('th-TH') : 'ไม่มีวันหมดอายุ'}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          {license.status === 'REVOKED' ? (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              title="เปิดใช้งานอีกครั้ง"
                              onClick={() => handleActivate(license.id)}
                            >
                              <RefreshCw className="w-4 h-4 text-green-500" />
                            </Button>
                          ) : (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              title="ยกเลิกไลเซนส์"
                              onClick={() => handleRevoke(license.id)}
                            >
                              <Ban className="w-4 h-4 text-red-500" />
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
        </Card>
      ) : (
        <Card variant="glass" className="p-12 text-center">
          <Key className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">ไม่พบไลเซนส์</h3>
          <p className="text-muted-foreground">
            {searchQuery || statusFilter !== 'all'
              ? 'ลองปรับตัวกรองหรือค้นหาด้วยคำอื่น'
              : 'ยังไม่มีไลเซนส์ในระบบ'
            }
          </p>
        </Card>
      )}
    </div>
  )
}
