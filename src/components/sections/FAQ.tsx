'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HelpCircle, MessageCircle, ArrowLeft, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface FAQItemData {
  id: string
  question: string
  answer: string
  category?: string | null
  order?: number
}

const faqIcons = ['☀️', '⏱️', '🔧', '🛡️', '🎨', '📍', '📋', '💳', '🏠', '⚡', '✅', '📞']

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut' as const,
    },
  },
}

function FAQSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-xl px-5 py-5">
          <div className="flex items-center gap-3">
            <Skeleton className="w-6 h-6 rounded" />
            <Skeleton className="h-5 w-2/3" />
          </div>
          <Skeleton className="h-4 w-full mt-3" />
          <Skeleton className="h-4 w-3/4 mt-2" />
        </div>
      ))}
    </div>
  )
}

export default function FAQ() {
  const [faqItems, setFaqItems] = useState<FAQItemData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/faqs')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFaqItems(data.data || [])
        } else {
          setError('حدث خطأ أثناء تحميل الأسئلة الشائعة')
        }
      })
      .catch(() => {
        setError('تعذر الاتصال بالخادم')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] mb-4">
            الأسئلة الشائعة
          </h2>
          <div className="w-20 h-1 bg-[#1a56db] mx-auto rounded-full mb-4" />
          <p className="text-[#64748b] text-lg max-w-2xl mx-auto">
            إجابات على أكثر الأسئلة شيوعًا حول خدماتنا ومنتجاتنا
          </p>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-[#64748b] text-lg mb-4">{error}</p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="text-[#1a56db] border-[#1a56db] hover:bg-[#1a56db] hover:text-white"
            >
              إعادة المحاولة
            </Button>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && !error && <FAQSkeleton />}

        {/* FAQ Accordion */}
        {!isLoading && !error && faqItems.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="max-w-3xl mx-auto"
          >
            <Accordion
              type="single"
              collapsible
              className="space-y-3"
            >
              {faqItems.map((item, index) => (
                <motion.div key={item.id} variants={itemVariants}>
                  <AccordionItem
                    value={item.id}
                    className="bg-white border border-gray-200 rounded-xl px-5 data-[state=open]:shadow-md data-[state=open]:border-[#1a56db]/30 transition-all duration-300"
                  >
                    <AccordionTrigger className="text-right text-base font-semibold text-[#0f172a] hover:text-[#1a56db] hover:no-underline py-5 [&[data-state=open]>svg]:text-[#1a56db]">
                      <span className="flex items-center gap-3">
                        <span className="flex-shrink-0 text-xl">{faqIcons[index % faqIcons.length]}</span>
                        {item.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-[#64748b] leading-relaxed text-base pr-10">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !error && faqItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <HelpCircle className="w-12 h-12 text-[#64748b] mx-auto mb-4" />
            <p className="text-[#64748b] text-lg">
              لا توجد أسئلة شائعة حالياً
            </p>
          </motion.div>
        )}

        {/* CTA */}
        {!isLoading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-12"
          >
            <div className="max-w-lg mx-auto bg-gradient-to-br from-blue-50 to-orange-50 border border-blue-100 rounded-2xl p-8">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-[#1a56db]/10 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-7 h-7 text-[#1a56db]" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-2">
                لم تجد إجابتك؟
              </h3>
              <p className="text-[#64748b] mb-6 text-sm">
                فريقنا جاهز للإجابة على جميع استفساراتك وتقديم المساعدة
              </p>
              <Button
                size="lg"
                className="bg-[#1a56db] hover:bg-[#1444b0] text-white px-8 py-3 rounded-lg font-semibold text-base"
              >
                تواصل معنا
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
