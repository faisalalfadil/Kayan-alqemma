import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, verifyPassword } from '@/lib/auth';

// Step 1: Get security question for username
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { error: 'اسم المستخدم مطلوب' },
        { status: 400 }
      );
    }

    const admin = await db.admin.findUnique({
      where: { username },
      select: { securityQuestion: true, username: true },
    });

    if (!admin) {
      return NextResponse.json(
        { error: 'اسم المستخدم غير موجود' },
        { status: 404 }
      );
    }

    if (!admin.securityQuestion) {
      return NextResponse.json(
        { error: 'لم يتم تعيين سؤال أمني لهذا الحساب' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      question: admin.securityQuestion,
      username: admin.username,
    });
  } catch (error) {
    console.error('Get security question error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ' },
      { status: 500 }
    );
  }
}

// Step 2: Verify answer and reset password
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, securityAnswer, newPassword, confirmPassword } = body;

    if (!username || !securityAnswer || !newPassword) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'كلمات المرور غير متطابقة' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل' },
        { status: 400 }
      );
    }

    const admin = await db.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return NextResponse.json(
        { error: 'اسم المستخدم غير موجود' },
        { status: 404 }
      );
    }

    if (!admin.securityAnswer) {
      return NextResponse.json(
        { error: 'لم يتم تعيين سؤال أمني لهذا الحساب' },
        { status: 400 }
      );
    }

    const isAnswerCorrect = await verifyPassword(
      securityAnswer.toLowerCase().trim(),
      admin.securityAnswer
    );

    if (!isAnswerCorrect) {
      return NextResponse.json(
        { error: 'الإجابة الأمنية غير صحيحة' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(newPassword);

    await db.admin.update({
      where: { id: admin.id },
      data: {
        password: hashedPassword,
        sessionToken: null,
      },
    });

    return NextResponse.json(
      { message: 'تم تغيير كلمة المرور بنجاح' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إعادة تعيين كلمة المرور' },
      { status: 500 }
    );
  }
}
