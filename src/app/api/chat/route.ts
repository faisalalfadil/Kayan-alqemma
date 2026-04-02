import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'
import { db } from '@/lib/db'

// Simple fallback responses for when AI is unavailable
const FALLBACK_RESPONSES: Record<string, string> = {
  services: 'نقدم في شركة كيان القمة مجموعة واسعة من الخدمات:\n\n1. 🏗️ المظلات الكهربائية - مظلات قابلة للفتح والإغلاق كهربائياً\n2. 🚗 مظلات السيارات - حماية سياراتك من الشمس والأمطار\n3. 🌳 مظلات الحدائق - تصميمات أنيقة لمساحاتك الخارجية\n4. 🏊 مظلات المسابح - حماية متخصصة للمسابح\n5. 🛋️ كنب الحديقة - أثاث خارجي عالي الجودة\n6. 🔧 الصيانة - خدمات صيانة دورية وطوارئ\n\nللحصول على عرض سعر مخصص، تواصل معنا عبر الهاتف أو الواتساب.',
  prices: 'أسعارنا تعتمد على عدة عوامل:\n\n• نوع الخدمة المطلوبة\n• المساحة المراد تغطيتها\n• نوع القماش والمواد\n• الإضافات الاختيارية (محرك، إضاءة LED، مستشعر مطر)\n\nننصحك باستخدام حاسبة الأسعار على موقعنا للحصول على تقدير سريع، أو تواصل معنا للحصول على عرض سعر مخصص ودقيق.\n\n📞 الهاتف: +966 50 123 4567',
  booking: 'لحجز موعد استشارة مجانية:\n\n📞 اتصل بنا: +966 50 123 4567\n📧 البريد: info@kayan-alaqma.sa\n📱 أو استخدم نموذج حجز الموعد على الموقع\n\nساعات العمل: السبت - الخميس، 8 صباحاً - 6 مساءً\n\nنقدم زيارة ميدانية مجانية لفحص الموقع وتقديم أفضل الحلول!',
  warranty: 'نقدم ضمان شامل على جميع منتجاتنا وخدماتنا:\n\n• ✅ ضمان 5 سنوات على الهيكل\n• ✅ ضمان 3 سنوات على المحرك\n• ✅ ضمان سنتين على القماش\n• ✅ خدمة صيانة دورية\n• ✅ خدمة طوارئ على مدار الساعة\n\nراحتك ورضاك هو أولويتنا!',
  contact: 'تواصل معنا عبر:\n\n📞 الهاتف: +966 50 123 4567\n📧 البريد: info@kayan-alaqma.sa\n📍 العنوان: طريق الملك فهد، حي العليا، الرياض\n🕐 ساعات العمل: السبت - الخميس 8 صباحاً - 6 مساءً\n\nيمكنك أيضاً إرسال رسالة عبر نموذج الاتصال على الموقع أو التواصل عبر الواتساب.',
  default: 'مرحباً بك في شركة كيان القمة! 😊\n\nنحن متخصصون في توريد وتركيب المظلات الكهربائية في المملكة العربية السعودية بخبرة تتجاوز 15 عاماً.\n\nكيف يمكنني مساعدتك اليوم؟ يمكنك الاستفسار عن:\n• خدماتنا المتنوعة\n• الأسعار والعروض\n• حجز موعد استشارة\n• معلومات الضمان\n\nأو تواصل معنا مباشرة:\n📞 +966 50 123 4567',
}

function getFallbackResponse(message: string): string {
  const lowerMsg = message.toLowerCase()

  if (lowerMsg.includes('خدم') || lowerMsg.includes('خدمات')) return FALLBACK_RESPONSES.services
  if (lowerMsg.includes('سعر') || lowerMsg.includes('تكلف') || lowerMsg.includes('ثمن')) return FALLBACK_RESPONSES.prices
  if (lowerMsg.includes('حجز') || lowerMsg.includes('موعد') || lowerMsg.includes('استشار')) return FALLBACK_RESPONSES.booking
  if (lowerMsg.includes('ضمان') || lowerMsg.includes('صيان')) return FALLBACK_RESPONSES.warranty
  if (lowerMsg.includes('تواصل') || lowerMsg.includes('اتصل') || lowerMsg.includes('هاتف') || lowerMsg.includes('رقم')) return FALLBACK_RESPONSES.contact

  return FALLBACK_RESPONSES.default
}

// Build system prompt with custom instructions from settings
async function buildSystemPrompt(): Promise<string> {
  let customPrompt = ''

  try {
    const settings = await db.siteSettings.findFirst()
    if (settings?.chatbotPrompt && settings.chatbotPrompt.trim()) {
      customPrompt = '\n\nتعليمات إضافية من مدير الموقع:\n' + settings.chatbotPrompt.trim()
    }
  } catch {
    // ignore - use default prompt
  }

  return `أنت مساعد ذكي لشركة "كيان القمة" وهي شركة متخصصة في المظلات الكهربائية في المملكة العربية السعودية.

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
- لا تذكر أنك ذكاء اصطناعي أو روبوت${customPrompt}`
}

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

    // Build messages array for AI - use 'assistant' role for system prompt per SDK docs
    const systemPrompt = await buildSystemPrompt()
    const messages: { role: 'user' | 'assistant'; content: string }[] = [
      { role: 'assistant', content: systemPrompt },
    ]

    // Add conversation history if provided
    if (Array.isArray(history) && history.length > 0) {
      // Keep only last 10 messages to avoid token limits
      const recentHistory = history.slice(-10)
      for (const msg of recentHistory) {
        if (msg.role === 'user' || msg.role === 'assistant') {
          messages.push({ role: msg.role as 'user' | 'assistant', content: msg.content })
        }
      }
    }

    // Add current user message
    messages.push({ role: 'user', content: message })

    // Try calling AI with fallback
    let reply: string | undefined

    try {
      const zai = await ZAI.create()
      const completion = await zai.chat.completions.create({
        model: 'google/gemma-3-27b-it:free',
        messages,
        thinking: { type: 'disabled' },
      })

      reply = completion.choices[0]?.message?.content

      if (!reply || reply.trim().length === 0) {
        reply = getFallbackResponse(message)
      }
    } catch (aiError) {
      // If AI fails, use intelligent fallback
      console.error('AI unavailable, using fallback:', aiError instanceof Error ? aiError.message : 'Unknown error')
      reply = getFallbackResponse(message)
    }

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('خطأ في خدمة المحادثة:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء معالجة رسالتك. يرجى المحاولة مرة أخرى.' },
      { status: 500 }
    )
  }
}
