import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/products - List all products
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    // Filters
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const type = searchParams.get('type') // PHYSICAL, DIGITAL
    const featured = searchParams.get('featured') === 'true'
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build where clause
    const where: any = {
      isActive: true,
    }

    if (category) {
      where.category = { slug: category }
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ]
    }

    if (type) {
      where.productType = type
    }

    if (featured) {
      where.isFeatured = true
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    // Get products
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          _count: {
            select: {
              reviews: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    // Calculate average rating for each product
    const productsWithRating = await Promise.all(
      products.map(async (product: typeof products[number]) => {
        const avgRating = await prisma.review.aggregate({
          where: { productId: product.id, isApproved: true },
          _avg: { rating: true },
        })
        return {
          ...product,
          averageRating: avgRating._avg.rating || 0,
        }
      })
    )

    return NextResponse.json({
      products: productsWithRating,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST /api/products - Create product (Admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()

    // Generate slug from name
    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Check for existing slug
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    })

    const finalSlug = existingProduct
      ? `${slug}-${Date.now()}`
      : slug

    const product = await prisma.product.create({
      data: {
        ...body,
        slug: finalSlug,
      },
      include: {
        category: true,
      },
    })

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'PRODUCT_CREATED',
        entity: 'Product',
        entityId: product.id,
        newData: body,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
