'use client'

import { useState } from 'react'
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
  Upload,
  Flame,
  Check,
  AlertTriangle
} from 'lucide-react'
import { Card, Badge, Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui'

const tabs = [
  { id: 'general', label: 'ทั่วไป', icon: Store },
  { id: 'payment', label: 'การชำระเงิน', icon: CreditCard },
  { id: 'notifications', label: 'การแจ้งเตือน', icon: Bell },
  { id: 'security', label: 'ความปลอดภัย', icon: Shield },
  { id: 'appearance', label: 'ธีม', icon: Palette },
]

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => setIsSaving(false), 1500)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 text-transparent bg-clip-text mb-2">ตั้งค่า</h1>
          <p className="text-muted-foreground">จัดการการตั้งค่าระบบร้านค้า</p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-white"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
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
                    <Input defaultValue="Soft Stop Shop" />
                  </div>
                  <div className="space-y-2">
                    <Label>อีเมลติดต่อ</Label>
                    <Input type="email" defaultValue="contact@softstopshop.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>เบอร์โทรศัพท์</Label>
                    <Input defaultValue="02-123-4567" />
                  </div>
                  <div className="space-y-2">
                    <Label>สกุลเงิน</Label>
                    <Select defaultValue="THB">
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
                    <Input defaultValue="123 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110" />
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
                    <Input defaultValue="Soft Stop Shop - ร้านขายซอฟต์แวร์และฮาร์ดแวร์" />
                  </div>
                  <div className="space-y-2">
                    <Label>Meta Description</Label>
                    <textarea 
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 resize-none"
                      rows={3}
                      defaultValue="Soft Stop Shop ร้านขายซอฟต์แวร์ลิขสิทธิ์ ฮาร์ดแวร์คุณภาพ พร้อมบริการหลังการขาย"
                    />
                  </div>
                </div>
              </Card>
            </>
          )}

          {/* Payment Settings */}
          {activeTab === 'payment' && (
            <>
              <Card variant="glass" className="p-6 border-amber-500/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Stripe</h2>
                    <p className="text-sm text-muted-foreground">การตั้งค่าการชำระเงินผ่าน Stripe</p>
                  </div>
                  <Badge variant="success" className="ml-auto">เชื่อมต่อแล้ว</Badge>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Publishable Key</Label>
                    <Input defaultValue="pk_live_****************************" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Secret Key</Label>
                    <Input type="password" defaultValue="sk_live_****************************" />
                  </div>
                  <div className="space-y-2">
                    <Label>Webhook Secret</Label>
                    <Input type="password" defaultValue="whsec_****************************" />
                  </div>
                </div>
              </Card>

              <Card variant="glass" className="p-6 border-amber-500/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">PromptPay</h2>
                    <p className="text-sm text-muted-foreground">การตั้งค่าการชำระเงินผ่าน PromptPay</p>
                  </div>
                  <Badge variant="success" className="ml-auto">เปิดใช้งาน</Badge>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>หมายเลข PromptPay</Label>
                    <Input defaultValue="0123456789" />
                  </div>
                  <div className="space-y-2">
                    <Label>ชื่อบัญชี</Label>
                    <Input defaultValue="Soft Stop Shop Co., Ltd." />
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
                  <h2 className="text-xl font-semibold text-white">การแจ้งเตือน</h2>
                  <p className="text-sm text-slate-400">ตั้งค่าการรับการแจ้งเตือน</p>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { title: 'คำสั่งซื้อใหม่', desc: 'รับแจ้งเตือนเมื่อมีคำสั่งซื้อใหม่', enabled: true },
                  { title: 'การชำระเงิน', desc: 'รับแจ้งเตือนเมื่อมีการชำระเงินสำเร็จ', enabled: true },
                  { title: 'สินค้าใกล้หมด', desc: 'แจ้งเตือนเมื่อสินค้าเหลือน้อยกว่า 10 ชิ้น', enabled: true },
                  { title: 'ลูกค้าใหม่', desc: 'รับแจ้งเตือนเมื่อมีลูกค้าสมัครใหม่', enabled: false },
                  { title: 'รีวิวใหม่', desc: 'รับแจ้งเตือนเมื่อมีรีวิวสินค้าใหม่', enabled: false },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border">
                    <div>
                      <p className="text-foreground font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
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
                  <h2 className="text-xl font-semibold text-white">ธีมและการแสดงผล</h2>
                  <p className="text-sm text-slate-400">ปรับแต่งหน้าตาของร้านค้า</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="mb-4 block">เลือกธีม</Label>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      { name: 'Gold', colors: ['from-yellow-300', 'via-amber-400', 'to-yellow-500'], active: true },
                      { name: 'Ocean', colors: ['from-cyan-500', 'via-blue-500', 'to-indigo-500'], active: false },
                      { name: 'Forest', colors: ['from-green-500', 'via-emerald-500', 'to-teal-500'], active: false },
                    ].map((theme) => (
                      <div
                        key={theme.name}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          theme.active 
                            ? 'border-amber-500 bg-amber-500/10' 
                            : 'border-border hover:border-muted-foreground'
                        }`}
                      >
                        <div className={`h-20 rounded-lg bg-gradient-to-br ${theme.colors.join(' ')} mb-3`} />
                        <div className="flex items-center justify-between">
                          <span className="text-foreground font-medium">{theme.name}</span>
                          {theme.active && (
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
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-yellow-400 peer-checked:to-amber-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border">
                    <div>
                      <p className="text-foreground font-medium">แสดงเอฟเฟกต์แสง</p>
                      <p className="text-sm text-muted-foreground">เปิด/ปิดเอฟเฟกต์ Glow และ Animation</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
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
