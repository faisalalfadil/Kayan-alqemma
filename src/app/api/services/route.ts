import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const serviceSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  icon: z.string().optional(),
  features: z.string().optional(),
  order: z.number().default(0),
});

export async function GET() {
  try {
    const services = await db.service.findMany({ orderBy: { order: 'asc' } });
    return NextResponse.json({ success: true, data: services });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = serviceSchema.safeParse(body);
    if (!validated.success) return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });

    const service = await db.service.create({ data: validated.data });
    return NextResponse.json({ success: true, data: service }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create service' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

    const service = await db.service.update({ where: { id }, data });
    return NextResponse.json({ success: true, data: service });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

    await db.service.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Service deleted' });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to delete service' }, { status: 500 });
  }
}
