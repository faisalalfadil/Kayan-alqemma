'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

interface TestimonialData {
  id: string
  name: string
  role?: string | null
  content: string
  rating: number
  avatar?: string | null
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return parts[0][0] + parts[1][0]
  }
  return parts[0][0]
}

function StarRating({ rating, size = 'size-5' }: { rating: number; size?: string }) {
  return (
    <div className="flex items-center gap-1" dir="ltr">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size} ${star <= rating ? 'fill-[#f59e0b] text-[#f59e0b]' : 'fill-gray-200 text-gray-200'}`}
        />
      ))}
    </div>
  )
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/testimonials')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setTestimonials(data.data)
          setIsLoaded(true)
        }
      })
      .catch(() => setIsLoaded(true))
  }, [])

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -200 : 200,
      opacity: 0,
    }),
  }

  const goToSlide = useCallback(
    (index: number) => {
      setDirection(index > currentIndex ? 1 : -1)
      setCurrentIndex(index)
    },
    [currentIndex]
  )

  const nextSlide = useCallback(() => {
    if (testimonials.length === 0) return
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }, [testimonials.length])

  const prevSlide = useCallback(() => {
    if (testimonials.length === 0) return
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }, [testimonials.length])

  // Auto-play
  useEffect(() => {
    if (isHovered || testimonials.length <= 1) return
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [isHovered, nextSlide, testimonials.length])

  if (!isLoaded) {
    return (
      <section id="testimonials" className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-4 h-4 rounded-full bg-gray-200 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (testimonials.length === 0) return null

  const current = testimonials[currentIndex]

  return (
    <section
      id="testimonials"
      className="py-20 relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-blue-50/30 to-white" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%231a56db%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%221%22%20cy%3D%221%22%20r%3D%221%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] mb-4">
            آراء عملائنا
          </h2>
          <div className="w-20 h-1 bg-[#ea580c] mx-auto rounded-full mb-4" />
          <p className="text-[#64748b] text-lg max-w-2xl mx-auto">
            ماذا يقول عملاؤنا عن خدماتنا
          </p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="relative max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants} className="relative">
            {/* Main Card */}
            <div className="relative min-h-[320px] sm:min-h-[280px]">
              <AnimatePresence mode="wait" custom={direction}>
                {current && (
                  <motion.div
                    key={current.id}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="absolute inset-0"
                  >
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-10 h-full relative overflow-hidden">
                      {/* Decorative elements */}
                      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 opacity-10">
                        <Quote className="size-16 sm:size-20 text-[#1a56db]" />
                      </div>
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#1a56db]/5 to-transparent rounded-tr-full" />
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#ea580c]/5 to-transparent rounded-bl-full" />

                      <div className="relative z-10">
                        {/* Stars */}
                        <div className="flex justify-center mb-5">
                          <StarRating rating={current.rating} size="size-6" />
                        </div>

                        {/* Content */}
                        <p className="text-center text-[#334155] text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto font-medium">
                          &ldquo;{current.content}&rdquo;
                        </p>

                        {/* Customer Info */}
                        <div className="flex flex-col items-center gap-3">
                          {/* Avatar */}
                          {current.avatar ? (
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-3 border-[#1a56db]/20 shadow-md">
                              <img
                                src={current.avatar}
                                alt={current.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#1a56db] to-[#ea580c] flex items-center justify-center shadow-md border-3 border-white">
                              <span className="text-white font-bold text-lg sm:text-xl">
                                {getInitials(current.name)}
                              </span>
                            </div>
                          )}

                          {/* Name & Role */}
                          <div className="text-center">
                            <h4 className="font-bold text-[#0f172a] text-base sm:text-lg">
                              {current.name}
                            </h4>
                            {current.role && (
                              <p className="text-[#64748b] text-sm mt-0.5">{current.role}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation Arrows */}
            {testimonials.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute top-1/2 -translate-y-1/2 -right-2 sm:-right-5 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-[#0f172a] hover:bg-[#1a56db] hover:text-white hover:border-[#1a56db] transition-all duration-200"
                  aria-label="السابق"
                >
                  <ChevronRight className="size-5 sm:size-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute top-1/2 -translate-y-1/2 -left-2 sm:-left-5 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-[#0f172a] hover:bg-[#1a56db] hover:text-white hover:border-[#1a56db] transition-all duration-200"
                  aria-label="التالي"
                >
                  <ChevronLeft className="size-5 sm:size-6" />
                </button>
              </>
            )}
          </motion.div>

          {/* Dots Indicator */}
          {testimonials.length > 1 && (
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center gap-2.5 mt-8"
            >
              {testimonials.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => goToSlide(idx)}
                  className={`transition-all duration-300 rounded-full ${
                    idx === currentIndex
                      ? 'w-8 h-3 bg-[#1a56db]'
                      : 'w-3 h-3 bg-gray-300 hover:bg-[#1a56db]/40'
                  }`}
                  aria-label={`عرض الرأي ${idx + 1}`}
                />
              ))}
            </motion.div>
          )}

          {/* Stats Bar */}
          <motion.div
            variants={itemVariants}
            className="mt-12 grid grid-cols-3 gap-4 max-w-lg mx-auto"
          >
            <div className="text-center p-4">
              <div className="text-2xl sm:text-3xl font-bold text-[#1a56db]">{testimonials.length}+</div>
              <div className="text-xs sm:text-sm text-[#64748b] mt-1">عميل سعيد</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl sm:text-3xl font-bold text-[#ea580c]">4.8</div>
              <div className="text-xs sm:text-sm text-[#64748b] mt-1">متوسط التقييم</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl sm:text-3xl font-bold text-[#1a56db]">100%</div>
              <div className="text-xs sm:text-sm text-[#64748b] mt-1">نسبة الرضا</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
