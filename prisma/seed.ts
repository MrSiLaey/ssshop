import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 เริ่มสร้างข้อมูลเริ่มต้น...\n')

  // ==================== ADMIN USER ====================
  const email = 'admin@ssshop.com'
  const password = 'password123'
  const hashedPassword = await bcrypt.hash(password, 12)

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })
  console.log('👤 สร้าง Admin:', admin.email)

  // สร้าง Test User
  const testUser = await prisma.user.upsert({
    where: { email: 'user@ssshop.com' },
    update: {},
    create: {
      email: 'user@ssshop.com',
      name: 'Test User',
      password: await bcrypt.hash('user123', 12),
      role: 'USER',
    },
  })
  console.log('👤 สร้าง Test User:', testUser.email)

  // ==================== CATEGORIES ====================
  const categories = [
    { name: 'Software', slug: 'software', description: 'ซอฟต์แวร์และโปรแกรม' },
    { name: 'Digital Art', slug: 'digital-art', description: 'งานศิลปะดิจิทัล' },
    { name: 'E-Books', slug: 'ebooks', description: 'หนังสืออิเล็กทรอนิกส์' },
    { name: 'Templates', slug: 'templates', description: 'เทมเพลตและธีม' },
    { name: 'Courses', slug: 'courses', description: 'คอร์สเรียนออนไลน์' },
    { name: 'Games', slug: 'games', description: 'เกมและสื่อบันเทิง' },
  ]

  for (const cat of categories) {
    await prisma.productCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log('📁 สร้างหมวดหมู่:', categories.length, 'หมวดหมู่')

  // ดึง category IDs
  const softwareCat = await prisma.productCategory.findUnique({ where: { slug: 'software' } })
  const artCat = await prisma.productCategory.findUnique({ where: { slug: 'digital-art' } })
  const ebookCat = await prisma.productCategory.findUnique({ where: { slug: 'ebooks' } })
  const templateCat = await prisma.productCategory.findUnique({ where: { slug: 'templates' } })
  const courseCat = await prisma.productCategory.findUnique({ where: { slug: 'courses' } })
  const gameCat = await prisma.productCategory.findUnique({ where: { slug: 'games' } })

  // ==================== PRODUCTS ====================
  const products = [
    {
      name: 'Premium Software License',
      slug: 'premium-software-license',
      description: 'ซอฟต์แวร์ระดับพรีเมียมพร้อม License Key ใช้งานได้ตลอดชีพ รองรับการอัปเดตฟรี 1 ปี',
      shortDescription: 'ซอฟต์แวร์พรีเมียมพร้อม License',
      price: 2990,
      comparePrice: 3990,
      productType: 'DIGITAL' as const,
      isDigital: true,
      isFeatured: true,
      categoryId: softwareCat?.id,
      sku: 'SW-001',
    },
    {
      name: 'Digital Art Pack Vol.1',
      slug: 'digital-art-pack-v1',
      description: 'ชุดภาพกราฟิกดิจิทัลคุณภาพสูง 100+ ไฟล์ รวมไอคอน, illustration, backgrounds',
      shortDescription: 'ชุดกราฟิกดิจิทัล 100+ ไฟล์',
      price: 599,
      comparePrice: 990,
      productType: 'DIGITAL' as const,
      isDigital: true,
      isFeatured: true,
      categoryId: artCat?.id,
      sku: 'ART-001',
    },
    {
      name: 'E-Book: Web Development Guide',
      slug: 'ebook-web-dev-guide',
      description: 'คู่มือการพัฒนาเว็บไซต์ครบวงจร ตั้งแต่พื้นฐานถึงขั้นสูง HTML, CSS, JavaScript, React',
      shortDescription: 'คู่มือพัฒนาเว็บครบวงจร',
      price: 450,
      comparePrice: null,
      productType: 'DIGITAL' as const,
      isDigital: true,
      isFeatured: true,
      categoryId: ebookCat?.id,
      sku: 'BOOK-001',
    },
    {
      name: 'Next.js Template Pro',
      slug: 'nextjs-template-pro',
      description: 'เทมเพลต Next.js พร้อมใช้งาน รวม Authentication, Dashboard, E-commerce components',
      shortDescription: 'เทมเพลต Next.js สำเร็จรูป',
      price: 1290,
      comparePrice: 1990,
      productType: 'DIGITAL' as const,
      isDigital: true,
      isFeatured: true,
      categoryId: templateCat?.id,
      sku: 'TPL-001',
    },
    {
      name: 'Python Mastery Course',
      slug: 'python-mastery-course',
      description: 'คอร์สเรียน Python ตั้งแต่เริ่มต้นจนเป็นมืออาชีพ 50+ ชั่วโมง พร้อมแบบฝึกหัด',
      shortDescription: 'คอร์ส Python 50+ ชั่วโมง',
      price: 1990,
      comparePrice: 2990,
      productType: 'DIGITAL' as const,
      isDigital: true,
      isFeatured: true,
      categoryId: courseCat?.id,
      sku: 'CRS-001',
    },
    {
      name: 'Indie Game Bundle',
      slug: 'indie-game-bundle',
      description: 'รวมเกมอินดี้คุณภาพ 5 เกม พร้อม Steam Key ดาวน์โหลดได้ทันที',
      shortDescription: 'รวม 5 เกมอินดี้ + Steam Key',
      price: 399,
      comparePrice: 799,
      productType: 'DIGITAL' as const,
      isDigital: true,
      isFeatured: true,
      categoryId: gameCat?.id,
      sku: 'GAME-001',
    },
    {
      name: 'UI Kit - Dark Neon Theme',
      slug: 'ui-kit-dark-neon',
      description: 'ชุด UI Components สไตล์ Dark Neon สำหรับ Figma และ Adobe XD กว่า 200 components',
      shortDescription: 'UI Kit สไตล์ Dark Neon',
      price: 890,
      comparePrice: 1290,
      productType: 'DIGITAL' as const,
      isDigital: true,
      isFeatured: false,
      categoryId: templateCat?.id,
      sku: 'UI-001',
    },
    {
      name: 'Stock Photo Pack - Nature',
      slug: 'stock-photo-nature',
      description: 'ชุดรูปภาพธรรมชาติความละเอียดสูง 500+ รูป ใช้เชิงพาณิชย์ได้',
      shortDescription: 'รูปธรรมชาติ 500+ รูป',
      price: 299,
      comparePrice: 499,
      productType: 'DIGITAL' as const,
      isDigital: true,
      isFeatured: false,
      categoryId: artCat?.id,
      sku: 'PHOTO-001',
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
  }
  console.log('📦 สร้างสินค้า:', products.length, 'รายการ')

  // ==================== COUPONS ====================
  const coupons = [
    {
      code: 'WELCOME10',
      description: 'ส่วนลด 10% สำหรับสมาชิกใหม่',
      discountType: 'PERCENTAGE' as const,
      discountValue: 10,
      minPurchase: 500,
      isActive: true,
    },
    {
      code: 'SAVE100',
      description: 'ส่วนลด 100 บาท เมื่อซื้อครบ 1000 บาท',
      discountType: 'FIXED_AMOUNT' as const,
      discountValue: 100,
      minPurchase: 1000,
      isActive: true,
    },
    {
      code: 'NEWYEAR2025',
      description: 'ส่วนลดปีใหม่ 15%',
      discountType: 'PERCENTAGE' as const,
      discountValue: 15,
      minPurchase: 300,
      maxDiscount: 500,
      isActive: true,
    },
  ]

  for (const coupon of coupons) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: {},
      create: coupon,
    })
  }
  console.log('🎟️  สร้างคูปอง:', coupons.length, 'รายการ')

  // ==================== LICENSE KEYS (Sample) ====================
  const softwareProduct = await prisma.product.findUnique({ where: { slug: 'premium-software-license' } })
  
  if (softwareProduct) {
    const licenseKeys = [
      'XXXX-YYYY-ZZZZ-1111',
      'XXXX-YYYY-ZZZZ-2222',
      'XXXX-YYYY-ZZZZ-3333',
      'XXXX-YYYY-ZZZZ-4444',
      'XXXX-YYYY-ZZZZ-5555',
    ]

    for (const key of licenseKeys) {
      await prisma.licenseKey.upsert({
        where: { key },
        update: {},
        create: {
          key,
          productId: softwareProduct.id,
          status: 'ACTIVE',
          activationsLimit: 3,
        },
      })
    }
    console.log('🔑 สร้าง License Keys:', licenseKeys.length, 'รายการ')
  }

  // ==================== SPIN WHEEL ====================
  console.log('\n🎡 สร้างวงล้อนำโชค...')
  
  const existingWheel = await prisma.spinWheel.findFirst({
    where: { name: 'วงล้อนำโชค' }
  })

  if (!existingWheel) {
    const wheel = await prisma.spinWheel.create({
      data: {
        name: 'วงล้อนำโชค',
        description: 'หมุนเพื่อรับส่วนลดพิเศษ!',
        isActive: true,
        spinsPerDay: 1,
        cooldownHours: 24,
        showOnPopup: true,
        popupDelay: 3,
        prizes: {
          create: [
            {
              name: 'ส่วนลด ฿500',
              description: 'ส่วนลดเงินสด 500 บาท',
              type: 'DISCOUNT_FIXED',
              value: 500,
              color: '#FF6B00',
              textColor: '#FFFFFF',
              probability: 2,
              totalQuantity: 10,
              dailyLimit: 2,
              validDays: 7,
              minPurchase: 1000,
              position: 0,
            },
            {
              name: 'ส่วนลด ฿200',
              description: 'ส่วนลดเงินสด 200 บาท',
              type: 'DISCOUNT_FIXED',
              value: 200,
              color: '#FF9500',
              textColor: '#FFFFFF',
              probability: 5,
              totalQuantity: 50,
              dailyLimit: 5,
              validDays: 7,
              minPurchase: 500,
              position: 1,
            },
            {
              name: 'ส่วนลด ฿100',
              description: 'ส่วนลดเงินสด 100 บาท',
              type: 'DISCOUNT_FIXED',
              value: 100,
              color: '#FFCC00',
              textColor: '#000000',
              probability: 10,
              totalQuantity: 100,
              dailyLimit: 10,
              validDays: 7,
              minPurchase: 300,
              position: 2,
            },
            {
              name: 'ลด 15%',
              description: 'ส่วนลด 15% สูงสุด ฿300',
              type: 'DISCOUNT_PERCENT',
              value: 15,
              maxValue: 300,
              color: '#4CAF50',
              textColor: '#FFFFFF',
              probability: 8,
              validDays: 7,
              minPurchase: 200,
              position: 3,
            },
            {
              name: 'ลด 10%',
              description: 'ส่วนลด 10% สูงสุด ฿200',
              type: 'DISCOUNT_PERCENT',
              value: 10,
              maxValue: 200,
              color: '#2196F3',
              textColor: '#FFFFFF',
              probability: 12,
              validDays: 7,
              minPurchase: 100,
              position: 4,
            },
            {
              name: 'ส่งฟรี',
              description: 'ส่งฟรีทั่วไทย',
              type: 'FREE_SHIPPING',
              value: 0,
              color: '#9C27B0',
              textColor: '#FFFFFF',
              probability: 15,
              validDays: 7,
              position: 5,
            },
            {
              name: 'ส่วนลด ฿50',
              description: 'ส่วนลดเงินสด 50 บาท',
              type: 'DISCOUNT_FIXED',
              value: 50,
              color: '#E91E63',
              textColor: '#FFFFFF',
              probability: 18,
              validDays: 7,
              minPurchase: 100,
              position: 6,
            },
            {
              name: 'เสียใจด้วย',
              description: 'ลองใหม่คราวหน้านะ',
              type: 'NO_PRIZE',
              value: 0,
              color: '#607D8B',
              textColor: '#FFFFFF',
              probability: 30,
              validDays: 1,
              position: 7,
            },
          ],
        },
      },
    })
    console.log('🎡 สร้างวงล้อ:', wheel.name, 'พร้อม 8 รางวัล')
  } else {
    console.log('🎡 วงล้อนำโชคมีอยู่แล้ว')
  }

  console.log('\n✅ สร้างข้อมูลเริ่มต้นเสร็จสมบูรณ์!')
  console.log('\n📋 ข้อมูล Login:')
  console.log('   Admin: admin@ssshop.com / password123')
  console.log('   User:  user@ssshop.com / user123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
