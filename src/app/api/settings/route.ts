import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const settingsSchema = z.object({
  siteName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  workingHours: z.string().optional(),
  whatsapp: z.string().optional(),
  twitter: z.string().optional(),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
  description: z.string().optional(),
  chatbotPrompt: z.string().optional(),
  logo: z.string().optional(),
  favicon: z.string().optional(),
});

export async function GET() {
  try {
    let settings = await db.siteSettings.findFirst();
    if (!settings) {
      settings = await db.siteSettings.create({ data: {} });
    }
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = settingsSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });
    }

    let settings = await db.siteSettings.findFirst();
    if (settings) {
      settings = await db.siteSettings.update({
        where: { id: settings.id },
        data: validated.data,
      });
    } else {
      settings = await db.siteSettings.create({ data: validated.data });
    }

    return NextResponse.json({ success: true, data: settings, message: 'تم حفظ الإعدادات بنجاح' });
  } catch (error) {
    console.error('Settings PUT error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
  }
}
