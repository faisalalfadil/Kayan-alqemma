'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowUp,
  Send,
  Loader2,
  Instagram,
  Linkedin,
  Settings,
} from 'lucide-react'
import { useAdminStore } from '@/store/admin-store'
import { useSettings } from '@/hooks/useSettings'

const quickLinks = [
  { label: 'الرئيسية', href: '#home' },
  { label: 'من نحن', href: '#about' },
  { label: 'خدماتنا', href: '#services' },
  { label: 'مشاريعنا', href: '#projects' },
  { label: 'المدونة', href: '#blog' },
  { label: 'اتصل بنا', href: '#contact' },
]

const serviceLinks = [
  { label: 'المظلات الكهربائية', href: '#services' },
  { label: 'مظلات السيارات', href: '#services' },
  { label: 'مظلات الحدائق', href: '#services' },
  { label: 'مظلات المسابح', href: '#services' },
  { label: 'كنب الحديقة', href: '#services' },
  { label: 'صيانة وإصلاح', href: '#services' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [subscribeMessage, setSubscribeMessage] = useState('')
  const openAdmin = useAdminStore((s) => s.open)
  const { settings } = useSettings()

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubscribing(true)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.success) {
        setSubscribeMessage('تم الاشتراك بنجاح! شكراً لك')
        setEmail('')
      } else {
        setSubscribeMessage(data.message || 'حدث خطأ')
      }
    } catch {
      setSubscribeMessage('حدث خطأ في الاتصال')
    } finally {
      setIsSubscribing(false)
      setTimeout(() => setSubscribeMessage(''), 3000)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="mt-auto bg-brand-dark text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1: Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-5"
          >
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img
                src="/company-logo.png"
                alt={settings.siteName}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div>
                <h3 className="font-bold text-lg text-white">{settings.siteName}</h3>
                <p className="text-xs text-slate-400">للمظلات الكهربائية</p>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed">
              شركة كيان القمة هي الخيار الأول في توريد وتركيب المظلات الكهربائية
              بأعلى جودة وأفضل الأسعار في المملكة العربية السعودية. خبرة تتجاوز
              15 عامًا في تقديم حلول المظلات المتطورة.
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-3">
              <a
                href={settings.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-brand-orange flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="تويتر"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-brand-orange flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="انستغرام"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={settings.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-brand-orange flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="لينكد إن"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-green-500 flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="واتساب"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-5"
          >
            <h3 className="font-bold text-lg text-white relative inline-block">
              روابط سريعة
              <span className="absolute -bottom-2 right-0 w-10 h-0.5 bg-brand-orange rounded-full" />
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-brand-orange transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-orange/50 group-hover:bg-brand-orange group-hover:w-2.5 transition-all duration-300" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Services Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-5"
          >
            <h3 className="font-bold text-lg text-white relative inline-block">
              خدماتنا
              <span className="absolute -bottom-2 right-0 w-10 h-0.5 bg-brand-orange rounded-full" />
            </h3>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-brand-orange transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-orange/50 group-hover:bg-brand-orange group-hover:w-2.5 transition-all duration-300" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Contact Info & Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-5"
          >
            <h3 className="font-bold text-lg text-white relative inline-block">
              معلومات التواصل
              <span className="absolute -bottom-2 right-0 w-10 h-0.5 bg-brand-orange rounded-full" />
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-brand-orange mt-1 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">الهاتف</p>
                  <a
                    href={`tel:${settings.phone.replace(/\s/g, '')}`}
                    className="text-sm text-slate-300 hover:text-brand-orange transition-colors"
                    dir="ltr"
                  >
                    {settings.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-brand-orange mt-1 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">البريد الإلكتروني</p>
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-sm text-slate-300 hover:text-brand-orange transition-colors"
                  >
                    {settings.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-orange mt-1 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">العنوان</p>
                  <p className="text-sm text-slate-300">
                    {settings.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-brand-orange mt-1 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">ساعات العمل</p>
                  <p className="text-sm text-slate-300">
                    {settings.workingHours}
                  </p>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="pt-3">
              <h4 className="text-sm font-semibold text-white mb-3">
                النشرة البريدية
              </h4>
              <p className="text-xs text-slate-500 mb-3">
                اشترك في نشرتنا البريدية للحصول على آخر العروض والأخبار
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="بريدك الإلكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 text-sm h-10 focus-visible:ring-brand-orange/30 focus-visible:border-brand-orange"
                  dir="ltr"
                />
                <Button
                  type="submit"
                  disabled={isSubscribing || !email}
                  size="icon"
                  className="shrink-0 bg-brand-orange hover:bg-brand-orange-light h-10 w-10 rounded-lg"
                >
                  {isSubscribing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </form>
              {subscribeMessage && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`text-xs mt-2 ${subscribeMessage.includes('نجاح') ? 'text-green-400' : 'text-red-400'}`}
                >
                  {subscribeMessage}
                </motion.p>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm text-center sm:text-right">
              © 2025 {settings.siteName}. جميع الحقوق محفوظة.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-slate-500 hover:text-brand-orange text-xs transition-colors"
              >
                سياسة الخصوصية
              </a>
              <span className="text-slate-700">|</span>
              <a
                href="#"
                className="text-slate-500 hover:text-brand-orange text-xs transition-colors"
              >
                الشروط والأحكام
              </a>
              <span className="text-slate-700">|</span>
              <button
                onClick={openAdmin}
                className="text-slate-600 hover:text-brand-orange text-xs transition-colors cursor-pointer flex items-center gap-1"
                title="لوحة التحكم"
              >
                <Settings className="w-3 h-3" />
                لوحة التحكم
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 w-12 h-12 bg-brand-orange hover:bg-brand-orange-light text-white rounded-full shadow-lg shadow-orange-200/50 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 z-40"
        aria-label="العودة للأعلى"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </footer>
  )
}
