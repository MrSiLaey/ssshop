import Link from 'next/link'
import { notFound } from 'next/navigation'
import { 
  Code, 
  Monitor, 
  Server, 
  Wifi, 
  MessageCircle, 
  Smartphone,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Phone,
  Mail,
  LucideIcon
} from 'lucide-react'
import { Button } from '@/components/ui'

interface ServiceData {
  title: string
  slug: string
  icon: LucideIcon
  color: string
  description: string
  longDescription: string
  items: string[]
  features: { title: string; description: string }[]
  faq: { question: string; answer: string }[]
}

const servicesData: Record<string, ServiceData> = {
  software: {
    title: 'ซอฟต์แวร์',
    slug: 'software',
    icon: Code,
    color: 'purple',
    description: 'พัฒนาและติดตั้งซอฟต์แวร์ครบวงจร',
    longDescription: 'บริการพัฒนาและติดตั้งซอฟต์แวร์ครบวงจร ตั้งแต่เว็บไซต์ ระบบหลังบ้าน ไปจนถึง Cloud และ DevOps ด้วยทีมนักพัฒนามืออาชีพที่มีประสบการณ์มากกว่า 10 ปี',
    items: [
      'พัฒนาเว็บไซต์ / ระบบหลังบ้าน / E-commerce',
      'ติดตั้ง / แก้ไข / ลงโปรแกรมเฉพาะทาง',
      'ระบบ API, Cloud, Hosting, DevOps',
      'ระบบจัดการฐานข้อมูล / CRM / ERP',
      'แอปพลิเคชันมือถือ iOS / Android',
      'ระบบ POS / ระบบขายหน้าร้าน',
      'ระบบจัดการคลังสินค้า / Inventory',
      'ระบบบัญชี / ใบเสร็จ / รายงาน',
    ],
    features: [
      { title: 'ออกแบบตามความต้องการ', description: 'วิเคราะห์และออกแบบระบบตามความต้องการเฉพาะของธุรกิจคุณ' },
      { title: 'เทคโนโลยีทันสมัย', description: 'ใช้เทคโนโลยีล่าสุดเพื่อประสิทธิภาพสูงสุด' },
      { title: 'Support หลังขาย', description: 'ดูแลและแก้ไขปัญหาตลอดอายุการใช้งาน' },
    ],
    faq: [
      { question: 'ใช้เวลาพัฒนานานแค่ไหน?', answer: 'ขึ้นอยู่กับความซับซ้อนของโปรเจกต์ โดยทั่วไป 1-3 เดือน' },
      { question: 'มีค่าใช้จ่ายเท่าไหร่?', answer: 'เริ่มต้นที่ 15,000 บาท ขึ้นอยู่กับ scope งาน' },
    ],
  },
  hardware: {
    title: 'ฮาร์ดแวร์',
    slug: 'hardware',
    icon: Monitor,
    color: 'cyan',
    description: 'ซ่อม อัปเกรด ดูแลรักษาอุปกรณ์คอมพิวเตอร์',
    longDescription: 'บริการซ่อม อัปเกรด และดูแลรักษาอุปกรณ์คอมพิวเตอร์ โน้ตบุ๊ค และอุปกรณ์เกมมิ่งทุกชนิด ด้วยช่างผู้ชำนาญที่มีอะไหล่พร้อม',
    items: [
      'ซ่อมคอม โน้ตบุ๊ค มือถือ เกมมิ่ง',
      'อัปเกรด SSD/RAM/GPU',
      'เปลี่ยนจอ เปลี่ยนแบต ทำความสะอาดเครื่อง',
      'ประกอบคอมพิวเตอร์ตามสเปค',
      'ติดตั้งระบบระบายความร้อน Water Cooling',
      'ซ่อมบอร์ด / เปลี่ยน Chip',
      'กู้ข้อมูลจาก HDD/SSD เสีย',
      'ติดตั้ง Windows / macOS / Linux',
    ],
    features: [
      { title: 'ช่างมืออาชีพ', description: 'ทีมช่างที่มีประสบการณ์มากกว่า 15 ปี' },
      { title: 'อะไหล่แท้', description: 'ใช้อะไหล่แท้ มีการรับประกัน' },
      { title: 'ราคาเป็นธรรม', description: 'ตรวจสอบฟรี แจ้งราคาก่อนซ่อม' },
    ],
    faq: [
      { question: 'ซ่อมใช้เวลานานแค่ไหน?', answer: 'งานทั่วไป 1-3 วัน งานเปลี่ยนบอร์ด 3-7 วัน' },
      { question: 'มีรับประกันไหม?', answer: 'รับประกันอะไหล่ 3-12 เดือน ขึ้นอยู่กับชิ้นส่วน' },
    ],
  },
  server: {
    title: 'เซิร์ฟเวอร์และระบบโครงสร้าง',
    slug: 'server',
    icon: Server,
    color: 'green',
    description: 'ติดตั้งระบบ Server และ Data Center',
    longDescription: 'ออกแบบและติดตั้งระบบ Server, Data Center และระบบสำรองข้อมูลสำหรับองค์กร ด้วยประสบการณ์ทำงานกับบริษัทชั้นนำ',
    items: [
      'ติดตั้ง ESXi / Proxmox / Windows Server',
      'ทำ AD / DNS / File Server / Backup Server',
      'ออกแบบ Data Center / Storage / RAID / SAN / NAS',
      'ระบบ High Availability / Clustering',
      'Migration และ Disaster Recovery',
      'ติดตั้ง Docker / Kubernetes',
      'Cloud Migration (AWS, Azure, GCP)',
      'ระบบ Monitoring / Alerting',
    ],
    features: [
      { title: 'ออกแบบครบวงจร', description: 'ตั้งแต่วางแผน ติดตั้ง จนถึงดูแลรักษา' },
      { title: 'มาตรฐานสากล', description: 'ใช้มาตรฐาน Tier สำหรับ Data Center' },
      { title: '24/7 Support', description: 'ทีมดูแลตลอด 24 ชั่วโมง' },
    ],
    faq: [
      { question: 'รองรับกี่ User?', answer: 'ออกแบบได้ตั้งแต่ 10 ถึง 10,000+ users' },
      { question: 'ใช้งบประมาณเท่าไหร่?', answer: 'เริ่มต้น 50,000 บาท สำหรับ SME' },
    ],
  },
  network: {
    title: 'ระบบเครือข่าย',
    slug: 'network',
    icon: Wifi,
    color: 'orange',
    description: 'ออกแบบและติดตั้งระบบเครือข่าย',
    longDescription: 'ออกแบบและติดตั้งระบบเครือข่ายสำหรับบ้านและองค์กร พร้อมระบบความปลอดภัยครบวงจร',
    items: [
      'ออกแบบ Network บ้าน-องค์กร',
      'Mikrotik / Cisco / Fortigate / UniFi',
      'เดินสายแลน Wi-Fi / Firewall / VPN',
      'Load Balancing / Failover',
      'Network Monitoring / Troubleshooting',
      'VLAN / QoS / Bandwidth Management',
      'Site-to-Site VPN / Remote Access',
      'Network Security Assessment',
    ],
    features: [
      { title: 'ครอบคลุมทุกพื้นที่', description: 'สำรวจหน้างานและออกแบบให้ครอบคลุม' },
      { title: 'อุปกรณ์คุณภาพ', description: 'ใช้อุปกรณ์ Enterprise Grade' },
      { title: 'รับประกันผลงาน', description: 'รับประกันความเสถียรของระบบ' },
    ],
    faq: [
      { question: 'เดินสายใช้เวลานานไหม?', answer: 'ขึ้นอยู่กับขนาดพื้นที่ โดยทั่วไป 1-5 วัน' },
      { question: 'มีบริการดูแลระบบไหม?', answer: 'มี Maintenance Contract รายเดือน/รายปี' },
    ],
  },
  consulting: {
    title: 'ให้คำปรึกษา IT',
    slug: 'consulting',
    icon: MessageCircle,
    color: 'pink',
    description: 'บริการให้คำปรึกษาด้าน IT',
    longDescription: 'บริการให้คำปรึกษาด้าน IT แก้ปัญหาทุกประเภท พร้อมวางแผนและออกแบบระบบสำหรับอนาคต',
    items: [
      'แก้ปัญหา IT ทุกประเภท',
      'ประเมินและอัปเกรดระบบเก่า',
      'Redesign ระบบให้เสถียร',
      'วางแผนงบประมาณ IT',
      'Training และ Workshop',
      'IT Audit / Security Assessment',
      'Digital Transformation',
      'Technology Roadmap',
    ],
    features: [
      { title: 'ปรึกษาฟรี', description: 'รับฟังปัญหาและให้คำแนะนำเบื้องต้นฟรี' },
      { title: 'ผู้เชี่ยวชาญ', description: 'ที่ปรึกษาที่มีประสบการณ์จริง' },
      { title: 'แผนปฏิบัติได้จริง', description: 'ให้แผนที่นำไปใช้งานได้ทันที' },
    ],
    faq: [
      { question: 'ปรึกษาฟรีจริงหรือ?', answer: 'ใช่ครับ ปรึกษาเบื้องต้นฟรี ไม่มีค่าใช้จ่าย' },
      { question: 'มีบริการ Onsite ไหม?', answer: 'มีครับ สามารถนัดเวลาเข้าสำรวจหน้างานได้' },
    ],
  },
  mobile: {
    title: 'มือถือ iPhone',
    slug: 'mobile',
    icon: Smartphone,
    color: 'blue',
    description: 'ซ่อมมือถือ จำหน่ายอะไหล่และมือถือ',
    longDescription: 'บริการซ่อมมือถือ จำหน่ายอะไหล่ และจำหน่ายมือถือพร้อมระบบผ่อนชำระ รองรับทั้ง iOS และ Android',
    items: [
      'ซ่อมมือถือ แบต จอ บอร์ด',
      'อะไหล่มือถือ iOS / Android',
      'จำหน่ายมือถือ / ระบบผ่อน / แลกเงิน MDM',
      'ปลดล็อค iCloud / Bypass',
      'กู้ข้อมูลจากมือถือเสีย',
      'เปลี่ยนกระจกหลัง / กรอบ',
      'ซ่อม Face ID / Touch ID',
      'Software Update / Downgrade',
    ],
    features: [
      { title: 'ซ่อมรอรับได้', description: 'งานบางรายการซ่อมรอรับภายใน 30 นาที' },
      { title: 'อะไหล่แท้', description: 'ใช้อะไหล่แท้ มีรับประกัน' },
      { title: 'ผ่อน 0%', description: 'ซื้อมือถือผ่อน 0% สูงสุด 10 เดือน' },
    ],
    faq: [
      { question: 'เปลี่ยนจอใช้เวลานานไหม?', answer: 'รอรับได้เลย ใช้เวลาประมาณ 30-60 นาที' },
      { question: 'รับประกันนานแค่ไหน?', answer: 'รับประกันอะไหล่ 3-12 เดือน' },
    ],
  },
}

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

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return Object.keys(servicesData).map((slug) => ({
    slug,
  }))
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params
  const service = servicesData[slug]

  if (!service) {
    notFound()
  }

  const colorClass = getColorClass(service.color)
  const IconComponent = service.icon

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-linear-to-b from-purple-500/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link 
              href="/services" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-purple-400 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              กลับไปหน้าบริการ
            </Link>
          </div>

          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Icon */}
            <div className={`inline-flex p-6 rounded-2xl ${colorClass.bg} ${colorClass.border} border`}>
              <IconComponent className={`h-16 w-16 ${colorClass.text}`} />
            </div>

            {/* Content */}
            <div className="flex-1">
              <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${colorClass.text}`}>
                {service.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
                {service.longDescription}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact">
                  <Button variant="neon" size="lg">
                    <Phone className="mr-2 h-5 w-5" />
                    ติดต่อขอใบเสนอราคา
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg" className="border-purple-500/30">
                    <Mail className="mr-2 h-5 w-5" />
                    สอบถามข้อมูล
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">บริการที่เราให้</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {service.items.map((item, idx) => (
            <div 
              key={idx}
              className={`flex items-start gap-3 p-4 rounded-xl ${colorClass.bg} border ${colorClass.border}`}
            >
              <CheckCircle className={`h-5 w-5 ${colorClass.text} shrink-0 mt-0.5`} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">ทำไมต้องเลือกเรา?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {service.features.map((feature, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-2xl border border-purple-500/20 bg-card/50 backdrop-blur-sm"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${colorClass.bg} ${colorClass.text} font-bold text-xl mb-4`}>
                {idx + 1}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">คำถามที่พบบ่อย</h2>
        <div className="space-y-4 max-w-2xl">
          {service.faq.map((item, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-xl border border-purple-500/20 bg-card/50"
            >
              <h3 className="font-semibold mb-2">{item.question}</h3>
              <p className="text-muted-foreground text-sm">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className={`relative rounded-3xl border ${colorClass.border} bg-card/50 backdrop-blur-sm p-8 md:p-12 overflow-hidden`}>
          {/* Background Effect */}
          <div className={`absolute inset-0 ${colorClass.bg}`} />
          
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              พร้อมใช้บริการ<span className={colorClass.text}>{service.title}</span>?
            </h2>
            <p className="text-muted-foreground mb-8">
              ติดต่อเราวันนี้เพื่อรับคำปรึกษาฟรี และใบเสนอราคาที่เหมาะกับความต้องการของคุณ
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button variant="neon" size="lg">
                  ติดต่อเราวันนี้
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" size="lg" className="border-purple-500/30">
                  ดูบริการอื่นๆ
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
