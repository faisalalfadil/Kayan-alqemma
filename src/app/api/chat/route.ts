import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

// In-memory session storage
const sessions = new Map<string, { role: string; content: string }[]>()

const SYSTEM_PROMPT = `أنت مساعد ذكي لشركة "كيان القمة" وهي شركة متخصصة في المظلات الكهربائية في المملكة العربية السعودية.

معلومات الشركة:
- الاسم: شركة كيان القمة
- التخصص: توريد وتركيب وصيانة المظلات الكهربائية
- الهاتف: +966 50 123 4567
- البريد الإلكتروني: info@kayan-alaqma.sa
- ساعات العمل: السبت - الخميس من 8 صباحاً إلى 6 مساءً

خدمات الشركة:
1. المظلات الكهربائية (البرجولات) - مظلات قابلة للفتح والإغلاق كهربائياً بأنظمة تحكم متطورة
2. مظلات السيارات - حماية السيارات من الشمس والأمطار بتصاميم عصرية
3. مظلات الحدائق - تغطية مساحات خارجية للحدائق والمناطق الترفيهية
4. أغطية المسابح - حماية المسابح من الأتربة والشمس مع سهولة الفتح والإغلاق
5. الأثاث الخارجي - تأثيث المساحات الخارجية بمواد عالية الجودة تتحمل الظروف المناخية
6. الصيانة - خدمات صيانة دورية وطوارئ لجميع أنواع المظلات

قواعد المحادثة:
- أجب دائماً باللغة العربية
- كن ودوداً ومهنياً في نفس الوقت
- قدم معلومات دقيقة عن خدمات الشركة ومنتجاتها
- عند الاستفسار عن الأسعار، أخبر العميل أن الأسعار تعتمد على المساحة والمواصفات المطلوبة ووجهه للتواصل مع الشركة للحصول على عرض سعر مخصص
- عند الاستفسار عن الحجز، أخبر العميل بالتواصل عبر الهاتف أو البريد الإلكتروني أو زيارة المقر
- أخبر عن ضمان الشركة على جميع المنتجات والتركيبات
- إذا سُئلت عن شيء خارج نطاق الخدمات، اشرح ذلك بلباقة ووجه المستخدم للتواصل مع الشركة
- كن موجزاً وواضحاً في إجاباتك
- لا تذكر أنك ذكاء اصطناعي أو روبوت`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, history } = body

    if (!message) {
      return NextResponse.json(
        { error: 'الرسالة مطلوبة' },
        { status: 400 }
      )
    }

    // Build messages array for AI
    const messages: { role: string; content: string }[] = [
      { role: 'system', content: SYSTEM_PROMPT },
    ]

    // Add conversation history if provided
    if (Array.isArray(history) && history.length > 0) {
      for (const msg of history) {
        if (msg.role === 'user' || msg.role === 'assistant') {
          messages.push({ role: msg.role, content: msg.content })
        }
      }
    }

    // Add current user message
    messages.push({ role: 'user', content: message })

    // Call AI
    const zai = await ZAI.create()
    const completion = await zai.chat.completions.create({
      model: 'glm-4-flash',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    })

    const reply =
      completion.choices[0]?.message?.content ||
      'عذراً، لم أتمكن من معالجة طلبك. يرجى المحاولة مرة أخرى.'

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('خطأ في خدمة المحادثة:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء معالجة رسالتك. يرجى المحاولة مرة أخرى.' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (sessionId) {
      sessions.delete(sessionId)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('خطأ في تنظيف الجلسة:', error)
    return NextResponse.json(
      { error: 'فشل في تنظيف الجلسة' },
      { status: 500 }
    )
  }
}
