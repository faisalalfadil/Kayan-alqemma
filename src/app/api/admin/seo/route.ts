import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const seoSchema = z.object({
  page: z.string().min(1, 'اسم الصفحة مطلوب'),
  title: z.string().min(1, 'عنوان SEO مطلوب'),
  description: z.string().min(1, 'وصف SEO مطلوب'),
  keywords: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
  canonicalUrl: z.string().optional(),
  robots: z.string().default('index, follow'),
  schema: z.string().optional(),
  focusKeyword: z.string().optional(),
})

export async function GET() {
  try {
    const settings = await db.seoSetting.findMany({
      orderBy: { page: 'asc' },
    })
    return NextResponse.json({ success: true, data: settings })
  } catch {
    return NextResponse.json(
      { success: false, error: 'فشل في تحميل إعدادات SEO' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = seoSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.issues[0]?.message || 'بيانات غير صالحة' },
        { status: 400 }
      )
    }

    const { page } = validated.data

    const existing = await db.seoSetting.findUnique({
      where: { page },
    })

    if (existing) {
      const updated = await db.seoSetting.update({
        where: { page },
        data: validated.data,
      })
      return NextResponse.json({ success: true, data: updated })
    }

    const created = await db.seoSetting.create({
      data: validated.data,
    })
    return NextResponse.json({ success: true, data: created })
  } catch {
    return NextResponse.json(
      { success: false, error: 'فشل في حفظ إعدادات SEO' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'معرف العنصر مطلوب' },
        { status: 400 }
      )
    }

    const existing = await db.seoSetting.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'إعداد SEO غير موجود' },
        { status: 404 }
      )
    }

    const updated = await db.seoSetting.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        keywords: data.keywords,
        ogTitle: data.ogTitle,
        ogDescription: data.ogDescription,
        ogImage: data.ogImage,
        canonicalUrl: data.canonicalUrl,
        robots: data.robots,
        schema: data.schema,
        focusKeyword: data.focusKeyword,
      },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch {
    return NextResponse.json(
      { success: false, error: 'فشل في تحديث إعدادات SEO' },
      { status: 500 }
    )
  }
}
