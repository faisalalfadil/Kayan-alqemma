import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

const contactSchema = z.object({
  name: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  phone: z.string().min(10, 'رقم الهاتف غير صحيح'),
  subject: z.string().min(3, 'الموضوع يجب أن يكون 3 أحرف على الأقل'),
  message: z.string().min(10, 'الرسالة يجب أن تكون 10 أحرف على الأقل'),
})

export async function GET() {
  try {
    const messages = await db.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    return NextResponse.json({ success: true, data: messages })
  } catch {
    return NextResponse.json(
      { success: false, error: 'فشل في جلب الرسائل' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validationResult = contactSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'بيانات غير صحيحة',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const { name, email, phone, subject, message } = validationResult.data

    // Save to database
    await db.contactMessage.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
      },
    })

    console.log('Contact form submission:', {
      name,
      email,
      phone,
      subject,
      message,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      {
        success: true,
        message: 'تم استلام رسالتك بنجاح. سنتواصل معك في أقرب وقت.',
      },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى.',
      },
      { status: 500 }
    )
  }
}
