'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  BarChart3, 
  Settings, 
  Gift,
  Percent,
  Truck,
  RefreshCw,
  Eye,
  EyeOff,
  GripVertical,
  Copy
} from 'lucide-react'
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Badge } from '@/components/ui'

interface Prize {
  id: string
  name: string
  description?: string
  type: string
  value: number
  maxValue?: number
  color: string
  textColor: string
  probability: number
  totalQuantity?: number
  wonCount: number
  dailyLimit?: number
  validDays: number
  minPurchase?: number
  isActive: boolean
  position: number
}

interface Wheel {
  id: string
  name: string
  description?: string
  isActive: boolean
  spinsPerDay: number
  cooldownHours: number
  showOnPopup: boolean
  popupDelay: number
  backgroundColor?: string
  textColor?: string
  prizes: Prize[]
  stats?: {
    totalSpins: number
    todaySpins: number
    todayWins: number
    totalWins: number
  }
}

interface Stats {
  totalSpins: number
  totalWins: number
  winRate: string
  todaySpins: number
  todayWins: number
  weekSpins: number
  monthSpins: number
  couponUsageRate: string
  prizeDistribution: Array<{
    prizeId: string
    name: string
    type: string
    count: number
  }>
}

const PRIZE_TYPES = [
  { value: 'DISCOUNT_FIXED', label: 'ส่วนลดเงินสด (฿)', icon: Gift },
  { value: 'DISCOUNT_PERCENT', label: 'ส่วนลด (%)', icon: Percent },
  { value: 'FREE_SHIPPING', label: 'ส่งฟรี', icon: Truck },
  { value: 'CASHBACK', label: 'เงินคืน', icon: RefreshCw },
  { value: 'NO_PRIZE', label: 'ไม่ถูกรางวัล', icon: X },
]

const DEFAULT_COLORS = [
  '#FF6B00', '#FF9500', '#FFCC00', '#4CAF50', 
  '#2196F3', '#9C27B0', '#E91E63', '#607D8B'
]

export default function SpinWheelAdminPage() {
  const [wheels, setWheels] = useState<Wheel[]>([])
  const [selectedWheel, setSelectedWheel] = useState<Wheel | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [editingPrize, setEditingPrize] = useState<Prize | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'settings' | 'prizes' | 'stats'>('settings')

  // Form states
  const [wheelForm, setWheelForm] = useState({
    name: '',
    description: '',
    isActive: true,
    spinsPerDay: 1,
    cooldownHours: 24,
    showOnPopup: true,
    popupDelay: 3,
  })

  const [prizeForm, setPrizeForm] = useState({
    name: '',
    description: '',
    type: 'DISCOUNT_FIXED',
    value: 0,
    maxValue: undefined as number | undefined,
    color: '#FF6B00',
    textColor: '#FFFFFF',
    probability: 10,
    totalQuantity: undefined as number | undefined,
    dailyLimit: undefined as number | undefined,
    validDays: 7,
    minPurchase: undefined as number | undefined,
    isActive: true,
  })

  const fetchWheels = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/spin-wheel')
      if (response.ok) {
        const data = await response.json()
        setWheels(data)
        if (data.length > 0 && !selectedWheel) {
          setSelectedWheel(data[0])
        }
      }
    } catch (error) {
      console.error('Error fetching wheels:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedWheel])

  const fetchStats = useCallback(async (wheelId?: string) => {
    try {
      const url = wheelId 
        ? `/api/admin/spin-wheel/history?wheelId=${wheelId}`
        : '/api/admin/spin-wheel/history'
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }, [])

  useEffect(() => {
    fetchWheels()
  }, [fetchWheels])

  useEffect(() => {
    if (selectedWheel && activeTab === 'stats') {
      fetchStats(selectedWheel.id)
    }
  }, [selectedWheel, activeTab, fetchStats])

  const handleCreateWheel = async () => {
    try {
      const response = await fetch('/api/admin/spin-wheel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wheelForm),
      })
      if (response.ok) {
        const newWheel = await response.json()
        setWheels(prev => [...prev, newWheel])
        setSelectedWheel(newWheel)
        setIsCreating(false)
        resetWheelForm()
      }
    } catch (error) {
      console.error('Error creating wheel:', error)
    }
  }

  const handleUpdateWheel = async () => {
    if (!selectedWheel) return
    try {
      const response = await fetch('/api/admin/spin-wheel', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedWheel.id, ...wheelForm }),
      })
      if (response.ok) {
        const updatedWheel = await response.json()
        setWheels(prev => prev.map(w => w.id === updatedWheel.id ? { ...w, ...updatedWheel } : w))
        setSelectedWheel(prev => prev ? { ...prev, ...updatedWheel } : null)
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Error updating wheel:', error)
    }
  }

  const handleDeleteWheel = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบวงล้อนี้?')) return
    try {
      const response = await fetch(`/api/admin/spin-wheel?id=${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setWheels(prev => prev.filter(w => w.id !== id))
        if (selectedWheel?.id === id) {
          setSelectedWheel(wheels.find(w => w.id !== id) || null)
        }
      }
    } catch (error) {
      console.error('Error deleting wheel:', error)
    }
  }

  const handleCreatePrize = async () => {
    if (!selectedWheel) return
    try {
      const response = await fetch('/api/admin/spin-wheel/prizes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wheelId: selectedWheel.id, ...prizeForm }),
      })
      if (response.ok) {
        fetchWheels()
        resetPrizeForm()
        setEditingPrize(null)
      }
    } catch (error) {
      console.error('Error creating prize:', error)
    }
  }

  const handleUpdatePrize = async () => {
    if (!editingPrize) return
    try {
      const response = await fetch('/api/admin/spin-wheel/prizes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingPrize.id, ...prizeForm }),
      })
      if (response.ok) {
        fetchWheels()
        resetPrizeForm()
        setEditingPrize(null)
      }
    } catch (error) {
      console.error('Error updating prize:', error)
    }
  }

  const handleDeletePrize = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบรางวัลนี้?')) return
    try {
      const response = await fetch(`/api/admin/spin-wheel/prizes?id=${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchWheels()
      }
    } catch (error) {
      console.error('Error deleting prize:', error)
    }
  }

  const resetWheelForm = () => {
    setWheelForm({
      name: '',
      description: '',
      isActive: true,
      spinsPerDay: 1,
      cooldownHours: 24,
      showOnPopup: true,
      popupDelay: 3,
    })
  }

  const resetPrizeForm = () => {
    setPrizeForm({
      name: '',
      description: '',
      type: 'DISCOUNT_FIXED',
      value: 0,
      maxValue: undefined,
      color: '#FF6B00',
      textColor: '#FFFFFF',
      probability: 10,
      totalQuantity: undefined,
      dailyLimit: undefined,
      validDays: 7,
      minPurchase: undefined,
      isActive: true,
    })
  }

  const startEditWheel = () => {
    if (!selectedWheel) return
    setWheelForm({
      name: selectedWheel.name,
      description: selectedWheel.description || '',
      isActive: selectedWheel.isActive,
      spinsPerDay: selectedWheel.spinsPerDay,
      cooldownHours: selectedWheel.cooldownHours,
      showOnPopup: selectedWheel.showOnPopup,
      popupDelay: selectedWheel.popupDelay,
    })
    setIsEditing(true)
  }

  const startEditPrize = (prize: Prize) => {
    setPrizeForm({
      name: prize.name,
      description: prize.description || '',
      type: prize.type,
      value: Number(prize.value),
      maxValue: prize.maxValue ? Number(prize.maxValue) : undefined,
      color: prize.color,
      textColor: prize.textColor,
      probability: Number(prize.probability),
      totalQuantity: prize.totalQuantity || undefined,
      dailyLimit: prize.dailyLimit || undefined,
      validDays: prize.validDays,
      minPurchase: prize.minPurchase ? Number(prize.minPurchase) : undefined,
      isActive: prize.isActive,
    })
    setEditingPrize(prize)
  }

  const getTotalProbability = () => {
    if (!selectedWheel) return 0
    return selectedWheel.prizes.reduce((sum, p) => sum + Number(p.probability), 0)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="animate-spin" size={32} />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Gift className="text-orange-500" />
            จัดการวงล้อนำโชค
          </h1>
          <p className="text-gray-500">ตั้งค่าวงล้อและเปอร์เซ็นต์การออกรางวัล</p>
        </div>
        <Button onClick={() => { setIsCreating(true); resetWheelForm(); }} className="bg-orange-500 hover:bg-orange-600">
          <Plus size={20} className="mr-2" />
          สร้างวงล้อใหม่
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Wheel List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">รายการวงล้อ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {wheels.length === 0 ? (
                <p className="text-gray-500 text-center py-4">ยังไม่มีวงล้อ</p>
              ) : (
                wheels.map(wheel => (
                  <div
                    key={wheel.id}
                    onClick={() => setSelectedWheel(wheel)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedWheel?.id === wheel.id 
                        ? 'bg-orange-100 border-2 border-orange-500' 
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{wheel.name}</span>
                      {wheel.isActive ? (
                        <Badge className="bg-green-500">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {wheel.prizes.length} รางวัล • {wheel.stats?.totalSpins || 0} หมุน
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Wheel Details */}
        <div className="lg:col-span-3">
          {selectedWheel ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{selectedWheel.name}</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={startEditWheel}>
                      <Edit2 size={16} className="mr-1" /> แก้ไข
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteWheel(selectedWheel.id)}>
                      <Trash2 size={16} className="mr-1" /> ลบ
                    </Button>
                  </div>
                </div>
                {/* Tabs */}
                <div className="flex gap-4 mt-4 border-b">
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`pb-2 px-1 ${activeTab === 'settings' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-500'}`}
                  >
                    <Settings size={16} className="inline mr-1" /> ตั้งค่า
                  </button>
                  <button
                    onClick={() => setActiveTab('prizes')}
                    className={`pb-2 px-1 ${activeTab === 'prizes' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-500'}`}
                  >
                    <Gift size={16} className="inline mr-1" /> รางวัล ({selectedWheel.prizes.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('stats')}
                    className={`pb-2 px-1 ${activeTab === 'stats' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-500'}`}
                  >
                    <BarChart3 size={16} className="inline mr-1" /> สถิติ
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Settings Tab */}
                {activeTab === 'settings' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label>คำอธิบาย</Label>
                      <p className="text-gray-600">{selectedWheel.description || '-'}</p>
                    </div>
                    <div>
                      <Label>จำนวนครั้งต่อวัน</Label>
                      <p className="text-2xl font-bold">{selectedWheel.spinsPerDay}</p>
                    </div>
                    <div>
                      <Label>ระยะรอ (ชั่วโมง)</Label>
                      <p className="text-2xl font-bold">{selectedWheel.cooldownHours}</p>
                    </div>
                    <div>
                      <Label>แสดง Popup</Label>
                      <p className="flex items-center gap-2">
                        {selectedWheel.showOnPopup ? (
                          <><Eye className="text-green-500" size={20} /> แสดง</>
                        ) : (
                          <><EyeOff className="text-gray-400" size={20} /> ไม่แสดง</>
                        )}
                      </p>
                    </div>
                    <div>
                      <Label>หน่วงเวลา Popup</Label>
                      <p className="text-2xl font-bold">{selectedWheel.popupDelay} วินาที</p>
                    </div>
                  </div>
                )}

                {/* Prizes Tab */}
                {activeTab === 'prizes' && (
                  <div>
                    {/* Probability Summary */}
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">ความน่าจะเป็นรวม:</span>
                        <span className={`text-2xl font-bold ${getTotalProbability() === 100 ? 'text-green-500' : 'text-red-500'}`}>
                          {getTotalProbability()}%
                        </span>
                      </div>
                      {getTotalProbability() !== 100 && (
                        <p className="text-sm text-red-500 mt-1">
                          ⚠️ ความน่าจะเป็นรวมควรเท่ากับ 100%
                        </p>
                      )}
                    </div>

                    {/* Prize List */}
                    <div className="space-y-3 mb-4">
                      {selectedWheel.prizes.map((prize, index) => (
                        <div
                          key={prize.id}
                          className="flex items-center gap-3 p-3 bg-white border rounded-lg"
                        >
                          <GripVertical className="text-gray-400" size={20} />
                          <div
                            className="w-8 h-8 rounded-full shrink-0"
                            style={{ backgroundColor: prize.color }}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{prize.name}</span>
                              {!prize.isActive && (
                                <Badge variant="secondary">ปิดใช้งาน</Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">
                              {prize.type === 'DISCOUNT_FIXED' && `฿${prize.value}`}
                              {prize.type === 'DISCOUNT_PERCENT' && `${prize.value}%`}
                              {prize.type === 'FREE_SHIPPING' && 'ส่งฟรี'}
                              {prize.type === 'CASHBACK' && `฿${prize.value} คืน`}
                              {prize.type === 'NO_PRIZE' && 'ไม่มีรางวัล'}
                              {' • '}โอกาส {Number(prize.probability)}%
                              {prize.wonCount > 0 && ` • ถูกไป ${prize.wonCount} ครั้ง`}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => startEditPrize(prize)}>
                              <Edit2 size={16} />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeletePrize(prize.id)}>
                              <Trash2 size={16} className="text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Prize Button */}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => { resetPrizeForm(); setEditingPrize({ id: 'new' } as Prize); }}
                    >
                      <Plus size={20} className="mr-2" /> เพิ่มรางวัล
                    </Button>
                  </div>
                )}

                {/* Stats Tab */}
                {activeTab === 'stats' && stats && (
                  <div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-600">หมุนทั้งหมด</p>
                        <p className="text-2xl font-bold text-blue-700">{stats.totalSpins}</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-600">ถูกรางวัล</p>
                        <p className="text-2xl font-bold text-green-700">{stats.totalWins}</p>
                      </div>
                      <div className="p-4 bg-orange-50 rounded-lg">
                        <p className="text-sm text-orange-600">อัตราชนะ</p>
                        <p className="text-2xl font-bold text-orange-700">{stats.winRate}%</p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <p className="text-sm text-purple-600">ใช้คูปองแล้ว</p>
                        <p className="text-2xl font-bold text-purple-700">{stats.couponUsageRate}%</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-3 border rounded-lg">
                        <p className="text-gray-500 text-sm">วันนี้</p>
                        <p className="text-xl font-bold">{stats.todaySpins}</p>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <p className="text-gray-500 text-sm">สัปดาห์นี้</p>
                        <p className="text-xl font-bold">{stats.weekSpins}</p>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <p className="text-gray-500 text-sm">เดือนนี้</p>
                        <p className="text-xl font-bold">{stats.monthSpins}</p>
                      </div>
                    </div>

                    {/* Prize Distribution */}
                    <h3 className="font-medium mb-3">การกระจายรางวัล</h3>
                    <div className="space-y-2">
                      {stats.prizeDistribution.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="flex-1">{item.name}</span>
                          <span className="font-medium">{item.count} ครั้ง</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-orange-500 h-2 rounded-full"
                              style={{ width: `${(item.count / stats.totalWins) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                <Gift size={48} className="mx-auto mb-4 opacity-50" />
                <p>เลือกวงล้อเพื่อดูรายละเอียด หรือสร้างวงล้อใหม่</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Create/Edit Wheel Modal */}
      {(isCreating || isEditing) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-lg mx-4">
            <CardHeader>
              <CardTitle>{isCreating ? 'สร้างวงล้อใหม่' : 'แก้ไขวงล้อ'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>ชื่อวงล้อ *</Label>
                <Input
                  value={wheelForm.name}
                  onChange={e => setWheelForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="เช่น วงล้อนำโชคปีใหม่"
                />
              </div>
              <div>
                <Label>คำอธิบาย</Label>
                <Input
                  value={wheelForm.description}
                  onChange={e => setWheelForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="หมุนเพื่อรับส่วนลดพิเศษ!"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>จำนวนครั้งต่อวัน</Label>
                  <Input
                    type="number"
                    min={1}
                    value={wheelForm.spinsPerDay}
                    onChange={e => setWheelForm(prev => ({ ...prev, spinsPerDay: parseInt(e.target.value) || 1 }))}
                  />
                </div>
                <div>
                  <Label>ระยะรอหมุน (ชั่วโมง)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={wheelForm.cooldownHours}
                    onChange={e => setWheelForm(prev => ({ ...prev, cooldownHours: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showOnPopup"
                    checked={wheelForm.showOnPopup}
                    onChange={e => setWheelForm(prev => ({ ...prev, showOnPopup: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="showOnPopup">แสดง Popup อัตโนมัติ</Label>
                </div>
                <div>
                  <Label>หน่วงเวลา (วินาที)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={wheelForm.popupDelay}
                    onChange={e => setWheelForm(prev => ({ ...prev, popupDelay: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={wheelForm.isActive}
                  onChange={e => setWheelForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4"
                />
                <Label htmlFor="isActive">เปิดใช้งาน (Active)</Label>
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={() => { setIsCreating(false); setIsEditing(false); }}>
                  ยกเลิก
                </Button>
                <Button onClick={isCreating ? handleCreateWheel : handleUpdateWheel} className="bg-orange-500 hover:bg-orange-600">
                  <Save size={16} className="mr-1" /> บันทึก
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Prize Modal */}
      {editingPrize && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{editingPrize.id === 'new' ? 'เพิ่มรางวัลใหม่' : 'แก้ไขรางวัล'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>ชื่อรางวัล *</Label>
                <Input
                  value={prizeForm.name}
                  onChange={e => setPrizeForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="เช่น ส่วนลด ฿100"
                />
              </div>
              <div>
                <Label>ประเภทรางวัล</Label>
                <select
                  value={prizeForm.type}
                  onChange={e => setPrizeForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                >
                  {PRIZE_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>
                    {prizeForm.type === 'DISCOUNT_PERCENT' ? 'เปอร์เซ็นต์ (%)' : 'มูลค่า (฿)'}
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    value={prizeForm.value}
                    onChange={e => setPrizeForm(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                {prizeForm.type === 'DISCOUNT_PERCENT' && (
                  <div>
                    <Label>ส่วนลดสูงสุด (฿)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={prizeForm.maxValue || ''}
                      onChange={e => setPrizeForm(prev => ({ ...prev, maxValue: parseFloat(e.target.value) || undefined }))}
                      placeholder="ไม่จำกัด"
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>สีในวงล้อ</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={prizeForm.color}
                      onChange={e => setPrizeForm(prev => ({ ...prev, color: e.target.value }))}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <div className="flex gap-1 flex-wrap flex-1">
                      {DEFAULT_COLORS.map(color => (
                        <button
                          key={color}
                          onClick={() => setPrizeForm(prev => ({ ...prev, color }))}
                          className={`w-6 h-6 rounded-full border-2 ${prizeForm.color === color ? 'border-black' : 'border-transparent'}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <Label>สีตัวอักษร</Label>
                  <Input
                    type="color"
                    value={prizeForm.textColor}
                    onChange={e => setPrizeForm(prev => ({ ...prev, textColor: e.target.value }))}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                </div>
              </div>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Label className="text-yellow-800">ความน่าจะเป็น (%) *</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step={0.01}
                  value={prizeForm.probability}
                  onChange={e => setPrizeForm(prev => ({ ...prev, probability: parseFloat(e.target.value) || 0 }))}
                  className="mt-1"
                />
                <p className="text-sm text-yellow-700 mt-1">
                  ยิ่งสูง = ยิ่งมีโอกาสถูกมาก (ความน่าจะเป็นรวมควร = 100%)
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>จำกัดจำนวนทั้งหมด</Label>
                  <Input
                    type="number"
                    min={0}
                    value={prizeForm.totalQuantity || ''}
                    onChange={e => setPrizeForm(prev => ({ ...prev, totalQuantity: parseInt(e.target.value) || undefined }))}
                    placeholder="ไม่จำกัด"
                  />
                </div>
                <div>
                  <Label>จำกัดต่อวัน</Label>
                  <Input
                    type="number"
                    min={0}
                    value={prizeForm.dailyLimit || ''}
                    onChange={e => setPrizeForm(prev => ({ ...prev, dailyLimit: parseInt(e.target.value) || undefined }))}
                    placeholder="ไม่จำกัด"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>คูปองใช้ได้ (วัน)</Label>
                  <Input
                    type="number"
                    min={1}
                    value={prizeForm.validDays}
                    onChange={e => setPrizeForm(prev => ({ ...prev, validDays: parseInt(e.target.value) || 7 }))}
                  />
                </div>
                <div>
                  <Label>ยอดซื้อขั้นต่ำ (฿)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={prizeForm.minPurchase || ''}
                    onChange={e => setPrizeForm(prev => ({ ...prev, minPurchase: parseFloat(e.target.value) || undefined }))}
                    placeholder="ไม่มี"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="prizeActive"
                  checked={prizeForm.isActive}
                  onChange={e => setPrizeForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4"
                />
                <Label htmlFor="prizeActive">เปิดใช้งานรางวัลนี้</Label>
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={() => { setEditingPrize(null); resetPrizeForm(); }}>
                  ยกเลิก
                </Button>
                <Button 
                  onClick={editingPrize.id === 'new' ? handleCreatePrize : handleUpdatePrize} 
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Save size={16} className="mr-1" /> บันทึก
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
