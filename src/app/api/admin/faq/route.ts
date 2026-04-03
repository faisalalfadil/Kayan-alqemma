import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all FAQs ordered by order
export async function GET() {
  try {
    const faqs = await db.fAQ.findMany({
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ success: true, data: faqs })
  } catch (error) {
    console.error('خطأ في جلب الأسئلة الشائعة:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في جلب الأسئلة الشائعة' },
      { status: 500 }
    )
  }
}

// POST create new FAQ
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { question, answer, category, order } = body

    if (!question || question.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: 'السؤال مطلوب ويجب أن يكون 3 أحرف على الأقل' },
        { status: 400 }
      )
    }

    if (!answer || answer.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: 'الإجابة مطلوبة ويجب أن تكون 5 أحرف على الأقل' },
        { status: 400 }
      )
    }

    const faq = await db.fAQ.create({
      data: {
        question: question.trim(),
        answer: answer.trim(),
        category: category?.trim() || null,
        order: typeof order === 'number' ? order : 0,
      },
    })

    return NextResponse.json({ success: true, data: faq }, { status: 201 })
  } catch (error) {
    console.error('خطأ في إنشاء السؤال:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في إنشاء السؤال' },
      { status: 500 }
    )
  }
}
