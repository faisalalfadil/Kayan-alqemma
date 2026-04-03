import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PUT update FAQ
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'معرف السؤال مطلوب' },
        { status: 400 }
      )
    }

    // Verify FAQ exists
    const existing = await db.fAQ.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'السؤال غير موجود' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const data: Record<string, unknown> = {}

    if (body.question !== undefined) data.question = body.question.trim()
    if (body.answer !== undefined) data.answer = body.answer.trim()
    if (body.category !== undefined) data.category = body.category?.trim() || null
    if (body.order !== undefined) data.order = body.order

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { success: false, error: 'لم يتم توفير بيانات للتحديث' },
        { status: 400 }
      )
    }

    const faq = await db.fAQ.update({
      where: { id },
      data,
    })

    return NextResponse.json({ success: true, data: faq })
  } catch (error) {
    console.error('خطأ في تحديث السؤال:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في تحديث السؤال' },
      { status: 500 }
    )
  }
}

// DELETE FAQ
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'معرف السؤال مطلوب' },
        { status: 400 }
      )
    }

    // Verify FAQ exists
    const existing = await db.fAQ.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'السؤال غير موجود' },
        { status: 404 }
      )
    }

    await db.fAQ.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: 'تم حذف السؤال بنجاح',
    })
  } catch (error) {
    console.error('خطأ في حذف السؤال:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في حذف السؤال' },
      { status: 500 }
    )
  }
}
