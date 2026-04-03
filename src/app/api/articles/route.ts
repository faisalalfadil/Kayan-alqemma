import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthenticatedAdmin } from '@/lib/auth';

// GET - List all articles
export async function GET() {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const articles = await db.article.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ articles });
  } catch {
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}

// POST - Create new article
export async function POST(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const body = await req.json();
    const { title, content, excerpt } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'عنوان المقال مطلوب' }, { status: 400 });
    }

    // Generate slug from title (Arabic-friendly)
    const slug = generateSlug(title);

    // Check slug uniqueness
    const existing = await db.article.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'يوجد مقال بعنوان مشابه' }, { status: 409 });
    }

    const article = await db.article.create({
      data: {
        title: title.trim(),
        slug,
        content: content || '',
        excerpt: excerpt || content?.substring(0, 200) || '',
        authorId: admin.id,
      },
    });

    return NextResponse.json({ article }, { status: 201 });
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
