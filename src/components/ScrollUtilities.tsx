'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

function getScrollState() {
  if (typeof window === 'undefined') return { progress: 0, showButton: false }
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  const progress = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0
  return { progress, showButton: scrollTop > 300 }
}

export default function ScrollUtilities() {
  const [scrollProgress, setScrollProgress] = useState(() => getScrollState().progress)
  const [showBackToTop, setShowBackToTop] = useState(() => getScrollState().showButton)

  const handleScroll = useCallback(() => {
    const { progress, showButton } = getScrollState()
    setScrollProgress(progress)
    setShowBackToTop(showButton)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {/* Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 right-0 z-50 h-[3px] transition-opacity duration-300"
        style={{ opacity: scrollProgress > 0 ? 1 : 0 }}
      >
        <div
          className="h-full transition-all duration-150 ease-out"
          style={{
            width: `${scrollProgress}%`,
            background: 'linear-gradient(90deg, #1a56db, #ea580c)',
          }}
        />
      </div>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.1, backgroundColor: '#1a56db', color: '#ffffff' }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#1a56db] bg-white text-[#1a56db] shadow-lg transition-colors duration-200 cursor-pointer"
            aria-label="العودة إلى الأعلى"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
