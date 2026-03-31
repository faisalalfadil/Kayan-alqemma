'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Cookie } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

const CONSENT_KEY = 'cookie-consent'

const COOKIE_DETAILS = [
  {
    title: 'ملفات تعريف الارتباط الضرورية',
    description:
      'هذه الملفات ضرورية لتشغيل الموقع الإلكتروني وتتيح لك التنقل فيه واستخدام ميزاته الأساسية.',
    required: true,
  },
  {
    title: 'ملفات تعريف الارتباط الوظيفية',
    description:
      'تساعد هذه الملفات في تحسين أداء الموقع وتوفير ميزات إضافية مثل تذكر تفضيلاتك.',
    required: false,
  },
  {
    title: 'ملفات تعريف الارتباط التحليلية',
    description:
      'تساعدنا هذه الملفات في فهم كيفية تفاعل الزوار مع الموقع وجمع معلومات حول الأداء.',
    required: false,
  },
]

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isAutoDismissing, setIsAutoDismissing] = useState(false)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false)
  const [functionalEnabled, setFunctionalEnabled] = useState(false)

  const saveConsent = useCallback(
    (settings?: { analytics: boolean; functional: boolean }) => {
      const data = {
        accepted: true,
        timestamp: new Date().toISOString(),
        analytics: settings?.analytics ?? analyticsEnabled,
        functional: settings?.functional ?? functionalEnabled,
      }
      localStorage.setItem(CONSENT_KEY, JSON.stringify(data))
    },
    [analyticsEnabled, functionalEnabled]
  )

  const handleAccept = useCallback(() => {
    saveConsent({ analytics: true, functional: true })
    setIsVisible(false)
  }, [saveConsent])

  const handleSaveSettings = useCallback(() => {
    saveConsent()
    setIsSettingsOpen(false)
    setIsVisible(false)
  }, [saveConsent])

  const handleReject = useCallback(() => {
    saveConsent({ analytics: false, functional: false })
    setIsVisible(false)
  }, [saveConsent])

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY)
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  // Auto-dismiss after 30 seconds
  useEffect(() => {
    if (!isVisible) return
    const timer = setTimeout(() => {
      setIsAutoDismissing(true)
      saveConsent({ analytics: true, functional: true })
      setIsVisible(false)
    }, 30000)
    return () => clearTimeout(timer)
  }, [isVisible, saveConsent])

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={
              isAutoDismissing
                ? { opacity: 0, transition: { duration: 0.5 } }
                : { y: 100, opacity: 0 }
            }
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="fixed bottom-0 left-0 right-0 z-40 p-4 md:p-6"
          >
            <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white/95 px-5 py-5 shadow-2xl backdrop-blur-sm md:px-8 md:py-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
                {/* Content */}
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1a56db]/10 to-[#ea580c]/10">
                    <Cookie className="h-5 w-5 text-[#1a56db]" />
                  </div>
                  <div>
                    <p className="text-sm leading-relaxed text-gray-700">
                      نستخدم ملفات تعريف الارتباط لتحسين تجربتك. بالاستمرار في
                      التصفح، فإنك توافق على{' '}
                      <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="font-semibold text-[#1a56db] underline underline-offset-2 hover:text-[#1545b0] transition-colors cursor-pointer"
                      >
                        سياسة الخصوصية
                      </button>{' '}
                      الخاصة بنا.
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex shrink-0 items-center gap-3 md:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsSettingsOpen(true)}
                    className="h-9 rounded-lg border-gray-300 px-4 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
                  >
                    <Shield className="ml-1.5 h-3.5 w-3.5" />
                    إعدادات
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleReject}
                    variant="ghost"
                    className="h-9 rounded-lg px-4 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    رفض
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAccept}
                    className="h-9 rounded-lg bg-[#1a56db] px-5 text-xs font-medium text-white hover:bg-[#1545b0] shadow-sm cursor-pointer"
                  >
                    قبول
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Privacy Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="max-w-lg rounded-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <Shield className="h-5 w-5 text-[#1a56db]" />
              إعدادات ملفات تعريف الارتباط
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              يمكنك التحكم في أنواع ملفات تعريف الارتباط التي نستخدمها
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            {COOKIE_DETAILS.map((cookie, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-100 bg-gray-50/50 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-gray-800">
                      {cookie.title}
                    </h4>
                    {cookie.required && (
                      <span className="rounded-md bg-[#1a56db]/10 px-2 py-0.5 text-[10px] font-medium text-[#1a56db]">
                        ضروري
                      </span>
                    )}
                  </div>

                  {!cookie.required && (
                    <button
                      onClick={() => {
                        if (cookie.title.includes('التحليلية')) {
                          setAnalyticsEnabled(!analyticsEnabled)
                        } else {
                          setFunctionalEnabled(!functionalEnabled)
                        }
                      }}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ${
                        cookie.title.includes('التحليلية')
                          ? analyticsEnabled
                            ? 'bg-[#1a56db]'
                            : 'bg-gray-300'
                          : functionalEnabled
                            ? 'bg-[#1a56db]'
                            : 'bg-gray-300'
                      }`}
                      role="switch"
                      aria-checked={
                        cookie.title.includes('التحليلية')
                          ? analyticsEnabled
                          : functionalEnabled
                      }
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                          cookie.title.includes('التحليلية')
                            ? analyticsEnabled
                              ? '-translate-x-6'
                              : '-translate-x-1'
                            : functionalEnabled
                              ? '-translate-x-6'
                              : '-translate-x-1'
                        }`}
                      />
                    </button>
                  )}

                  {cookie.required && (
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#1a56db] opacity-80">
                      <span className="inline-block h-4 w-4 -translate-x-6 rounded-full bg-white shadow-sm" />
                    </div>
                  )}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-gray-500">
                  {cookie.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSettingsOpen(false)}
              className="rounded-lg border-gray-300 px-4 text-sm cursor-pointer"
            >
              إلغاء
            </Button>
            <Button
              size="sm"
              onClick={handleSaveSettings}
              className="rounded-lg bg-[#1a56db] px-6 text-sm text-white hover:bg-[#1545b0] cursor-pointer"
            >
              حفظ التفضيلات
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
