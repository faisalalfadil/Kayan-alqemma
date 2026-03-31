'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Sun,
  Car,
  Trees,
  Waves,
  Sofa,
  Wrench,
  ArrowLeft,
  Phone,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Star,
  Users,
  X,
  ChevronLeft,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Services Data with Full Details                                    */
/* ------------------------------------------------------------------ */

interface ServiceDetail {
  icon: React.ElementType;
  title: string;
  shortDescription: string;
  gradient: string;
  heroGradient: string;
  fullDescription: string;
  features: string[];
  process: { step: string; title: string; description: string }[];
  benefits: string[];
  faqs: { question: string; answer: string }[];
  stats: { value: string; label: string }[];
}

const servicesData: ServiceDetail[] = [
  {
    icon: Sun,
    title: 'المظلات الكهربائية',
    shortDescription:
      'توريد وتركيب جميع أنواع المظلات الكهربائية بأحدث التقنيات والمواد عالية الجودة لتناسب جميع الاحتياجات.',
    gradient: 'from-[#1a56db] to-[#3b82f6]',
    heroGradient: 'from-[#1a56db] via-[#2563eb] to-[#3b82f6]',
    fullDescription:
      'نقدم في شركة كيان القمة أفضل أنواع المظلات الكهربائية بأحدث التقنيات العالمية. تشمل خدماتنا تصميم وتوريد وتركيب المظلات الكهربائية للمنازل والفنادق والمطاعم والمنشآت التجارية والصناعية. نستخدم أجود أنواع الأقمشة المقاومة للأشعة فوق البنفسجية والماء، مع هياكل ألمنيوم مقواة تتحمل الرياح القوية ودرجات الحرارة العالية في المناخ السعودي.',
    features: [
      'مظلات تراجعية أفقية بأنماط متعددة',
      'مظلات عمودية معلقة بتشطيبات أنيقة',
      'مظلات منحنية بتصميم عصري',
      'مظلات برجولات ثابتة ومتحركة',
      'أنظمة تحكم عن بُعد عبر ريموت أو تطبيق هاتف',
      'حساسات طقس ذكية للفتح والإغلاق التلقائي',
      'إضاءة LED مدمجة في هيكل المظلة',
      'تشكيلة ألوان تضم أكثر من 50 لوناً',
    ],
    process: [
      {
        step: '01',
        title: 'الاستشارة والتصميم',
        description:
          'نبدأ بزيارة ميدانية مجانية لفحص الموقع، ثم نقدم تصميماً ثلاثي الأبعاد يوضح شكل المظلة النهائي مع اختيارات الألوان والمواد.',
      },
      {
        step: '02',
        title: 'تصنيع الهيكل',
        description:
          'يتم تصنيع هيكل الألمنيوم في ورشاتنا المتخصصة وفق المواصفات العالمية، مع إخضاعه لاختبارات الجودة الدقيقة.',
      },
      {
        step: '03',
        title: 'تركيب المظلة',
        description:
          'يقوم فريق الفنيين المتخصصين بتركيب المظلة في موقعك بدقة عالية، مع الالتزام بأعلى معايير السلامة والجودة.',
      },
      {
        step: '04',
        title: 'التشغيل والتسليم',
        description:
          'نقوم بتشغيل النظام واختباره بالكامل أمامك، ثم نقدم لك شرحاً مفصلاً عن طريقة الاستخدام والصيانة، مع تسليمك شهادة الضمان.',
      },
    ],
    benefits: [
      'حماية من أشعة الشمس بنسبة تصل إلى 98%',
      'تقليل درجة حرارة المكان حتى 15 درجة مئوية',
      'توفير استهلاك الطاقة الكهربائية',
      'إطالة عمر الأثاث الخارجي',
      'زيادة القيمة الجمالية والعقارية للمنزل',
      'تشغيل هادئ وسلس بدون ضوضاء',
      'عمر افتراضي يتجاوز 15 عاماً',
    ],
    faqs: [
      {
        question: 'ما هي أنواع التحكم المتاحة للمظلات الكهربائية؟',
        answer:
          'نوفر عدة خيارات: ريموت كنترول عادي، ريموت ذكي مع شاشة، تحكم عبر تطبيق الهاتف (متوافق مع أنظمة المنزل الذكي)، وحساسات طقس تعمل تلقائياً.',
      },
      {
        question: 'هل يمكن تركيب المظلة على واجهة الحائط الموجودة؟',
        answer:
          'نعم، يمكن تركيب المظلات على معظم أنواع الواجهات بما فيها الخرسانة والجبس والألمنيوم. فريقنا سيقوم بتقييم واجهة الحائط أثناء الزيارة الميدانية المجانية.',
      },
      {
        question: 'كم يستغرق تركيب المظلة الكهربائية؟',
        answer:
          'عادةً يستغرق التركيب من يوم إلى 3 أيام عمل حسب حجم وتعقيد المشروع. المظلات القياسية تركب في يوم واحد.',
      },
    ],
    stats: [
      { value: '+200', label: 'مشروع منجز' },
      { value: '15+', label: 'سنة ضمان' },
      { value: '98%', label: 'رضا العملاء' },
      { value: '3 أيام', label: 'أقصى مدة تركيب' },
    ],
  },
  {
    icon: Car,
    title: 'مظلات السيارات',
    shortDescription:
      'حلول حماية سياراتك من الشمس والأمطار بتصاميم عصرية ومتينة تضمن حماية مثالية على مدار السنة.',
    gradient: 'from-[#ea580c] to-[#f97316]',
    heroGradient: 'from-[#ea580c] via-[#f97316] to-[#fb923c]',
    fullDescription:
      'نوفر حلولاً متكاملة لحماية سياراتك من حرارة الشمس الحارقة والأمطار والغبار باستخدام مظلات سيارات مصممة خصيصاً للمناخ السعودي. تشمل خدماتنا تصميم وتركيب مظلات لمواقف السيارات المنزلية والتجارية بتصاميم حديثة ومتينة تضمن حماية فائقة لسيارتك.',
    features: [
      'مظلات فردية للمنازل بتصاميم أنيقة',
      'مظلات مزدوجة ومتعددة للمواقف التجارية',
      'هياكل ألمنيوم مقاومة للرياح والصدأ',
      'أقمشة PVC مقاومة للأشعة فوق البنفسجية بمعامل حماية UPF 50+',
      'تصاميم مفتوحة ومغلقة قابلة للتحويل',
      'نظام تصريف مياه الأمطار المدمج',
      'إمكانية إضافة إضاءة ليلية',
      'تشكيلة واسعة من الألوان والتشطيبات',
    ],
    process: [
      {
        step: '01',
        title: 'مسح الموقع',
        description:
          'نقوم بقياس مساحة موقف السيارات بدقة وتقييم التربة والبنية التحتية لضمان التثبيت الأمثل.',
      },
      {
        step: '02',
        title: 'التصميم والعرض',
        description:
          'نقدم تصميماً مفصلاً مع عرض سعر شامل يتضمن التوريد والتركيب والضمان، مع إمكانية التعديل حسب رغبتك.',
      },
      {
        step: '03',
        title: 'التنفيذ والتركيب',
        description:
          'فريقنا المتخصص يقوم بتنفيذ المشروع بجودة عالية مع الالتزام بالجدول الزمني المتفق عليه.',
      },
      {
        step: '04',
        title: 'الفحص والتسليم',
        description:
          'إجراء فحص شامل للسلامة والجودة، ثم تسليم المشروع مع شهادة الضمان ودليل الاستخدام.',
      },
    ],
    benefits: [
      'حماية السيارة من أشعة الشمس المباشرة',
      'تقليل درجة حرارة داخل السيارة بشكل كبير',
      'حماية الطلاء من التشقق والتلاشي',
      'منع تضرر لوحة القيادة والمقاعد الجلدية',
      'زيادة عمر بطارية التكييف',
      'حماية من الأمطار والأملاح والغبار',
      'رفع قيمة العقار',
    ],
    faqs: [
      {
        question: 'هل المظلة تتحمل رياح السعودية القوية؟',
        answer:
          'نعم، مظلاتنا مصممة لتحمل رياح تصل إلى 120 كم/ساعة. نستخدم هياكل ألمنيوم سميك مع أنظمة تثبيت متطورة تضمن ثبات المظلة في أسوأ الظروف الجوية.',
      },
      {
        question: 'هل يمكنني تركيب مظلة لسيارتين أو أكثر؟',
        answer:
          'بالتأكيد! نقدم حلولاً لمواقف متعددة السيارات، من المظلة المزدوجة إلى مواقف تجارية تتسع لعشرات السيارات.',
      },
      {
        question: 'ما الفرق بين المظلة المفتوحة والمغلقة؟',
        answer:
          'المظلة المفتوحة توفر تظليلاً وحماية من الشمس مع تهوية طبيعية. المظلة المغلقة توفر حماية شاملة من الشمس والأمطار والغبار، وتتضمن أنظمة تصريف مياه مدمجة.',
      },
    ],
    stats: [
      { value: '+350', label: 'موقف منجز' },
      { value: '120 كم/س', label: 'تحمل الرياح' },
      { value: 'UPF 50+', label: 'حماية من الشمس' },
      { value: '10+', label: 'سنة ضمان' },
    ],
  },
  {
    icon: Trees,
    title: 'مظلات الحدائق',
    shortDescription:
      'تصميم مظلات أنيقة وعملية لحدائقك ومساحاتك الخارجية تجمع بين الجمال والراحة والمتانة.',
    gradient: 'from-[#059669] to-[#34d399]',
    heroGradient: 'from-[#059669] via-[#10b981] to-[#34d399]',
    fullDescription:
      'نحوّل حديقتك إلى واحة خضراء مريحة وجميلة مع مظلات حدائق مصممة بعناية تجمع بين الجمال والوظيفة. نقدم حلولاً مبتكرة لتظليل مناطق الجلوس والمطاعم الخارجية والممرات في الحدائق المنزلية والتجارية والمنتزهات العامة، مع الحفاظ على المظهر الجمالي الطبيعي للحديقة.',
    features: [
      'مظلات برجولات خشبية ومعدنية بأنماط متنوعة',
      'مظلات قماشية منسوجة بتصاميم أنيقة',
      'مظلات ثابتة ومتحركة حسب الحاجة',
      'أنظمة إضاءة وتهوية متكاملة',
      'نباتات متسلقة مدعمة على هياكل المظلات',
      'تصاميم مخصصة تناسب مساحتك وتصميم حديقتك',
      'مواد مقاومة للرطوبة والعفن',
      'ألوان طبيعية تتناغم مع البيئة المحيطة',
    ],
    process: [
      {
        step: '01',
        title: 'دراسة المساحة',
        description:
          'نقوم بدراسة شاملة لمساحة الحديقة والتضاريس والنباتات الموجودة لاقتراح أفضل حلول التظليل.',
      },
      {
        step: '02',
        title: 'التصميم المعماري',
        description:
          'نقدم تصميماً يتناغم مع أسلوب حديقتك ويحافظ على جمالها الطبيعي مع إضافة لمسة عصرية.',
      },
      {
        step: '03',
        title: 'التنفيذ الدقيق',
        description:
          'يقوم فريقنا بتنفيذ العمل بعناية فائقة دون الإضرار بالنباتات والعناصر الموجودة في الحديقة.',
      },
      {
        step: '04',
        title: 'الديكور والتشطيب',
        description:
          'نضيف لمسات ديكورية نهائية تشمل الإضاءة والنباتات المتسلقة والقطع الفنية لتحقيق أقصى جمال.',
      },
    ],
    benefits: [
      'تحويل الحديقة لمساحة صالحة للاستخدام طوال اليوم',
      'حماية النباتات الحساسة من الشمس الحارقة',
      'خلق مناطق جلوس مريحة ومنعشة',
      'إضافة قيمة جمالية وعقارية للحديقة',
      'حماية الأثاث الخارجي من العوامل الجوية',
      'توفير بيئة مثالية للتجمعات العائلية',
      'تصاميم قابلة للتوسيع والتعديل مستقبلاً',
    ],
    faqs: [
      {
        question: 'هل يمكن دمج المظلة مع النباتات الموجودة؟',
        answer:
          'بالتأكيد! هذا من أبرز مزايانا. نصمم المظلات بحيث تتناغم مع النباتات الموجودة، بل ويمكننا دمج النباتات المتسلقة كعنصر ديكوري في هيكل المظلة.',
      },
      {
        question: 'هل تتحمل مظلات الحدائق الرياح والأمطار؟',
        answer:
          'نعم، نستخدم مواد مقاومة للعوامل الجوية مصممة خصيصاً للاستخدام الخارجي الدائم. الهياكل من الألمنيوم أو الخشب المعالج، والأقمشة مقاومة للماء والرطوبة.',
      },
      {
        question: 'هل يمكن تغيير تصميم المظلة لاحقاً؟',
        answer:
          'نعم، نوفر أنظمة مرنة تسمح بالتوسيع أو التعديل أو حتى تغيير التصميم بالكامل في المستقبل حسب احتياجاتك المتغيرة.',
      },
    ],
    stats: [
      { value: '+120', label: 'حديقة مزودة' },
      { value: '50+', label: 'تصميم مختلف' },
      { value: '100%', label: 'مواد طبيعية' },
      { value: '5+', label: 'سنوات ضمان' },
    ],
  },
  {
    icon: Waves,
    title: 'مظلات المسابح',
    shortDescription:
      'مظلات مقاومة للماء والمواد الكيميائية، مثالية لحماية مسابحك مع الحفاظ على المظهر الجمالي.',
    gradient: 'from-[#0891b2] to-[#22d3ee]',
    heroGradient: 'from-[#0891b2] via-[#06b6d4] to-[#22d3ee]',
    fullDescription:
      'نوفر حلولاً متخصصة لتظليل المسابح بتصاميم عصرية تحمي من الشمس وتحافظ على نظافة المسبح ومياهه. مظلاتنا مصممة خصيصاً لتحمل الرطوبة العالية وملح الماء والأبخرة الكيميائية، مع أنظمة تهوية ذكية تمنع تراكم الحرارة تحت المظلة.',
    features: [
      'مظلات تراجعية للمسابح بأبعاد مخصصة',
      'مظلات ثابتة بتصاميم برجولات أنيقة',
      'هياكل من الألمنيوم البحري المقاوم للصدأ',
      'أقمشة مخصصة مقاومة للرطوبة والأبخرة الكيميائية',
      'أنظمة تهوية طبيعية مدمجة',
      'حساسات رياح للأمان التلقائي',
      'إمكانية التحكم بمستوى الظل المطلوب',
      'تصاميم تناسب المسابح الخاصة والعامة',
    ],
    process: [
      {
        step: '01',
        title: 'تقييم المسبح',
        description:
          'نقوم بقياس أبعاد المسبح وتقييم الموقع المحيط لتحديد أفضل نوع وحجم المظلة المناسبة.',
      },
      {
        step: '02',
        title: 'التصميم الهندسي',
        description:
          'نصمم المظلة مع مراعاة عوامل الأمان والمسافات والتهوية لضمان أفضل تجربة استخدام.',
      },
      {
        step: '03',
        title: 'التركيب الاحترافي',
        description:
          'فريقنا يركب المظلة بعناية مع التأكد من جميع تدابير السلامة خاصة بجانب الماء.',
      },
      {
        step: '04',
        title: 'اختبار الأمان',
        description:
          'نختبر جميع أنظمة الأمان والحساسات ونتأكد من عملها بشكل مثالي قبل التسليم.',
      },
    ],
    benefits: [
      'حماية السباحين من أشعة الشمس الحارقة',
      'الحفاظ على درجة حرارة الماء المثالية',
      'تقليل تبخر الماء بنسبة كبيرة',
      'الحفاظ على نظافة المسبح من الأوراق والحشرات',
      'تمديد موسم السباحة طوال العام',
      'توفير منطقة مظللة للاسترخاء بجانب المسبح',
      'رفع مستوى الخصوصية',
    ],
    faqs: [
      {
        question: 'هل المظلة تتحمل الأبخرة والملوحة من المسبح؟',
        answer:
          'بالتأكيد! نستخدم هياكل ألمنيوم بحري وأقمشة مخصصة مقاومة للملوحة والأبخرة الكيميائية. هذه المواد مصممة خصيصاً لبيئات المسابح وتتحمل الرطوبة العالية.',
      },
      {
        question: 'هل يمكن فتح وإغلاق المظلة بسهولة؟',
        answer:
          'نعم، مظلاتنا الكهربائية تعمل بنظام سلس وهادئ. يمكن التحكم بها عبر ريموت كنترول أو تطبيق الهاتف، كما أن حساسات الرياح تؤمن إغلاقها تلقائياً عند الحاجة.',
      },
      {
        question: 'هل تؤثر المظلة على تهوية منطقة المسبح؟',
        answer:
          'لا، تصميمنا يتضمن أنظمة تهوية ذكية تضمن تدفق الهواء الطبيعي تحت المظلة، مما يمنع تراكم الحرارة والرطوبة ويحافظ على بيئة مريحة.',
      },
    ],
    stats: [
      { value: '+80', label: 'مسبح مظلل' },
      { value: 'IP65', label: 'مقاومة الماء' },
      { value: '100 كم/س', label: 'تحمل الرياح' },
      { value: '10+', label: 'سنوات ضمان' },
    ],
  },
  {
    icon: Sofa,
    title: 'كنب الحديقة',
    shortDescription:
      'تشكيلة واسعة من الكنب والمراتب الخارجية المصممة خصيصًا لتحمل ظروف الطقس المختلفة.',
    gradient: 'from-[#7c3aed] to-[#a78bfa]',
    heroGradient: 'from-[#7c3aed] via-[#8b5cf6] to-[#a78bfa]',
    fullDescription:
      'نقدم تشكيلة واسعة ومتميزة من كنب الحديقة والمراتب والطاولات الخارجية المصممة لتحمل الظروف المناخية الصعبة. تشمل مجموعتنا تصميمات عصرية وكلاسيكية بمختلف الأحجام والألوان لتتناسب مع ذوقك ومساحتك، مصنوعة من أجود المواد المقاومة للشمس والماء.',
    features: [
      'طقم كنب كامل (أريكة + كراسي + طاولة قهوة)',
      'مراتب استرخاء بمقاسات مختلفة',
      'طاولات طعام خارجية بأحجام متعددة',
      'كنب موديولار قابل لإعادة الترتيب',
      'أرجوحة وأسرّة شمسية',
      'وسائد ومخدات خارجية بأقمشة مقاومة',
      'مواد: ألمنيوم، حبل PE، خشب تيك معالج',
      'أقمشة Olefin و Sunbrella المقاومة',
    ],
    process: [
      {
        step: '01',
        title: 'استشارة المساحة',
        description:
          'نساعدك في اختيار الأثاث المناسب لحجم مساحتك الخارجية وأسلوبك المعماري.',
      },
      {
        step: '02',
        title: 'اختيار التصميم',
        description:
          'نعرض لك تشكيلتنا الواسعة في كتالوج متعدد التصاميم مع إمكانية التخصيص حسب رغبتك.',
      },
      {
        step: '03',
        title: 'التوصيل والتركيب',
        description:
          'نوصل الأثاث إلى موقعك ونقوم بتركيبه وترتيبه بشكل احترافي في المساحة المحددة.',
      },
      {
        step: '04',
        title: 'الدعم المستمر',
        description:
          'نقدم نصائح العناية بالأثاث الخارجي وضمان شامل مع خدمة صيانة متاحة عند الحاجة.',
      },
    ],
    benefits: [
      'متانة عالية تتحمل الشمس والمطر والرطوبة',
      'أقمشة مقاومة للبهتان والانزلاق',
      'تصاميم مريحة وعملية للاستخدام اليومي',
      'سهولة التنظيف والصيانة',
      'تشكيلة واسعة تناسب جميع الأذواق',
      'أوزان ثابتة تتحمل الرياح',
      'قيمة ممتازة مقابل السعر',
    ],
    faqs: [
      {
        question: 'هل الأثاث يتحمل الشمس السعودية الحارقة؟',
        answer:
          'نعم! نستخدم أقمشة Sunbrella و Olefin المقاومة لأشعة الشمس والبهتان، مع هياكل ألمنيوم لا تصدأ أو تتأثر بالحرارة العالية.',
      },
      {
        question: 'كيف أنظف الكنب الخارجي؟',
        answer:
          'التنظيف سهل جداً: يمسح بقطعة قماش مبللة وصابون خفيف. الأقمشة المقاومة لا تمتص البقع ويمكن تنظيفها بسهولة.',
      },
      {
        question: 'هل يمكنني طلب تصميم مخصص للكنب؟',
        answer:
          'نعم، نوفر خدمة تخصيص كاملة تشمل اختيار الأبعاد والألوان والأقمشة والتشطيبات حسب رغبتك.',
      },
    ],
    stats: [
      { value: '+1000', label: 'قطعة أثاث' },
      { value: '200+', label: 'تصميم متوفر' },
      { value: '5+', label: 'سنوات ضمان' },
      { value: '98%', label: 'رضا العملاء' },
    ],
  },
  {
    icon: Wrench,
    title: 'صيانة وإصلاح',
    shortDescription:
      'خدمة صيانة دورية وإصلاح المظلات بفريق فني متخصص يضمن أطول عمر ممكن لمظلاتك.',
    gradient: 'from-[#dc2626] to-[#f87171]',
    heroGradient: 'from-[#dc2626] via-[#ef4444] to-[#f87171]',
    fullDescription:
      'نوفر خدمة صيانة شاملة ومتخصصة لجميع أنواع المظلات الكهربائية. فريقنا الفني المتكون من مهندسين وفنيين ذوي خبرة عالية يقدم خدمات صيانة وقائية دورية وإصلاح طارئ لضمان عمل مظلاتك بكفاءة عالية على مدار السنة.',
    features: [
      'صيانة وقائية دورية (كل 6 أشهر)',
      'إصلاح طوارئ على مدار الساعة',
      'صيانة المحركات والأنظمة الكهربائية',
      'تنظيف ومعالجة القماش',
      'إصلاح واستبدال الأجزاء الميكانيكية',
      'تشحيم وصيانة الأجزاء المتحركة',
      'فحص واختبار أنظمة الأمان',
      'خدمة إعادة طلاء الهياكل',
    ],
    process: [
      {
        step: '01',
        title: 'طلب الخدمة',
        description:
          'تواصل معنا عبر الهاتف أو الواتساب أو نموذج الموقع لطلب خدمة الصيانة.',
      },
      {
        step: '02',
        title: 'التشخيص الميداني',
        description:
          'يرسل فريقنا الفني لفحص المظلة وتشخيص المشكلة وتقديم تقرير مفصل بالحالة.',
      },
      {
        step: '03',
        title: 'الإصلاح أو الصيانة',
        description:
          'يقوم الفنيون بتنفيذ الإصلاحات أو الصيانة المطلوبة باستخدام قطع غيار أصلية وأدوات متخصصة.',
      },
      {
        step: '04',
        title: 'الاختبار والتسليم',
        description:
          'نختبر المظلة بالكامل ونتأكد من عمل جميع الأنظمة بشكل سليم قبل التسليم.',
      },
    ],
    benefits: [
      'إطالة عمر المظلة الافتراضي بشكل كبير',
      'تقليل تكاليف الإصلاح الكبيرة بالصيانة المبكرة',
      'ضمان عمل المظلة بكفاءة على مدار السنة',
      'استجابة سريعة لطلبات الطوارئ',
      'فنيون معتمدون وذوو خبرة عالية',
      'قطع غيار أصلية مضمونة',
      'أسعار صيانة تنافسية وشفافة',
    ],
    faqs: [
      {
        question: 'ما هي تكلفة الصيانة الدورية؟',
        answer:
          'تعتمد التكلفة على نوع وحجم المظلة. نقدم عدة باقات صيانة تناسب مختلف الميزانيات، مع خصومات خاصة للعملاء الحاصلين على عقود صيانة سنوية. تواصل معنا للحصول على عرض سعر مفصل.',
      },
      {
        question: 'كم تستغرق خدمة الصيانة الدورية؟',
        answer:
          'عادةً تستغرق من ساعة إلى 3 ساعات حسب نوع وحجم المظلة وحالتها. الصيانة الدورية الروتينية تكون أسرع من الإصلاحات الكبيرة.',
      },
      {
        question: 'هل تقدمون خدمة طوارئ؟',
        answer:
          'نعم! نوفر خدمة طوارئ على مدار الساعة. في حال تعرضت المظلة لعطل مفاجئ بسبب عوامل جوية أو أي سبب آخر، اتصل بنا وسنرسل فريق الصيانة في أقرب وقت ممكن.',
      },
    ],
    stats: [
      { value: '24/7', label: 'خدمة طوارئ' },
      { value: '+500', label: 'صيانة سنوية' },
      { value: '1-3 ساعات', label: 'وقت الصيانة' },
      { value: '100%', label: 'قطع أصلية' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Animation Variants                                                 */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

/* ------------------------------------------------------------------ */
/*  Service Detail Dialog                                              */
/* ------------------------------------------------------------------ */

function ServiceDetailDialog({
  service,
  open,
  onOpenChange,
}: {
  service: ServiceDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const Icon = service.icon;

  const scrollToSection = (id: string) => {
    onOpenChange(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-2xl">
        {/* Hero Banner */}
        <div
          className={`relative bg-gradient-to-br ${service.heroGradient} p-8 md:p-12`}
        >
          {/* Decorative circles */}
          <div className="absolute top-4 left-4 w-32 h-32 bg-white/10 rounded-full blur-xl" />
          <div className="absolute bottom-4 right-4 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
          {/* Dot pattern */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative z-10">
            <DialogHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl md:text-3xl font-bold text-white">
                    {service.title}
                  </DialogTitle>
                  <DialogDescription className="text-white/80 text-base mt-1">
                    خدمة احترافية من شركة كيان القمة
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Stats Bar */}
          <div className="relative z-10 mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            {service.stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 text-center border border-white/20"
              >
                <div className="text-xl md:text-2xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-white/70 text-xs md:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-10 space-y-10">
          {/* Description */}
          <div>
            <h3 className="text-lg font-bold text-[#0f172a] mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-[#ea580c]" />
              نبذة عن الخدمة
            </h3>
            <p className="text-[#475569] leading-[1.9] text-base">
              {service.fullDescription}
            </p>
          </div>

          <Separator className="bg-gray-100" />

          {/* Features Grid */}
          <div>
            <h3 className="text-lg font-bold text-[#0f172a] mb-5 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#1a56db]" />
              ما يتضمن
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {service.features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-[#f8fafc] rounded-xl p-4 border border-gray-50"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#059669] mt-0.5 shrink-0" />
                  <span className="text-sm text-[#334155] leading-relaxed">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-gray-100" />

          {/* Process Steps */}
          <div>
            <h3 className="text-lg font-bold text-[#0f172a] mb-5 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#ea580c]" />
              مراحل العمل
            </h3>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute right-[23px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-[#1a56db] via-[#ea580c] to-gray-200 hidden sm:block" />

              <div className="space-y-6">
                {service.process.map((step, i) => (
                  <div key={i} className="flex gap-4 sm:gap-5">
                    {/* Step Number */}
                    <div className="relative shrink-0">
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg`}
                      >
                        <span className="text-white font-bold text-sm">
                          {step.step}
                        </span>
                      </div>
                    </div>
                    {/* Step Content */}
                    <div className="flex-1 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                      <h4 className="font-bold text-[#0f172a] mb-1.5">
                        {step.title}
                      </h4>
                      <p className="text-sm text-[#64748b] leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Separator className="bg-gray-100" />

          {/* Benefits */}
          <div>
            <h3 className="text-lg font-bold text-[#0f172a] mb-5 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#059669]" />
              الفوائد
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {service.benefits.map((benefit, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-gradient-to-l from-[#f0fdf4] to-white rounded-xl p-4 border border-[#bbf7d0]/50"
                >
                  <div className="w-2 h-2 rounded-full bg-[#059669] shrink-0" />
                  <span className="text-sm text-[#334155]">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-gray-100" />

          {/* FAQs */}
          <div>
            <h3 className="text-lg font-bold text-[#0f172a] mb-5 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#1a56db]" />
              أسئلة شائعة عن الخدمة
            </h3>
            <div className="space-y-4">
              {service.faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-[#f8fafc] rounded-xl border border-gray-100 overflow-hidden"
                >
                  <div className="p-5">
                    <h4 className="font-bold text-[#0f172a] mb-2 text-sm">
                      {faq.question}
                    </h4>
                    <p className="text-sm text-[#64748b] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-gray-100" />

          {/* CTA */}
          <div
            className={`rounded-2xl bg-gradient-to-br ${service.gradient} p-8 text-center`}
          >
            <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
              مهتم بخدمة {service.title}؟
            </h3>
            <p className="text-white/80 mb-6 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
              تواصل معنا الآن واحصل على استشارة مجانية وعرض سعر خاص يناسب
              احتياجاتك
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="bg-white hover:bg-white/90 text-[#0f172a] font-bold px-8 py-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
                onClick={() => scrollToSection('contact')}
              >
                <Phone className="w-5 h-5 ml-2" />
                اطلب عرض سعر
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/40 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-6 rounded-xl backdrop-blur-sm transition-all duration-300"
                onClick={() => {
                  window.open(
                    'https://wa.me/966501234567',
                    '_blank'
                  );
                }}
              >
                تواصل عبر واتساب
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Services Component                                            */
/* ------------------------------------------------------------------ */

export default function Services() {
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(
    null
  );

  return (
    <section
      id="services"
      className="relative py-20 lg:py-28 overflow-hidden bg-white"
    >
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #1a56db 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-[#ea580c]" />
            <span className="text-sm font-semibold text-[#ea580c] tracking-wide">
              ما نقدمه لكم
            </span>
            <Sparkles className="h-5 w-5 text-[#ea580c]" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0f172a] mb-4">
            خدماتنا المتميزة
          </h2>
          <div className="w-20 h-1 bg-[#1a56db] mx-auto rounded-full mb-6" />
          <p className="text-[#64748b] text-lg max-w-2xl mx-auto leading-relaxed">
            نقدم مجموعة واسعة من خدمات المظلات الكهربائية بأعلى معايير الجودة
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {servicesData.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card
                  className="group relative border border-gray-100 bg-white hover:border-[#1a56db]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#1a56db]/5 hover:-translate-y-1 h-full overflow-hidden cursor-pointer"
                  onClick={() => setSelectedService(service)}
                >
                  {/* Top gradient accent line */}
                  <div
                    className={`absolute top-0 right-0 left-0 h-1 bg-gradient-to-l ${service.gradient} transform origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
                  />
                  <CardContent className="p-6 pt-8 flex flex-col items-center text-center gap-5">
                    {/* Icon container */}
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>

                    {/* Service title */}
                    <h3 className="text-xl font-bold text-[#0f172a] group-hover:text-[#1a56db] transition-colors duration-300">
                      {service.title}
                    </h3>

                    {/* Service description */}
                    <p className="text-[#64748b] text-sm leading-relaxed">
                      {service.shortDescription}
                    </p>

                    {/* Read more link */}
                    <button className="inline-flex items-center gap-2 text-[#1a56db] font-semibold text-sm hover:text-[#ea580c] transition-colors duration-300 mt-auto pt-2">
                      تفاصيل الخدمة
                      <ChevronLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform duration-300" />
                    </button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20"
        >
          <div className="relative rounded-2xl overflow-hidden">
            {/* Gradient background */}
            <div className="gradient-cta absolute inset-0" />
            {/* Decorative shapes */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-56 h-56 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />

            <div className="relative z-10 px-6 py-12 sm:px-12 sm:py-16 text-center flex flex-col items-center gap-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                هل تبحث عن خدمة مخصصة؟
              </h3>
              <p className="text-blue-100 text-lg max-w-xl leading-relaxed">
                تواصل معنا الآن واحصل على استشارة مجانية وعرض سعر خاص يناسب
                احتياجاتك وميزانيتك
              </p>
              <Button
                size="lg"
                className="bg-white text-[#1a56db] hover:bg-white/90 font-bold text-base px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 gap-3"
                onClick={() => {
                  document
                    .getElementById('contact')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Phone className="h-5 w-5" />
                تواصل معنا الآن
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Service Detail Dialog */}
      {selectedService && (
        <ServiceDetailDialog
          service={selectedService}
          open={!!selectedService}
          onOpenChange={(open) => !open && setSelectedService(null)}
        />
      )}
    </section>
  );
}
