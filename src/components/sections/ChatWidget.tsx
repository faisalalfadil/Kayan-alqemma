'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const WELCOME_MESSAGE = 'مرحباً بك! 👋 أنا مساعد شركة كيان القمة الذكي. كيف يمكنني مساعدتك اليوم؟'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState(1)
  const [sessionId] = useState(() => Date.now().toString())
  const [hasInitialized, setHasInitialized] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Initialize welcome message and focus input when opened
  useEffect(() => {
    if (isOpen && !hasInitialized) {
      setMessages([{ role: 'assistant', content: WELCOME_MESSAGE }])
      setHasInitialized(true)
      setUnreadCount(0)
      setTimeout(() => inputRef.current?.focus(), 400)
    } else if (isOpen) {
      setUnreadCount(0)
      setTimeout(() => inputRef.current?.focus(), 400)
    }
  }, [isOpen, hasInitialized])

  // Cleanup session on unmount
  useEffect(() => {
    return () => {
      if (hasInitialized) {
        fetch(`/api/chat?sessionId=${sessionId}`, { method: 'DELETE' }).catch(() => {})
      }
    }
  }, [sessionId, hasInitialized])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    // Cleanup session on close
    if (hasInitialized) {
      fetch(`/api/chat?sessionId=${sessionId}`, { method: 'DELETE' }).catch(() => {})
    }
  }, [sessionId, hasInitialized])

  const sendMessage = async () => {
    const trimmed = inputValue.trim()
    if (!trimmed || isLoading) return

    const userMessage: ChatMessage = { role: 'user', content: trimmed }
    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, sessionId }),
      })

      if (!response.ok) {
        throw new Error('فشل في الاتصال بالخادم')
      }

      const data = await response.json()
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.message || 'عذراً، لم أتمكن من معالجة طلبك.',
      }
      setMessages((prev) => [...prev, assistantMessage])

      // Add unread count if chat is closed
      if (!isOpen) {
        setUnreadCount((prev) => prev + 1)
      }
    } catch {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: '⚠️ عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.',
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 left-6 z-50 flex items-center justify-center',
          'w-14 h-14 rounded-full shadow-lg',
          'bg-gradient-to-br from-[#ea580c] to-[#f97316]',
          'hover:shadow-xl hover:scale-105',
          'transition-shadow duration-300 cursor-pointer',
          'border-0 outline-none'
        )}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1 }}
      >
        {/* Pulse ring animation */}
        {!isOpen && (
          <motion.span
            className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ea580c] to-[#f97316] opacity-50"
            animate={{
              scale: [1, 1.4, 1.4],
              opacity: [0.5, 0, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        <MessageCircle className="w-6 h-6 text-white relative z-10" />

        {/* Unread badge */}
        {unreadCount > 0 && !isOpen && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white z-10"
          >
            {unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
            }}
            className="fixed bottom-6 left-6 z-50 flex flex-col overflow-hidden rounded-2xl shadow-2xl border border-gray-200/50"
            style={{
              width: '380px',
              maxWidth: 'calc(100vw - 3rem)',
              height: '500px',
              maxHeight: 'calc(100vh - 6rem)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-l from-[#ea580c] to-[#f97316] text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center overflow-hidden p-0.5">
                  <Image
                    src="/company-logo.png"
                    alt="كيان القمة"
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold leading-tight">كيان القمة</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-[11px] text-white/80">مساعد ذكي</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-8 w-8 text-white hover:bg-white/20 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/80" style={{ direction: 'rtl' }}>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                  className={cn(
                    'flex w-full',
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[80%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap',
                      msg.role === 'user'
                        ? 'bg-[#1a56db] text-white rounded-2xl rounded-br-md'
                        : 'bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-sm border border-gray-100'
                    )}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white rounded-2xl rounded-bl-md shadow-sm border border-gray-100 px-4 py-3 flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{
                          y: [0, -6, 0],
                          opacity: [0.4, 1, 0.4],
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.15,
                          ease: 'easeInOut',
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex items-center gap-2 px-4 py-3 bg-white border-t border-gray-100 shrink-0">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="اكتب رسالتك..."
                disabled={isLoading}
                className="flex-1 h-10 text-sm border-gray-200 focus:border-[#ea580c] focus:ring-[#ea580c]/20 rounded-xl bg-gray-50"
                dir="rtl"
              />
              <Button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="icon"
                className={cn(
                  'h-10 w-10 rounded-xl shrink-0 cursor-pointer',
                  'bg-gradient-to-br from-[#ea580c] to-[#f97316]',
                  'hover:from-[#c2410c] hover:to-[#ea580c]',
                  'text-white shadow-sm',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
