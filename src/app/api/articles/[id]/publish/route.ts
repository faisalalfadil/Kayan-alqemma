import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthenticatedAdmin } from '@/lib/auth';

// PATCH - Toggle publish status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { published } = body;

    const existing = await db.article.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'المقال غير موجود' }, { status: 404 });
    }

    const article = await db.article.update({
      where: { id },
      data: { published: published ?? !existing.published },
    });

    return NextResponse.json({ article });
  } catch {
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}
