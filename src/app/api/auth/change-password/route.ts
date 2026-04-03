import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthenticatedAdmin, verifyPassword, hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'كلمة المرور الحالية والجديدة مطلوبتان' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل' },
        { status: 400 }
      );
    }

    const adminRecord = await db.admin.findUnique({
      where: { id: admin.id },
    });

    if (!adminRecord) {
      return NextResponse.json(
        { error: 'المسؤول غير موجود' },
        { status: 404 }
      );
    }

    const isValid = await verifyPassword(currentPassword, adminRecord.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'كلمة المرور الحالية غير صحيحة' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(newPassword);

    await db.admin.update({
      where: { id: admin.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json(
      { message: 'تم تغيير كلمة المرور بنجاح' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تغيير كلمة المرور' },
      { status: 500 }
    );
  }
}
