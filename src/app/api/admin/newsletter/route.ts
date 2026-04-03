import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const subscribers = await db.newsletter.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: subscribers,
      count: subscribers.length,
    })
  } catch {
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في تحميل المشتركين' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'يرجى تحديد البريد الإلكتروني' },
        { status: 400 }
      )
    }

    const existing = await db.newsletter.findUnique({
      where: { email },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'المشترك غير موجود' },
        { status: 404 }
      )
    }

    await db.newsletter.delete({
      where: { email },
    })

    return NextResponse.json({
      success: true,
      message: 'تم حذف المشترك بنجاح',
    })
  } catch {
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء الحذف' },
      { status: 500 }
    )
  }
}
