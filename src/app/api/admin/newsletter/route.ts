import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export default async function handler(req, res) {
  try {
    // كل الكود هنا فقط 👇

    return res.status(200).json({ message: "OK" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
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
