'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, CheckCircle2, Clock, MapPin, Phone, Shield, Loader2, RotateCcw } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const SERVICE_TYPES = [
  { value: 'مظلات كهربائية', label: 'مظلات كهربائية' },
  { value: 'مظلات سيارات', label: 'مظلات سيارات' },
  { value: 'مظلات حدائق', label: 'مظلات حدائق' },
  { value: 'مظلات مسابح', label: 'مظلات مسابح' },
  { value: 'كنب حديقة', label: 'كنب حديقة' },
  { value: 'صيانة وإصلاح', label: 'صيانة وإصلاح' },
  { value: 'استشارة مجانية', label: 'استشارة مجانية' },
]

const TIME_SLOTS = [
  '8:00', '9:00', '10:00', '11:00', '12:00',
  '1:00', '2:00', '3:00', '4:00', '5:00',
]

const BENEFITS = [
  { icon: <MapPin className="size-5" />, text: 'زيارة ميدانية مجانية' },
  { icon: <Calendar className="size-5" />, text: 'عرض سعر مفصل' },
  { icon: <Shield className="size-5" />, text: 'استشارة مع خبراء' },
  { icon: <Clock className="size-5" />, text: 'ضمان أفضل الأسعار' },
]

function getTomorrowDate(): string {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
}

interface FormData {
  name: string
  phone: string
  email: string
  serviceType: string
  date: string
  time: string
  notes: string
}

export default function Booking() {
  const [form, setForm] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    serviceType: '',
    date: '',
    time: '',
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const minDate = useMemo(() => getTomorrowDate(), [])

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError('')
  }

  const validateForm = (): boolean => {
    if (!form.name.trim() || form.name.trim().length < 3) {
      setError('يجب أن يكون الاسم 3 أحرف على الأقل')
      return false
    }
    const phonePattern = /^(05\d{8}|\+9665\d{8})$/
    if (!phonePattern.test(form.phone)) {
      setError('رقم الجوال غير صالح (يجب أن يبدأ بـ 05 أو +9665)')
      return false
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('البريد الإلكتروني غير صالح')
      return false
    }
    if (!form.serviceType) {
      setError('يرجى اختيار نوع الخدمة')
      return false
    }
    if (!form.date) {
      setError('يرجى اختيار تاريخ الزيارة')
      return false
    }
    if (!form.time) {
      setError('يرجى اختيار الوقت المفضل')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (data.success) {
        setIsSuccess(true)
      } else {
        setError(data.message || 'حدث خطأ أثناء حجز الموعد')
      }
    } catch {
      setError('حدث خطأ في الاتصال بالخادم')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setForm({
      name: '',
      phone: '',
      email: '',
      serviceType: '',
      date: '',
      time: '',
      notes: '',
    })
    setIsSuccess(false)
    setError('')
  }

  return (
    <section id="booking" className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-blue-50/30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(26,86,219,0.04),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(234,88,12,0.04),transparent_50%)]" />

      <div className="relative container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-[#1a56db]/10 text-[#1a56db] px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Calendar className="size-4" />
            احجز موعدك الآن
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            حجز موعد
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            احجز موعداً لزيارة مجانية وعرض سعر
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-0 shadow-xl shadow-slate-200/50 bg-white">
              <CardContent className="p-6 md:p-8">
                <AnimatePresence mode="wait">
                  {isSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="text-center py-8 space-y-4"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                        className="mx-auto w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center"
                      >
                        <CheckCircle2 className="size-10 text-emerald-500" />
                      </motion.div>
                      <h3 className="text-xl font-bold text-slate-900">
                        تم حجز موعدك بنجاح!
                      </h3>
                      <p className="text-slate-500 max-w-sm mx-auto">
                        سنتواصل معك قريباً لتأكيد الموعد
                      </p>
                      <Button
                        onClick={resetForm}
                        variant="outline"
                        className="mt-4 border-[#1a56db] text-[#1a56db] hover:bg-[#1a56db] hover:text-white"
                      >
                        <RotateCcw className="size-4 ml-2" />
                        حجز موعد آخر
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-5"
                    >
                      {/* Name */}
                      <div className="space-y-2">
                        <Label htmlFor="booking-name" className="text-sm font-medium text-slate-700">
                          الاسم الكامل <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="booking-name"
                          value={form.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          placeholder="أدخل اسمك الكامل"
                          className="h-11 text-right"
                        />
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <Label htmlFor="booking-phone" className="text-sm font-medium text-slate-700">
                          رقم الجوال <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="booking-phone"
                          value={form.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          placeholder="05XXXXXXXX أو +9665XXXXXXXX"
                          className="h-11 text-right"
                          dir="ltr"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="booking-email" className="text-sm font-medium text-slate-700">
                          البريد الإلكتروني <span className="text-slate-400 text-xs">(اختياري)</span>
                        </Label>
                        <Input
                          id="booking-email"
                          type="email"
                          value={form.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          placeholder="example@email.com"
                          className="h-11 text-right"
                          dir="ltr"
                        />
                      </div>

                      {/* Service Type */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">
                          نوع الخدمة <span className="text-red-500">*</span>
                        </Label>
                        <Select value={form.serviceType} onValueChange={(v) => handleChange('serviceType', v)}>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="اختر نوع الخدمة" />
                          </SelectTrigger>
                          <SelectContent>
                            {SERVICE_TYPES.map((service) => (
                              <SelectItem key={service.value} value={service.value}>
                                {service.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Date & Time Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="booking-date" className="text-sm font-medium text-slate-700">
                            تاريخ الزيارة المفضل <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="booking-date"
                            type="date"
                            value={form.date}
                            onChange={(e) => handleChange('date', e.target.value)}
                            min={minDate}
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700">
                            الوقت المفضل <span className="text-red-500">*</span>
                          </Label>
                          <Select value={form.time} onValueChange={(v) => handleChange('time', v)}>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="اختر الوقت" />
                            </SelectTrigger>
                            <SelectContent>
                              {TIME_SLOTS.map((slot) => (
                                <SelectItem key={slot} value={slot}>
                                  {slot}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="space-y-2">
                        <Label htmlFor="booking-notes" className="text-sm font-medium text-slate-700">
                          ملاحظات إضافية <span className="text-slate-400 text-xs">(اختياري)</span>
                        </Label>
                        <Textarea
                          id="booking-notes"
                          value={form.notes}
                          onChange={(e) => handleChange('notes', e.target.value)}
                          placeholder="أي ملاحظات أو تفاصيل إضافية..."
                          rows={3}
                          className="resize-none"
                        />
                      </div>

                      {/* Error */}
                      <AnimatePresence>
                        {error && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-red-500 text-sm"
                          >
                            {error}
                          </motion.p>
                        )}
                      </AnimatePresence>

                      {/* Submit */}
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-12 text-base font-bold bg-[#1a56db] hover:bg-[#1545b0] text-white shadow-lg shadow-[#1a56db]/25 transition-all"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="size-5 ml-2 animate-spin" />
                            جاري الحجز...
                          </>
                        ) : (
                          'حجز الموعد'
                        )}
                      </Button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Decorative Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="space-y-6">
              {/* Calendar Icon Card */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-[#1a56db] to-[#1a56db]/80 text-white">
                <CardContent className="p-8 text-center space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.4 }}
                    className="mx-auto w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                  >
                    <Calendar className="size-10" />
                  </motion.div>
                  <h3 className="text-2xl font-bold">حجز سهل وسريع</h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    احجز موعدك في خطوات بسيطة وسنتواصل معك في أقرب وقت ممكن
                  </p>
                </CardContent>
              </Card>

              {/* Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BENEFITS.map((benefit, idx) => (
                  <motion.div
                    key={benefit.text}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                  >
                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow h-full">
                      <CardContent className="p-5 flex items-center gap-3">
                        <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a56db]/10 to-[#ea580c]/10 flex items-center justify-center text-[#1a56db]">
                          {benefit.icon}
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                          {benefit.text}
                        </span>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Contact Info Card */}
              <Card className="border-0 shadow-md">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Phone className="size-5 text-[#ea580c]" />
                    <div>
                      <p className="text-xs text-slate-400">أو اتصل بنا مباشرة</p>
                      <p className="font-bold text-slate-800" dir="ltr">+966 50 123 4567</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Clock className="size-5 text-[#ea580c]" />
                    <div>
                      <p className="text-xs text-slate-400">ساعات العمل</p>
                      <p className="font-medium text-slate-700">السبت - الخميس: 8 صباحاً - 6 مساءً</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
