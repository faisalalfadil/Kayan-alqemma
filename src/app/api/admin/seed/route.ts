import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

async function seedDatabase() {
  try {
    const blogCount = await db.blogPost.count()
    const testimonialCount = await db.testimonial.count()

    if (blogCount > 0 && testimonialCount > 0) {
      return NextResponse.json({ success: true, message: 'Already seeded' })
    }

    if (blogCount === 0) {
      await db.blogPost.createMany({
        data: [
          { title: 'كيف تختار المظلة الكهربائية المناسبة لمنزلك', slug: 'how-to-choose-awning', excerpt: 'نصائح لاختيار المظلة المثالية لمنزلك مع مراعاة المساحة والميزانية', content: 'عند التفكير في شراء مظلة كهربائية لمنزلك، هناك عدة عوامل مهمة يجب أخذها في الاعتبار لضمان الحصول على المنتج المثالي.\n\n**تحديد الغرض من الاستخدام**\nقبل البدء في البحث، حدد الغرض الرئيسي من المظلة. هل تريد حماية منطقة الجلوس الخارجية؟ أم تغطية مواقف السيارات؟\n\n**قياس المساحة بدقة**\nاحرص على قياس المساحة التي ترغب في تغطيتها بدقة.\n\n**اختيار نوع القماش**\nتتنوع أنواع الأقمشة المستخدمة في المظلات الكهربائية: المقاومة للأشعة فوق البنفسجية، المقاومة للماء، المضادة للعفن والفطريات.\n\n**مراعاة المناخ المحلي**\nفي المناخ السعودي الحار، يجب اختيار مظلة مصممة لتحمل درجات الحرارة العالية والرياح القوية.', metaDescription: 'دليل شامل لاختيار المظلة الكهربائية المناسبة', published: true, coverImage: '/uploads/services/electric-awnings.png' },
          { title: 'أحدث تصميمات المظلات لعام 2025', slug: 'latest-awning-designs-2025', excerpt: 'اكتشف أحدث الترندات في عالم المظلات الكهربائية', content: 'يشهد عالم المظلات الكهربائية تطوراً مستمراً في التصميم والتقنية.\n\n**المظلات الذكية**\nتتجه المظلات الحديثة نحو التكامل مع أنظمة المنزل الذكي.\n\n**الألوان الطبيعية**\nيعود استخدام الألوان الطبيعية والأرضية بقوة هذا العام.\n\n**المظلات المتعددة المستويات**\nتعتبر من أكثر التصاميم طلباً هذا العام.\n\n**التصاميم المنحنية**\nتحل التصاميم المنحنية محل التصاميم التقليدية.\n\n**الإضاءة المدمجة**\nتأتي العديد من المظلات الحديثة مع إضاءة LED مدمجة.', metaDescription: 'أحدث تصميمات المظلات الكهربائية لعام 2025', published: true, coverImage: '/uploads/services/garden-awnings.png' },
          { title: 'صيانة المظلات الكهربائية: دليل شامل', slug: 'awning-maintenance-guide', excerpt: 'كل ما تحتاج معرفته عن صيانة المظلات', content: 'للحفاظ على مظلتك الكهربائية في أفضل حالاتها:\n\n**الصيانة الدورية (شهرياً)**\n- تنظيف القماش بفرشاة ناعمة\n- فحص المحرك والتأكد من عمله بسلاسة\n- التحقق من سلامة الأسلاك الكهربائية\n\n**الصيانة الموسمية**\n- قبل الصيف: تأكد من جاهزية المظلة للحرارة العالية\n- قبل الشتاء: أغلق المظلة وحماها من الأمطار\n\n**تنظيف القماش**\nاستخدم ماءً فاتراً وصابوناً خفيفاً لتنظيف القماش.', metaDescription: 'دليل شامل لصيانة المظلات الكهربائية', published: true, coverImage: '/uploads/services/maintenance.png' },
          { title: 'فوائد المظلات في المناخ السعودي', slug: 'awning-benefits-saudi', excerpt: 'لماذا تحتاج مظلة في منزلك في المملكة', content: 'فوائد المظلات الكهربائية في المناخ السعودي:\n\n- تقليل درجة الحرارة بنسبة تصل إلى 15 درجة\n- توفير استهلاك الطاقة الكهربائية\n- حماية الأثاث الخارجي من الشمس\n- حماية من الأشعة فوق البنفسجية\n- زيادة المساحة الصالحة للاستخدام\n- تحسين جمالية المنزل\n- زيادة قيمة العقار', metaDescription: 'فوائد المظلات في المناخ السعودي الحار', published: true },
          { title: 'مقارنة بين أنواع المظلات المختلفة', slug: 'awning-types-comparison', excerpt: 'دليل المقارنة الشامل بين أنواع المظلات', content: 'أنواع المظلات الكهربائية:\n\n**المظلات التراجعية**: سهلة التركيب، اقتصادية\n**المظلات المعلقة**: تغطية واسعة، تصميم أنيق\n**مظلات السقف الثابت**: حماية شاملة، متانة عالية\n**المظلات المنحنية**: تصميم عصري، تصريف مياه ممتاز', metaDescription: 'مقارنة شاملة بين أنواع المظلات', published: true },
          { title: 'أفكار لتصميم حديقتك مع المظلات', slug: 'garden-design-ideas', excerpt: 'إلهام لتصميم المساحات الخارجية مع المظلات', content: 'أفكار لتصميم حديقتك:\n\n**منطقة الجلوس الرئيسية**: مظلة كبيرة مع أثاث مريح\n**ركن القراءة**: زاوية هادئة تحت مظلة صغيرة\n**منطقة تناول الطعام**: غرفة طعام خارجية مظللة\n**مطبخ خارجي**: مظلة تمنع الشمس أثناء الطهي', metaDescription: 'أفكار إبداعية لتصميم حديقتك باستخدام المظلات', published: true, coverImage: '/uploads/services/outdoor-furniture.png' },
        ],
      })

      await db.project.createMany({
        data: [
          { title: 'مظلات فيلا الرياض', description: 'تصميم وتركيب مظلات كهربائية متطورة لفيلا فاخرة', image: '/uploads/projects/riyadh-villa.png', category: 'مظلات كهربائية', clientName: 'عميل خاص', location: 'الرياض', completedAt: new Date('2024-06-15'), featured: true },
          { title: 'موقف سيارات جدة', description: 'مواقف سيارات مجهزة بمظلات مقاومة للعوامل الجوية بسعة 50 سيارة', image: '/uploads/services/car-shades.png', category: 'مظلات سيارات', clientName: 'شركة الخليج التجارية', location: 'جدة', completedAt: new Date('2024-05-20'), featured: true },
          { title: 'حديقة فندق الدمام', description: 'تصميم مظلات أنيقة لمنطقة المطعم الخارجي في فندق خمس نجوم', image: '/uploads/services/garden-awnings.png', category: 'حدائق', clientName: 'فندق الشرق الأوسط', location: 'الدمام', completedAt: new Date('2023-11-10'), featured: false },
          { title: 'مظلات مسبح الخبر', description: 'مظلات مقاومة للماء والأملاح لمسبح خاص في فيلا ساحلية', image: '/uploads/services/pool-covers.png', category: 'مسابح', clientName: 'عميل خاص', location: 'الخبر', completedAt: new Date('2023-09-05'), featured: true },
          { title: 'مجمع تجاري مكة', description: 'تجهيز مناطق المشي الخارجية في مجمع تجاري بمظلات أوتوماتيكية', image: '/uploads/projects/commercial.png', category: 'مظلات كهربائية', clientName: 'مجموعة مكة التجارية', location: 'مكة المكرمة', completedAt: new Date('2024-03-18'), featured: true },
          { title: 'منتزه المدينة المنورة', description: 'تصميم مظلات حدائق عامة بمساحة 500 متر مربع', image: '/uploads/services/garden-awnings.png', category: 'حدائق', clientName: 'أمانة المدينة المنورة', location: 'المدينة المنورة', completedAt: new Date('2023-07-22'), featured: false },
        ],
      })

      for (const faq of [
        { question: 'ما هي المظلات الكهربائية؟', answer: 'المظلات الكهربائية هي أنظمة تظليل متطورة تعمل بمحرك كهربائي يمكن التحكم فيه عن بُعد.', category: 'عام', order: 1 },
        { question: 'كم تستغرق عملية التركيب؟', answer: 'تعتمد على حجم المظلة ونوعها. بشكل عام من يوم إلى ثلاثة أيام عمل.', category: 'عام', order: 2 },
        { question: 'هل توفر خدمة الصيانة؟', answer: 'نعم، نوفر خدمة صيانة شاملة دورية وخدمة طوارئ على مدار الساعة.', category: 'خدمات', order: 3 },
        { question: 'ما هي ضماناتكم؟', answer: 'ضمان 5 سنوات على الهيكل، 3 سنوات على المحرك، سنتين على القماش.', category: 'ضمان', order: 4 },
        { question: 'هل يمكن تصميم مظلات مخصصة؟', answer: 'بالتأكيد! يمكنك اختيار الأبعاد والألوان والتصميم حسب رغبتك.', category: 'خدمات', order: 5 },
        { question: 'ما هي المناطق التي تغطونها؟', answer: 'نغطي جميع مناطق المملكة: الرياض، جدة، الدمام، مكة، المدينة وغيرها.', category: 'عام', order: 6 },
        { question: 'كيف يمكنني طلب عرض سعر؟', answer: 'تواصل عبر الهاتف 966501234567+ أو الواتساب أو نموذج التواصل على الموقع.', category: 'تواصل', order: 7 },
        { question: 'ما طرق الدفع المتاحة؟', answer: 'نوفر الدفع النقدي، التحويل البنكي، بطاقات الائتمان، وأقساط لمدة 12 شهراً.', category: 'تواصل', order: 8 },
      ]) {
        await db.fAQ.create({ data: faq })
      }
    }

    if (testimonialCount === 0) {
      await db.testimonial.createMany({
        data: [
          { name: 'أحمد محمد العتيبي', role: 'صاحب فيلا - الرياض', content: 'خدمة ممتازة وجودة عالية في المظلات الكهربائية. الفريق محترف والتنفيذ كان أسرع من المتوقع. أنصح بشركة كيان القمة بشدة.', rating: 5 },
          { name: 'سارة عبدالله القحطاني', role: 'مصممة داخلي', content: 'تعاملت مع كيان القمة في عدة مشاريع لعملائي وكانت النتائج رائعة. التصاميم عصرية والتنفيذ دقيق جداً.', rating: 5 },
          { name: 'خالد إبراهيم الدوسري', role: 'مدير فندق الشرق', content: 'جهّزنا منطقة المطعم الخارجي بمظلات من كيان القمة. الجودة ممتازة والضمان يطالمنا بالراحة.', rating: 4 },
          { name: 'فاطمة ناصر الشمري', role: 'ربة منزل - جدة', content: 'سعيدة جداً بمظلة الحديقة التي ركبوها. الآن أستطيع الجلوس في الحديقة حتى في الظهيرة بدون حر.', rating: 5 },
          { name: 'محمد سعد الحربي', role: 'مقاول بناء', content: 'أعمل مع كيان القمة كمقاول وأشهد على احترافيتهم. أسعارهم منافسة وجودة العمل عالية.', rating: 4 },
          { name: 'نورة عبدالرحمن المالكي', role: 'مالكة مجمع تجاري - الدمام', content: 'مظلات مواقف السيارات ممتازة ومتحملة للشمس. عملاؤنا راضون جداً عن التغطية الجديدة.', rating: 5 },
        ],
      })
    }

    return NextResponse.json({ success: true, message: 'Seeded successfully' })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ success: false, message: 'Seed failed' }, { status: 500 })
  }
}

export async function GET() {
  return seedDatabase()
}

export async function POST() {
  return seedDatabase()
}
