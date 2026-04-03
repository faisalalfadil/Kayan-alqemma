import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const projectSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  image: z.string().optional(),
  category: z.string().optional(),
  clientName: z.string().optional(),
  location: z.string().optional(),
  featured: z.boolean().default(false),
});

export async function GET() {
  try {
    const projects = await db.project.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ success: true, data: projects });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = projectSchema.safeParse(body);
    if (!validated.success) return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });

    const project = await db.project.create({ data: validated.data });
    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create project' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

    const project = await db.project.update({ where: { id }, data });
    return NextResponse.json({ success: true, data: project });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

    await db.project.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Project deleted' });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to delete project' }, { status: 500 });
  }
}
