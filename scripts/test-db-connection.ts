// Script ทดสอบการเชื่อมต่อ MySQL Database
// รัน: npx tsx scripts/test-db-connection.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  console.log('🔌 กำลังทดสอบการเชื่อมต่อฐานข้อมูล...\n')
  
  try {
    // ทดสอบเชื่อมต่อ
    await prisma.$connect()
    console.log('✅ เชื่อมต่อฐานข้อมูลสำเร็จ!\n')
    
    // ทดสอบ Query
    console.log('📊 ตรวจสอบตารางในฐานข้อมูล:\n')
    
    // นับจำนวน Users
    const userCount = await prisma.user.count()
    console.log(`   👤 Users: ${userCount} รายการ`)
    
    // นับจำนวน Products
    const productCount = await prisma.product.count()
    console.log(`   📦 Products: ${productCount} รายการ`)
    
    // นับจำนวน Categories
    const categoryCount = await prisma.productCategory.count()
    console.log(`   📁 Categories: ${categoryCount} รายการ`)
    
    // นับจำนวน Orders
    const orderCount = await prisma.order.count()
    console.log(`   🛒 Orders: ${orderCount} รายการ`)
    
    // นับจำนวน License Keys
    const licenseCount = await prisma.licenseKey.count()
    console.log(`   🔑 License Keys: ${licenseCount} รายการ`)
    
    // นับจำนวน Coupons
    const couponCount = await prisma.coupon.count()
    console.log(`   🎟️  Coupons: ${couponCount} รายการ`)
    
    console.log('\n✨ ฐานข้อมูลพร้อมใช้งาน!')
    console.log('📍 Database URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'))
    
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการเชื่อมต่อ:\n')
    
    if (error instanceof Error) {
      console.error('   Error:', error.message)
      
      if (error.message.includes('ECONNREFUSED')) {
        console.log('\n💡 คำแนะนำ:')
        console.log('   1. ตรวจสอบว่า MySQL Server กำลังทำงานอยู่')
        console.log('   2. ตรวจสอบ port (ค่าเริ่มต้น: 3306)')
        console.log('   3. ตรวจสอบ firewall ไม่ได้บล็อก port')
      } else if (error.message.includes('Access denied')) {
        console.log('\n💡 คำแนะนำ:')
        console.log('   1. ตรวจสอบ username และ password ใน .env')
        console.log('   2. ตรวจสอบสิทธิ์ของ user ใน MySQL')
      } else if (error.message.includes("Unknown database")) {
        console.log('\n💡 คำแนะนำ:')
        console.log('   1. สร้างฐานข้อมูล "ssshop" ใน phpMyAdmin')
        console.log('   2. หรือรัน: npx prisma db push')
      }
    }
    
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
