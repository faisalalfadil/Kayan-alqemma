import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await db.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'الرأي غير موجود' }, { status: 404 });
    }

    const { name, role, content, rating, avatar } = body;
    const testimonial = await db.testimonial.update({
      where: { id },
      data: { name, role, content, rating, avatar },
    });
    return NextResponse.json({ success: true, data: testimonial });
  } catch {
    return NextResponse.json({ success: false, error: 'فشل في تحديث الرأي' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await db.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'الرأي غير موجود' }, { status: 404 });
    }

    await db.testimonial.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'تم حذف الرأي بنجاح' });
  } catch {
    return NextResponse.json({ success: false, error: 'فشل في حذف الرأي' }, { status: 500 });
  }
}
