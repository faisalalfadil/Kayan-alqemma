import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthenticatedAdmin } from '@/lib/auth';

export async function POST() {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    await db.admin.update({
      where: { id: admin.id },
      data: { sessionToken: null },
    });

    const response = NextResponse.json(
      { message: 'تم تسجيل الخروج بنجاح' },
      { status: 200 }
    );

    response.cookies.set('admin_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تسجيل الخروج' },
      { status: 500 }
    );
  }
}
