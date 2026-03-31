'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'

const WHATSAPP_NUMBER = '966501234567'
const WHATSAPP_MESSAGE = 'مرحباً، أرغب في الاستفسار عن خدماتكم'
const BADGE_KEY = 'whatsapp-badge-clicked'

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export default function WhatsAppButton() {
  const [showBadge, setShowBadge] = useState(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem(BADGE_KEY)
    }
    return false
  })

  const handleClick = () => {
    localStorage.setItem(BADGE_KEY, 'true')
    setShowBadge(false)
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          className="fixed bottom-28 left-6 z-50 md:bottom-28"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            delay: 1.5,
          }}
        >
          {/* Pulse ring animation */}
          <motion.span
            className="absolute inset-0 rounded-full bg-[#25D366]/40"
            animate={{
              scale: [1, 1.6, 1.6],
              opacity: [0.4, 0, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          <Button
            onClick={handleClick}
            size="icon"
            className="relative w-[60px] h-[60px] rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-[0_4px_14px_rgba(37,211,102,0.4)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.55)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer border-0 outline-none"
            aria-label="تواصل عبر واتساب"
          >
            <WhatsAppIcon className="w-7 h-7" />

            {/* Notification badge */}
            {showBadge && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white shadow-sm"
              >
                1
              </motion.span>
            )}
          </Button>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent
        side="right"
        sideOffset={12}
        className="bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg border-0 shadow-lg"
      >
        تواصل عبر واتساب
      </TooltipContent>
    </Tooltip>
  )
}
