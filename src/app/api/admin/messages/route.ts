import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all contact messages with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const read = searchParams.get('read')
    const countOnly = searchParams.get('count')

    const where: Record<string, unknown> = {}

    if (read !== null && read !== undefined && read !== '') {
      where.read = read === 'true'
    }

    // Return unread count if requested
    if (countOnly === 'unread') {
      const unreadCount = await db.contactMessage.count({
        where: { read: false },
      })
      return NextResponse.json({ success: true, count: unreadCount })
    }

    const messages = await db.contactMessage.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: messages })
  } catch (error) {
    console.error('خطأ في جلب الرسائل:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في جلب الرسائل' },
      { status: 500 }
    )
  }
}

// PATCH mark message as read/unread
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, read } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'معرف الرسالة مطلوب' },
        { status: 400 }
      )
    }

    if (typeof read !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'حالة القراءة مطلوبة (true/false)' },
        { status: 400 }
      )
    }

    // Verify message exists
    const existing = await db.contactMessage.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'الرسالة غير موجودة' },
        { status: 404 }
      )
    }

    const message = await db.contactMessage.update({
      where: { id },
      data: { read },
    })

    return NextResponse.json({ success: true, data: message })
  } catch (error) {
    console.error('خطأ في تحديث حالة الرسالة:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في تحديث حالة الرسالة' },
      { status: 500 }
    )
  }
}

// DELETE message
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'معرف الرسالة مطلوب' },
        { status: 400 }
      )
    }

    // Verify message exists
    const existing = await db.contactMessage.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'الرسالة غير موجودة' },
        { status: 404 }
      )
    }

    await db.contactMessage.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: 'تم حذف الرسالة بنجاح',
    })
  } catch (error) {
    console.error('خطأ في حذف الرسالة:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في حذف الرسالة' },
      { status: 500 }
    )
  }
}
