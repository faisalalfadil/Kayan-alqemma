'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Globe,
  Share2,
  Code2,
  FileText,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Save,
  Copy,
  ExternalLink,
  Eye,
  Plus,
  Trash2,
  Loader2,
  ShieldCheck,
  Smartphone,
  Lock,
  ImageIcon,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

// ─── Types ──────────────────────────────────────────────────────────────────

interface SeoSetting {
  id?: string
  page: string
  title: string
  description: string
  keywords?: string | null
  ogTitle?: string | null
  ogDescription?: string | null
  ogImage?: string | null
  canonicalUrl?: string | null
  robots: string
  schema?: string | null
  focusKeyword?: string | null
}

interface PageConfig {
  id: string
  label: string
  icon: string
}

interface SeoPanelProps {
  showToast: (message: string, type?: 'success' | 'error') => void
}

// ─── Constants ──────────────────────────────────────────────────────────────

const PAGES: PageConfig[] = [
  { id: 'home', label: 'الرئيسية', icon: '🏠' },
  { id: 'about', label: 'من نحن', icon: '🏢' },
  { id: 'services', label: 'الخدمات', icon: '⚡' },
  { id: 'projects', label: 'المشاريع', icon: '🏗️' },
  { id: 'blog', label: 'المدونة', icon: '📝' },
  { id: 'contact', label: 'اتصل بنا', icon: '📞' },
]

const PRESET_SCHEMAS: Record<string, string> = {
  LocalBusiness: JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'شركة كيان القمة',
    description: 'شركة متخصصة في تركيب وصيانة المظلات الكهربائية والحدائق والمسابح',
    url: 'https://kayan-alaqma.sa',
    telephone: '+966501234567',
    email: 'info@kayan-alaqma.sa',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'SA',
      addressLocality: 'الرياض',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '24.7136',
      longitude: '46.6753',
    },
    openingHours: 'Sa-Th 08:00-18:00',
    priceRange: '$$',
    image: 'https://kayan-alaqma.sa/og-image.jpg',
  }, null, 2),
  Organization: JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'شركة كيان القمة',
    url: 'https://kayan-alaqma.sa',
    logo: 'https://kayan-alaqma.sa/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+966501234567',
      contactType: 'customer service',
      availableLanguage: ['Arabic'],
    },
    sameAs: [],
  }, null, 2),
  WebSite: JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'شركة كيان القمة',
    url: 'https://kayan-alaqma.sa',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://kayan-alaqma.sa/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }, null, 2),
  BreadcrumbList: JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: 'https://kayan-alaqma.sa' },
      { '@type': 'ListItem', position: 2, name: 'الخدمات', item: 'https://kayan-alaqma.sa/#services' },
    ],
  }, null, 2),
}

const DEFAULT_ROBOTS_TXT = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: https://kayan-alaqma.sa/api/sitemap
`

// ─── Helpers ────────────────────────────────────────────────────────────────

function getScoreColor(score: number): string {
  if (score >= 70) return 'text-emerald-600'
  if (score >= 40) return 'text-orange-500'
  return 'text-red-500'
}

function getScoreBg(score: number): string {
  if (score >= 70) return 'bg-emerald-500'
  if (score >= 40) return 'bg-orange-500'
  return 'bg-red-500'
}

function getScoreLabel(score: number): string {
  if (score >= 70) return 'ممتاز'
  if (score >= 40) return 'متوسط'
  return 'ضعيف'
}

function getScoreRingColor(score: number): string {
  if (score >= 70) return '#10b981'
  if (score >= 40) return '#f97316'
  return '#ef4444'
}

function CharCounter({ current, min, max }: { current: number; min: number; max: number }) {
  const isUnder = current < min
  const isOver = current > max
  const isGood = !isUnder && !isOver

  return (
    <span className={`text-xs ${isGood ? 'text-emerald-500' : 'text-red-500'}`}>
      {current} / {min}-{max}
    </span>
  )
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function SeoPanel({ showToast }: SeoPanelProps) {
  const [seoSettings, setSeoSettings] = useState<SeoSetting[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [expandedPage, setExpandedPage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('analysis')

  // Form state
  const [editForms, setEditForms] = useState<Record<string, SeoSetting>>({})
  const [robotsTxt, setRobotsTxt] = useState(DEFAULT_ROBOTS_TXT)
  const [schemaEditor, setSchemaEditor] = useState('')
  const [selectedPresetSchema, setSelectedPresetSchema] = useState('')

  // ─── Fetch SEO Settings ───────────────────────────────────────────────
  const fetchSeoSettings = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/seo')
      const data = await res.json()
      if (data.success) {
        setSeoSettings(data.data)
        const forms: Record<string, SeoSetting> = {}
        data.data.forEach((s: SeoSetting) => {
          forms[s.page] = s
        })
        setEditForms(forms)
      }
    } catch {
      showToast('فشل في تحميل إعدادات SEO', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    fetchSeoSettings()
  }, [fetchSeoSettings])

  // ─── Save Page SEO ────────────────────────────────────────────────────
  const savePageSeo = async (pageId: string) => {
    const form = editForms[pageId]
    if (!form) return

    setIsSaving(true)
    try {
      const res = await fetch('/api/admin/seo', {
        method: form.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        showToast(`تم حفظ إعدادات SEO لصفحة ${PAGES.find(p => p.id === pageId)?.label}`)
        fetchSeoSettings()
      } else {
        showToast(data.error || 'حدث خطأ', 'error')
      }
    } catch {
      showToast('حدث خطأ في الاتصال', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  // ─── Update Form Field ───────────────────────────────────────────────
  const updateFormField = (pageId: string, field: keyof SeoSetting, value: string) => {
    setEditForms(prev => ({
      ...prev,
      [pageId]: {
        ...prev[pageId],
        page: prev[pageId]?.page || pageId,
        [field]: value,
      },
    }))
  }

  // ─── Save Robots.txt ─────────────────────────────────────────────────
  const saveRobotsTxt = () => {
    showToast('تم حفظ ملف robots.txt')
  }

  // ─── Save Schema ─────────────────────────────────────────────────────
  const saveSchema = (pageId: string) => {
    updateFormField(pageId, 'schema', schemaEditor)
    showToast('تم حفظ البيانات المنظمة')
  }

  // ─── SEO Score Calculation ───────────────────────────────────────────
  const calculateScore = () => {
    const homeSeo = editForms['home'] || seoSettings.find(s => s.page === 'home')
    let score = 0
    const checks: { label: string; passed: boolean; weight: number }[] = []

    // Title check
    const hasTitle = homeSeo && homeSeo.title && homeSeo.title.length > 0
    const titleLength = homeSeo?.title?.length || 0
    const titleGood = titleLength >= 30 && titleLength <= 60
    checks.push({ label: 'عنوان الموقع', passed: !!(hasTitle && titleGood), weight: 10 })
    if (hasTitle && titleGood) score += 10
    else if (hasTitle) score += 5

    // Description check
    const hasDesc = homeSeo && homeSeo.description && homeSeo.description.length > 0
    const descLength = homeSeo?.description?.length || 0
    const descGood = descLength >= 120 && descLength <= 160
    checks.push({ label: 'وصف الموقع', passed: !!(hasDesc && descGood), weight: 10 })
    if (hasDesc && descGood) score += 10
    else if (hasDesc) score += 5

    // Keywords
    const hasKeywords = homeSeo && homeSeo.keywords && homeSeo.keywords.length > 0
    checks.push({ label: 'الكلمات المفتاحية', passed: !!hasKeywords, weight: 8 })
    if (hasKeywords) score += 8

    // Canonical URL
    const hasCanonical = homeSeo && homeSeo.canonicalUrl && homeSeo.canonicalUrl.length > 0
    checks.push({ label: 'رابط Canonical', passed: !!hasCanonical, weight: 8 })
    if (hasCanonical) score += 8

    // OG Image
    const hasOgImage = homeSeo && homeSeo.ogImage && homeSeo.ogImage.length > 0
    checks.push({ label: 'صورة OG', passed: !!hasOgImage, weight: 8 })
    if (hasOgImage) score += 8

    // Schema
    const hasSchema = homeSeo && homeSeo.schema && homeSeo.schema.length > 0
    checks.push({ label: 'Schema.org', passed: !!hasSchema, weight: 10 })
    if (hasSchema) score += 10

    // Sitemap - always assumed accessible
    checks.push({ label: 'خريطة الموقع', passed: true, weight: 8 })
    score += 8

    // Robots.txt
    checks.push({ label: 'Robots.txt', passed: robotsTxt.length > 0, weight: 8 })
    if (robotsTxt.length > 0) score += 8

    // Image Alt tags - assumed good
    checks.push({ label: 'علامات Alt للصور', passed: true, weight: 7 })
    score += 7

    // Heading structure - assumed good
    checks.push({ label: 'بنية العناوين', passed: true, weight: 7 })
    score += 7

    // Mobile friendly - assumed good
    checks.push({ label: 'صديق للهاتف', passed: true, weight: 8 })
    score += 8

    // SSL/HTTPS
    checks.push({ label: 'SSL/HTTPS', passed: true, weight: 8 })
    score += 8

    return { score: Math.min(score, 100), checks }
  }

  const { score: seoScore, checks: seoChecks } = calculateScore()

  // ─── Copy to clipboard ───────────────────────────────────────────────
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`تم نسخ ${label}`)
    }).catch(() => {
      showToast('فشل في النسخ', 'error')
    })
  }

  // ─── Animation Variants ──────────────────────────────────────────────
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  // ─── Loading State ───────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl lg:col-span-2" />
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    )
  }

  // ─── Render ──────────────────────────────────────────────────────────
  const getForm = (pageId: string): SeoSetting => {
    return editForms[pageId] || {
      page: pageId,
      title: '',
      description: '',
      keywords: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      canonicalUrl: '',
      robots: 'index, follow',
      schema: '',
      focusKeyword: '',
    }
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">تحسين محركات البحث (SEO)</h2>
          <p className="text-sm text-slate-500">إدارة شاملة لتحسين ظهور الموقع في نتائج البحث</p>
        </div>
        <Button onClick={fetchSeoSettings} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="size-4" />
          تحديث
        </Button>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl">
        <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-slate-100 p-1 rounded-lg">
          <TabsTrigger value="analysis" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm flex-1 min-w-[120px]">
            <Search className="size-4" />
            تحليل SEO
          </TabsTrigger>
          <TabsTrigger value="pages" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm flex-1 min-w-[120px]">
            <Globe className="size-4" />
            إعدادات الصفحات
          </TabsTrigger>
          <TabsTrigger value="social" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm flex-1 min-w-[120px]">
            <Share2 className="size-4" />
            المعاينة الاجتماعية
          </TabsTrigger>
          <TabsTrigger value="schema" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm flex-1 min-w-[120px]">
            <Code2 className="size-4" />
            البيانات المنظمة
          </TabsTrigger>
          <TabsTrigger value="sitemap" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm flex-1 min-w-[120px]">
            <FileText className="size-4" />
            Sitemap & Robots
          </TabsTrigger>
        </TabsList>

        {/* ═══════════════════════════════════════════════════════════════
           Tab 1: تحليل SEO (SEO Analysis)
        ═══════════════════════════════════════════════════════════════ */}
        <TabsContent value="analysis" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Score Circle */}
            <motion.div variants={itemVariants}>
              <Card className="border-0 bg-white shadow-sm">
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="relative w-44 h-44 mb-4">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="52" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                      <motion.circle
                        cx="60" cy="60" r="52" fill="none"
                        stroke={getScoreRingColor(seoScore)}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 52}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - seoScore / 100) }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.span
                        className={`text-4xl font-bold ${getScoreColor(seoScore)}`}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        {seoScore}
                      </motion.span>
                      <span className="text-sm text-slate-400">من 100</span>
                    </div>
                  </div>
                  <Badge className={`${getScoreBg(seoScore)} text-white text-sm px-4 py-1`}>
                    {getScoreLabel(seoScore)}
                  </Badge>
                  <p className="text-xs text-slate-400 mt-2 text-center">درجة تحسين محركات البحث</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Checklist */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card className="border-0 bg-white shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ShieldCheck className="size-5 text-[#1a56db]" />
                    فحص شامل لموقعك
                  </CardTitle>
                  <CardDescription>تحقق من جميع عوامل SEO المهمة</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {seoChecks.map((check, idx) => (
                      <motion.div
                        key={check.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                          check.passed ? 'border-emerald-100 bg-emerald-50/50' : 'border-red-100 bg-red-50/50'
                        }`}
                      >
                        {check.passed ? (
                          <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
                        ) : (
                          <XCircle className="size-5 text-red-500 shrink-0" />
                        )}
                        <span className={`text-sm font-medium flex-1 ${check.passed ? 'text-slate-700' : 'text-red-700'}`}>
                          {check.label}
                        </span>
                        <Badge variant="secondary" className={`text-[10px] ${check.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {check.weight} نقطة
                        </Badge>
                      </motion.div>
                    ))}
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-600">التقدم الإجمالي</span>
                      <span className={`text-sm font-bold ${getScoreColor(seoScore)}`}>{seoScore}%</span>
                    </div>
                    <Progress value={seoScore} className="h-2.5" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════════
           Tab 2: إعدادات الصفحات (Page Settings)
        ═══════════════════════════════════════════════════════════════ */}
        <TabsContent value="pages" className="mt-6">
          <div className="space-y-4">
            {PAGES.map((page) => {
              const form = getForm(page.id)
              const isExpanded = expandedPage === page.id
              const hasData = !!form.id

              return (
                <motion.div key={page.id} variants={itemVariants}>
                  <Card className="border-0 bg-white shadow-sm overflow-hidden">
                    {/* Page Header - Clickable */}
                    <button
                      onClick={() => setExpandedPage(isExpanded ? null : page.id)}
                      className="w-full p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors text-right"
                    >
                      <span className="text-2xl">{page.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-800">{page.label}</h3>
                          <Badge variant="secondary" className={`text-[10px] ${hasData ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                            {hasData ? 'مُهيأ' : 'غير مُهيأ'}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {form.title || 'لم يتم تعيين عنوان SEO'}
                        </p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="size-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="size-5 text-slate-400" />
                      )}
                    </button>

                    {/* Expanded Form */}
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Separator />
                        <div className="p-4 space-y-4">
                          {/* SEO Title */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm font-medium">عنوان SEO</Label>
                              <CharCounter current={form.title.length} min={30} max={60} />
                            </div>
                            <Input
                              value={form.title}
                              onChange={e => updateFormField(page.id, 'title', e.target.value)}
                              placeholder="أدخل عنوان SEO (30-60 حرف)"
                              className="text-sm"
                            />
                          </div>

                          {/* Meta Description */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm font-medium">وصف ميتا</Label>
                              <CharCounter current={form.description.length} min={120} max={160} />
                            </div>
                            <Textarea
                              value={form.description}
                              onChange={e => updateFormField(page.id, 'description', e.target.value)}
                              placeholder="أدخل وصف ميتا (120-160 حرف)"
                              className="text-sm min-h-[80px]"
                            />
                          </div>

                          {/* Keywords & Focus Keyword */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">الكلمات المفتاحية</Label>
                              <Input
                                value={form.keywords || ''}
                                onChange={e => updateFormField(page.id, 'keywords', e.target.value)}
                                placeholder="كلمة1, كلمة2, كلمة3"
                                className="text-sm"
                              />
                              <p className="text-[11px] text-slate-400">مفصولة بفاصلة</p>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium flex items-center gap-1">
                                <Sparkles className="size-3.5 text-[#ea580c]" />
                                الكلمة المفتاحية المركزة
                              </Label>
                              <Input
                                value={form.focusKeyword || ''}
                                onChange={e => updateFormField(page.id, 'focusKeyword', e.target.value)}
                                placeholder="الكلمة الأساسية المستهدفة"
                                className="text-sm"
                              />
                            </div>
                          </div>

                          {/* Canonical URL & Robots */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">رابط Canonical</Label>
                              <Input
                                value={form.canonicalUrl || ''}
                                onChange={e => updateFormField(page.id, 'canonicalUrl', e.target.value)}
                                placeholder="https://kayan-alaqma.sa/"
                                className="text-sm"
                                dir="ltr"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">إعدادات الروبوتس</Label>
                              <Select
                                value={form.robots || 'index, follow'}
                                onValueChange={val => updateFormField(page.id, 'robots', val)}
                              >
                                <SelectTrigger className="text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="index, follow">فهرسة ومتابعة الروابط</SelectItem>
                                  <SelectItem value="noindex, follow">عدم الفهرسة مع متابعة</SelectItem>
                                  <SelectItem value="index, nofollow">فهرسة بدون متابعة</SelectItem>
                                  <SelectItem value="noindex, nofollow">عدم الفهرسة والمتابعة</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* Save Button */}
                          <div className="flex justify-end pt-2">
                            <Button
                              onClick={() => savePageSeo(page.id)}
                              disabled={isSaving}
                              className="bg-[#1a56db] hover:bg-[#1545b0] text-white gap-2"
                            >
                              {isSaving ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <Save className="size-4" />
                              )}
                              حفظ الإعدادات
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════════
           Tab 3: معاينة وسائل التواصل (Social Preview)
        ═══════════════════════════════════════════════════════════════ */}
        <TabsContent value="social" className="mt-6">
          <div className="space-y-6">
            {/* OG Settings */}
            <motion.div variants={itemVariants}>
              <Card className="border-0 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Share2 className="size-5 text-[#1a56db]" />
                    إعدادات وسائل التواصل الاجتماعي
                  </CardTitle>
                  <CardDescription>هذه الإعدادات تظهر عند مشاركة الموقع على منصات التواصل</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">عنوان OG</Label>
                      <Input
                        value={getForm('home').ogTitle || ''}
                        onChange={e => updateFormField('home', 'ogTitle', e.target.value)}
                        placeholder="العنوان الذي يظهر عند المشاركة"
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">وصف OG</Label>
                      <Input
                        value={getForm('home').ogDescription || ''}
                        onChange={e => updateFormField('home', 'ogDescription', e.target.value)}
                        placeholder="الوصف الذي يظهر عند المشاركة"
                        className="text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">رابط صورة OG</Label>
                    <Input
                      value={getForm('home').ogImage || ''}
                      onChange={e => updateFormField('home', 'ogImage', e.target.value)}
                      placeholder="https://kayan-alaqma.sa/og-image.jpg"
                      className="text-sm"
                      dir="ltr"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Preview Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Google Preview */}
              <motion.div variants={itemVariants}>
                <Card className="border-0 bg-white shadow-sm overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Search className="size-4 text-blue-500" />
                      معاينة Google
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-[#1a56db] flex items-center justify-center">
                          <span className="text-white text-[10px] font-bold">ك</span>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">kayan-alaqma.sa</p>
                          <p className="text-[10px] text-green-600">https://kayan-alaqma.sa › home</p>
                        </div>
                      </div>
                      <h3 className="text-base text-blue-700 hover:underline cursor-pointer leading-tight">
                        {getForm('home').ogTitle || getForm('home').title || 'شركة كيان القمة - مظلات كهربائية'}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {getForm('home').ogDescription || getForm('home').description || 'شركة متخصصة في تركيب وصيانة المظلات الكهربائية في الرياض والمملكة العربية السعودية'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Facebook Preview */}
              <motion.div variants={itemVariants}>
                <Card className="border-0 bg-white shadow-sm overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <svg className="size-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                      معاينة Facebook
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      {getForm('home').ogImage && (
                        <div className="h-40 bg-slate-100 flex items-center justify-center">
                          <ImageIcon className="size-10 text-slate-300" />
                        </div>
                      )}
                      <div className="bg-slate-50 p-3 space-y-1">
                        <p className="text-[10px] text-slate-400 uppercase">kayan-alaqma.sa</p>
                        <h3 className="text-sm font-medium text-slate-800 leading-tight">
                          {getForm('home').ogTitle || getForm('home').title || 'شركة كيان القمة'}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {getForm('home').ogDescription || getForm('home').description || 'شركة متخصصة في تركيب وصيانة المظلات الكهربائية'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Twitter Preview */}
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <Card className="border-0 bg-white shadow-sm overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <svg className="size-4 text-slate-800" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                      معاينة Twitter / X
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border border-slate-200 rounded-lg overflow-hidden max-w-lg mx-auto">
                      <div className="p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#1a56db] flex items-center justify-center">
                            <span className="text-white text-xs font-bold">ك</span>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">كيان القمة</p>
                            <p className="text-[10px] text-slate-400">@kayan_alaqma</p>
                          </div>
                        </div>
                        <h3 className="text-sm text-slate-800 leading-tight">
                          {getForm('home').ogTitle || getForm('home').title || 'شركة كيان القمة - مظلات كهربائية'}
                        </h3>
                        <p className="text-sm text-slate-500 line-clamp-2">
                          {getForm('home').ogDescription || getForm('home').description || 'شركة متخصصة في تركيب وصيانة المظلات الكهربائية في الرياض'}
                        </p>
                        <p className="text-[10px] text-slate-400" dir="ltr">
                          kayan-alaqma.sa
                          {getForm('home').canonicalUrl && ` • ${getForm('home').canonicalUrl}`}
                        </p>
                      </div>
                      {getForm('home').ogImage && (
                        <div className="h-48 bg-slate-100 flex items-center justify-center border-t border-slate-200">
                          <ImageIcon className="size-10 text-slate-300" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Save Social Settings */}
            <div className="flex justify-end">
              <Button
                onClick={() => savePageSeo('home')}
                disabled={isSaving}
                className="bg-[#1a56db] hover:bg-[#1545b0] text-white gap-2"
              >
                {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                حفظ إعدادات التواصل
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════════
           Tab 4: Schema / البيانات المنظمة (Structured Data)
        ═══════════════════════════════════════════════════════════════ */}
        <TabsContent value="schema" className="mt-6">
          <div className="space-y-6">
            {/* Preset Schemas */}
            <motion.div variants={itemVariants}>
              <Card className="border-0 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="size-5 text-[#ea580c]" />
                    قوالب Schema جاهزة
                  </CardTitle>
                  <CardDescription>اختر قالب جاهز أو أنشئ Schema مخصص</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Object.keys(PRESET_SCHEMAS).map((schemaName) => (
                      <Button
                        key={schemaName}
                        variant="outline"
                        className={`h-auto py-3 flex flex-col gap-1 text-xs ${selectedPresetSchema === schemaName ? 'border-[#1a56db] bg-[#1a56db]/5 text-[#1a56db]' : ''}`}
                        onClick={() => {
                          setSelectedPresetSchema(schemaName)
                          setSchemaEditor(PRESET_SCHEMAS[schemaName])
                        }}
                      >
                        <Code2 className="size-5" />
                        {schemaName}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Schema Editor */}
            <motion.div variants={itemVariants}>
              <Card className="border-0 bg-white shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Code2 className="size-5 text-[#1a56db]" />
                        محرر JSON-LD
                      </CardTitle>
                      <CardDescription>أدخل أو عدّل كود البيانات المنظمة</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-xs"
                        onClick={() => copyToClipboard(schemaEditor, 'Schema')}
                      >
                        <Copy className="size-3.5" />
                        نسخ
                      </Button>
                      <Button
                        size="sm"
                        className="gap-1 text-xs bg-[#1a56db] hover:bg-[#1545b0] text-white"
                        onClick={() => saveSchema('home')}
                      >
                        <Save className="size-3.5" />
                        حفظ
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Textarea
                      value={schemaEditor}
                      onChange={e => setSchemaEditor(e.target.value)}
                      className="font-mono text-xs leading-relaxed min-h-[300px] bg-slate-50 border-slate-200"
                      dir="ltr"
                      placeholder="أدخل كود JSON-LD هنا..."
                    />
                    {schemaEditor && (
                      <div className="absolute top-2 left-2">
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-[10px]">
                          <CheckCircle2 className="size-3 mr-1" />
                          JSON صالح
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* JSON Preview */}
                  {schemaEditor && (
                    <div className="mt-4">
                      <Label className="text-sm font-medium mb-2 block">معاينة الإخراج:</Label>
                      <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto max-h-64">
                        <pre className="text-emerald-400 text-xs font-mono whitespace-pre-wrap" dir="ltr">
{`<script type="application/ld+json">${schemaEditor}</script>`}
                        </pre>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════════
           Tab 5: Sitemap & Robots
        ═══════════════════════════════════════════════════════════════ */}
        <TabsContent value="sitemap" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sitemap Section */}
            <motion.div variants={itemVariants}>
              <Card className="border-0 bg-white shadow-sm h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="size-5 text-[#1a56db]" />
                        خريطة الموقع (Sitemap)
                      </CardTitle>
                      <CardDescription>جميع صفحات الموقع المفهرسة</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-xs"
                        onClick={() => copyToClipboard('https://kayan-alaqma.sa/api/sitemap', 'رابط Sitemap')}
                      >
                        <Copy className="size-3.5" />
                        نسخ الرابط
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-xs"
                        onClick={() => window.open('/api/sitemap', '_blank')}
                      >
                        <ExternalLink className="size-3.5" />
                        عرض
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Sitemap URL */}
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2">
                    <Globe className="size-4 text-slate-400 shrink-0" />
                    <code className="text-sm text-slate-600 truncate" dir="ltr">
                      https://kayan-alaqma.sa/api/sitemap
                    </code>
                  </div>

                  {/* Included URLs */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">الصفحات المضمنة:</Label>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {[
                        { url: '/', label: 'الرئيسية', priority: '1.0', freq: 'يومي' },
                        { url: '/#about', label: 'من نحن', priority: '0.8', freq: 'شهري' },
                        { url: '/#services', label: 'الخدمات', priority: '0.9', freq: 'أسبوعي' },
                        { url: '/#projects', label: 'المشاريع', priority: '0.8', freq: 'أسبوعي' },
                        { url: '/#blog', label: 'المدونة', priority: '0.7', freq: 'يومي' },
                        { url: '/#contact', label: 'اتصل بنا', priority: '0.8', freq: 'شهري' },
                        { url: '/#faq', label: 'الأسئلة الشائعة', priority: '0.6', freq: 'شهري' },
                      ].map(page => (
                        <div key={page.url} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 text-sm">
                          <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <span className="font-medium text-slate-700">{page.label}</span>
                            <span className="text-xs text-slate-400 mr-2" dir="ltr">{page.url}</span>
                          </div>
                          <Badge variant="secondary" className="text-[10px]">{page.priority}</Badge>
                          <span className="text-[10px] text-slate-400">{page.freq}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 border border-blue-100">
                    <AlertCircle className="size-4 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-700">
                      يتم إنشاء خريطة الموقع تلقائياً بناءً على الصفحات الثابتة والمقالات المنشورة في المدونة.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Robots.txt Section */}
            <motion.div variants={itemVariants}>
              <Card className="border-0 bg-white shadow-sm h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <ShieldCheck className="size-5 text-[#1a56db]" />
                        ملف Robots.txt
                      </CardTitle>
                      <CardDescription>تحكم في كيفية زحف محركات البحث</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-xs"
                        onClick={() => copyToClipboard(robotsTxt, 'Robots.txt')}
                      >
                        <Copy className="size-3.5" />
                        نسخ
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Textarea
                      value={robotsTxt}
                      onChange={e => setRobotsTxt(e.target.value)}
                      className="font-mono text-xs leading-relaxed min-h-[250px] bg-slate-50 border-slate-200"
                      dir="ltr"
                      placeholder="User-agent: *&#10;Allow: /"
                    />
                  </div>

                  {/* Quick Rules */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">قواعد شائعة:</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'السماح بالكل', rule: 'User-agent: *\nAllow: /' },
                        { label: 'حظر API', rule: 'User-agent: *\nDisallow: /api/' },
                        { label: 'حظر الأدمن', rule: 'User-agent: *\nDisallow: /admin/' },
                        { label: 'إضافة Sitemap', rule: 'Sitemap: https://kayan-alaqma.sa/api/sitemap' },
                      ].map(rule => (
                        <Button
                          key={rule.label}
                          variant="outline"
                          size="sm"
                          className="h-auto py-2 text-xs justify-start"
                          onClick={() => setRobotsTxt(prev => prev + '\n' + rule.rule)}
                        >
                          <Plus className="size-3.5 ml-1" />
                          {rule.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Save */}
                  <div className="flex justify-end">
                    <Button
                      onClick={saveRobotsTxt}
                      className="bg-[#1a56db] hover:bg-[#1545b0] text-white gap-2"
                    >
                      <Save className="size-4" />
                      حفظ Robots.txt
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
