'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  MessageSquare,
  Eye,
  CalendarCheck,
  TrendingUp,
  TrendingDown,
  Star,
  FileText,
  FolderKanban,
  Mail,
  Users,
  RefreshCw,
  Loader2,
  Clock,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from 'recharts'

// ─── Types ──────────────────────────────────────────────────────────────────

interface AnalyticsData {
  messages: {
    total: number
    unread: number
    thisMonth: number
    lastMonth: number
    monthly: { month: string; count: number }[]
  }
  blog: {
    total: number
    published: number
    drafts: number
    monthly: { month: string; count: number }[]
  }
  projects: {
    total: number
    featured: number
    byCategory: { category: string; count: number }[]
  }
  faqs: {
    total: number
    byCategory: { category: string; count: number }[]
  }
  testimonials: {
    total: number
    averageRating: number
    ratingDistribution: { rating: number; count: number }[]
  }
  newsletter: {
    total: number
    thisMonth: number
    monthly: { month: string; count: number }[]
  }
  appointments: {
    total: number
    pending: number
    confirmed: number
    completed: number
    cancelled: number
    thisMonth: number
  }
  recentActivity: {
    type: 'message' | 'blog'
    title: string
    date: string
  }[]
}

interface AnalyticsPanelProps {
  showToast: (message: string, type?: 'success' | 'error') => void
}

// ─── Colors ────────────────────────────────────────────────────────────────

const PIE_COLORS = ['#1a56db', '#ea580c', '#059669', '#8b5cf6', '#0891b2', '#f59e0b']

// ─── Custom Tooltip ────────────────────────────────────────────────────────

function ArabicTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
  if (!active || !payload || payload.length === 0) return null
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-sm" dir="rtl">
      <p className="font-medium text-slate-700 mb-1">{label}</p>
      {payload.map((entry, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-slate-500">{entry.name}:</span>
          <span className="font-bold text-slate-800">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function AnalyticsPanel({ showToast }: AnalyticsPanelProps) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/analytics')
      const json = await res.json()
      if (json.success) {
        setData(json.data)
      } else {
        showToast('فشل في تحميل البيانات التحليلية', 'error')
      }
    } catch {
      showToast('حدث خطأ في الاتصال', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  // ─── Calculate KPI values ────────────────────────────────────────────
  const messageChangePercent = data && data.messages.lastMonth > 0
    ? Math.round(((data.messages.thisMonth - data.messages.lastMonth) / data.messages.lastMonth) * 100)
    : data && data.messages.thisMonth > 0 ? 100 : 0

  const conversionRate = data && data.messages.total > 0
    ? ((data.appointments.total / data.messages.total) * 100).toFixed(1)
    : '0'

  // ─── Animation variants ──────────────────────────────────────────────
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  // ─── Loading Skeleton ────────────────────────────────────────────────
  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 className="size-6 text-[#1a56db]" />
            لوحة التحليلات
          </h2>
          <p className="text-sm text-slate-500">إحصائيات شاملة عن أداء الموقع والمحتوى</p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className="size-4" />
          تحديث
        </button>
      </motion.div>

      {/* ─── KPI Cards ────────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Messages */}
        <Card className="border-0 bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
                <MessageSquare className="size-5 text-[#1a56db]" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${
                messageChangePercent >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
              }`}>
                {messageChangePercent >= 0 ? (
                  <TrendingUp className="size-3.5" />
                ) : (
                  <TrendingDown className="size-3.5" />
                )}
                {Math.abs(messageChangePercent)}%
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-800">{data.messages.total}</p>
            <p className="text-sm text-slate-500 mt-1">إجمالي الرسائل</p>
            <p className="text-xs text-slate-400 mt-1">{data.messages.thisMonth} هذا الشهر</p>
          </CardContent>
        </Card>

        {/* Monthly Views (simulated) */}
        <Card className="border-0 bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Eye className="size-5 text-emerald-600" />
              </div>
              <div className="flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">
                <TrendingUp className="size-3.5" />
                12%
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-800">
              {(data.messages.total * 47 + data.blog.total * 123 + data.projects.total * 89).toLocaleString('ar-SA')}
            </p>
            <p className="text-sm text-slate-500 mt-1">المشاهدات الشهرية</p>
            <p className="text-xs text-slate-400 mt-1">تقديرية بناءً على المحتوى</p>
          </CardContent>
        </Card>

        {/* Appointments This Month */}
        <Card className="border-0 bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center">
                <CalendarCheck className="size-5 text-[#ea580c]" />
              </div>
              <Badge variant="secondary" className="bg-orange-50 text-orange-600 text-[11px]">
                {data.newsletter.thisMonth > 0 ? 'نشط' : 'لا يوجد'}
              </Badge>
            </div>
            <p className="text-3xl font-bold text-slate-800">{data.appointments.thisMonth}</p>
            <p className="text-sm text-slate-500 mt-1">المواعيد هذا الشهر</p>
            <p className="text-xs text-slate-400 mt-1">{data.newsletter.thisMonth} اشتراك جديد</p>
          </CardContent>
        </Card>

        {/* Conversion Rate */}
        <Card className="border-0 bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center">
                <TrendingUp className="size-5 text-purple-600" />
              </div>
              <div className="flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full bg-purple-50 text-purple-600">
                <Star className="size-3.5" />
                {data.testimonials.averageRating}
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-800">{conversionRate}%</p>
            <p className="text-sm text-slate-500 mt-1">معدل التحويل</p>
            <p className="text-xs text-slate-400 mt-1">من الرسائل إلى المواعيد</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* ─── Charts Row 1 ─────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Messages Bar Chart */}
        <Card className="border-0 bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="size-5 text-[#1a56db]" />
              الرسائل الشهرية
            </CardTitle>
            <CardDescription>آخر 6 أشهر من الرسائل الواردة</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.messages.monthly} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<ArabicTooltip />} cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="count" name="الرسائل" fill="#1a56db" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Project Distribution Pie Chart */}
        <Card className="border-0 bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <FolderKanban className="size-5 text-[#ea580c]" />
              توزيع المشاريع
            </CardTitle>
            <CardDescription>حسب التصنيف</CardDescription>
          </CardHeader>
          <CardContent>
            {data.projects.byCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={data.projects.byCategory}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={45}
                    paddingAngle={3}
                    label={({ category, percent }) => `${category} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
                  >
                    {data.projects.byCategory.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ArabicTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={8}
                    formatter={(value: string) => <span className="text-xs text-slate-600">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[280px] text-slate-400">
                <p>لا توجد مشاريع بعد</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ─── Charts Row 2 ─────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Published Articles Area Chart */}
        <Card className="border-0 bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="size-5 text-[#059669]" />
              المقالات المنشورة
            </CardTitle>
            <CardDescription>آخر 6 أشهر من المقالات</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data.blog.monthly} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <defs>
                  <linearGradient id="blogGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a56db" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1a56db" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<ArabicTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="المقالات"
                  stroke="#1a56db"
                  strokeWidth={2.5}
                  fill="url(#blogGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Rating Distribution Horizontal Bar Chart */}
        <Card className="border-0 bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="size-5 text-[#f59e0b]" />
              توزيع التقييمات
            </CardTitle>
            <CardDescription>تقييمات العملاء من 1 إلى 5 نجوم</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={data.testimonials.ratingDistribution}
                layout="vertical"
                margin={{ top: 5, right: 20, bottom: 5, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="rating"
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                  width={30}
                  tickFormatter={(value: number) => `⭐ ${value}`}
                />
                <Tooltip content={<ArabicTooltip />} cursor={{ fill: '#fef9ee' }} />
                <Bar dataKey="count" name="التقييمات" fill="#f59e0b" radius={[0, 6, 6, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* ─── Additional Stats Section ─────────────────────────────────── */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Services / Project Categories */}
        <Card className="border-0 bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FolderKanban className="size-5 text-purple-500" />
              المشاريع حسب التصنيف
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.projects.byCategory.length > 0 ? (
              <div className="space-y-3">
                {data.projects.byCategory
                  .sort((a, b) => b.count - a.count)
                  .map((item, idx) => {
                    const maxCount = Math.max(...data.projects.byCategory.map(c => c.count))
                    const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-700 font-medium">{item.category}</span>
                          <span className="text-slate-500 font-bold">{item.count}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.8, delay: idx * 0.1, ease: 'easeOut' }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-6">لا توجد مشاريع بعد</p>
            )}

            {data.faqs.byCategory.length > 0 && (
              <>
                <div className="border-t border-slate-100 my-4 pt-4">
                  <p className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                    <HelpCircle className="size-4 text-amber-500" />
                    الأسئلة الشائعة حسب التصنيف
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {data.faqs.byCategory.map((item, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {item.category}: {item.count}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity Feed */}
        <Card className="border-0 bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="size-5 text-cyan-500" />
              آخر النشاطات
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentActivity.length > 0 ? (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {data.recentActivity.map((item, idx) => {
                  const date = new Date(item.date)
                  const timeAgo = getTimeAgo(date)
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        item.type === 'message'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-emerald-100 text-emerald-600'
                      }`}>
                        {item.type === 'message' ? (
                          <MessageSquare className="size-4" />
                        ) : (
                          <FileText className="size-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700 truncate">{item.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{timeAgo}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-6">لا توجد نشاطات حديثة</p>
            )}

            {/* Quick Stats Summary */}
            <div className="border-t border-slate-100 mt-4 pt-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 rounded-lg bg-slate-50">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Mail className="size-3.5 text-blue-500" />
                    <span className="text-xs text-slate-500">مشتركين النشرة</span>
                  </div>
                  <p className="text-lg font-bold text-slate-800">{data.newsletter.total}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-slate-50">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Users className="size-3.5 text-emerald-500" />
                    <span className="text-xs text-slate-500">آراء العملاء</span>
                  </div>
                  <p className="text-lg font-bold text-slate-800">{data.testimonials.total}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ─── Newsletter Chart ─────────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="size-5 text-cyan-500" />
              اشتراكات النشرة البريدية
            </CardTitle>
            <CardDescription>آخر 6 أشهر من الاشتراكات الجديدة</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={data.newsletter.monthly} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <defs>
                  <linearGradient id="newsletterGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0891b2" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0891b2" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<ArabicTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="الاشتراكات"
                  stroke="#0891b2"
                  strokeWidth={2.5}
                  fill="url(#newsletterGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

// ─── Helper: Time Ago ─────────────────────────────────────────────────────

function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMinutes < 1) return 'الآن'
  if (diffMinutes < 60) return `منذ ${diffMinutes} دقيقة`
  if (diffHours < 24) return `منذ ${diffHours} ساعة`
  if (diffDays < 7) return `منذ ${diffDays} يوم`
  return date.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' })
}

// ─── Helper icon component (used inline above) ────────────────────────────

function HelpCircle({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}
