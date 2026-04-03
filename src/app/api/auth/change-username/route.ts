import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthenticatedAdmin, verifyPassword } from '@/lib/auth';

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
    const { newUsername, password } = body;

    if (!newUsername || !password) {
      return NextResponse.json(
        { error: 'اسم المستخدم الجديد وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }

    if (newUsername.length < 3) {
      return NextResponse.json(
        { error: 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل' },
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

    const existingUser = await db.admin.findUnique({
      where: { username: newUsername },
    });

    if (existingUser && existingUser.id !== admin.id) {
      return NextResponse.json(
        { error: 'اسم المستخدم مستخدم بالفعل' },
        { status: 400 }
      );
    }

    await db.admin.update({
      where: { id: admin.id },
      data: { username: newUsername },
    });

    return NextResponse.json(
      { message: 'تم تغيير اسم المستخدم بنجاح' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Change username error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تغيير اسم المستخدم' },
      { status: 500 }
    );
  }
}
