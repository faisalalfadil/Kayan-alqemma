import { NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const admin = await getAuthenticatedAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    return NextResponse.json({ admin });
  } catch (error) {
    console.error('Get admin error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ' },
      { status: 500 }
    );
  }
}
