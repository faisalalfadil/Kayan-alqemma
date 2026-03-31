import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

const newsletterSchema = z.object({
  email: z.string().email('بريد إلكتروني غير صالح'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validationResult = newsletterSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, message: 'بريد إلكتروني غير صالح' },
        { status: 400 }
      )
    }

    const { email } = validationResult.data

    // Check if already subscribed
    const existing = await db.newsletter.findUnique({
      where: { email },
    })

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'هذا البريد الإلكتروني مسجل مسبقاً' },
        { status: 409 }
      )
    }

    // Create subscriber
    await db.newsletter.create({
      data: { email },
    })

    return NextResponse.json(
      { success: true, message: 'تم الاشتراك بنجاح' },
      { status: 201 }
    )
  } catch {
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في الخادم' },
      { status: 500 }
    )
  }
}
