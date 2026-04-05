import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Simple fallback responses for when AI is unavailable
const FALLBACK_RESPONSES: Record<string, string> = {
  services: 'نقدم في شركة كيان القمة مجموعة واسعة من الخدمات:\n\n🏗️ **المظلات الكهربائية (البرجولات)**\nمظلات قابلة للفتح والإغلاق كهربائياً بأنظمة تحكم متطورة\n\n🚗 **مظلات السيارات**\nحماية سياراتك من الشمس والأمطار بتصاميم عصرية\n\n🌳 **مظلات الحدائق**\nتغطية مساحات خارجية للحدائق والمناطق الترفيهية\n\n🏊 **أغطية المسابح**\nحماية المسابح من الأتربة والشمس مع سهولة الفتح والإغلاق\n\n🛋️ **الأثاث الخارجي**\nتأثيث المساحات الخارجية بمواد عالية الجودة\n\n🔧 **الصيانة**\nخدمات صيانة دورية وطوارئ لجميع أنواع المظلات\n\nللحصول على عرض سعر مخصص، تواصل معنا:\n📞 +966 50 123 4567',
  prices: 'أسعارنا تعتمد على عدة عوامل:\n\n💰 **العوامل المؤثرة في السعر:**\n• نوع الخدمة المطلوبة\n• المساحة المراد تغطيتها\n• نوع القماش والمواد المستخدمة\n• الإضافات الاختيارية (محرك كهربائي، إضاءة LED، مستشعر مطر)\n• موقع التركيب\n\n✨ **للحصول على عرض سعر دقيق:**\nننصحك باستخدام حاسبة الأسعار على موقعنا للحصول على تقدير سريع، أو تواصل معنا مباشرة للحصول على عرض سعر مخصص ودقيق.\n\n📞 الهاتف: +966 50 123 4567\n📧 البريد: info@kayan-alaqma.sa',
  booking: '📅 **لحجز موعد استشارة مجانية:**\n\n📞 **اتصل بنا:** +966 50 123 4567\n📧 **البريد:** info@kayan-alaqma.sa\n📱 **أو استخدم نموذج حجز الموعد على الموقع**\n\n🕐 **ساعات العمل:**\nالسبت - الخميس، 8 صباحاً - 6 مساءً\n\n✅ **نقدم:**\n• زيارة ميدانية مجانية\n• فحص الموقع وتقييم احتياجاتك\n• تقديم أفضل الحلول المناسبة\n• عرض سعر تفصيلي',
  warranty: '✅ **ضمان شامل على جميع منتجاتنا:**\n\n🔹 ضمان 5 سنوات على الهيكل المعدني\n🔹 ضمان 3 سنوات على المحرك الكهربائي\n🔹 ضمان سنتين على القماش والأقمشة\n🔹 خدمة صيانة دورية مجانية للسنة الأولى\n🔹 خدمة طوارئ على مدار الساعة\n\n💯 **التزامنا:**\nراحتك ورضاك هو أولويتنا! نستخدم أفضل المواد ونقدم خدمة ما بعد البيع المتميزة.\n\n📞 للاستفسار: +966 50 123 4567',
  contact: '📞 **تواصل معنا:**\n\n☎️ **الهاتف:** +966 50 123 4567\n📧 **البريد:** info@kayan-alaqma.sa\n📍 **العنوان:** طريق الملك فهد، حي العليا، الرياض\n🕐 **ساعات العمل:** السبت - الخميس 8 صباحاً - 6 مساءً\n\n💬 **طرق التواصل:**\n• إرسال رسالة عبر نموذج الاتصال على الموقع\n• التواصل عبر الواتساب\n• زيارة مقرنا الرئيسي\n\nنحن في خدمتك دائماً! 😊',
  default: 'مرحباً بك في شركة كيان القمة! 😊\n\nنحن متخصصون في توريد وتركيب المظلات الكهربائية في المملكة العربية السعودية بخبرة تتجاوز 15 عاماً.\n\n**كيف يمكنني مساعدتك اليوم؟**\n\nيمكنك الاستفسار عن:\n• 🏗️ خدماتنا المتنوعة\n• 💰 الأسعار والعروض\n• 📅 حجز موعد استشارة مجانية\n• ✅ معلومات الضمان\n• 📞 طرق التواصل\n\n**أو تواصل معنا مباشرة:**\n📞 +966 50 123 4567\n📧 info@kayan-alaqma.sa',
}

function getFallbackResponse(message: string): string {
  const msg = message.trim()

  // Price keywords (check first as it's more specific)
  if (/سعر|أسعار|تكلف|ثمن|تكاليف|قيمة/.test(msg)) {
    return FALLBACK_RESPONSES.prices
  }

  // Services keywords
  if (/خدم|خدمات|تقدم|تقدمون|منتج|عروض|مظلات|برجول/.test(msg)) {
    return FALLBACK_RESPONSES.services
  }

  // Booking keywords
  if (/حجز|موعد|استشار|زيارة|أحجز/.test(msg)) {
    return FALLBACK_RESPONSES.booking
  }

  // Warranty keywords
  if (/ضمان|صيان|كفال|جودة/.test(msg)) {
    return FALLBACK_RESPONSES.warranty
  }

  // Contact keywords
  if (/تواصل|اتصل|هاتف|رقم|عنوان|موقع|بريد|واتس/.test(msg)) {
    return FALLBACK_RESPONSES.contact
  }

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

    // Build messages array for AI
    const systemPrompt = await buildSystemPrompt()
    const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: systemPrompt },
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
      // Using smart fallback responses
      // The current free AI models don't work well with Arabic
      // To enable AI: add credits to OpenRouter account or use a better model
      reply = getFallbackResponse(message)
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
