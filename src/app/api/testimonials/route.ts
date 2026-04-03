import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const testimonialSchema = z.object({
  name: z.string().min(3, 'الاسم مطلوب (3 أحرف على الأقل)'),
  role: z.string().optional(),
  content: z.string().min(10, 'المحتوى مطلوب (10 أحرف على الأقل)'),
  rating: z.number().min(1).max(5),
  avatar: z.string().optional(),
});

export async function GET() {
  try {
    const testimonials = await db.testimonial.findMany({
      orderBy: { id: 'desc' },
    });
    return NextResponse.json({ success: true, data: testimonials });
  } catch {
    return NextResponse.json({ success: false, error: 'فشل في تحميل آراء العملاء' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = testimonialSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ success: false, error: 'بيانات غير صالحة', details: validated.error.flatten().fieldErrors }, { status: 400 });
    }

    const testimonial = await db.testimonial.create({ data: validated.data });
    return NextResponse.json({ success: true, data: testimonial }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'فشل في إنشاء الرأي' }, { status: 500 });
  }
}
