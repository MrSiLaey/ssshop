'use client'

import Link from 'next/link'
import Image from 'next/image'
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  Download,
  ArrowRight,
  ShoppingBag,
  Package
} from 'lucide-react'
import { Button, Card, Input, Badge } from '@/components/ui'
import { useCartStore } from '@/stores'
import { formatCurrency } from '@/lib/utils'

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore()
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-4">ตะกร้าว่างเปล่า</h1>
          <p className="text-muted-foreground mb-8">ยังไม่มีสินค้าในตะกร้าของคุณ</p>
          <Link href="/shop">
            <Button variant="neon">
              <ShoppingBag className="w-5 h-5 mr-2" />
              ไปยังร้านค้า
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-foreground mb-8">ตะกร้าสินค้า</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.productId} className="p-6 border border-purple-500/20 bg-card/50 backdrop-blur-sm">
                <div className="flex gap-6">
                  {/* Product Image */}
                  <div className="w-24 h-24 rounded-lg bg-muted shrink-0 flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : item.isDigital ? (
                      <Download className="w-8 h-8 text-purple-400" />
                    ) : (
                      <Package className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{item.name}</h3>
                        {item.isDigital && (
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                            <Download className="w-3 h-3 mr-1" />
                            ดิจิทัล
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-red-400"
                        onClick={() => removeItem(item.productId)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controls */}
                      {!item.isDigital ? (
                        <div className="flex items-center border border-purple-500/30 rounded-lg">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-10 text-center text-foreground text-sm">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">จำนวน: 1</span>
                      )}

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-purple-400">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(item.price)} x {item.quantity}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {/* Clear Cart */}
            <div className="flex justify-end">
              <Button variant="ghost" className="text-muted-foreground hover:text-red-400" onClick={clearCart}>
                <Trash2 className="w-4 h-4 mr-2" />
                ล้างตะกร้า
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24 border border-purple-500/20 bg-card/50 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-foreground mb-6">สรุปคำสั่งซื้อ</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>รวมสินค้า ({items.length} รายการ)</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>ค่าจัดส่ง</span>
                  <span className="text-green-400">ฟรี</span>
                </div>
              </div>

              {/* Coupon Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  โค้ดส่วนลด
                </label>
                <div className="flex gap-2">
                  <Input placeholder="กรอกโค้ดส่วนลด" className="flex-1" />
                  <Button variant="outline" className="border-purple-500/30">ใช้โค้ด</Button>
                </div>
              </div>

              <div className="border-t border-purple-500/20 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-foreground">ยอดรวมทั้งหมด</span>
                  <span className="text-2xl font-bold text-purple-400">{formatCurrency(total)}</span>
                </div>
              </div>

              <Link href="/checkout">
                <Button variant="neon" className="w-full" size="lg">
                  ดำเนินการชำระเงิน
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              <p className="text-xs text-muted-foreground text-center mt-4">
                การชำระเงินมีความปลอดภัยด้วย SSL encryption
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
