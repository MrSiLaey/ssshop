import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'เกี่ยวกับเรา | Soft Stop Shop',
  description: 'เกี่ยวกับ Soft Stop Shop ร้านค้าซอฟต์แวร์และสินค้าไอทีชั้นนำ',
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-primary">เกี่ยวกับเรา</h1>
        <div className="prose dark:prose-invert max-w-none">
          <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
            <p className="text-lg text-muted-foreground mb-6">
              Soft Stop Shop คือผู้นำด้านการจำหน่ายซอฟต์แวร์ลิขสิทธิ์แท้และสินค้าไอทีคุณภาพสูง 
              เรามุ่งมั่นที่จะมอบประสบการณ์การช้อปปิ้งที่ดีที่สุดให้กับลูกค้าของเรา 
              ด้วยสินค้าที่หลากหลายและการบริการที่รวดเร็วและเชื่อถือได้
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              เราคัดสรรเฉพาะสินค้าที่มีคุณภาพและได้รับมาตรฐาน เพื่อให้มั่นใจว่าลูกค้าจะได้รับสิ่งที่ดีที่สุด 
              ไม่ว่าจะเป็นซอฟต์แวร์สำหรับการทำงาน, เกม, หรืออุปกรณ์เสริมต่างๆ
            </p>
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">วิสัยทัศน์ของเรา</h2>
            <p className="text-lg text-muted-foreground">
              เป็นร้านค้าออนไลน์อันดับหนึ่งที่ลูกค้าไว้วางใจในการเลือกซื้อซอฟต์แวร์และสินค้าไอที 
              พร้อมทั้งสร้างสังคมแห่งการแบ่งปันความรู้และเทคโนโลยี
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
