'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronDown, Phone, ArrowLeft, Shield, Award, Users } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

const statsData = [
  { value: '+15', label: 'سنة خبرة', icon: Shield },
  { value: '+500', label: 'مشروع منجز', icon: Award },
  { value: '+200', label: 'عميل سعيد', icon: Users },
  { value: '100%', label: 'ضمان الجودة', icon: Shield },
];

export default function Hero() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="gradient-hero relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/hero-bg.png"
          alt=""
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/80 via-[#1e3a5f]/70 to-[#1a56db]/60" />
      </div>
      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-20 right-[10%] w-32 h-32 rounded-full bg-white/5 blur-xl"
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-[40%] left-[5%] w-48 h-48 rounded-full bg-[#1a56db]/20 blur-2xl"
          animate={{ y: [0, 15, 0], x: [0, -15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[20%] right-[15%] w-24 h-24 rounded-full bg-[#ea580c]/10 blur-lg"
          animate={{ y: [0, -12, 0], x: [0, 8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[30%] left-[20%] w-16 h-16 rounded-full bg-white/5 blur-md"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Decorative lines */}
        <motion.div
          className="absolute top-0 left-[30%] w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1 }}
        />
        <motion.div
          className="absolute top-0 left-[70%] w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1.5 }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          className="flex flex-col items-center text-center max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium px-4 py-2 rounded-full border border-white/10">
              <Phone className="w-4 h-4" />
              <span>اتصل بنا الآن: 966501234567+</span>
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          >
            نصنع لك المظلات التي
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#ea580c] to-[#f97316]">
              تلبي احتياجاتك
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-white/80 leading-relaxed max-w-3xl mb-10"
          >
            شركة كيان القمة رائدة في توريد وتركيب المظلات الكهربائية في المملكة العربية السعودية
            بخبرة تتجاوز 15 عامًا
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 mb-16">
            <Button
              size="lg"
              className="bg-[#ea580c] hover:bg-[#c2410c] text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-lg shadow-[#ea580c]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[#ea580c]/30 hover:-translate-y-0.5"
              onClick={() => scrollToSection('contact')}
            >
              <Phone className="w-5 h-5 ml-2" />
              احصل على عرض سعر
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white/30 bg-white/5 hover:bg-white/10 text-white font-semibold px-8 py-6 text-lg rounded-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5"
              onClick={() => scrollToSection('projects')}
            >
              <ArrowLeft className="w-5 h-5 ml-2" />
              تصفح مشاريعنا
            </Button>
          </motion.div>
        </motion.div>

        {/* Statistics Counters */}
        <motion.div
          className="mt-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2, ease: 'easeOut' }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statsData.map((stat, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.4 + index * 0.15 }}
              >
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/10 text-center hover:bg-white/15 transition-all duration-300">
                  <div className="flex justify-center mb-2">
                    <stat.icon className="w-5 h-5 text-[#ea580c]" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll down indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => scrollToSection('about')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <span className="text-white/50 text-xs tracking-widest">اكتشف المزيد</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-6 h-6 text-white/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
