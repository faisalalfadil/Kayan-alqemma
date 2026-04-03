'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Users, Award, DollarSign, ShieldCheck, HeadphonesIcon, ArrowLeft, Building2 } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: 'easeOut' as const },
  },
};

const fadeInRight = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: 'easeOut' as const },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const features = [
  {
    icon: Clock,
    title: 'خبرة أكثر من 15 عامًا',
    description: 'خبرة واسعة في مجال توريد وتركيب المظلات الكهربائية بأعلى معايير الجودة',
  },
  {
    icon: Users,
    title: 'فريق عمل محترف',
    description: 'فريق متخصص من المهندسين والفنيين ذوي الخبرة العالية في التركيب والصيانة',
  },
  {
    icon: Award,
    title: 'مواد عالية الجودة',
    description: 'نستخدم أفضل المواد والتقنيات الحديثة لضمان متانة المظلات وطول عمرها',
  },
  {
    icon: DollarSign,
    title: 'أسعار تنافسية',
    description: 'نقدم أفضل الأسعار في السوق مع الحفاظ على أعلى مستويات الجودة',
  },
  {
    icon: ShieldCheck,
    title: 'ضمان شامل',
    description: 'ضمان شامل على جميع منتجاتنا وخدماتنا مع دعم فني متواصل',
  },
  {
    icon: HeadphonesIcon,
    title: 'خدمة ما بعد البيع',
    description: 'نوفر خدمة ما بعد البيع المتميزة مع فريق صيانة متخصص على مدار الساعة',
  },
];

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="about" className="gradient-section py-20 lg:py-28 overflow-hidden">
      <div ref={sectionRef} className="container mx-auto px-4">
        {/* Section Title */}
        <motion.div
          className="text-center mb-16"
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] mb-4">
            من نحن
          </h2>
          <div className="w-20 h-1 bg-[#1a56db] mx-auto rounded-full" />
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-16">
          {/* Image Placeholder - Left */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
              <img
                src="/uploads/about/company-office.png"
                alt="شركة كيان القمة - المظلات الكهربائية"
                className="w-full h-full object-cover"
              />
              {/* Overlay accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a56db]/20 to-transparent" />
            </div>
            {/* Floating stats card */}
            <motion.div
              className="absolute -bottom-6 -left-4 md:left-4 bg-white rounded-xl shadow-lg p-4 border border-gray-100"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#ea580c]/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-[#ea580c]" />
                </div>
                <div>
                  <div className="text-xl font-bold text-[#0f172a]">+15</div>
                  <div className="text-xs text-[#64748b]">سنة من الخبرة</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Content - Right */}
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="flex flex-col gap-6"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-[#0f172a] leading-tight">
              خبرة واسعة في عالم
              <span className="text-[#1a56db]"> المظلات الكهربائية</span>
            </h3>
            <p className="text-[#64748b] leading-relaxed text-base md:text-lg">
              شركة كيان القمة هي إحدى الشركات الرائدة في المملكة العربية السعودية في مجال توريد وتركيب
              المظلات الكهربائية. نقدم حلولاً متكاملة ومبتكرة تلبي احتياجات عملائنا المتنوعة، من المظلات
              المنزلية إلى المشاريع التجارية الكبيرة، مع الالتزام بأعلى معايير الجودة والسلامة.
            </p>
            <p className="text-[#64748b] leading-relaxed text-base md:text-lg">
              نحرص على استخدام أحدث التقنيات وأفضل المواد المتاحة في السوق لضمان تحقيق أعلى مستويات
              الرضا لدى عملائنا. فريقنا المكون من مهندسين وفنيين متخصصين يعمل بشغف لتقديم نتائج استثنائية
              تتجاوز التوقعات.
            </p>

            <div className="mt-2">
              <Button
                size="lg"
                className="bg-[#1a56db] hover:bg-[#1648c0] text-white font-semibold px-8 py-6 rounded-xl shadow-lg shadow-[#1a56db]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#1a56db]/25 hover:-translate-y-0.5"
                onClick={() => scrollToSection('services')}
              >
                <ArrowLeft className="w-5 h-5 ml-2" />
                تعرف على خدماتنا
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card className="h-full group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-gray-100 bg-white">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#1a56db]/10 flex items-center justify-center group-hover:bg-[#1a56db] transition-colors duration-300">
                      <feature.icon className="w-6 h-6 text-[#1a56db] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-[#0f172a] mb-2">{feature.title}</h4>
                      <p className="text-[#64748b] text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
