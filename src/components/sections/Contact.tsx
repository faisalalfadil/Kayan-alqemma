'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  Loader2,
} from 'lucide-react'

const contactSchema = z.object({
  name: z.string().min(3, 'يجب أن يحتوي الاسم على 3 أحرف على الأقل'),
  email: z.string().email('يرجى إدخال بريد إلكتروني صحيح'),
  phone: z
    .string()
    .min(10, 'يرجى إدخال رقم هاتف صحيح')
    .regex(/^[+]?[\d\s-]{10,}$/, 'يرجى إدخال رقم هاتف صحيح'),
  subject: z.string().min(3, 'يجب أن يحتوي الموضوع على 3 أحرف على الأقل'),
  message: z.string().min(10, 'يجب أن تحتوي الرسالة على 10 أحرف على الأقل'),
})

type ContactFormData = z.infer<typeof contactSchema>

const contactInfo = [
  {
    icon: MapPin,
    label: 'العنوان',
    value: 'طريق الملك فهد، حي العليا، الرياض',
  },
  {
    icon: Phone,
    label: 'الهاتف',
    value: '+966 50 123 4567',
    href: 'tel:+966501234567',
  },
  {
    icon: Mail,
    label: 'البريد الإلكتروني',
    value: 'info@kayan-alaqma.sa',
    href: 'mailto:info@kayan-alaqma.sa',
  },
  {
    icon: Clock,
    label: 'ساعات العمل',
    value: 'السبت - الخميس: 8 صباحًا - 6 مساءً',
  },
]

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('فشل إرسال الرسالة')
      }

      toast({
        title: 'تم الإرسال بنجاح',
        description: 'شكرًا لتواصلكم معنا. سنرد عليكم في أقرب وقت.',
      })
      reset()
    } catch {
      toast({
        title: 'خطأ في الإرسال',
        description: 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageSquare className="w-8 h-8 text-brand-blue" />
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">
              اتصل بنا
            </h2>
          </div>
          <div className="w-24 h-1 bg-brand-blue mx-auto mb-6 rounded-full" />
          <p className="text-brand-gray text-lg max-w-2xl mx-auto">
            نسعد بتواصلكم معنا. لا تترددوا في الاتصال بنا لأي استفسار
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="shadow-lg border-0 shadow-slate-200/50">
              <CardContent className="p-6 md:p-8">
                <h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center gap-2">
                  <Send className="w-5 h-5 text-brand-orange" />
                  أرسل لنا رسالة
                </h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم الكامل</Label>
                    <Input
                      id="name"
                      placeholder="أدخل اسمك الكامل"
                      className={
                        errors.name
                          ? 'border-destructive focus-visible:ring-destructive/20'
                          : ''
                      }
                      {...register('name')}
                    />
                    {errors.name && (
                      <p className="text-destructive text-sm">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email & Phone Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        dir="ltr"
                        className={
                          errors.email
                            ? 'border-destructive focus-visible:ring-destructive/20'
                            : ''
                        }
                        {...register('email')}
                      />
                      {errors.email && (
                        <p className="text-destructive text-sm">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">رقم الهاتف</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+966 5X XXX XXXX"
                        dir="ltr"
                        className={
                          errors.phone
                            ? 'border-destructive focus-visible:ring-destructive/20'
                            : ''
                        }
                        {...register('phone')}
                      />
                      {errors.phone && (
                        <p className="text-destructive text-sm">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <Label htmlFor="subject">الموضوع</Label>
                    <Input
                      id="subject"
                      placeholder="موضوع الرسالة"
                      className={
                        errors.subject
                          ? 'border-destructive focus-visible:ring-destructive/20'
                          : ''
                      }
                      {...register('subject')}
                    />
                    {errors.subject && (
                      <p className="text-destructive text-sm">
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message">الرسالة</Label>
                    <Textarea
                      id="message"
                      placeholder="اكتب رسالتك هنا..."
                      rows={5}
                      className={
                        errors.message
                          ? 'border-destructive focus-visible:ring-destructive/20'
                          : ''
                      }
                      {...register('message')}
                    />
                    {errors.message && (
                      <p className="text-destructive text-sm">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-orange hover:bg-brand-orange-light text-white font-semibold h-12 text-base rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-orange-200"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        إرسال الرسالة
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column - Contact Info & Map */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow duration-300 border-0 shadow-slate-200/50 h-full">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-brand-blue/10 flex items-center justify-center shrink-0">
                          <info.icon className="w-5 h-5 text-brand-blue" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-brand-dark mb-1">
                            {info.label}
                          </p>
                          {info.href ? (
                            <a
                              href={info.href}
                              className="text-sm text-brand-gray hover:text-brand-blue transition-colors leading-relaxed break-words"
                            >
                              {info.value}
                            </a>
                          ) : (
                            <p className="text-sm text-brand-gray leading-relaxed">
                              {info.value}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="overflow-hidden border-0 shadow-slate-200/50">
                <div className="relative h-64 md:h-72 bg-gradient-to-br from-brand-blue/5 via-brand-blue/10 to-brand-blue/20 flex flex-col items-center justify-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-brand-blue/10 flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-brand-blue" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-brand-dark text-lg">
                      موقعنا على الخريطة
                    </p>
                    <p className="text-brand-gray text-sm mt-1">
                      طريق الملك فهد، حي العليا، الرياض
                    </p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-l from-brand-blue via-brand-orange to-brand-blue" />
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
