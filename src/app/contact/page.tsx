import { Metadata } from 'next'
import { Button } from '@/components/ui'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ติดต่อเรา | Soft Stop Shop',
  description: 'ติดต่อทีมงาน Soft Stop Shop สอบถามข้อมูลเพิ่มเติม',
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-primary text-center">ติดต่อเรา</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-card border border-border rounded-xl p-8 shadow-lg h-full">
              <h2 className="text-2xl font-semibold text-foreground mb-6">ข้อมูลการติดต่อ</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">ที่อยู่</h3>
                    <p className="text-muted-foreground mt-1">
                      123 ถนนสุขุมวิท แขวงคลองเตยเหนือ<br />
                      เขตวัฒนา กรุงเทพมหานคร 10110
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">เบอร์โทรศัพท์</h3>
                    <p className="text-muted-foreground mt-1">02-123-4567</p>
                    <p className="text-muted-foreground">089-123-4567</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">อีเมล</h3>
                    <p className="text-muted-foreground mt-1">contact@softstopshop.com</p>
                    <p className="text-muted-foreground">support@softstopshop.com</p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h3 className="font-medium text-foreground mb-4">ติดตามเรา</h3>
                <div className="flex space-x-4">
                  <Button variant="outline" size="icon" className="rounded-full hover:text-primary hover:border-primary">
                    <Facebook className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full hover:text-primary hover:border-primary">
                    <Twitter className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full hover:text-primary hover:border-primary">
                    <Instagram className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-foreground mb-6">ส่งข้อความถึงเรา</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-foreground">ชื่อ</label>
                  <input
                    type="text"
                    id="firstName"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="ชื่อจริง"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-foreground">นามสกุล</label>
                  <input
                    type="text"
                    id="lastName"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="นามสกุล"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">อีเมล</label>
                <input
                  type="email"
                  id="email"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="example@email.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-foreground">หัวข้อ</label>
                <input
                  type="text"
                  id="subject"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="เรื่องที่ต้องการติดต่อ"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground">ข้อความ</label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="รายละเอียด..."
                />
              </div>

              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                ส่งข้อความ
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
