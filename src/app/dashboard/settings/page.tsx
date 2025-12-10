'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Bell,
  Shield,
  Save,
  ArrowLeft,
  Eye,
  EyeOff,
  Check,
  Camera
} from 'lucide-react'
import { Header, Footer } from '@/components/layout'
import { Card, Button, Input, Label, Badge } from '@/components/ui'
import { useNotificationStore } from '@/stores'

const tabs = [
  { id: 'profile', label: 'โปรไฟล์', icon: User },
  { id: 'security', label: 'ความปลอดภัย', icon: Lock },
  { id: 'notifications', label: 'การแจ้งเตือน', icon: Bell },
]

export default function SettingsPage() {
  const { addNotification } = useNotificationStore()
  const [activeTab, setActiveTab] = useState('profile')
  const [isSaving, setIsSaving] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  // Profile form state
  const [profile, setProfile] = useState({
    name: 'สมชาย ใจดี',
    email: 'somchai@email.com',
    phone: '081-234-5678',
    address: 'กรุงเทพมหานคร',
  })

  // Password form state
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailOrders: true,
    emailPromotions: false,
    emailUpdates: true,
    pushOrders: true,
    pushPromotions: false,
  })

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    setIsSaving(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    addNotification({
      type: 'success',
      title: 'บันทึกสำเร็จ',
      message: 'การเปลี่ยนแปลงของคุณได้รับการบันทึกแล้ว',
    })
    
    setIsSaving(false)
  }

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      addNotification({
        type: 'error',
        title: 'ข้อผิดพลาด',
        message: 'รหัสผ่านใหม่ไม่ตรงกัน',
      })
      return
    }

    if (passwords.newPassword.length < 8) {
      addNotification({
        type: 'error',
        title: 'ข้อผิดพลาด',
        message: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร',
      })
      return
    }

    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    addNotification({
      type: 'success',
      title: 'เปลี่ยนรหัสผ่านสำเร็จ',
      message: 'รหัสผ่านของคุณได้รับการเปลี่ยนแปลงแล้ว',
    })
    
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setIsSaving(false)
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">ตั้งค่าบัญชี</h1>
              <p className="text-muted-foreground">จัดการข้อมูลส่วนตัวและการตั้งค่าบัญชีของคุณ</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar Tabs */}
            <div className="lg:col-span-1">
              <Card variant="glass" className="p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-primary/20 text-primary border border-primary/30'
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
              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <>
                  {/* Avatar Section */}
                  <Card variant="glass" className="p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-6">รูปโปรไฟล์</h2>
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-3xl font-bold text-primary">
                          {profile.name.charAt(0)}
                        </div>
                        <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors">
                          <Camera className="w-4 h-4" />
                        </button>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{profile.name}</p>
                        <p className="text-sm text-muted-foreground">{profile.email}</p>
                        <Badge variant="success" className="mt-2">
                          <Shield className="w-3 h-3 mr-1" />
                          บัญชียืนยันแล้ว
                        </Badge>
                      </div>
                    </div>
                  </Card>

                  {/* Profile Form */}
                  <Card variant="glass" className="p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-6">ข้อมูลส่วนตัว</h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name">ชื่อ-นามสกุล</Label>
                        <Input
                          id="name"
                          name="name"
                          value={profile.name}
                          onChange={handleProfileChange}
                          icon={<User className="w-4 h-4" />}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">อีเมล</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={profile.email}
                          onChange={handleProfileChange}
                          icon={<Mail className="w-4 h-4" />}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={profile.phone}
                          onChange={handleProfileChange}
                          icon={<Phone className="w-4 h-4" />}
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">ที่อยู่</Label>
                        <Input
                          id="address"
                          name="address"
                          value={profile.address}
                          onChange={handleProfileChange}
                          icon={<MapPin className="w-4 h-4" />}
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <Button 
                        variant="gold" 
                        onClick={handleSave}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                            กำลังบันทึก...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            บันทึกข้อมูล
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                </>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <>
                  <Card variant="glass" className="p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-6">เปลี่ยนรหัสผ่าน</h2>
                    <div className="space-y-4 max-w-md">
                      <div>
                        <Label htmlFor="currentPassword">รหัสผ่านปัจจุบัน</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            name="currentPassword"
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={passwords.currentPassword}
                            onChange={handlePasswordChange}
                            icon={<Lock className="w-4 h-4" />}
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="newPassword">รหัสผ่านใหม่</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type={showNewPassword ? 'text' : 'password'}
                            value={passwords.newPassword}
                            onChange={handlePasswordChange}
                            icon={<Lock className="w-4 h-4" />}
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">ยืนยันรหัสผ่านใหม่</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwords.confirmPassword}
                          onChange={handlePasswordChange}
                          icon={<Lock className="w-4 h-4" />}
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="pt-4">
                        <Button 
                          variant="gold" 
                          onClick={handleChangePassword}
                          disabled={isSaving || !passwords.currentPassword || !passwords.newPassword}
                        >
                          {isSaving ? (
                            <>
                              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                              กำลังเปลี่ยนรหัสผ่าน...
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4 mr-2" />
                              เปลี่ยนรหัสผ่าน
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </Card>

                  <Card variant="glass" className="p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-6">ความปลอดภัยบัญชี</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-emerald-500" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">การยืนยันตัวตนสองขั้นตอน</p>
                            <p className="text-sm text-muted-foreground">เพิ่มความปลอดภัยให้บัญชีของคุณ</p>
                          </div>
                        </div>
                        <Badge variant="success">เปิดใช้งาน</Badge>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                            <Mail className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">การยืนยันอีเมล</p>
                            <p className="text-sm text-muted-foreground">{profile.email}</p>
                          </div>
                        </div>
                        <Badge variant="success">ยืนยันแล้ว</Badge>
                      </div>
                    </div>
                  </Card>
                </>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <Card variant="glass" className="p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6">การตั้งค่าการแจ้งเตือน</h2>
                  
                  <div className="space-y-6">
                    {/* Email Notifications */}
                    <div>
                      <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        การแจ้งเตือนทางอีเมล
                      </h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between p-4 bg-muted/50 rounded-lg cursor-pointer">
                          <div>
                            <p className="font-medium text-foreground">การอัปเดตคำสั่งซื้อ</p>
                            <p className="text-sm text-muted-foreground">รับการแจ้งเตือนเมื่อสถานะคำสั่งซื้อเปลี่ยนแปลง</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications.emailOrders}
                            onChange={(e) => setNotifications({ ...notifications, emailOrders: e.target.checked })}
                            className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                          />
                        </label>
                        <label className="flex items-center justify-between p-4 bg-muted/50 rounded-lg cursor-pointer">
                          <div>
                            <p className="font-medium text-foreground">โปรโมชันและส่วนลด</p>
                            <p className="text-sm text-muted-foreground">รับข้อเสนอพิเศษและโปรโมชัน</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications.emailPromotions}
                            onChange={(e) => setNotifications({ ...notifications, emailPromotions: e.target.checked })}
                            className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                          />
                        </label>
                        <label className="flex items-center justify-between p-4 bg-muted/50 rounded-lg cursor-pointer">
                          <div>
                            <p className="font-medium text-foreground">ข่าวสารและอัปเดต</p>
                            <p className="text-sm text-muted-foreground">รับข่าวสารเกี่ยวกับสินค้าและบริการใหม่</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications.emailUpdates}
                            onChange={(e) => setNotifications({ ...notifications, emailUpdates: e.target.checked })}
                            className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Push Notifications */}
                    <div>
                      <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        การแจ้งเตือนแบบ Push
                      </h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between p-4 bg-muted/50 rounded-lg cursor-pointer">
                          <div>
                            <p className="font-medium text-foreground">การอัปเดตคำสั่งซื้อ</p>
                            <p className="text-sm text-muted-foreground">รับการแจ้งเตือนแบบ push บนอุปกรณ์ของคุณ</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications.pushOrders}
                            onChange={(e) => setNotifications({ ...notifications, pushOrders: e.target.checked })}
                            className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                          />
                        </label>
                        <label className="flex items-center justify-between p-4 bg-muted/50 rounded-lg cursor-pointer">
                          <div>
                            <p className="font-medium text-foreground">โปรโมชันพิเศษ</p>
                            <p className="text-sm text-muted-foreground">รับการแจ้งเตือนโปรโมชันแบบ push</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications.pushPromotions}
                            onChange={(e) => setNotifications({ ...notifications, pushPromotions: e.target.checked })}
                            className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button 
                      variant="gold" 
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                          กำลังบันทึก...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          บันทึกการตั้งค่า
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
