'use client'

import { useState, useEffect } from 'react'
import { 
  Settings,
  Store,
  CreditCard,
  Bell,
  Shield,
  Palette,
  Globe,
  Mail,
  Save,
  Check,
  AlertTriangle,
  Loader2
} from 'lucide-react'
import { Card, Badge, Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui'

const tabs = [
  { id: 'general', label: 'ทั่วไป', icon: Store },
  { id: 'payment', label: 'การชำระเงิน', icon: CreditCard },
  { id: 'notifications', label: 'การแจ้งเตือน', icon: Bell },
  { id: 'security', label: 'ความปลอดภัย', icon: Shield },
  { id: 'appearance', label: 'ธีม', icon: Palette },
]

interface Settings {
  // General
  storeName?: string
  storeEmail?: string
  storePhone?: string
  storeCurrency?: string
  storeAddress?: string
  metaTitle?: string
  metaDescription?: string
  // K Bank Payment
  kbank_payment?: {
    consumerKey?: string
    consumerSecret?: string
    merchantId?: string
    partnerId?: string
    partnerSecret?: string
    environment?: 'sandbox' | 'production'
    isEnabled?: boolean
  }
  // PromptPay
  promptpay?: {
    number?: string
    accountName?: string
    isEnabled?: boolean
  }
  // Bank Transfer
  bankTransfer?: {
    bankName?: string
    accountNumber?: string
    accountName?: string
    isEnabled?: boolean
  }
  // Notifications
  notifications?: {
    newOrder?: boolean
    payment?: boolean
    lowStock?: boolean
    newCustomer?: boolean
    newReview?: boolean
  }
  // Appearance
  appearance?: {
    theme?: string
    darkMode?: boolean
    showEffects?: boolean
  }
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  const [settings, setSettings] = useState<Settings>({
    storeName: '',
    storeEmail: '',
    storePhone: '',
    storeCurrency: 'THB',
    storeAddress: '',
    metaTitle: '',
    metaDescription: '',
    kbank_payment: {
      consumerKey: '',
      consumerSecret: '',
      merchantId: '',
      partnerId: '',
      partnerSecret: '',
      environment: 'sandbox',
      isEnabled: false,
    },
    promptpay: {
      number: '',
      accountName: '',
      isEnabled: false,
    },
    bankTransfer: {
      bankName: 'กสิกรไทย (KBANK)',
      accountNumber: '',
      accountName: '',
      isEnabled: true,
    },
    notifications: {
      newOrder: true,
      payment: true,
      lowStock: true,
      newCustomer: false,
      newReview: false,
    },
    appearance: {
      theme: 'gold',
      darkMode: true,
      showEffects: true,
    },
  })

  // Load settings on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings')
        if (res.ok) {
          const data = await res.json()
          if (data.settings) {
            setSettings(prev => ({
              ...prev,
              ...data.settings.general,
              kbank_payment: data.settings.kbank_payment || prev.kbank_payment,
              promptpay: data.settings.promptpay || prev.promptpay,
              bankTransfer: data.settings.bankTransfer || prev.bankTransfer,
              notifications: data.settings.notifications || prev.notifications,
              appearance: data.settings.appearance || prev.appearance,
            }))
          }
        }
      } catch (error) {
        console.error('Failed to load settings:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadSettings()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage(null)

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: {
            general: {
              storeName: settings.storeName,
              storeEmail: settings.storeEmail,
              storePhone: settings.storePhone,
              storeCurrency: settings.storeCurrency,
              storeAddress: settings.storeAddress,
              metaTitle: settings.metaTitle,
              metaDescription: settings.metaDescription,
            },
            kbank_payment: settings.kbank_payment,
            promptpay: settings.promptpay,
            bankTransfer: settings.bankTransfer,
            notifications: settings.notifications,
            appearance: settings.appearance,
          },
        }),
      })

      if (res.ok) {
        setSaveMessage({ type: 'success', text: 'บันทึกการตั้งค่าเรียบร้อยแล้ว' })
      } else {
        setSaveMessage({ type: 'error', text: 'เกิดข้อผิดพลาดในการบันทึก' })
      }
    } catch {
      setSaveMessage({ type: 'error', text: 'เกิดข้อผิดพลาดในการบันทึก' })
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveMessage(null), 3000)
    }
  }

  const updateSetting = (key: keyof Settings, value: unknown) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const updateNestedSetting = (parent: keyof Settings, key: string, value: unknown) => {
    setSettings(prev => ({
      ...prev,
      [parent]: { ...(prev[parent] as object), [key]: value },
    }))
  }

  if (isLoading) {
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 text-transparent bg-clip-text mb-2">ตั้งค่า</h1>
          <p className="text-muted-foreground">จัดการการตั้งค่าระบบร้านค้า</p>
        </div>
        <div className="flex items-center gap-3">
          {saveMessage && (
            <span className={`text-sm ${saveMessage.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
              {saveMessage.text}
            </span>
          )}
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-white"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                กำลังบันทึก...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                บันทึกการเปลี่ยนแปลง
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <Card variant="glass" className="p-4 border-amber-500/20">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-amber-500 border border-amber-500/30'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <>
              <Card variant="glass" className="p-6 border-amber-500/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                    <Store className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">ข้อมูลร้านค้า</h2>
                    <p className="text-sm text-muted-foreground">ตั้งค่าข้อมูลพื้นฐานของร้านค้า</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>ชื่อร้านค้า</Label>
                    <Input 
                      value={settings.storeName || ''} 
                      onChange={(e) => updateSetting('storeName', e.target.value)}
                      placeholder="ชื่อร้านค้าของคุณ"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>อีเมลติดต่อ</Label>
                    <Input 
                      type="email" 
                      value={settings.storeEmail || ''} 
                      onChange={(e) => updateSetting('storeEmail', e.target.value)}
                      placeholder="contact@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>เบอร์โทรศัพท์</Label>
                    <Input 
                      value={settings.storePhone || ''} 
                      onChange={(e) => updateSetting('storePhone', e.target.value)}
                      placeholder="02-xxx-xxxx"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>สกุลเงิน</Label>
                    <Select value={settings.storeCurrency || 'THB'} onValueChange={(v) => updateSetting('storeCurrency', v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="THB">บาท (฿)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>ที่อยู่</Label>
                    <Input 
                      value={settings.storeAddress || ''} 
                      onChange={(e) => updateSetting('storeAddress', e.target.value)}
                      placeholder="ที่อยู่ร้านค้า"
                    />
                  </div>
                </div>
              </Card>

              <Card variant="glass" className="p-6 border-amber-500/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">SEO & โซเชียล</h2>
                    <p className="text-sm text-muted-foreground">ตั้งค่าการแสดงผลบนเครื่องมือค้นหา</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Meta Title</Label>
                    <Input 
                      value={settings.metaTitle || ''} 
                      onChange={(e) => updateSetting('metaTitle', e.target.value)}
                      placeholder="ชื่อเว็บไซต์สำหรับ SEO"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Meta Description</Label>
                    <textarea 
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 resize-none"
                      rows={3}
                      value={settings.metaDescription || ''}
                      onChange={(e) => updateSetting('metaDescription', e.target.value)}
                      placeholder="คำอธิบายเว็บไซต์สำหรับ SEO"
                    />
                  </div>
                </div>
              </Card>
            </>
          )}

          {/* Payment Settings */}
          {activeTab === 'payment' && (
            <>
              {/* K Bank Payment */}
              <Card variant="glass" className="p-6 border-amber-500/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">K Bank OPEN API</h2>
                    <p className="text-sm text-muted-foreground">ระบบชำระเงินผ่าน K Bank QR Payment</p>
                  </div>
                  <Badge 
                    variant={settings.kbank_payment?.isEnabled ? 'success' : 'secondary'} 
                    className="ml-auto"
                  >
                    {settings.kbank_payment?.isEnabled ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                  </Badge>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border">
                    <div>
                      <p className="text-foreground font-medium">เปิดใช้งาน K Bank Payment</p>
                      <p className="text-sm text-muted-foreground">เปิด/ปิดการชำระเงินผ่าน K Bank API</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={settings.kbank_payment?.isEnabled || false}
                        onChange={(e) => updateNestedSetting('kbank_payment', 'isEnabled', e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-emerald-500"></div>
                    </label>
                  </div>

                  <div className="space-y-2">
                    <Label>Environment</Label>
                    <Select 
                      value={settings.kbank_payment?.environment || 'sandbox'} 
                      onValueChange={(v) => updateNestedSetting('kbank_payment', 'environment', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sandbox">Sandbox (ทดสอบ)</SelectItem>
                        <SelectItem value="production">Production (ใช้งานจริง)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Consumer Key</Label>
                    <Input 
                      value={settings.kbank_payment?.consumerKey || ''} 
                      onChange={(e) => updateNestedSetting('kbank_payment', 'consumerKey', e.target.value)}
                      placeholder="Consumer Key จาก K Bank Developer Portal"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Consumer Secret</Label>
                    <Input 
                      type="password"
                      value={settings.kbank_payment?.consumerSecret || ''} 
                      onChange={(e) => updateNestedSetting('kbank_payment', 'consumerSecret', e.target.value)}
                      placeholder="Consumer Secret จาก K Bank Developer Portal"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Merchant ID</Label>
                    <Input 
                      value={settings.kbank_payment?.merchantId || ''} 
                      onChange={(e) => updateNestedSetting('kbank_payment', 'merchantId', e.target.value)}
                      placeholder="Merchant ID ของร้านค้า"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Partner ID</Label>
                    <Input 
                      value={settings.kbank_payment?.partnerId || ''} 
                      onChange={(e) => updateNestedSetting('kbank_payment', 'partnerId', e.target.value)}
                      placeholder="Partner ID (ถ้ามี)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Partner Secret</Label>
                    <Input 
                      type="password"
                      value={settings.kbank_payment?.partnerSecret || ''} 
                      onChange={(e) => updateNestedSetting('kbank_payment', 'partnerSecret', e.target.value)}
                      placeholder="Partner Secret (ถ้ามี)"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                      <div>
                        <p className="text-amber-500 font-medium">คำแนะนำ</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          สมัครใช้งาน K Bank OPEN API ได้ที่{' '}
                          <a href="https://apiportal.kasikornbank.com" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline">
                            apiportal.kasikornbank.com
                          </a>
                          {' '}แล้วนำ Keys มากรอกด้านบน
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* PromptPay */}
              <Card variant="glass" className="p-6 border-amber-500/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">PromptPay (Manual)</h2>
                    <p className="text-sm text-muted-foreground">การชำระเงินผ่าน PromptPay แบบแจ้งโอน</p>
                  </div>
                  <Badge 
                    variant={settings.promptpay?.isEnabled ? 'success' : 'secondary'} 
                    className="ml-auto"
                  >
                    {settings.promptpay?.isEnabled ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                  </Badge>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border">
                    <div>
                      <p className="text-foreground font-medium">เปิดใช้งาน PromptPay</p>
                      <p className="text-sm text-muted-foreground">ลูกค้าจะโอนเงินเองและแจ้งชำระ</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={settings.promptpay?.isEnabled || false}
                        onChange={(e) => updateNestedSetting('promptpay', 'isEnabled', e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-indigo-500"></div>
                    </label>
                  </div>

                  <div className="space-y-2">
                    <Label>หมายเลข PromptPay</Label>
                    <Input 
                      value={settings.promptpay?.number || ''} 
                      onChange={(e) => updateNestedSetting('promptpay', 'number', e.target.value)}
                      placeholder="เบอร์โทรหรือเลขบัตรประชาชน"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>ชื่อบัญชี</Label>
                    <Input 
                      value={settings.promptpay?.accountName || ''} 
                      onChange={(e) => updateNestedSetting('promptpay', 'accountName', e.target.value)}
                      placeholder="ชื่อเจ้าของบัญชี"
                    />
                  </div>
                </div>
              </Card>

              {/* Bank Transfer */}
              <Card variant="glass" className="p-6 border-amber-500/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">โอนเงินผ่านธนาคาร</h2>
                    <p className="text-sm text-muted-foreground">การชำระเงินผ่านการโอนเงิน</p>
                  </div>
                  <Badge 
                    variant={settings.bankTransfer?.isEnabled ? 'success' : 'secondary'} 
                    className="ml-auto"
                  >
                    {settings.bankTransfer?.isEnabled ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                  </Badge>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border">
                    <div>
                      <p className="text-foreground font-medium">เปิดใช้งานโอนเงินผ่านธนาคาร</p>
                      <p className="text-sm text-muted-foreground">ลูกค้าจะโอนเงินเองและแจ้งชำระ</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={settings.bankTransfer?.isEnabled || false}
                        onChange={(e) => updateNestedSetting('bankTransfer', 'isEnabled', e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-yellow-400 peer-checked:to-amber-500"></div>
                    </label>
                  </div>

                  <div className="space-y-2">
                    <Label>ชื่อธนาคาร</Label>
                    <Select 
                      value={settings.bankTransfer?.bankName || ''} 
                      onValueChange={(v) => updateNestedSetting('bankTransfer', 'bankName', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกธนาคาร" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="กสิกรไทย (KBANK)">กสิกรไทย (KBANK)</SelectItem>
                        <SelectItem value="กรุงเทพ (BBL)">กรุงเทพ (BBL)</SelectItem>
                        <SelectItem value="กรุงไทย (KTB)">กรุงไทย (KTB)</SelectItem>
                        <SelectItem value="ไทยพาณิชย์ (SCB)">ไทยพาณิชย์ (SCB)</SelectItem>
                        <SelectItem value="กรุงศรี (BAY)">กรุงศรี (BAY)</SelectItem>
                        <SelectItem value="ทหารไทยธนชาต (TTB)">ทหารไทยธนชาต (TTB)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>เลขบัญชี</Label>
                    <Input 
                      value={settings.bankTransfer?.accountNumber || ''} 
                      onChange={(e) => updateNestedSetting('bankTransfer', 'accountNumber', e.target.value)}
                      placeholder="xxx-x-xxxxx-x"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>ชื่อบัญชี</Label>
                    <Input 
                      value={settings.bankTransfer?.accountName || ''} 
                      onChange={(e) => updateNestedSetting('bankTransfer', 'accountName', e.target.value)}
                      placeholder="ชื่อเจ้าของบัญชี"
                    />
                  </div>
                </div>
              </Card>
            </>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <Card variant="glass" className="p-6 border-amber-500/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">การแจ้งเตือน</h2>
                  <p className="text-sm text-muted-foreground">ตั้งค่าการรับการแจ้งเตือน</p>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { key: 'newOrder', title: 'คำสั่งซื้อใหม่', desc: 'รับแจ้งเตือนเมื่อมีคำสั่งซื้อใหม่' },
                  { key: 'payment', title: 'การชำระเงิน', desc: 'รับแจ้งเตือนเมื่อมีการชำระเงินสำเร็จ' },
                  { key: 'lowStock', title: 'สินค้าใกล้หมด', desc: 'แจ้งเตือนเมื่อสินค้าเหลือน้อยกว่า 10 ชิ้น' },
                  { key: 'newCustomer', title: 'ลูกค้าใหม่', desc: 'รับแจ้งเตือนเมื่อมีลูกค้าสมัครใหม่' },
                  { key: 'newReview', title: 'รีวิวใหม่', desc: 'รับแจ้งเตือนเมื่อมีรีวิวสินค้าใหม่' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border">
                    <div>
                      <p className="text-foreground font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={(settings.notifications as Record<string, boolean>)?.[item.key] || false}
                        onChange={(e) => updateNestedSetting('notifications', item.key, e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-yellow-400 peer-checked:to-amber-500"></div>
                    </label>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <>
              <Card variant="glass" className="p-6 border-amber-500/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">ความปลอดภัย</h2>
                    <p className="text-sm text-muted-foreground">ตั้งค่าความปลอดภัยของระบบ</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-emerald-500" />
                      <div>
                        <p className="text-foreground font-medium">HTTPS เปิดใช้งาน</p>
                        <p className="text-sm text-muted-foreground">การเชื่อมต่อทั้งหมดถูกเข้ารหัส</p>
                      </div>
                    </div>
                    <Badge variant="success">ปลอดภัย</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                      <div>
                        <p className="text-foreground font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">เพิ่มความปลอดภัยด้วย 2FA</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="border-amber-500/30 text-amber-500">
                      เปิดใช้งาน
                    </Button>
                  </div>
                </div>
              </Card>

              <Card variant="glass" className="p-6 border-amber-500/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">เปลี่ยนรหัสผ่าน</h2>
                    <p className="text-sm text-muted-foreground">อัปเดตรหัสผ่านของคุณ</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>รหัสผ่านปัจจุบัน</Label>
                    <Input type="password" placeholder="กรอกรหัสผ่านปัจจุบัน" />
                  </div>
                  <div className="space-y-2">
                    <Label>รหัสผ่านใหม่</Label>
                    <Input type="password" placeholder="กรอกรหัสผ่านใหม่" />
                  </div>
                  <div className="space-y-2">
                    <Label>ยืนยันรหัสผ่านใหม่</Label>
                    <Input type="password" placeholder="ยืนยันรหัสผ่านใหม่" />
                  </div>
                  <Button className="bg-gradient-to-r from-yellow-400 to-amber-500">
                    เปลี่ยนรหัสผ่าน
                  </Button>
                </div>
              </Card>
            </>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <Card variant="glass" className="p-6 border-amber-500/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-500 flex items-center justify-center">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">ธีมและการแสดงผล</h2>
                  <p className="text-sm text-muted-foreground">ปรับแต่งหน้าตาของร้านค้า</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="mb-4 block">เลือกธีม</Label>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      { name: 'gold', label: 'Gold', colors: ['from-yellow-300', 'via-amber-400', 'to-yellow-500'] },
                      { name: 'ocean', label: 'Ocean', colors: ['from-cyan-500', 'via-blue-500', 'to-indigo-500'] },
                      { name: 'forest', label: 'Forest', colors: ['from-green-500', 'via-emerald-500', 'to-teal-500'] },
                    ].map((theme) => (
                      <div
                        key={theme.name}
                        onClick={() => updateNestedSetting('appearance', 'theme', theme.name)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          settings.appearance?.theme === theme.name 
                            ? 'border-amber-500 bg-amber-500/10' 
                            : 'border-border hover:border-muted-foreground'
                        }`}
                      >
                        <div className={`h-20 rounded-lg bg-gradient-to-br ${theme.colors.join(' ')} mb-3`} />
                        <div className="flex items-center justify-between">
                          <span className="text-foreground font-medium">{theme.label}</span>
                          {settings.appearance?.theme === theme.name && (
                            <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border">
                    <div>
                      <p className="text-foreground font-medium">โหมดมืด</p>
                      <p className="text-sm text-muted-foreground">ใช้โหมดมืดเป็นค่าเริ่มต้น</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={settings.appearance?.darkMode || false}
                        onChange={(e) => updateNestedSetting('appearance', 'darkMode', e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-yellow-400 peer-checked:to-amber-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border">
                    <div>
                      <p className="text-foreground font-medium">แสดงเอฟเฟกต์แสง</p>
                      <p className="text-sm text-muted-foreground">เปิด/ปิดเอฟเฟกต์ Glow และ Animation</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={settings.appearance?.showEffects || false}
                        onChange={(e) => updateNestedSetting('appearance', 'showEffects', e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-yellow-400 peer-checked:to-amber-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
