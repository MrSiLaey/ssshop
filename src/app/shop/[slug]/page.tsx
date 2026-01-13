import { notFound } from 'next/navigation'
import prisma from '@/lib/db'
import ProductDetailClient from './product-detail-client'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: {
        select: { id: true, name: true, slug: true },
      },
      digitalAssets: {
        select: {
          id: true,
          name: true,
          fileName: true,
          fileSize: true,
          version: true,
        },
      },
      reviews: {
        where: { isApproved: true },
        include: {
          user: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      _count: {
        select: { reviews: true },
      },
    },
  })

  if (!product) return null

  // Calculate average rating
  const avgRating = await prisma.review.aggregate({
    where: { productId: product.id, isApproved: true },
    _avg: { rating: true },
  })

  return {
    ...product,
    price: Number(product.price),
    comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
    rating: avgRating._avg.rating || 0,
    reviewCount: product._count.reviews,
    stock: product.quantity,
    features: null,
    images: typeof product.images === 'string' ? product.images : null,
    reviews: product.reviews.map(review => ({
      id: review.id,
      user: { name: review.user.name || 'ผู้ใช้' },
      rating: review.rating,
      comment: review.comment || '',
      createdAt: review.createdAt.toISOString().split('T')[0],
    })),
  }
}

async function getRelatedProducts(categoryId: string, productId: string) {
  return prisma.product.findMany({
    where: {
      categoryId,
      id: { not: productId },
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      thumbnail: true,
      productType: true,
    },
    take: 4,
  })
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    return { title: 'ไม่พบสินค้า' }
  }

  return {
    title: product.name,
    description: product.shortDescription || product.description?.slice(0, 160),
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = product.categoryId
    ? await getRelatedProducts(product.categoryId, product.id)
    : []

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts.map(p => ({
        ...p,
        price: Number(p.price),
      }))}
    />
  )
}
