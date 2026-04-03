import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthenticatedAdmin, verifyPassword } from '@/lib/auth';

export async function PUT(request: Request) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { phone1, phone2, password } = body;

    if (!password) {
      return NextResponse.json(
        { error: 'كلمة المرور مطلوبة للتحقق' },
        { status: 400 }
      );
    }

    // Validate phone format (Saudi numbers: 05xxxxxxxx or +9665xxxxxxxx)
    const phoneRegex = /^(\+966|05)\d{8}$/;

    if (phone1 && !phoneRegex.test(phone1)) {
      return NextResponse.json(
        { error: 'صيغة الرقم الأول غير صحيحة. يجب أن يبدأ بـ 05 أو +966' },
        { status: 400 }
      );
    }

    if (phone2 && !phoneRegex.test(phone2)) {
      return NextResponse.json(
        { error: 'صيغة الرقم الثاني غير صحيحة. يجب أن يبدأ بـ 05 أو +966' },
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

    const isValid = await verifyPassword(password, adminRecord.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'كلمة المرور غير صحيحة' },
        { status: 400 }
      );
    }

    await db.admin.update({
      where: { id: admin.id },
      data: {
        phone1: phone1 || null,
        phone2: phone2 || null,
      },
    });

    return NextResponse.json(
      { message: 'تم حفظ أرقام الجوال بنجاح' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update phones error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حفظ أرقام الجوال' },
      { status: 500 }
    );
  }
}
