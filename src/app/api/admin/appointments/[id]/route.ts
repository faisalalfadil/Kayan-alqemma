import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled']

const updateSchema = z.object({
  status: z.string().refine((val) => validStatuses.includes(val), {
    message: 'حالة غير صالحة',
  }),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existing = await db.appointment.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'الموعد غير موجود' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const result = updateSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error.errors[0]?.message || 'بيانات غير صالحة' },
        { status: 400 }
      )
    }

    const appointment = await db.appointment.update({
      where: { id },
      data: { status: result.data.status },
    })

    return NextResponse.json({
      success: true,
      message: 'تم تحديث حالة الموعد بنجاح',
      data: appointment,
    })
  } catch {
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في تحديث الموعد' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existing = await db.appointment.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'الموعد غير موجود' },
        { status: 404 }
      )
    }

    await db.appointment.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: 'تم حذف الموعد بنجاح',
    })
  } catch {
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في حذف الموعد' },
      { status: 500 }
    )
  }
}
