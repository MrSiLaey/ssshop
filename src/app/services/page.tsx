import Link from 'next/link'
import { 
  Code, 
  Monitor, 
  Server, 
  Wifi, 
  MessageCircle, 
  Smartphone,
  ArrowRight,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui'

const services = [
  {
    title: 'ซอฟต์แวร์',
    slug: 'software',
    icon: Code,
    color: 'purple',
    description: 'พัฒนาและติดตั้งซอฟต์แวร์ครบวงจร ตั้งแต่เว็บไซต์ ระบบหลังบ้าน ไปจนถึง Cloud และ DevOps',
    items: [
      'พัฒนาเว็บไซต์ / ระบบหลังบ้าน / E-commerce',
      'ติดตั้ง / แก้ไข / ลงโปรแกรมเฉพาะทาง',
      'ระบบ API, Cloud, Hosting, DevOps',
      'ระบบจัดการฐานข้อมูล / CRM / ERP',
      'แอปพลิเคชันมือถือ iOS / Android',
    ],
  },
  {
    title: 'ฮาร์ดแวร์',
    slug: 'hardware',
    icon: Monitor,
    color: 'cyan',
    description: 'บริการซ่อม อัปเกรด และดูแลรักษาอุปกรณ์คอมพิวเตอร์ โน้ตบุ๊ค และอุปกรณ์เกมมิ่งทุกชนิด',
    items: [
      'ซ่อมคอม โน้ตบุ๊ค มือถือ เกมมิ่ง',
      'อัปเกรด SSD/RAM/GPU',
      'เปลี่ยนจอ เปลี่ยนแบต ทำความสะอาดเครื่อง',
      'ประกอบคอมพิวเตอร์ตามสเปค',
      'ติดตั้งระบบระบายความร้อน Water Cooling',
    ],
  },
  {
    title: 'เซิร์ฟเวอร์และระบบโครงสร้าง',
    slug: 'server',
    icon: Server,
    color: 'green',
    description: 'ออกแบบและติดตั้งระบบ Server, Data Center และระบบสำรองข้อมูลสำหรับองค์กร',
    items: [
      'ติดตั้ง ESXi / Proxmox / Windows Server',
      'ทำ AD / DNS / File Server / Backup Server',
      'ออกแบบ Data Center / Storage / RAID / SAN / NAS',
      'ระบบ High Availability / Clustering',
      'Migration และ Disaster Recovery',
    ],
  },
  {
    title: 'ระบบเครือข่าย',
    slug: 'network',
    icon: Wifi,
    color: 'orange',
    description: 'ออกแบบและติดตั้งระบบเครือข่ายสำหรับบ้านและองค์กร พร้อมระบบความปลอดภัย',
    items: [
      'ออกแบบ Network บ้าน-องค์กร',
      'Mikrotik / Cisco / Fortigate / UniFi',
      'เดินสายแลน Wi-Fi / Firewall / VPN',
      'Load Balancing / Failover',
      'Network Monitoring / Troubleshooting',
    ],
  },
  {
    title: 'ให้คำปรึกษา IT',
    slug: 'consulting',
    icon: MessageCircle,
    color: 'pink',
    description: 'บริการให้คำปรึกษาด้าน IT แก้ปัญหาทุกประเภท พร้อมวางแผนและออกแบบระบบ',
    items: [
      'แก้ปัญหา IT ทุกประเภท',
      'ประเมินและอัปเกรดระบบเก่า',
      'Redesign ระบบให้เสถียร',
      'วางแผนงบประมาณ IT',
      'Training และ Workshop',
    ],
  },
  {
    title: 'มือถือ iPhone',
    slug: 'mobile',
    icon: Smartphone,
    color: 'blue',
    description: 'บริการซ่อมมือถือ จำหน่ายอะไหล่ และจำหน่ายมือถือพร้อมระบบผ่อนชำระ',
    items: [
      'ซ่อมมือถือ แบต จอ บอร์ด',
      'อะไหล่มือถือ iOS / Android',
      'จำหน่ายมือถือ / ระบบผ่อน / แลกเงิน MDM',
      'ปลดล็อค iCloud / Bypass',
      'กู้ข้อมูลจากมือถือเสีย',
    ],
  },
]

const getColorClass = (color: string) => {
  const colors: Record<string, { text: string; bg: string; border: string; glow: string }> = {
    purple: { 
      text: 'text-purple-400', 
      bg: 'bg-purple-500/10', 
      border: 'border-purple-500/30',
      glow: 'shadow-purple-500/20'
    },
    cyan: { 
      text: 'text-cyan-400', 
      bg: 'bg-cyan-500/10', 
      border: 'border-cyan-500/30',
      glow: 'shadow-cyan-500/20'
    },
    green: { 
      text: 'text-green-400', 
      bg: 'bg-green-500/10', 
      border: 'border-green-500/30',
      glow: 'shadow-green-500/20'
    },
    orange: { 
      text: 'text-orange-400', 
      bg: 'bg-orange-500/10', 
      border: 'border-orange-500/30',
      glow: 'shadow-orange-500/20'
    },
    pink: { 
      text: 'text-pink-400', 
      bg: 'bg-pink-500/10', 
      border: 'border-pink-500/30',
      glow: 'shadow-pink-500/20'
    },
    blue: { 
      text: 'text-blue-400', 
      bg: 'bg-blue-500/10', 
      border: 'border-blue-500/30',
      glow: 'shadow-blue-500/20'
    },
  }
  return colors[color] || colors.purple
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-linear-to-b from-purple-500/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gradient">บริการของเรา</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              ครบครันทุกบริการด้าน IT ไม่ว่าจะเป็นซอฟต์แวร์ ฮาร์ดแวร์ เครือข่าย หรือให้คำปรึกษา
              เรามีทีมผู้เชี่ยวชาญพร้อมให้บริการคุณ
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button variant="neon" size="lg">
                  ติดต่อขอใบเสนอราคา
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/shop">
                <Button variant="outline" size="lg" className="border-purple-500/30">
                  ดูสินค้าทั้งหมด
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const colorClass = getColorClass(service.color)
            const IconComponent = service.icon
            
            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className={`group relative p-6 rounded-2xl border ${colorClass.border} bg-card/50 backdrop-blur-sm hover:shadow-xl ${colorClass.glow} transition-all duration-300 hover:-translate-y-1`}
              >
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-xl ${colorClass.bg} mb-4`}>
                  <IconComponent className={`h-8 w-8 ${colorClass.text}`} />
                </div>
                
                {/* Title */}
                <h2 className={`text-xl font-bold mb-3 ${colorClass.text}`}>
                  {service.title}
                </h2>
                
                {/* Description */}
                <p className="text-muted-foreground text-sm mb-4">
                  {service.description}
                </p>
                
                {/* Items Preview */}
                <ul className="space-y-2 mb-6">
                  {service.items.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className={`h-4 w-4 ${colorClass.text} shrink-0 mt-0.5`} />
                      <span>{item}</span>
                    </li>
                  ))}
                  {service.items.length > 3 && (
                    <li className={`text-sm ${colorClass.text}`}>
                      +{service.items.length - 3} รายการเพิ่มเติม
                    </li>
                  )}
                </ul>
                
                {/* CTA */}
                <div className={`flex items-center gap-2 ${colorClass.text} font-medium text-sm group-hover:gap-3 transition-all`}>
                  ดูรายละเอียด
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="relative rounded-3xl border border-purple-500/20 bg-card/50 backdrop-blur-sm p-8 md:p-12 overflow-hidden">
          {/* Background Effect */}
          <div className="absolute inset-0 bg-linear-to-r from-purple-500/10 via-cyan-500/5 to-pink-500/10" />
          
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              ต้องการ<span className="text-gradient">บริการเฉพาะทาง</span>?
            </h2>
            <p className="text-muted-foreground mb-8">
              หากคุณมีโปรเจกต์พิเศษหรือต้องการบริการที่ไม่ได้อยู่ในรายการ
              ติดต่อเราได้เลย เรายินดีให้คำปรึกษาฟรี!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button variant="neon" size="lg">
                  ติดต่อเราวันนี้
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
