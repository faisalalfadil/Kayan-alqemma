import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthenticatedAdmin } from '@/lib/auth';

// GET - Single article
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { id } = await params;

    const article = await db.article.findUnique({
      where: { id },
    });

    if (!article) {
      return NextResponse.json({ error: 'المقال غير موجود' }, { status: 404 });
    }

    return NextResponse.json({ article });
  } catch {
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}

// PUT - Update article
export async function PUT(
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
    const { title, content, excerpt } = body;

    const existing = await db.article.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'المقال غير موجود' }, { status: 404 });
    }

    const updateData: Record<string, string> = {};
    if (title !== undefined) updateData.title = title.trim();
    if (content !== undefined) updateData.content = content;
    if (excerpt !== undefined) updateData.excerpt = excerpt;

    if (title !== undefined) {
      updateData.slug = generateSlug(title);
    }

    const article = await db.article.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ article });
  } catch {
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}

// DELETE - Delete article
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { id } = await params;

    const existing = await db.article.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'المقال غير موجود' }, { status: 404 });
    }

    await db.article.delete({ where: { id } });

    return NextResponse.json({ message: 'تم حذف المقال' });
  } catch {
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}

function generateSlug(title: string): string {
  const timestamp = Date.now().toString(36);
  const base = title
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\u0621-\u064Aa-zA-Z0-9\-]/g, '')
    .substring(0, 60);
  return `${base}-${timestamp}`;
}
