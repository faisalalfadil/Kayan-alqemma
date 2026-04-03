'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
}

interface QuickReply {
  label: string
  message: string
}

const GREETING_MESSAGE = 'مرحباً! 👋 أنا المساعد الذكي لشركة كيان القمة. كيف يمكنني مساعدتك اليوم؟'

const QUICK_REPLIES: QuickReply[] = [
  { label: 'الخدمات', message: 'ما هي الخدمات التي تقدمونها؟' },
  { label: 'الأسعار', message: 'ما هي أسعار خدماتكم؟' },
  { label: 'حجز موعد', message: 'أريد حجز موعد استشارة' },
  { label: 'تواصل معنا', message: 'كيف يمكنني التواصل معكم؟' },
]

function formatTimestamp(): string {
  const now = new Date()
  return now.toLocaleTimeString('ar-SA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showQuickReplies, setShowQuickReplies] = useState(false)
  const [badgeCount, setBadgeCount] = useState(1)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll on new messages or loading state change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Initialize greeting when chat opens, reset on every open
  useEffect(() => {
    if (isOpen) {
      setMessages([{ role: 'assistant', content: GREETING_MESSAGE, timestamp: formatTimestamp() }])
      setShowQuickReplies(true)
      setBadgeCount(0)
      setInputValue('')
      setTimeout(() => inputRef.current?.focus(), 400)
    }
  }, [isOpen])

  const handleToggle = () => {
    setIsOpen((prev) => !prev)
  }

  const handleQuickReply = (reply: QuickReply) => {
    setShowQuickReplies(false)
    sendMessage(reply.message)
  }

  const sendMessage = async (messageText?: string) => {
    const text = (messageText || inputValue).trim()
    if (!text || isLoading) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: text,
      timestamp: formatTimestamp(),
    }

    setMessages((prev) => [...prev, userMessage])
    if (!messageText) setInputValue('')
    setShowQuickReplies(false)
    setIsLoading(true)

    try {
      // Build history for the API (excluding the greeting system message)
      const historyForApi = messages
        .filter((m) => m.role === 'user' || (m.role === 'assistant' && m.content !== GREETING_MESSAGE))
        .map((m) => ({ role: m.role, content: m.content }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyForApi,
        }),
      })

      if (!response.ok) {
        throw new Error('فشل في الاتصال بالخادم')
      }

      const data = await response.json()
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.reply || 'عذراً، لم أتمكن من معالجة طلبك.',
        timestamp: formatTimestamp(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: '⚠️ عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.',
        timestamp: formatTimestamp(),
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
      {/* Floating Action Button */}
      <motion.button
        onClick={handleToggle}
        className={cn(
          'fixed bottom-6 left-6 z-50 flex items-center justify-center',
          'w-16 h-16 rounded-full shadow-lg',
          'bg-[#25D366]',
          'hover:shadow-xl hover:scale-105',
          'transition-shadow duration-300 cursor-pointer',
          'border-0 outline-none'
        )}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1 }}
        aria-label={isOpen ? 'إغلاق المحادثة' : 'فتح المحادثة'}
      >
        {/* Pulse animation when chat is closed */}
        {!isOpen && (
          <motion.span
            className="absolute inset-0 rounded-full bg-[#25D366] opacity-50"
            animate={{
              scale: [1, 1.5, 1.5],
              opacity: [0.5, 0, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {isOpen ? (
          <X className="w-7 h-7 text-white relative z-10" />
        ) : (
          <MessageCircle className="w-7 h-7 text-white relative z-10" />
        )}

        {/* Notification badge */}
        {badgeCount > 0 && !isOpen && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white z-10"
          >
            {badgeCount}
          </motion.span>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
            }}
            className="fixed bottom-24 left-6 z-50 flex flex-col overflow-hidden rounded-2xl shadow-2xl border border-gray-200/50"
            style={{
              width: '380px',
              maxWidth: 'calc(100vw - 3rem)',
              height: '500px',
              maxHeight: 'calc(100vh - 10rem)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-l from-[#1a56db] to-[#2563eb] text-white shrink-0">
              <div className="flex items-center gap-3">
                {/* Logo placeholder */}
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold leading-tight">كيان القمة</span>
                  <span className="text-[11px] text-white/80">مساعد ذكي</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 text-white hover:bg-white/20 rounded-full cursor-pointer"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages Area */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-3 bg-white"
              style={{ direction: 'rtl' }}
            >
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                  className={cn(
                    'flex w-full gap-2',
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {/* Bot avatar */}
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-[#1a56db] flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}

                  <div className="flex flex-col max-w-[78%]">
                    <div
                      className={cn(
                        'px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap',
                        msg.role === 'user'
                          ? 'bg-[#1a56db] text-white rounded-2xl rounded-br-sm'
                          : 'bg-[#f1f5f9] text-gray-800 rounded-2xl rounded-bl-sm'
                      )}
                    >
                      {msg.content}
                    </div>
                    {msg.timestamp && (
                      <span
                        className={cn(
                          'text-[10px] text-gray-400 mt-1 px-1',
                          msg.role === 'user' ? 'text-left' : 'text-right'
                        )}
                      >
                        {msg.timestamp}
                      </span>
                    )}
                  </div>

                  {/* User avatar */}
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-3.5 h-3.5 text-gray-500" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex w-full gap-2 justify-start"
                >
                  <div className="w-7 h-7 rounded-full bg-[#1a56db] flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-[#f1f5f9] rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
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

              {/* Quick Reply Buttons */}
              {showQuickReplies && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="flex flex-wrap gap-2 justify-center pt-2"
                >
                  {QUICK_REPLIES.map((reply) => (
                    <button
                      key={reply.label}
                      onClick={() => handleQuickReply(reply)}
                      className={cn(
                        'px-4 py-2 rounded-full text-xs font-medium',
                        'border border-[#1a56db]/30 text-[#1a56db]',
                        'bg-white hover:bg-[#1a56db] hover:text-white',
                        'transition-all duration-200 cursor-pointer',
                        'shadow-sm hover:shadow-md'
                      )}
                    >
                      {reply.label}
                    </button>
                  ))}
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
                className="flex-1 h-10 text-sm border-gray-200 focus:border-[#1a56db] focus:ring-[#1a56db]/20 rounded-xl bg-gray-50"
                dir="rtl"
              />
              <Button
                onClick={() => sendMessage()}
                disabled={!inputValue.trim() || isLoading}
                size="icon"
                className={cn(
                  'h-10 w-10 rounded-xl shrink-0 cursor-pointer',
                  'bg-[#1a56db] hover:bg-[#1545b0]',
                  'text-white shadow-sm',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
                aria-label="إرسال"
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
