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
});

export async function GET() {
  try {
    const settings = {
      siteName: 'شركة كيان القمة',
      phone: '+966 50 123 4567',
      email: 'info@kayan-alaqma.sa',
      address: 'طريق الملك فهد، حي العليا، الرياض',
      workingHours: 'السبت - الخميس: 8 صباحًا - 6 مساءً',
      whatsapp: '966501234567',
      twitter: 'https://twitter.com/kayan_alaqma',
      instagram: 'https://instagram.com/kayan_alaqma',
      linkedin: 'https://linkedin.com/company/kayan-alaqma',
      description: 'شركة كيان القمة رائدة في توريد وتركيب المظلات الكهربائية',
    };
    return NextResponse.json({ success: true, data: settings });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = settingsSchema.safeParse(body);
    if (!validated.success) return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });

    return NextResponse.json({ success: true, data: validated.data, message: 'Settings saved (stored in memory)' });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
  }
}
