'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  FileDown,
  Loader2,
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  CheckCircle2,
  Star,
  Award,
  Users,
  Shield,
  ChevronDown,
} from 'lucide-react'
import { useSettings } from '@/hooks/useSettings'

async function generatePDF(settings: {
  siteName: string
  phone: string
  email: string
  address: string
  workingHours: string
  whatsapp: string
  description: string
}) {
  // Dynamic import to avoid SSR issues
  const { default: jsPDF } = await import('jspdf')

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const contentWidth = pageWidth - margin * 2

  let y = 0

  // ─── Helper: Draw a rounded rectangle ────────────────────────
  const roundedRect = (x: number, yy: number, w: number, h: number, r: number) => {
    doc.setFillColor(26, 86, 219) // #1a56db
    doc.roundedRect(x, yy, w, h, r, r, 'F')
  }

  // ─── Helper: Add new page ────────────────────────────────────
  const checkPageBreak = (neededSpace: number) => {
    if (y + neededSpace > pageHeight - margin) {
      doc.addPage()
      y = margin
      return true
    }
    return false
  }

  // ─── PAGE 1: COVER ───────────────────────────────────────────
  // Top blue header bar
  roundedRect(0, 0, pageWidth, 90, 0)

  // Company logo area
  doc.setFillColor(255, 255, 255)
  doc.circle(pageWidth / 2, 32, 15, 'F')
  doc.setFillColor(26, 86, 219)
  doc.circle(pageWidth / 2, 32, 13, 'F')

  // Building icon (simple shapes)
  doc.setFillColor(255, 255, 255)
  doc.rect(pageWidth / 2 - 5, 25, 10, 14, 'F')
  doc.rect(pageWidth / 2 - 8, 35, 4, 4, 'F')
  doc.rect(pageWidth / 2 + 4, 33, 4, 6, 'F')

  // Company name
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.text(settings.siteName, pageWidth / 2, 58, { align: 'center' })

  // Tagline
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(12)
  doc.setTextColor(255, 255, 255)
  doc.text('Tawhid & Installation of Electric Canopies', pageWidth / 2, 68, { align: 'center' })

  // Orange accent line
  doc.setFillColor(234, 88, 12) // #ea580c
  doc.rect(pageWidth / 2 - 30, 76, 60, 2, 'F')

  // ─── "COMPANY PROFILE" Title ─────────────────────────────────
  y = 105
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(26, 86, 219)
  doc.setFontSize(28)
  doc.text('COMPANY PROFILE', pageWidth / 2, y, { align: 'center' })

  y += 12
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  doc.setFontSize(11)
  doc.text('A comprehensive overview of our services, expertise, and commitment to excellence', pageWidth / 2, y, { align: 'center' })

  // ─── Key Stats ───────────────────────────────────────────────
  y += 25
  const stats = [
    { value: '15+', label: 'Years Experience' },
    { value: '500+', label: 'Projects Completed' },
    { value: '200+', label: 'Happy Clients' },
    { value: '100%', label: 'Quality Guaranteed' },
  ]

  const statWidth = contentWidth / 4
  stats.forEach((stat, i) => {
    const x = margin + i * statWidth

    // Circle background
    doc.setFillColor(240, 247, 255) // light blue
    doc.circle(x + statWidth / 2, y + 12, 16, 'F')

    // Value
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(26, 86, 219)
    doc.setFontSize(16)
    doc.text(stat.value, x + statWidth / 2, y + 15, { align: 'center' })

    // Label
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(7)
    doc.text(stat.label, x + statWidth / 2, y + 36, { align: 'center' })
  })

  // ─── About Section ───────────────────────────────────────────
  y += 55
  doc.setDrawColor(234, 88, 12)
  doc.setLineWidth(1)
  doc.line(margin, y, margin + 40, y)

  y += 8
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(26, 86, 219)
  doc.setFontSize(16)
  doc.text('About Us', margin, y)

  y += 10
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(60, 60, 60)
  doc.setFontSize(10)

  const aboutText = settings.description ||
    'A leading Saudi company specializing in the supply, installation, and maintenance of electric canopies and shades. With over 15 years of experience, we serve residential, commercial, and industrial clients across the Kingdom of Saudi Arabia.'

  const aboutLines = doc.splitTextToSize(aboutText, contentWidth)
  doc.text(aboutLines, margin, y)
  y += aboutLines.length * 5 + 5

  // ─── Our Services ────────────────────────────────────────────
  checkPageBreak(80)
  y += 5
  doc.setDrawColor(234, 88, 12)
  doc.line(margin, y, margin + 40, y)

  y += 8
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(26, 86, 219)
  doc.setFontSize(16)
  doc.text('Our Services', margin, y)

  const services = [
    { title: 'Electric Awnings', desc: 'Motorized retractable awnings with remote control and smart sensors' },
    { title: 'Car Shades', desc: 'Durable car parking shades with modern designs and weather resistance' },
    { title: 'Garden Canopies', desc: 'Custom garden and outdoor area canopies with premium fabrics' },
    { title: 'Pool Covers', desc: 'Pool protection covers with automatic opening and closing systems' },
    { title: 'Outdoor Furniture', desc: 'High-quality outdoor furniture resistant to Saudi climate conditions' },
    { title: 'Maintenance', desc: 'Regular and emergency maintenance services for all canopy types' },
  ]

  services.forEach((service) => {
    checkPageBreak(20)
    y += 10

    // Bullet
    doc.setFillColor(26, 86, 219)
    doc.circle(margin + 3, y - 1, 2, 'F')

    // Title
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(30, 30, 30)
    doc.setFontSize(11)
    doc.text(service.title, margin + 9, y)

    // Description
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(9)
    const descLines = doc.splitTextToSize(service.desc, contentWidth - 12)
    doc.text(descLines, margin + 9, y + 5)
    y += descLines.length * 4 + 3
  })

  // ─── PAGE 2 ──────────────────────────────────────────────────
  doc.addPage()
  y = margin

  // Why Choose Us
  doc.setDrawColor(234, 88, 12)
  doc.setLineWidth(1)
  doc.line(margin, y, margin + 40, y)

  y += 8
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(26, 86, 219)
  doc.setFontSize(16)
  doc.text('Why Choose Us', margin, y)

  const advantages = [
    { title: '15+ Years of Experience', desc: 'Extensive expertise in electric canopy supply and installation' },
    { title: 'Professional Team', desc: 'Engineers and technicians with high expertise in installation and maintenance' },
    { title: 'Premium Materials', desc: 'We use the best materials and modern technologies for durability' },
    { title: 'Competitive Prices', desc: 'Best market prices while maintaining the highest quality standards' },
    { title: 'Comprehensive Warranty', desc: 'Full warranty on all products and services with continuous technical support' },
    { title: 'After-Sales Service', desc: 'Dedicated after-sales support with specialized maintenance team 24/7' },
  ]

  advantages.forEach((item) => {
    y += 10
    checkPageBreak(18)

    // Check icon
    doc.setFillColor(5, 150, 105) // green
    doc.circle(margin + 3, y - 1, 2.5, 'F')
    doc.setFillColor(255, 255, 255)
    doc.setFontSize(6)
    doc.text('✓', margin + 1.8, y, { align: 'center' })

    doc.setFont('helvetica', 'bold')
    doc.setTextColor(30, 30, 30)
    doc.setFontSize(11)
    doc.text(item.title, margin + 10, y)

    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(9)
    const lines = doc.splitTextToSize(item.desc, contentWidth - 14)
    doc.text(lines, margin + 10, y + 5)
    y += lines.length * 4 + 3
  })

  // ─── Warranty ────────────────────────────────────────────────
  checkPageBreak(50)
  y += 10
  doc.setDrawColor(234, 88, 12)
  doc.line(margin, y, margin + 40, y)

  y += 8
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(26, 86, 219)
  doc.setFontSize(16)
  doc.text('Our Warranty', margin, y)

  y += 8
  doc.setFillColor(240, 247, 255)
  doc.roundedRect(margin, y, contentWidth, 40, 3, 3, 'F')

  const warrantyItems = [
    '5 years warranty on metal structure',
    '3 years warranty on electric motor',
    '2 years warranty on fabric',
    '1 year warranty on installation work',
  ]

  warrantyItems.forEach((item, i) => {
    const iy = y + 8 + i * 8
    doc.setFillColor(234, 88, 12)
    doc.circle(margin + 10, iy, 2, 'F')
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(60, 60, 60)
    doc.setFontSize(10)
    doc.text(item, margin + 16, iy + 1)
  })

  y += 48

  // ─── Coverage Areas ──────────────────────────────────────────
  checkPageBreak(40)
  doc.setDrawColor(234, 88, 12)
  doc.line(margin, y, margin + 40, y)

  y += 8
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(26, 86, 219)
  doc.setFontSize(16)
  doc.text('Coverage Areas', margin, y)

  y += 8
  const cities = ['Riyadh', 'Jeddah', 'Dammam', 'Makkah', 'Madinah', 'Khobar', 'Abha', 'Taif']
  cities.forEach((city, i) => {
    const col = i % 4
    const row = Math.floor(i / 4)
    const cx = margin + col * (contentWidth / 4) + 5
    const cy = y + row * 7
    doc.setFillColor(26, 86, 219)
    doc.circle(cx, cy, 1.5, 'F')
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(60, 60, 60)
    doc.setFontSize(10)
    doc.text(city, cx + 5, cy + 1)
  })

  y += 20

  // ─── Contact Information ─────────────────────────────────────
  checkPageBreak(60)
  y += 5
  doc.setDrawColor(234, 88, 12)
  doc.line(margin, y, margin + 40, y)

  y += 8
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(26, 86, 219)
  doc.setFontSize(16)
  doc.text('Contact Information', margin, y)

  y += 12

  // Contact card background
  doc.setFillColor(248, 250, 252)
  doc.roundedRect(margin, y, contentWidth, 45, 3, 3, 'F')

  const contactItems = [
    { label: 'Phone', value: settings.phone || '+966 50 123 4567' },
    { label: 'WhatsApp', value: settings.whatsapp ? `+${settings.whatsapp}` : '+966 50 123 4567' },
    { label: 'Email', value: settings.email || 'info@kayan-alaqma.sa' },
    { label: 'Address', value: settings.address || 'Riyadh, Saudi Arabia' },
    { label: 'Working Hours', value: settings.workingHours || 'Sat - Thu: 8 AM - 6 PM' },
  ]

  contactItems.forEach((item) => {
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(9)
    doc.text(`${item.label}:`, margin + 10, y + 6)

    doc.setFont('helvetica', 'normal')
    doc.setTextColor(26, 86, 219)
    doc.setFontSize(10)
    doc.text(item.value, margin + 45, y + 6)

    y += 8
  })

  y += 8

  // ─── Footer on every page ────────────────────────────────────
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    const footY = pageHeight - 10

    // Orange line
    doc.setFillColor(234, 88, 12)
    doc.rect(0, footY - 5, pageWidth, 1, 'F')

    doc.setFont('helvetica', 'normal')
    doc.setTextColor(150, 150, 150)
    doc.setFontSize(8)
    doc.text(settings.siteName, margin, footY)
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, footY, { align: 'right' })
  }

  return doc
}

interface CompanyProfileProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CompanyProfile({ open, onOpenChange }: CompanyProfileProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const { settings } = useSettings()
  const downloadLinkRef = useRef<HTMLAnchorElement>(null)

  const handleDownload = async () => {
    setIsGenerating(true)
    try {
      const doc = await generatePDF(settings)
      const blob = doc.output('blob')
      const url = URL.createObjectURL(blob)

      if (downloadLinkRef.current) {
        downloadLinkRef.current.href = url
        downloadLinkRef.current.click()
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('PDF generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      <a
        ref={downloadLinkRef}
        href="#"
        download={`company-profile-${settings.siteName}.pdf`}
        className="hidden"
      >
        download
      </a>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#0f172a] flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#1a56db]/10">
                <FileDown className="size-6 text-[#1a56db]" />
              </div>
              تحميل بروفايل الشركة
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              حمل ملف PDF يحتوي على معلومات شاملة عن الشركة وخدماتها ومنجزاتها
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Preview Card */}
            <div className="border rounded-xl p-4 bg-gradient-to-br from-blue-50 to-orange-50 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#1a56db] flex items-center justify-center">
                  <Building2 className="size-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0f172a] text-sm">{settings.siteName}</h4>
                  <p className="text-xs text-slate-500">Company Profile PDF</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { icon: FileDown, label: 'صفحتين A4' },
                  { icon: CheckCircle2, label: 'جاهز للطباعة' },
                  { icon: Globe, label: 'باللغتين عربي/إنجليزي' },
                  { icon: Star, label: 'تصميم احترافي' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5 text-slate-600">
                    <Icon className="size-3.5 text-[#ea580c]" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contents List */}
            <div className="border rounded-xl p-4 bg-white">
              <h5 className="font-bold text-sm text-[#0f172a] mb-3">محتويات الملف:</h5>
              <div className="space-y-2">
                {[
                  'معلومات الشركة والوصف العام',
                  'الخدمات المقدمة (6 خدمات)',
                  'لماذا تختارنا (6 مميزات)',
                  'الضمانات',
                  'مناطق التغطية',
                  'معلومات الاتصال',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-slate-600">
                    <ChevronDown className="size-3.5 text-[#1a56db] rotate-[-90deg]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleDownload}
              disabled={isGenerating}
              className="flex-1 bg-[#1a56db] hover:bg-[#1545b0] text-white font-bold"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="size-4 ml-2 animate-spin" />
                  جاري التجهيز...
                </>
              ) : (
                <>
                  <FileDown className="size-4 ml-2" />
                  تحميل PDF
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-6"
            >
              إغلاق
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
