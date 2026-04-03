import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, securityQuestion, securityAnswer } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'اسم المستخدم وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' },
        { status: 400 }
      );
    }

    if (!securityQuestion || !securityAnswer) {
      return NextResponse.json(
        { error: 'السؤال الأمني والإجابة مطلوبان' },
        { status: 400 }
      );
    }

    if (securityAnswer.length < 2) {
      return NextResponse.json(
        { error: 'الإجابة الأمنية يجب أن تكون حرفين على الأقل' },
        { status: 400 }
      );
    }

    const existingAdmin = await db.admin.findFirst();
    if (existingAdmin) {
      return NextResponse.json(
        { error: 'يوجد مسؤول بالفعل. لا يمكن إنشاء أكثر من مسؤول.' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const hashedAnswer = await hashPassword(securityAnswer.toLowerCase().trim());

    await db.admin.create({
      data: {
        username,
        password: hashedPassword,
        securityQuestion,
        securityAnswer: hashedAnswer,
      },
    });

    return NextResponse.json(
      { message: 'تم إنشاء المسؤول بنجاح' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء المسؤول' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const adminCount = await db.admin.count();
    return NextResponse.json({ isSetup: adminCount === 0 });
  } catch (error) {
    console.error('Check setup error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ' },
      { status: 500 }
    );
  }
}
