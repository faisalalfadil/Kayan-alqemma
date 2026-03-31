import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Arabic-to-Latin slug generator
function generateSlug(text: string): string {
  const arabicMap: Record<string, string> = {
    'ا': 'a', 'أ': 'a', 'إ': 'i', 'آ': 'aa', 'ب': 'b', 'ت': 't', 'ث': 'th',
    'ج': 'j', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z',
    'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a',
    'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
    'ه': 'h', 'و': 'w', 'ي': 'y', 'ى': 'a', 'ة': 'h', 'ؤ': 'ou', 'ئ': 'ei',
  }
  const transliterated = text
    .split('')
    .map((char) => arabicMap[char] || char)
    .join('')
  return transliterated
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// GET all blog posts with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published')
    const search = searchParams.get('search')

    const where: Record<string, unknown> = {}

    if (published !== null && published !== undefined && published !== '') {
      where.published = published === 'true'
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
      ]
    }

    const posts = await db.blogPost.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: posts })
  } catch (error) {
    console.error('خطأ في جلب المقالات:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في جلب المقالات' },
      { status: 500 }
    )
  }
}

// POST create new blog post (supports JSON and FormData)
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''

    let title = ''
    let slug = ''
    let excerpt = ''
    let content = ''
    let coverImage = ''
    let metaDescription = ''
    let published = true

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      title = (formData.get('title') as string) || ''
      slug = (formData.get('slug') as string) || ''
      excerpt = (formData.get('excerpt') as string) || ''
      content = (formData.get('content') as string) || ''
      coverImage = (formData.get('coverImage') as string) || ''
      metaDescription = (formData.get('metaDescription') as string) || ''
      published = formData.get('published') === 'true'
    } else {
      const body = await request.json()
      title = body.title || ''
      slug = body.slug || ''
      excerpt = body.excerpt || ''
      content = body.content || ''
      coverImage = body.coverImage || ''
      metaDescription = body.metaDescription || ''
      published = body.published !== false
    }

    if (!title || title.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: 'العنوان مطلوب ويجب أن يكون 3 أحرف على الأقل' },
        { status: 400 }
      )
    }

    if (!content || content.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'المحتوى مطلوب ويجب أن يكون 10 أحرف على الأقل' },
        { status: 400 }
      )
    }

    // Auto-generate slug from title if not provided
    if (!slug) {
      slug = generateSlug(title)
    }

    // Ensure slug uniqueness
    const existing = await db.blogPost.findUnique({ where: { slug } })
    if (existing) {
      slug = `${slug}-${Date.now()}`
    }

    const post = await db.blogPost.create({
      data: {
        title: title.trim(),
        slug,
        excerpt: excerpt.trim() || null,
        content: content.trim(),
        coverImage: coverImage.trim() || null,
        metaDescription: metaDescription.trim() || null,
        published,
      },
    })

    return NextResponse.json({ success: true, data: post }, { status: 201 })
  } catch (error) {
    console.error('خطأ في إنشاء المقال:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في إنشاء المقال' },
      { status: 500 }
    )
  }
}
