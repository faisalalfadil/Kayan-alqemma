import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const faqSchema = z.object({
  question: z.string().min(3),
  answer: z.string().min(5),
  category: z.string().optional(),
  order: z.number().default(0),
});

export async function GET() {
  try {
    const faqs = await db.fAQ.findMany({ orderBy: { order: 'asc' } });
    return NextResponse.json({ success: true, data: faqs });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch FAQs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = faqSchema.safeParse(body);
    if (!validated.success) return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });

    const faq = await db.fAQ.create({ data: validated.data });
    return NextResponse.json({ success: true, data: faq }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create FAQ' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

    const faq = await db.fAQ.update({ where: { id }, data });
    return NextResponse.json({ success: true, data: faq });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update FAQ' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

    await db.fAQ.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'FAQ deleted' });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to delete FAQ' }, { status: 500 });
  }
}
