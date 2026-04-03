import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/auth';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const body = await req.json();
    const { topic, tone, length } = body;

    if (!topic || !topic.trim()) {
      return NextResponse.json({ error: 'موضوع المقال مطلوب' }, { status: 400 });
    }

    const toneMap: Record<string, string> = {
      professional: 'مهني ورسمي',
      casual: 'ودي وسلس',
      educational: 'تعليمي وتوضيحي',
      marketing: 'تسويقي وجذاب',
      technical: 'تقني ومتخصص',
    };

    const lengthMap: Record<string, string> = {
      short: '300-500 كلمة',
      medium: '500-800 كلمة',
      long: '800-1200 كلمة',
    };

    const selectedTone = toneMap[tone] || 'مهني ورسمي';
    const selectedLength = lengthMap[length] || '500-800 كلمة';

    const systemPrompt = `أنت كاتب محترف لمقالات شركة كيان القمة المتخصصة في تصنيع وتركيب المظلات والسواتر الكهربائية في المملكة العربية السعودية. 
اكتب مقالات باللغة العربية الفصحى بأسلوب ${selectedTone}.
طول المقال يجب أن يكون ${selectedLength}.

القواعد:
- اكتب بلغة عربية فصحى واضحة
- استخدم عناوين فرعية لتنظيم المحتوى
- أضف فقرات قصيرة وسهلة القراءة
- ركّز على الفوائد والمميزات
- استخدم كلمات مفتاحية مناسبة لتحسين محركات البحث (SEO)
- أضف خاتمة تلخص النقاط الرئيسية`;

    const userPrompt = `اكتب مقالاً عن: ${topic.trim()}

المطلوب:
1. عنوان جذاب للمقال
2. مقدمّة مشوّقة (2-3 جمل)
3. محتوى رئيسي منظم بعناوين فرعية
4. خاتمة ملخّصة
5. ملخص قصير (excerpt) لا يتجاوز 150 حرف

ردّ بالتنسيق التالي بالضبط:
---
العنوان: [عنوان المقال هنا]
---
الملخص: [ملخص قصير هنا]
---
[محتوى المقال الكامل هنا]`;

    const zai = await ZAI.create();

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      thinking: { type: 'disabled' },
    });

    const raw = completion.choices[0]?.message?.content;

    if (!raw) {
      return NextResponse.json({ error: 'لم يتم توليد المحتوى. حاول مرة أخرى.' }, { status: 500 });
    }

    // Parse the AI response
    let title = topic.trim();
    let excerpt = '';
    let content = raw;

    // Extract title
    const titleMatch = raw.match(/---\s*العنوان:\s*(.+?)\s*---/);
    if (titleMatch) {
      title = titleMatch[1].trim();
    }

    // Extract excerpt
    const excerptMatch = raw.match(/---\s*الملخص:\s*(.+?)\s*---/s);
    if (excerptMatch) {
      excerpt = excerptMatch[1].trim();
    }

    // Extract content (everything after the second ---)
    const parts = raw.split('---');
    if (parts.length >= 3) {
      content = parts.slice(2).join('---').trim();
    } else if (parts.length === 2) {
      content = parts[1].trim();
    }

    return NextResponse.json({
      title,
      content,
      excerpt: excerpt || content.substring(0, 150).trim(),
    });
  } catch (error) {
    console.error('AI generation error:', error);
    return NextResponse.json({ error: 'حدث خطأ في توليد المقال. حاول مرة أخرى.' }, { status: 500 });
  }
}
