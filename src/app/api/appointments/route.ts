import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

const appointmentSchema = z.object({
  name: z.string().min(3, 'يجب أن يكون الاسم 3 أحرف على الأقل'),
  phone: z.string().regex(/^(05\d{8}|\+9665\d{8})$/, 'رقم الجوال غير صالح (يجب أن يبدأ بـ 05 أو +9665)'),
  email: z.string().email('البريد الإلكتروني غير صالح').optional().or(z.literal('')),
  serviceType: z.string().min(1, 'يرجى اختيار نوع الخدمة'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'صيغة التاريخ غير صالحة (YYYY-MM-DD)'),
  time: z.string().regex(/^\d{1,2}:\d{2}$/, 'صيغة الوقت غير صالحة (HH:MM)'),
  notes: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where: Record<string, unknown> = status ? { status } : {}

    const appointments = await db.appointment.findMany({
      where,
      orderBy: { date: 'desc' },
    })

    return NextResponse.json({ success: true, data: appointments })
  } catch {
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في جلب المواعيد' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const result = appointmentSchema.safeParse(body)
    if (!result.success) {
      const firstError = result.error.issues[0]
      return NextResponse.json(
        { success: false, message: firstError?.message || 'بيانات غير صالحة' },
        { status: 400 }
      )
    }

    const { name, phone, email, serviceType, date, time, notes } = result.data

    // Validate date is today or in the future
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const appointmentDate = new Date(date + 'T00:00:00')

    if (appointmentDate < today) {
      return NextResponse.json(
        { success: false, message: 'لا يمكن حجز موعد في تاريخ سابق' },
        { status: 400 }
      )
    }

    const appointment = await db.appointment.create({
      data: {
        name,
        phone,
        email: email && email.trim() !== '' ? email : null,
        serviceType,
        date,
        time,
        notes: notes || null,
        status: 'pending',
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'تم حجز الموعد بنجاح! سنتواصل معك قريباً لتأكيد الموعد',
        data: appointment,
      },
      { status: 201 }
    )
  } catch {
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في الخادم' },
      { status: 500 }
    )
  }
}
