'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  FolderKanban,
  HelpCircle,
  MessageSquare,
  Settings,
  X,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  ChevronLeft,
  BarChart3,
  Send,
  Phone,
  Mail,
  MapPin,
  Clock,
  ImageIcon,
  Star,
  Globe,
  Lock,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Search,
  Download,
  Calendar,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import SeoPanel from '@/components/admin/SeoPanel'
import AnalyticsPanel from '@/components/admin/AnalyticsPanel'

// ─── Types ──────────────────────────────────────────────────────────────────

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  content: string
  coverImage?: string | null
  metaDescription?: string | null
  published: boolean
  createdAt: string
  updatedAt: string
}

interface Service {
  id: string
  title: string
  description: string
  icon?: string | null
  features?: string | null
  order: number
}

interface Project {
  id: string
  title: string
  description: string
  image?: string | null
  category?: string | null
  clientName?: string | null
  location?: string | null
  completedAt?: string | null
  featured: boolean
  createdAt: string
}

interface FAQ {
  id: string
  question: string
  answer: string
  category?: string | null
  order: number
}

interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string | null
  subject?: string | null
  message: string
  read: boolean
  createdAt: string
}

interface NewsletterSubscriber {
  id: string
  email: string
  isActive: boolean
  createdAt: string
}

interface SiteSettings {
  siteName: string
  phone: string
  email: string
  address: string
  workingHours: string
  whatsapp: string
  twitter: string
  instagram: string
  linkedin: string
  description: string
}

interface Testimonial {
  id: string
  name: string
  role?: string | null
  content: string
  rating: number
  avatar?: string | null
}

interface Appointment {
  id: string
  name: string
  phone: string
  email?: string | null
  serviceType: string
  date: string
  time: string
  notes?: string | null
  status: string
  createdAt: string
  updatedAt: string
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function generateSlug(title: string): string {
  const arabicToLatinMap: Record<string, string> = {
    'ا': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': 'h', 'خ': 'kh',
    'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh', 'ص': 's',
    'ض': 'dh', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
    'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'y',
    'ء': '', 'ة': 'h', 'ى': 'a', 'لا': 'la',
    'أ': 'a', 'إ': 'i', 'آ': 'aa', 'ؤ': 'w', 'ئ': 'y',
    ' ': '-', '/': '-', '\\': '-',
  }

  let slug = ''
  for (const char of title) {
    slug += arabicToLatinMap[char] || char
  }
  slug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '')
  if (slug.length < 3) slug = slug + '-' + Date.now().toString(36)
  return slug
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function truncateText(text: string, maxLen: number = 50): string {
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen) + '...'
}

// ─── Sidebar Config ─────────────────────────────────────────────────────────

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'لوحة التحكم', icon: <LayoutDashboard className="size-5" /> },
  { id: 'blog', label: 'المدونة', icon: <FileText className="size-5" /> },
  { id: 'services', label: 'الخدمات', icon: <Briefcase className="size-5" /> },
  { id: 'projects', label: 'المشاريع', icon: <FolderKanban className="size-5" /> },
  { id: 'faqs', label: 'الأسئلة الشائعة', icon: <HelpCircle className="size-5" /> },
  { id: 'messages', label: 'الرسائل', icon: <MessageSquare className="size-5" /> },
  { id: 'settings', label: 'الإعدادات', icon: <Settings className="size-5" /> },
  { id: 'testimonials', label: 'آراء العملاء', icon: <Star className="size-5" /> },
  { id: 'newsletter', label: 'النشرة البريدية', icon: <Mail className="size-5" /> },
  { id: 'analytics', label: 'التحليلات', icon: <BarChart3 className="size-5" /> },
  { id: 'seo', label: 'تحسين محركات البحث', icon: <Search className="size-5" /> },
  { id: 'appointments', label: 'حجز المواعيد', icon: <Calendar className="size-5" /> },
]

// ─── Component ──────────────────────────────────────────────────────────────

interface AdminDashboardProps {
  onClose?: () => void
}

export default function AdminDashboard({ onClose }: AdminDashboardProps) {
  // Core state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Data state
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)

  // Dialog state
  const [blogDialogOpen, setBlogDialogOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<Partial<BlogPost> | null>(null)
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null)
  const [projectDialogOpen, setProjectDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null)
  const [faqDialogOpen, setFaqDialogOpen] = useState(false)
  const [editingFaq, setEditingFaq] = useState<Partial<FAQ> | null>(null)
  const [messageViewOpen, setMessageViewOpen] = useState(false)
  const [viewingMessage, setViewingMessage] = useState<ContactMessage | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string } | null>(null)

  // Form state
  const [blogForm, setBlogForm] = useState({ title: '', slug: '', excerpt: '', content: '', coverImage: '', metaDescription: '', published: true })
  const [serviceForm, setServiceForm] = useState({ title: '', description: '', icon: '', features: '', order: 0 })
  const [projectForm, setProjectForm] = useState({ title: '', description: '', image: '', category: '', clientName: '', location: '', featured: false, completedAt: '' })
  const [faqForm, setFaqForm] = useState({ question: '', answer: '', category: '', order: 0 })
  const [settingsForm, setSettingsForm] = useState<Partial<SiteSettings>>({})

  // Newsletter state
  const [newsletterList, setNewsletterList] = useState<NewsletterSubscriber[]>([])

  // Testimonial state
  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>([])
  const [testimonialDialogOpen, setTestimonialDialogOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null)
  const [testimonialForm, setTestimonialForm] = useState({ name: '', role: '', content: '', rating: 5, avatar: '' })

  // Appointment state
  const [appointmentsList, setAppointmentsList] = useState<Appointment[]>([])
  const [appointmentFilter, setAppointmentFilter] = useState('all')
  const [appointmentViewOpen, setAppointmentViewOpen] = useState(false)
  const [viewingAppointment, setViewingAppointment] = useState<Appointment | null>(null)

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // ─── Toast ──────────────────────────────────────────────────────────────
  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  // ─── Data Fetching ──────────────────────────────────────────────────────
  const fetchAllData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [blogRes, servicesRes, projectsRes, faqsRes, messagesRes, settingsRes, testimonialsRes, newsletterRes] = await Promise.all([
        fetch('/api/blog').then(r => r.json()),
        fetch('/api/services').then(r => r.json()),
        fetch('/api/projects').then(r => r.json()),
        fetch('/api/faqs').then(r => r.json()),
        fetch('/api/messages').then(r => r.json()),
        fetch('/api/settings').then(r => r.json()),
        fetch('/api/testimonials').then(r => r.json()),
        fetch('/api/admin/newsletter').then(r => r.json()),
      ])

      if (blogRes.success) setBlogPosts(blogRes.data)
      if (servicesRes.success) setServices(servicesRes.data)
      if (projectsRes.success) setProjects(projectsRes.data)
      if (faqsRes.success) setFaqs(faqsRes.data)
      if (messagesRes.success) {
        setMessages(messagesRes.data)
        setUnreadCount(messagesRes.data.filter((m: ContactMessage) => !m.read).length)
      }
      if (settingsRes.success) {
        setSettings(settingsRes.data)
        setSettingsForm(settingsRes.data)
      }
      if (testimonialsRes.success) setTestimonialsList(testimonialsRes.data)
      if (newsletterRes.success) setNewsletterList(newsletterRes.data)
    } catch {
      showToast('فشل في تحميل البيانات', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData()
    }
  }, [isAuthenticated, fetchAllData])

  // ─── Keyboard shortcut ──────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isAuthenticated) {
          setIsAuthenticated(false)
          setLoginError('')
        } else {
          onClose?.()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isAuthenticated])

  // ─── Login ──────────────────────────────────────────────────────────────
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'admin123') {
      setIsAuthenticated(true)
      setLoginError('')
      setPassword('')
    } else {
      setLoginError('كلمة المرور غير صحيحة')
    }
  }

  // ─── Blog CRUD ──────────────────────────────────────────────────────────
  const handleBlogTitleChange = (title: string) => {
    setBlogForm(prev => ({ ...prev, title, slug: generateSlug(title) }))
  }

  const openBlogDialog = (post?: BlogPost) => {
    if (post) {
      setEditingBlog(post)
      setBlogForm({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || '',
        content: post.content,
        coverImage: post.coverImage || '',
        metaDescription: post.metaDescription || '',
        published: post.published,
      })
    } else {
      setEditingBlog(null)
      setBlogForm({ title: '', slug: '', excerpt: '', content: '', coverImage: '', metaDescription: '', published: true })
    }
    setBlogDialogOpen(true)
  }

  const saveBlog = async () => {
    if (!blogForm.title || !blogForm.content) {
      showToast('يرجى ملء الحقول المطلوبة', 'error')
      return
    }
    try {
      const url = editingBlog?.id ? '/api/blog' : '/api/blog'
      const method = editingBlog?.id ? 'PUT' : 'POST'
      const body = editingBlog?.id ? { id: editingBlog.id, ...blogForm } : blogForm

      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()

      if (data.success) {
        showToast(editingBlog?.id ? 'تم تحديث المقال بنجاح' : 'تم إنشاء المقال بنجاح')
        setBlogDialogOpen(false)
        fetchAllData()
      } else {
        showToast(data.error || 'حدث خطأ', 'error')
      }
    } catch {
      showToast('حدث خطأ في الاتصال', 'error')
    }
  }

  const toggleBlogPublished = async (post: BlogPost) => {
    try {
      const res = await fetch('/api/blog', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: post.id, published: !post.published }),
      })
      const data = await res.json()
      if (data.success) {
        showToast(post.published ? 'تم إلغاء نشر المقال' : 'تم نشر المقال')
        fetchAllData()
      }
    } catch {
      showToast('حدث خطأ', 'error')
    }
  }

  // ─── Service CRUD ───────────────────────────────────────────────────────
  const openServiceDialog = (service?: Service) => {
    if (service) {
      setEditingService(service)
      setServiceForm({
        title: service.title,
        description: service.description,
        icon: service.icon || '',
        features: service.features || '',
        order: service.order,
      })
    } else {
      setEditingService(null)
      setServiceForm({ title: '', description: '', icon: '', features: '', order: 0 })
    }
    setServiceDialogOpen(true)
  }

  const saveService = async () => {
    if (!serviceForm.title || !serviceForm.description) {
      showToast('يرجى ملء الحقول المطلوبة', 'error')
      return
    }
    try {
      const method = editingService?.id ? 'PUT' : 'POST'
      const body = editingService?.id ? { id: editingService.id, ...serviceForm } : serviceForm

      const res = await fetch('/api/services', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()

      if (data.success) {
        showToast(editingService?.id ? 'تم تحديث الخدمة بنجاح' : 'تم إنشاء الخدمة بنجاح')
        setServiceDialogOpen(false)
        fetchAllData()
      } else {
        showToast(data.error || 'حدث خطأ', 'error')
      }
    } catch {
      showToast('حدث خطأ في الاتصال', 'error')
    }
  }

  // ─── Project CRUD ───────────────────────────────────────────────────────
  const openProjectDialog = (project?: Project) => {
    if (project) {
      setEditingProject(project)
      setProjectForm({
        title: project.title,
        description: project.description,
        image: project.image || '',
        category: project.category || '',
        clientName: project.clientName || '',
        location: project.location || '',
        featured: project.featured,
        completedAt: project.completedAt ? project.completedAt.split('T')[0] : '',
      })
    } else {
      setEditingProject(null)
      setProjectForm({ title: '', description: '', image: '', category: '', clientName: '', location: '', featured: false, completedAt: '' })
    }
    setProjectDialogOpen(true)
  }

  const saveProject = async () => {
    if (!projectForm.title || !projectForm.description) {
      showToast('يرجى ملء الحقول المطلوبة', 'error')
      return
    }
    try {
      const method = editingProject?.id ? 'PUT' : 'POST'
      const body: Record<string, unknown> = editingProject?.id
        ? { id: editingProject.id, ...projectForm }
        : { ...projectForm }
      if (projectForm.completedAt) {
        body.completedAt = new Date(projectForm.completedAt).toISOString()
      } else {
        body.completedAt = null
      }

      const res = await fetch('/api/projects', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()

      if (data.success) {
        showToast(editingProject?.id ? 'تم تحديث المشروع بنجاح' : 'تم إنشاء المشروع بنجاح')
        setProjectDialogOpen(false)
        fetchAllData()
      } else {
        showToast(data.error || 'حدث خطأ', 'error')
      }
    } catch {
      showToast('حدث خطأ في الاتصال', 'error')
    }
  }

  // ─── FAQ CRUD ───────────────────────────────────────────────────────────
  const openFaqDialog = (faq?: FAQ) => {
    if (faq) {
      setEditingFaq(faq)
      setFaqForm({ question: faq.question, answer: faq.answer, category: faq.category || '', order: faq.order })
    } else {
      setEditingFaq(null)
      setFaqForm({ question: '', answer: '', category: '', order: 0 })
    }
    setFaqDialogOpen(true)
  }

  const saveFaq = async () => {
    if (!faqForm.question || !faqForm.answer) {
      showToast('يرجى ملء الحقول المطلوبة', 'error')
      return
    }
    try {
      const method = editingFaq?.id ? 'PUT' : 'POST'
      const body = editingFaq?.id ? { id: editingFaq.id, ...faqForm } : faqForm

      const res = await fetch('/api/faqs', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()

      if (data.success) {
        showToast(editingFaq?.id ? 'تم تحديث السؤال بنجاح' : 'تم إنشاء السؤال بنجاح')
        setFaqDialogOpen(false)
        fetchAllData()
      } else {
        showToast(data.error || 'حدث خطأ', 'error')
      }
    } catch {
      showToast('حدث خطأ في الاتصال', 'error')
    }
  }

  // ─── Messages ───────────────────────────────────────────────────────────
  const viewMessage = async (msg: ContactMessage) => {
    setViewingMessage(msg)
    setMessageViewOpen(true)
    if (!msg.read) {
      try {
        await fetch('/api/messages', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: msg.id, read: true }),
        })
        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m))
        setUnreadCount(prev => Math.max(0, prev - 1))
      } catch { /* silent */ }
    }
  }

  const toggleMessageRead = async (msg: ContactMessage) => {
    try {
      await fetch('/api/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: msg.id, read: !msg.read }),
      })
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: !m.read } : m))
      setUnreadCount(prev => msg.read ? prev + 1 : Math.max(0, prev - 1))
    } catch { /* silent */ }
  }

  // ─── Delete ─────────────────────────────────────────────────────────────
  const confirmDelete = (type: string, id: string) => {
    setDeleteTarget({ type, id })
    setDeleteDialogOpen(true)
  }

  const executeDelete = async () => {
    if (!deleteTarget) return
    try {
      const apiMap: Record<string, string> = {
        blog: '/api/blog',
        services: '/api/services',
        projects: '/api/projects',
        faqs: '/api/faqs',
        messages: '/api/messages',
        testimonials: '/api/admin/testimonials',
      }
      const url = apiMap[deleteTarget.type]
      if (!url) return

      const deleteUrl = deleteTarget.type === 'testimonials'
        ? `${url}/${deleteTarget.id}`
        : `${url}?id=${deleteTarget.id}`
      const res = await fetch(deleteUrl, { method: 'DELETE' })
      const data = await res.json()

      if (data.success) {
        showToast('تم الحذف بنجاح')
        fetchAllData()
      } else {
        showToast(data.error || 'حدث خطأ أثناء الحذف', 'error')
      }
    } catch {
      showToast('حدث خطأ في الاتصال', 'error')
    } finally {
      setDeleteDialogOpen(false)
      setDeleteTarget(null)
    }
  }

  // ─── Newsletter ──────────────────────────────────────────────────────
  const fetchNewsletter = async () => {
    try {
      const res = await fetch('/api/admin/newsletter')
      const data = await res.json()
      if (data.success) setNewsletterList(data.data)
    } catch { /* silent */ }
  }

  const deleteNewsletterSubscriber = async (email: string) => {
    try {
      const res = await fetch(`/api/admin/newsletter?email=${encodeURIComponent(email)}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        showToast('تم حذف المشترك بنجاح')
        fetchNewsletter()
        fetchAllData()
      } else {
        showToast(data.message || 'حدث خطأ أثناء الحذف', 'error')
      }
    } catch {
      showToast('حدث خطأ في الاتصال', 'error')
    }
  }

  const exportNewsletterCSV = () => {
    if (newsletterList.length === 0) return
    const BOM = '\uFEFF'
    const header = 'البريد الإلكتروني,الحالة,تاريخ الاشتراك\n'
    const rows = newsletterList.map(s =>
      `${s.email},${s.isActive ? 'نشط' : 'غير نشط'},${formatDate(s.createdAt)}`
    ).join('\n')
    const blob = new Blob([BOM + header + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    showToast('تم تصدير المشتركين بنجاح')
  }

  // ─── Testimonial CRUD ────────────────────────────────────────────────
  const openTestimonialDialog = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial)
      setTestimonialForm({
        name: testimonial.name,
        role: testimonial.role || '',
        content: testimonial.content,
        rating: testimonial.rating,
        avatar: testimonial.avatar || '',
      })
    } else {
      setEditingTestimonial(null)
      setTestimonialForm({ name: '', role: '', content: '', rating: 5, avatar: '' })
    }
    setTestimonialDialogOpen(true)
  }

  const saveTestimonial = async () => {
    if (!testimonialForm.name || !testimonialForm.content) {
      showToast('يرجى ملء الحقول المطلوبة', 'error')
      return
    }
    try {
      let res: Response
      if (editingTestimonial?.id) {
        res = await fetch(`/api/admin/testimonials/${editingTestimonial.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testimonialForm),
        })
      } else {
        res = await fetch('/api/admin/testimonials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testimonialForm),
        })
      }
      const data = await res.json()
      if (data.success) {
        showToast(editingTestimonial?.id ? 'تم تحديث الرأي بنجاح' : 'تم إنشاء الرأي بنجاح')
        setTestimonialDialogOpen(false)
        fetchAllData()
      } else {
        showToast(data.error || 'حدث خطأ', 'error')
      }
    } catch {
      showToast('حدث خطأ في الاتصال', 'error')
    }
  }

  // ─── Settings ───────────────────────────────────────────────────────────
  const saveSettings = async () => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm),
      })
      const data = await res.json()
      if (data.success) {
        showToast('تم حفظ الإعدادات بنجاح')
        setSettings(settingsForm as SiteSettings)
        // Update global settings store so all components reflect changes immediately
        const { useSettingsStore } = await import('@/hooks/useSettings')
        useSettingsStore.getState().updateSettings(settingsForm as SiteSettings)
      } else {
        showToast(data.error || 'حدث خطأ', 'error')
      }
    } catch {
      showToast('حدث خطأ في الاتصال', 'error')
    }
  }

  // ─── Appointments ───────────────────────────────────────────────
  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/admin/appointments')
      const data = await res.json()
      if (data.success) setAppointmentsList(data.data)
    } catch { /* silent */ }
  }

  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const data = await res.json()
      if (data.success) {
        showToast('تم تحديث حالة الموعد بنجاح')
        fetchAppointments()
      } else {
        showToast(data.message || 'حدث خطأ', 'error')
      }
    } catch {
      showToast('حدث خطأ في الاتصال', 'error')
    }
  }

  const deleteAppointment = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        showToast('تم حذف الموعد بنجاح')
        fetchAppointments()
      } else {
        showToast(data.message || 'حدث خطأ أثناء الحذف', 'error')
      }
    } catch {
      showToast('حدث خطأ في الاتصال', 'error')
    }
  }

  useEffect(() => {
    if (isAuthenticated && activeTab === 'appointments') {
      fetchAppointments()
    }
  }, [isAuthenticated, activeTab])

  const filteredAppointments = appointmentFilter === 'all'
    ? appointmentsList
    : appointmentsList.filter(a => a.status === appointmentFilter)

  const appointmentStats = {
    total: appointmentsList.length,
    pending: appointmentsList.filter(a => a.status === 'pending').length,
    confirmed: appointmentsList.filter(a => a.status === 'confirmed').length,
    completed: appointmentsList.filter(a => a.status === 'completed').length,
  }

  const statusLabels: Record<string, string> = {
    pending: 'قيد الانتظار',
    confirmed: 'مؤكد',
    completed: 'مكتمل',
    cancelled: 'ملغي',
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    completed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  // ─── Dashboard Stats ────────────────────────────────────────────────────
  const statCards = [
    { label: 'إجمالي المقالات', value: blogPosts.length, icon: <FileText className="size-6" />, color: 'bg-blue-500', tab: 'blog' },
    { label: 'الخدمات', value: services.length, icon: <Briefcase className="size-6" />, color: 'bg-emerald-500', tab: 'services' },
    { label: 'المشاريع', value: projects.length, icon: <FolderKanban className="size-6" />, color: 'bg-purple-500', tab: 'projects' },
    { label: 'الأسئلة الشائعة', value: faqs.length, icon: <HelpCircle className="size-6" />, color: 'bg-amber-500', tab: 'faqs' },
    { label: 'رسائل غير مقروءة', value: unreadCount, icon: <MessageSquare className="size-6" />, color: 'bg-red-500', tab: 'messages' },
    { label: 'إجمالي الرسائل', value: messages.length, icon: <BarChart3 className="size-6" />, color: 'bg-cyan-500', tab: 'messages' },
  ]

  // ─── Render: Login Screen ───────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900"
      >
        <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center opacity-10" />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-md mx-4"
        >
          <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
            <CardHeader className="text-center space-y-4 pb-2">
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2 }}
                className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1a56db] to-[#ea580c] flex items-center justify-center"
              >
                <Lock className="size-10 text-white" />
              </motion.div>
              <CardTitle className="text-2xl font-bold text-white">
                لوحة الإدارة
              </CardTitle>
              <CardDescription className="text-slate-300">
                شركة كيان القمة - تسجيل الدخول
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">كلمة المرور</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setLoginError('') }}
                    placeholder="أدخل كلمة المرور"
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-[#1a56db] h-12 text-base"
                    dir="ltr"
                  />
                </div>
                {loginError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm flex items-center gap-1"
                  >
                    <AlertCircle className="size-4" />
                    {loginError}
                  </motion.p>
                )}
                <Button
                  type="submit"
                  className="w-full h-12 text-base bg-gradient-to-l from-[#1a56db] to-[#1a56db] hover:from-[#1545b0] hover:to-[#1545b0] text-white font-semibold"
                >
                  دخول
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    )
  }

  // ─── Render: Admin Dashboard ────────────────────────────────────────────
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex bg-slate-50"
        dir="rtl"
      >
        {/* ─── Sidebar ─────────────────────────────────────────────────── */}
        <motion.aside
          initial={{ x: 100 }}
          animate={{ x: 0, width: sidebarOpen ? 260 : 72 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="h-screen bg-white border-l border-slate-200 shadow-sm flex flex-col shrink-0 overflow-hidden"
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a56db] to-[#ea580c] flex items-center justify-center shrink-0">
                <Globe className="size-5 text-white" />
              </div>
              {sidebarOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
                  <h2 className="font-bold text-slate-800 text-sm whitespace-nowrap">كيان القمة</h2>
                  <p className="text-xs text-slate-400 whitespace-nowrap">لوحة الإدارة</p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Nav Items */}
          <ScrollArea className="flex-1 py-2">
            <nav className="space-y-1 px-2">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium group ${
                    activeTab === item.id
                      ? 'bg-[#1a56db]/10 text-[#1a56db]'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                  }`}
                >
                  <span className={`shrink-0 ${activeTab === item.id ? 'text-[#1a56db]' : 'text-slate-400 group-hover:text-slate-600'}`}>
                    {item.icon}
                  </span>
                  {sidebarOpen && (
                    <span className="whitespace-nowrap">{item.label}</span>
                  )}
                  {item.id === 'messages' && unreadCount > 0 && (
                    <Badge className="mr-auto bg-red-500 text-white text-[10px] px-1.5 py-0 min-w-[20px] text-center">
                      {unreadCount}
                    </Badge>
                  )}
                </button>
              ))}
            </nav>
          </ScrollArea>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-slate-100 space-y-1">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all text-sm"
            >
              <ChevronLeft className={`size-5 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
              {sidebarOpen && <span>طي القائمة</span>}
            </button>
            <button
              onClick={() => { setIsAuthenticated(false); setLoginError('') }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all text-sm"
            >
              <LogOut className="size-5" />
              {sidebarOpen && <span>تسجيل الخروج</span>}
            </button>
          </div>
        </motion.aside>

        {/* ─── Main Content ────────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-bold text-slate-800">
                {navItems.find(n => n.id === activeTab)?.label || 'لوحة التحكم'}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fetchAllData()}
                disabled={isLoading}
                className="text-slate-500 hover:text-slate-700"
              >
                <RefreshCw className={`size-4 ${isLoading ? 'animate-spin' : ''}`} />
                {sidebarOpen && <span className="mr-2">تحديث</span>}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { onClose?.() }}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <X className="size-4 ml-1" />
                إغلاق
              </Button>
            </div>
          </header>

          {/* Content Area */}
          <ScrollArea className="flex-1">
            <div className="p-6 max-w-7xl mx-auto">
              {isLoading && blogPosts.length === 0 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <Skeleton key={i} className="h-32 rounded-xl" />
                    ))}
                  </div>
                  <Skeleton className="h-96 rounded-xl" />
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* ─── Dashboard Overview ──────────────────────────── */}
                    {activeTab === 'dashboard' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {statCards.map((stat, idx) => (
                            <motion.div
                              key={stat.label}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05 }}
                            >
                              <Card
                                className="cursor-pointer hover:shadow-md transition-shadow border-0 bg-white shadow-sm"
                                onClick={() => setActiveTab(stat.tab)}
                              >
                                <CardContent className="p-4 flex items-center gap-4">
                                  <div className={`${stat.color} text-white rounded-xl p-3`}>
                                    {stat.icon}
                                  </div>
                                  <div>
                                    <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                                    <p className="text-sm text-slate-500">{stat.label}</p>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>

                        {/* Recent Messages */}
                        <Card className="border-0 bg-white shadow-sm">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">آخر الرسائل</CardTitle>
                              <Button variant="ghost" size="sm" onClick={() => setActiveTab('messages')}>
                                عرض الكل
                                <ChevronLeft className="size-4 mr-1" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            {messages.length === 0 ? (
                              <p className="text-slate-400 text-center py-8">لا توجد رسائل بعد</p>
                            ) : (
                              <div className="space-y-3">
                                {messages.slice(0, 5).map(msg => (
                                  <div
                                    key={msg.id}
                                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-slate-50 ${!msg.read ? 'bg-blue-50/50 border border-blue-100' : ''}`}
                                    onClick={() => viewMessage(msg)}
                                  >
                                    <div className={`w-2 h-2 rounded-full shrink-0 ${!msg.read ? 'bg-blue-500' : 'bg-slate-300'}`} />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm text-slate-700">{msg.name}</span>
                                        <span className="text-xs text-slate-400">{formatDate(msg.createdAt)}</span>
                                      </div>
                                      <p className="text-xs text-slate-500 truncate">{msg.subject || truncateText(msg.message, 60)}</p>
                                    </div>
                                    {!msg.read && <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-[10px]">جديد</Badge>}
                                  </div>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        {/* Recent Blog Posts */}
                        <Card className="border-0 bg-white shadow-sm">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">آخر المقالات</CardTitle>
                              <Button variant="ghost" size="sm" onClick={() => setActiveTab('blog')}>
                                عرض الكل
                                <ChevronLeft className="size-4 mr-1" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            {blogPosts.length === 0 ? (
                              <p className="text-slate-400 text-center py-8">لا توجد مقالات بعد</p>
                            ) : (
                              <div className="space-y-3">
                                {blogPosts.slice(0, 5).map(post => (
                                  <div key={post.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                                      <FileText className="size-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-sm text-slate-700 truncate">{post.title}</p>
                                      <p className="text-xs text-slate-400">{formatDate(post.createdAt)}</p>
                                    </div>
                                    <Badge variant={post.published ? 'default' : 'secondary'} className={post.published ? 'bg-emerald-100 text-emerald-700' : ''}>
                                      {post.published ? 'منشور' : 'مسودة'}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {/* ─── Blog Management ─────────────────────────────── */}
                    {activeTab === 'blog' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-xl font-bold text-slate-800">إدارة المدونة</h2>
                            <p className="text-sm text-slate-500">{blogPosts.length} مقال</p>
                          </div>
                          <Button onClick={() => openBlogDialog()} className="bg-[#1a56db] hover:bg-[#1545b0] text-white">
                            <Plus className="size-4 ml-1" />
                            إضافة مقال
                          </Button>
                        </div>

                        <Card className="border-0 bg-white shadow-sm">
                          <CardContent className="p-0">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-slate-50">
                                  <TableHead className="text-right">العنوان</TableHead>
                                  <TableHead className="text-right">المسار</TableHead>
                                  <TableHead className="text-right">التاريخ</TableHead>
                                  <TableHead className="text-right">الحالة</TableHead>
                                  <TableHead className="text-right">الإجراءات</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {blogPosts.length === 0 ? (
                                  <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12 text-slate-400">
                                      لا توجد مقالات بعد. اضغط &quot;إضافة مقال&quot; لإنشاء واحد جديد.
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  blogPosts.map(post => (
                                    <TableRow key={post.id}>
                                      <TableCell className="font-medium text-slate-700 max-w-[200px] truncate">
                                        {truncateText(post.title, 40)}
                                      </TableCell>
                                      <TableCell className="text-slate-400 text-xs max-w-[150px] truncate" dir="ltr">
                                        {truncateText(post.slug, 25)}
                                      </TableCell>
                                      <TableCell className="text-slate-500 text-sm">
                                        {formatDate(post.createdAt)}
                                      </TableCell>
                                      <TableCell>
                                        <Switch
                                          checked={post.published}
                                          onCheckedChange={() => toggleBlogPublished(post)}
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <div className="flex items-center gap-1">
                                          <Button variant="ghost" size="icon" className="size-8" onClick={() => openBlogDialog(post)}>
                                            <Pencil className="size-4 text-blue-500" />
                                          </Button>
                                          <Button variant="ghost" size="icon" className="size-8" onClick={() => confirmDelete('blog', post.id)}>
                                            <Trash2 className="size-4 text-red-500" />
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))
                                )}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {/* ─── Services Management ─────────────────────────── */}
                    {activeTab === 'services' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-xl font-bold text-slate-800">إدارة الخدمات</h2>
                            <p className="text-sm text-slate-500">{services.length} خدمة</p>
                          </div>
                          <Button onClick={() => openServiceDialog()} className="bg-[#1a56db] hover:bg-[#1545b0] text-white">
                            <Plus className="size-4 ml-1" />
                            إضافة خدمة
                          </Button>
                        </div>

                        <Card className="border-0 bg-white shadow-sm">
                          <CardContent className="p-0">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-slate-50">
                                  <TableHead className="text-right">العنوان</TableHead>
                                  <TableHead className="text-right">الوصف</TableHead>
                                  <TableHead className="text-right">الترتيب</TableHead>
                                  <TableHead className="text-right">الإجراءات</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {services.length === 0 ? (
                                  <TableRow>
                                    <TableCell colSpan={4} className="text-center py-12 text-slate-400">
                                      لا توجد خدمات بعد
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  services.map(service => (
                                    <TableRow key={service.id}>
                                      <TableCell className="font-medium text-slate-700">{service.title}</TableCell>
                                      <TableCell className="text-slate-500 text-sm max-w-[250px] truncate">{truncateText(service.description, 50)}</TableCell>
                                      <TableCell className="text-slate-500 text-sm">{service.order}</TableCell>
                                      <TableCell>
                                        <div className="flex items-center gap-1">
                                          <Button variant="ghost" size="icon" className="size-8" onClick={() => openServiceDialog(service)}>
                                            <Pencil className="size-4 text-blue-500" />
                                          </Button>
                                          <Button variant="ghost" size="icon" className="size-8" onClick={() => confirmDelete('services', service.id)}>
                                            <Trash2 className="size-4 text-red-500" />
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))
                                )}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {/* ─── Projects Management ────────────────────────── */}
                    {activeTab === 'projects' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-xl font-bold text-slate-800">إدارة المشاريع</h2>
                            <p className="text-sm text-slate-500">{projects.length} مشروع</p>
                          </div>
                          <Button onClick={() => openProjectDialog()} className="bg-[#1a56db] hover:bg-[#1545b0] text-white">
                            <Plus className="size-4 ml-1" />
                            إضافة مشروع
                          </Button>
                        </div>

                        <Card className="border-0 bg-white shadow-sm">
                          <CardContent className="p-0">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-slate-50">
                                  <TableHead className="text-right">العنوان</TableHead>
                                  <TableHead className="text-right">التصنيف</TableHead>
                                  <TableHead className="text-right">الموقع</TableHead>
                                  <TableHead className="text-right">مميز</TableHead>
                                  <TableHead className="text-right">الإجراءات</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {projects.length === 0 ? (
                                  <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12 text-slate-400">
                                      لا توجد مشاريع بعد
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  projects.map(project => (
                                    <TableRow key={project.id}>
                                      <TableCell className="font-medium text-slate-700 max-w-[200px] truncate">{truncateText(project.title, 30)}</TableCell>
                                      <TableCell className="text-slate-500 text-sm">{project.category || '-'}</TableCell>
                                      <TableCell className="text-slate-500 text-sm">{project.location || '-'}</TableCell>
                                      <TableCell>
                                        {project.featured && <Badge className="bg-amber-100 text-amber-700"><Star className="size-3 ml-1" /> مميز</Badge>}
                                      </TableCell>
                                      <TableCell>
                                        <div className="flex items-center gap-1">
                                          <Button variant="ghost" size="icon" className="size-8" onClick={() => openProjectDialog(project)}>
                                            <Pencil className="size-4 text-blue-500" />
                                          </Button>
                                          <Button variant="ghost" size="icon" className="size-8" onClick={() => confirmDelete('projects', project.id)}>
                                            <Trash2 className="size-4 text-red-500" />
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))
                                )}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {/* ─── FAQ Management ──────────────────────────────── */}
                    {activeTab === 'faqs' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-xl font-bold text-slate-800">إدارة الأسئلة الشائعة</h2>
                            <p className="text-sm text-slate-500">{faqs.length} سؤال</p>
                          </div>
                          <Button onClick={() => openFaqDialog()} className="bg-[#1a56db] hover:bg-[#1545b0] text-white">
                            <Plus className="size-4 ml-1" />
                            إضافة سؤال
                          </Button>
                        </div>

                        <Card className="border-0 bg-white shadow-sm">
                          <CardContent className="p-0">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-slate-50">
                                  <TableHead className="text-right">السؤال</TableHead>
                                  <TableHead className="text-right">التصنيف</TableHead>
                                  <TableHead className="text-right">الترتيب</TableHead>
                                  <TableHead className="text-right">الإجراءات</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {faqs.length === 0 ? (
                                  <TableRow>
                                    <TableCell colSpan={4} className="text-center py-12 text-slate-400">
                                      لا توجد أسئلة بعد
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  faqs.map(faq => (
                                    <TableRow key={faq.id}>
                                      <TableCell className="font-medium text-slate-700 max-w-[300px] truncate">{truncateText(faq.question, 50)}</TableCell>
                                      <TableCell className="text-slate-500 text-sm">{faq.category || '-'}</TableCell>
                                      <TableCell className="text-slate-500 text-sm">{faq.order}</TableCell>
                                      <TableCell>
                                        <div className="flex items-center gap-1">
                                          <Button variant="ghost" size="icon" className="size-8" onClick={() => openFaqDialog(faq)}>
                                            <Pencil className="size-4 text-blue-500" />
                                          </Button>
                                          <Button variant="ghost" size="icon" className="size-8" onClick={() => confirmDelete('faqs', faq.id)}>
                                            <Trash2 className="size-4 text-red-500" />
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))
                                )}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {/* ─── Messages Viewer ─────────────────────────────── */}
                    {activeTab === 'messages' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-xl font-bold text-slate-800">الرسائل الواردة</h2>
                            <p className="text-sm text-slate-500">{messages.length} رسالة — {unreadCount} غير مقروءة</p>
                          </div>
                          {unreadCount > 0 && (
                            <Badge className="bg-red-500 text-white px-3 py-1">
                              <MessageSquare className="size-3 ml-1" />
                              {unreadCount} رسالة جديدة
                            </Badge>
                          )}
                        </div>

                        <Card className="border-0 bg-white shadow-sm">
                          <CardContent className="p-0">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-slate-50">
                                  <TableHead className="text-right w-2"></TableHead>
                                  <TableHead className="text-right">الاسم</TableHead>
                                  <TableHead className="text-right">البريد</TableHead>
                                  <TableHead className="text-right">الموضوع</TableHead>
                                  <TableHead className="text-right">التاريخ</TableHead>
                                  <TableHead className="text-right">الإجراءات</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {messages.length === 0 ? (
                                  <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                                      لا توجد رسائل بعد
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  messages.map(msg => (
                                    <TableRow key={msg.id} className={!msg.read ? 'bg-blue-50/30' : ''}>
                                      <TableCell>
                                        <div className={`w-2 h-2 rounded-full ${!msg.read ? 'bg-blue-500' : 'bg-slate-200'}`} />
                                      </TableCell>
                                      <TableCell className="font-medium text-slate-700">{msg.name}</TableCell>
                                      <TableCell className="text-slate-500 text-sm" dir="ltr">{msg.email}</TableCell>
                                      <TableCell className="text-slate-500 text-sm max-w-[150px] truncate">{msg.subject || '-'}</TableCell>
                                      <TableCell className="text-slate-500 text-sm">{formatDate(msg.createdAt)}</TableCell>
                                      <TableCell>
                                        <div className="flex items-center gap-1">
                                          <Button variant="ghost" size="icon" className="size-8" onClick={() => viewMessage(msg)}>
                                            <Eye className="size-4 text-blue-500" />
                                          </Button>
                                          <Button variant="ghost" size="icon" className="size-8" onClick={() => toggleMessageRead(msg)}>
                                            {msg.read ? <EyeOff className="size-4 text-slate-400" /> : <Eye className="size-4 text-amber-500" />}
                                          </Button>
                                          <Button variant="ghost" size="icon" className="size-8" onClick={() => confirmDelete('messages', msg.id)}>
                                            <Trash2 className="size-4 text-red-500" />
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))
                                )}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {/* ─── Testimonials Management ────────────────────────── */}
                    {activeTab === 'testimonials' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-xl font-bold text-slate-800">إدارة آراء العملاء</h2>
                            <p className="text-sm text-slate-500">{testimonialsList.length} رأي</p>
                          </div>
                          <Button onClick={() => openTestimonialDialog()} className="bg-[#1a56db] hover:bg-[#1545b0] text-white">
                            <Plus className="size-4 ml-1" />
                            إضافة رأي جديد
                          </Button>
                        </div>

                        <Card className="border-0 bg-white shadow-sm">
                          <CardContent className="p-0">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-slate-50">
                                  <TableHead className="text-right">الاسم</TableHead>
                                  <TableHead className="text-right">التقييم</TableHead>
                                  <TableHead className="text-right">المحتوى</TableHead>
                                  <TableHead className="text-right hidden md:table-cell">التاريخ</TableHead>
                                  <TableHead className="text-right">إجراءات</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {testimonialsList.length === 0 ? (
                                  <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12 text-slate-400">
                                      لا توجد آراء بعد. اضغط &quot;إضافة رأي جديد&quot; لإنشاء واحد.
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  testimonialsList.map((t) => (
                                    <TableRow key={t.id} className="hover:bg-slate-50 transition-colors">
                                      <TableCell>
                                        <div>
                                          <p className="font-medium text-slate-700">{t.name}</p>
                                          {t.role && <p className="text-xs text-slate-400">{t.role}</p>}
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <div className="flex items-center gap-0.5" dir="ltr">
                                          {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} className={`size-3.5 ${star <= t.rating ? 'fill-[#f59e0b] text-[#f59e0b]' : 'fill-gray-200 text-gray-200'}`} />
                                          ))}
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <p className="text-sm text-slate-600 line-clamp-2 max-w-xs">{t.content}</p>
                                      </TableCell>
                                      <TableCell className="hidden md:table-cell">
                                        <span className="text-sm text-slate-400">{formatDate(t.id)}</span>
                                      </TableCell>
                                      <TableCell>
                                        <div className="flex items-center gap-1">
                                          <Button variant="ghost" size="sm" onClick={() => openTestimonialDialog(t)} className="text-slate-500 hover:text-blue-600 h-8 w-8 p-0">
                                            <Pencil className="size-4" />
                                          </Button>
                                          <Button variant="ghost" size="sm" onClick={() => confirmDelete('testimonials', t.id)} className="text-slate-500 hover:text-red-600 h-8 w-8 p-0">
                                            <Trash2 className="size-4" />
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))
                                )}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {/* ─── Newsletter ────────────────────────────────── */}
                    {activeTab === 'newsletter' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div>
                            <h2 className="text-xl font-bold text-slate-800">النشرة البريدية</h2>
                            <p className="text-sm text-slate-500">إدارة المشتركين في النشرة البريدية</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={exportNewsletterCSV}
                              disabled={newsletterList.length === 0}
                            >
                              <Download className="size-4 ml-1" />
                              تصدير المشتركين
                            </Button>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <Card className="border-0 bg-white shadow-sm">
                            <CardContent className="p-4 flex items-center gap-4">
                              <div className="bg-blue-500 text-white rounded-xl p-3">
                                <Mail className="size-6" />
                              </div>
                              <div>
                                <p className="text-2xl font-bold text-slate-800">{newsletterList.length}</p>
                                <p className="text-sm text-slate-500">إجمالي المشتركين</p>
                              </div>
                            </CardContent>
                          </Card>
                          <Card className="border-0 bg-white shadow-sm">
                            <CardContent className="p-4 flex items-center gap-4">
                              <div className="bg-emerald-500 text-white rounded-xl p-3">
                                <CheckCircle2 className="size-6" />
                              </div>
                              <div>
                                <p className="text-2xl font-bold text-slate-800">{newsletterList.filter(s => s.isActive).length}</p>
                                <p className="text-sm text-slate-500">مشترك نشط</p>
                              </div>
                            </CardContent>
                          </Card>
                          <Card className="border-0 bg-white shadow-sm">
                            <CardContent className="p-4 flex items-center gap-4">
                              <div className="bg-amber-500 text-white rounded-xl p-3">
                                <BarChart3 className="size-6" />
                              </div>
                              <div>
                                <p className="text-2xl font-bold text-slate-800">
                                  {newsletterList.length > 0 ? formatDate(newsletterList[0].createdAt) : '—'}
                                </p>
                                <p className="text-sm text-slate-500">آخر اشتراك</p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Subscribers Table */}
                        <Card className="border-0 bg-white shadow-sm">
                          <CardContent className="p-0">
                            {newsletterList.length === 0 ? (
                              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                                <Mail className="size-12 mb-3 opacity-50" />
                                <p className="text-lg font-medium">لا يوجد مشتركين بعد</p>
                                <p className="text-sm mt-1">ستظهر المشتركين الجدد هنا عند اشتراكهم من الموقع</p>
                              </div>
                            ) : (
                              <div className="max-h-[500px] overflow-y-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className="text-right">#</TableHead>
                                      <TableHead className="text-right">البريد الإلكتروني</TableHead>
                                      <TableHead className="text-right">الحالة</TableHead>
                                      <TableHead className="text-right">تاريخ الاشتراك</TableHead>
                                      <TableHead className="text-right">إجراءات</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {newsletterList.map((subscriber, idx) => (
                                      <TableRow key={subscriber.id}>
                                        <TableCell className="font-medium text-slate-500">{idx + 1}</TableCell>
                                        <TableCell className="font-medium" dir="ltr">{subscriber.email}</TableCell>
                                        <TableCell>
                                          <Badge variant="secondary" className={subscriber.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}>
                                            {subscriber.isActive ? 'نشط' : 'غير نشط'}
                                          </Badge>
                                        </TableCell>
                                        <TableCell className="text-slate-500 text-sm">{formatDate(subscriber.createdAt)}</TableCell>
                                        <TableCell>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => deleteNewsletterSubscriber(subscriber.email)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                          >
                                            <Trash2 className="size-4" />
                                          </Button>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {/* ─── Analytics Panel ─────────────────────────────────── */}
                    {activeTab === 'analytics' && <AnalyticsPanel showToast={showToast} />}

                    {/* ─── Appointments Management ────────────────────────── */}
                    {activeTab === 'appointments' && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-xl font-bold text-slate-800">حجز المواعيد</h2>
                          <p className="text-sm text-slate-500">إدارة مواعيد الزيارات والاستشارات</p>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          <Card className="border-0 bg-white shadow-sm">
                            <CardContent className="p-4 flex items-center gap-3">
                              <div className="bg-blue-500 text-white rounded-xl p-2.5">
                                <Calendar className="size-5" />
                              </div>
                              <div>
                                <p className="text-xl font-bold text-slate-800">{appointmentStats.total}</p>
                                <p className="text-xs text-slate-500">إجمالي المواعيد</p>
                              </div>
                            </CardContent>
                          </Card>
                          <Card className="border-0 bg-white shadow-sm">
                            <CardContent className="p-4 flex items-center gap-3">
                              <div className="bg-yellow-500 text-white rounded-xl p-2.5">
                                <Clock className="size-5" />
                              </div>
                              <div>
                                <p className="text-xl font-bold text-slate-800">{appointmentStats.pending}</p>
                                <p className="text-xs text-slate-500">قيد الانتظار</p>
                              </div>
                            </CardContent>
                          </Card>
                          <Card className="border-0 bg-white shadow-sm">
                            <CardContent className="p-4 flex items-center gap-3">
                              <div className="bg-emerald-500 text-white rounded-xl p-2.5">
                                <CheckCircle2 className="size-5" />
                              </div>
                              <div>
                                <p className="text-xl font-bold text-slate-800">{appointmentStats.confirmed}</p>
                                <p className="text-xs text-slate-500">مؤكد</p>
                              </div>
                            </CardContent>
                          </Card>
                          <Card className="border-0 bg-white shadow-sm">
                            <CardContent className="p-4 flex items-center gap-3">
                              <div className="bg-purple-500 text-white rounded-xl p-2.5">
                                <BarChart3 className="size-5" />
                              </div>
                              <div>
                                <p className="text-xl font-bold text-slate-800">{appointmentStats.completed}</p>
                                <p className="text-xs text-slate-500">مكتمل</p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {[
                            { value: 'all', label: 'الكل' },
                            { value: 'pending', label: 'قيد الانتظار' },
                            { value: 'confirmed', label: 'مؤكد' },
                            { value: 'completed', label: 'مكتمل' },
                            { value: 'cancelled', label: 'ملغي' },
                          ].map((tab) => (
                            <Button
                              key={tab.value}
                              variant={appointmentFilter === tab.value ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setAppointmentFilter(tab.value)}
                              className={appointmentFilter === tab.value ? 'bg-[#1a56db] hover:bg-[#1545b0]' : ''}
                            >
                              {tab.label}
                            </Button>
                          ))}
                        </div>

                        {/* Appointments Table */}
                        <Card className="border-0 bg-white shadow-sm">
                          <CardContent className="p-0">
                            {filteredAppointments.length === 0 ? (
                              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                                <Calendar className="size-12 mb-3 opacity-50" />
                                <p className="text-lg font-medium">لا توجد مواعيد</p>
                                <p className="text-sm mt-1">ستظهر المواعيد الجديدة هنا عند حجزها من الموقع</p>
                              </div>
                            ) : (
                              <div className="max-h-[500px] overflow-y-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow className="bg-slate-50">
                                      <TableHead className="text-right">الاسم</TableHead>
                                      <TableHead className="text-right">الجوال</TableHead>
                                      <TableHead className="text-right">الخدمة</TableHead>
                                      <TableHead className="text-right hidden md:table-cell">التاريخ</TableHead>
                                      <TableHead className="text-right hidden lg:table-cell">الوقت</TableHead>
                                      <TableHead className="text-right">الحالة</TableHead>
                                      <TableHead className="text-right">إجراءات</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {filteredAppointments.map((appointment) => (
                                      <TableRow key={appointment.id} className="hover:bg-slate-50 transition-colors">
                                        <TableCell>
                                          <button
                                            onClick={() => { setViewingAppointment(appointment); setAppointmentViewOpen(true) }}
                                            className="font-medium text-slate-700 hover:text-[#1a56db] transition-colors text-right"
                                          >
                                            {appointment.name}
                                          </button>
                                        </TableCell>
                                        <TableCell>
                                          <span className="text-sm text-slate-600" dir="ltr">{appointment.phone}</span>
                                        </TableCell>
                                        <TableCell>
                                          <span className="text-sm text-slate-600">{appointment.serviceType}</span>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                          <span className="text-sm text-slate-500">{appointment.date}</span>
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                          <span className="text-sm text-slate-500">{appointment.time}</span>
                                        </TableCell>
                                        <TableCell>
                                          <Badge variant="secondary" className={statusColors[appointment.status] || 'bg-slate-100 text-slate-500'}>
                                            {statusLabels[appointment.status] || appointment.status}
                                          </Badge>
                                        </TableCell>
                                        <TableCell>
                                          <div className="flex items-center gap-1">
                                            <Select
                                              value={appointment.status}
                                              onValueChange={(val) => updateAppointmentStatus(appointment.id, val)}
                                            >
                                              <SelectTrigger className="w-28 h-8 text-xs">
                                                <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {Object.entries(statusLabels).map(([key, label]) => (
                                                  <SelectItem key={key} value={key} className="text-xs">
                                                    {label}
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => deleteAppointment(appointment.id)}
                                              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                                            >
                                              <Trash2 className="size-4" />
                                            </Button>
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        {/* Appointment Detail Dialog */}
                        <Dialog open={appointmentViewOpen} onOpenChange={setAppointmentViewOpen}>
                          <DialogContent dir="rtl" className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Calendar className="size-5 text-[#1a56db]" />
                                تفاصيل الموعد
                              </DialogTitle>
                              <DialogDescription>
                                عرض تفاصيل موعد الزيارة
                              </DialogDescription>
                            </DialogHeader>
                            {viewingAppointment && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-xs text-slate-400 mb-1">الاسم</p>
                                    <p className="font-medium text-slate-800">{viewingAppointment.name}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-slate-400 mb-1">الجوال</p>
                                    <p className="font-medium text-slate-800" dir="ltr">{viewingAppointment.phone}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-slate-400 mb-1">البريد الإلكتروني</p>
                                    <p className="font-medium text-slate-800" dir="ltr">{viewingAppointment.email || '—'}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-slate-400 mb-1">نوع الخدمة</p>
                                    <p className="font-medium text-slate-800">{viewingAppointment.serviceType}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-slate-400 mb-1">تاريخ الزيارة</p>
                                    <p className="font-medium text-slate-800">{viewingAppointment.date}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-slate-400 mb-1">الوقت</p>
                                    <p className="font-medium text-slate-800">{viewingAppointment.time}</p>
                                  </div>
                                </div>
                                <Separator />
                                <div>
                                  <p className="text-xs text-slate-400 mb-1">الحالة</p>
                                  <Badge variant="secondary" className={statusColors[viewingAppointment.status] || 'bg-slate-100 text-slate-500'}>
                                    {statusLabels[viewingAppointment.status] || viewingAppointment.status}
                                  </Badge>
                                </div>
                                {viewingAppointment.notes && (
                                  <div>
                                    <p className="text-xs text-slate-400 mb-1">ملاحظات</p>
                                    <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3">{viewingAppointment.notes}</p>
                                  </div>
                                )}
                                <div className="flex items-center justify-between pt-2">
                                  <p className="text-xs text-slate-400">
                                    تاريخ الحجز: {formatDate(viewingAppointment.createdAt)}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => deleteAppointment(viewingAppointment.id)}
                                      className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
                                    >
                                      <Trash2 className="size-4 ml-1" />
                                      حذف
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}

                    {/* ─── SEO Panel ─────────────────────────────────────── */}
                    {activeTab === 'seo' && <SeoPanel showToast={showToast} />}

                    {/* ─── Settings ────────────────────────────────────── */}
                    {activeTab === 'settings' && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-xl font-bold text-slate-800">إعدادات الموقع</h2>
                          <p className="text-sm text-slate-500">تعديل معلومات الشركة والإعدادات العامة</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Basic Info */}
                          <Card className="border-0 bg-white shadow-sm">
                            <CardHeader>
                              <CardTitle className="text-base flex items-center gap-2">
                                <Globe className="size-5 text-[#1a56db]" />
                                المعلومات الأساسية
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="space-y-2">
                                <Label>اسم الموقع</Label>
                                <Input
                                  value={settingsForm.siteName || ''}
                                  onChange={e => setSettingsForm(prev => ({ ...prev, siteName: e.target.value }))}
                                  placeholder="اسم الموقع"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>الوصف</Label>
                                <Textarea
                                  value={settingsForm.description || ''}
                                  onChange={e => setSettingsForm(prev => ({ ...prev, description: e.target.value }))}
                                  placeholder="وصف الموقع"
                                  rows={3}
                                />
                              </div>
                            </CardContent>
                          </Card>

                          {/* Contact Info */}
                          <Card className="border-0 bg-white shadow-sm">
                            <CardHeader>
                              <CardTitle className="text-base flex items-center gap-2">
                                <Phone className="size-5 text-[#ea580c]" />
                                معلومات الاتصال
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="space-y-2">
                                <Label className="flex items-center gap-1"><Phone className="size-3" /> رقم الهاتف</Label>
                                <Input
                                  value={settingsForm.phone || ''}
                                  onChange={e => setSettingsForm(prev => ({ ...prev, phone: e.target.value }))}
                                  placeholder="+966 50 123 4567"
                                  dir="ltr"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="flex items-center gap-1"><Mail className="size-3" /> البريد الإلكتروني</Label>
                                <Input
                                  value={settingsForm.email || ''}
                                  onChange={e => setSettingsForm(prev => ({ ...prev, email: e.target.value }))}
                                  placeholder="info@example.com"
                                  dir="ltr"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="flex items-center gap-1"><MapPin className="size-3" /> العنوان</Label>
                                <Input
                                  value={settingsForm.address || ''}
                                  onChange={e => setSettingsForm(prev => ({ ...prev, address: e.target.value }))}
                                  placeholder="العنوان"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="flex items-center gap-1"><Clock className="size-3" /> ساعات العمل</Label>
                                <Input
                                  value={settingsForm.workingHours || ''}
                                  onChange={e => setSettingsForm(prev => ({ ...prev, workingHours: e.target.value }))}
                                  placeholder="السبت - الخميس: 8 صباحًا - 6 مساءً"
                                />
                              </div>
                            </CardContent>
                          </Card>

                          {/* Social Media */}
                          <Card className="border-0 bg-white shadow-sm">
                            <CardHeader>
                              <CardTitle className="text-base flex items-center gap-2">
                                <Send className="size-5 text-emerald-500" />
                                وسائل التواصل الاجتماعي
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="space-y-2">
                                <Label>واتساب</Label>
                                <Input
                                  value={settingsForm.whatsapp || ''}
                                  onChange={e => setSettingsForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                                  placeholder="966501234567"
                                  dir="ltr"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>تويتر / X</Label>
                                <Input
                                  value={settingsForm.twitter || ''}
                                  onChange={e => setSettingsForm(prev => ({ ...prev, twitter: e.target.value }))}
                                  placeholder="https://twitter.com/..."
                                  dir="ltr"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>انستغرام</Label>
                                <Input
                                  value={settingsForm.instagram || ''}
                                  onChange={e => setSettingsForm(prev => ({ ...prev, instagram: e.target.value }))}
                                  placeholder="https://instagram.com/..."
                                  dir="ltr"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>لينكد إن</Label>
                                <Input
                                  value={settingsForm.linkedin || ''}
                                  onChange={e => setSettingsForm(prev => ({ ...prev, linkedin: e.target.value }))}
                                  placeholder="https://linkedin.com/..."
                                  dir="ltr"
                                />
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="flex justify-end">
                          <Button onClick={saveSettings} className="bg-[#1a56db] hover:bg-[#1545b0] text-white min-w-[150px]">
                            <Save className="size-4 ml-2" />
                            حفظ الإعدادات
                          </Button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </ScrollArea>
        </main>

        {/* ─── Blog Dialog ────────────────────────────────────────────── */}
        <Dialog open={blogDialogOpen} onOpenChange={setBlogDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <DialogHeader>
              <DialogTitle>{editingBlog?.id ? 'تعديل المقال' : 'إضافة مقال جديد'}</DialogTitle>
              <DialogDescription>
                {editingBlog?.id ? 'قم بتعديل بيانات المقال' : 'أدخل بيانات المقال الجديد'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>العنوان *</Label>
                <Input
                  value={blogForm.title}
                  onChange={e => handleBlogTitleChange(e.target.value)}
                  placeholder="عنوان المقال"
                />
              </div>
              <div className="space-y-2">
                <Label>المسار (رابط URL)</Label>
                <Input
                  value={blogForm.slug}
                  onChange={e => setBlogForm(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="post-slug"
                  dir="ltr"
                  className="text-left"
                />
              </div>
              <div className="space-y-2">
                <Label>المقتطف</Label>
                <Textarea
                  value={blogForm.excerpt}
                  onChange={e => setBlogForm(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="مقتطف قصير عن المقال"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>المحتوى *</Label>
                <Textarea
                  value={blogForm.content}
                  onChange={e => setBlogForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="محتوى المقال الكامل"
                  rows={6}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1"><ImageIcon className="size-3" /> رابط الصورة</Label>
                  <Input
                    value={blogForm.coverImage}
                    onChange={e => setBlogForm(prev => ({ ...prev, coverImage: e.target.value }))}
                    placeholder="https://..."
                    dir="ltr"
                    className="text-left"
                  />
                </div>
                <div className="space-y-2">
                  <Label>وصف META</Label>
                  <Input
                    value={blogForm.metaDescription}
                    onChange={e => setBlogForm(prev => ({ ...prev, metaDescription: e.target.value }))}
                    placeholder="وصف محركات البحث"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                <Switch
                  checked={blogForm.published}
                  onCheckedChange={checked => setBlogForm(prev => ({ ...prev, published: checked }))}
                />
                <Label className="cursor-pointer">نشر المقال</Label>
                <Badge variant={blogForm.published ? 'default' : 'secondary'} className={blogForm.published ? 'bg-emerald-100 text-emerald-700' : ''}>
                  {blogForm.published ? 'منشور' : 'مسودة'}
                </Badge>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setBlogDialogOpen(false)}>إلغاء</Button>
              <Button onClick={saveBlog} className="bg-[#1a56db] hover:bg-[#1545b0] text-white">
                {editingBlog?.id ? 'تحديث' : 'إنشاء'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ─── Service Dialog ─────────────────────────────────────────── */}
        <Dialog open={serviceDialogOpen} onOpenChange={setServiceDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
            <DialogHeader>
              <DialogTitle>{editingService?.id ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}</DialogTitle>
              <DialogDescription>
                {editingService?.id ? 'قم بتعديل بيانات الخدمة' : 'أدخل بيانات الخدمة الجديدة'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>عنوان الخدمة *</Label>
                <Input
                  value={serviceForm.title}
                  onChange={e => setServiceForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="عنوان الخدمة"
                />
              </div>
              <div className="space-y-2">
                <Label>الوصف *</Label>
                <Textarea
                  value={serviceForm.description}
                  onChange={e => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="وصف الخدمة"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1"><ImageIcon className="size-3" /> أيقونة (اسم lucide)</Label>
                  <Input
                    value={serviceForm.icon}
                    onChange={e => setServiceForm(prev => ({ ...prev, icon: e.target.value }))}
                    placeholder="umbrella"
                    dir="ltr"
                    className="text-left"
                  />
                </div>
                <div className="space-y-2">
                  <Label>الترتيب</Label>
                  <Input
                    type="number"
                    value={serviceForm.order}
                    onChange={e => setServiceForm(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                    dir="ltr"
                    className="text-left"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>المميزات (مفصولة بفاصلة)</Label>
                <Textarea
                  value={serviceForm.features}
                  onChange={e => setServiceForm(prev => ({ ...prev, features: e.target.value }))}
                  placeholder="ميزة 1, ميزة 2, ميزة 3"
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setServiceDialogOpen(false)}>إلغاء</Button>
              <Button onClick={saveService} className="bg-[#1a56db] hover:bg-[#1545b0] text-white">
                {editingService?.id ? 'تحديث' : 'إنشاء'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ─── Project Dialog ─────────────────────────────────────────── */}
        <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <DialogHeader>
              <DialogTitle>{editingProject?.id ? 'تعديل المشروع' : 'إضافة مشروع جديد'}</DialogTitle>
              <DialogDescription>
                {editingProject?.id ? 'قم بتعديل بيانات المشروع' : 'أدخل بيانات المشروع الجديد'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>عنوان المشروع *</Label>
                  <Input
                    value={projectForm.title}
                    onChange={e => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="عنوان المشروع"
                  />
                </div>
                <div className="space-y-2">
                  <Label>التصنيف</Label>
                  <Input
                    value={projectForm.category}
                    onChange={e => setProjectForm(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="التصنيف"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>الوصف *</Label>
                <Textarea
                  value={projectForm.description}
                  onChange={e => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="وصف المشروع"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1"><ImageIcon className="size-3" /> رابط الصورة</Label>
                  <Input
                    value={projectForm.image}
                    onChange={e => setProjectForm(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://..."
                    dir="ltr"
                    className="text-left"
                  />
                </div>
                <div className="space-y-2">
                  <Label>اسم العميل</Label>
                  <Input
                    value={projectForm.clientName}
                    onChange={e => setProjectForm(prev => ({ ...prev, clientName: e.target.value }))}
                    placeholder="اسم العميل"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1"><MapPin className="size-3" /> الموقع</Label>
                  <Input
                    value={projectForm.location}
                    onChange={e => setProjectForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="الموقع"
                  />
                </div>
                <div className="space-y-2">
                  <Label>تاريخ الإنجاز</Label>
                  <Input
                    type="date"
                    value={projectForm.completedAt}
                    onChange={e => setProjectForm(prev => ({ ...prev, completedAt: e.target.value }))}
                    dir="ltr"
                    className="text-left"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                <Switch
                  checked={projectForm.featured}
                  onCheckedChange={checked => setProjectForm(prev => ({ ...prev, featured: checked }))}
                />
                <Label className="cursor-pointer">مشروع مميز</Label>
                {projectForm.featured && <Badge className="bg-amber-100 text-amber-700"><Star className="size-3 ml-1" /> مميز</Badge>}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setProjectDialogOpen(false)}>إلغاء</Button>
              <Button onClick={saveProject} className="bg-[#1a56db] hover:bg-[#1545b0] text-white">
                {editingProject?.id ? 'تحديث' : 'إنشاء'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ─── FAQ Dialog ─────────────────────────────────────────────── */}
        <Dialog open={faqDialogOpen} onOpenChange={setFaqDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
            <DialogHeader>
              <DialogTitle>{editingFaq?.id ? 'تعديل السؤال' : 'إضافة سؤال جديد'}</DialogTitle>
              <DialogDescription>
                {editingFaq?.id ? 'قم بتعديل بيانات السؤال' : 'أدخل بيانات السؤال الجديد'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>السؤال *</Label>
                <Input
                  value={faqForm.question}
                  onChange={e => setFaqForm(prev => ({ ...prev, question: e.target.value }))}
                  placeholder="نص السؤال"
                />
              </div>
              <div className="space-y-2">
                <Label>الإجابة *</Label>
                <Textarea
                  value={faqForm.answer}
                  onChange={e => setFaqForm(prev => ({ ...prev, answer: e.target.value }))}
                  placeholder="نص الإجابة"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>التصنيف</Label>
                  <Input
                    value={faqForm.category}
                    onChange={e => setFaqForm(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="التصنيف"
                  />
                </div>
                <div className="space-y-2">
                  <Label>الترتيب</Label>
                  <Input
                    type="number"
                    value={faqForm.order}
                    onChange={e => setFaqForm(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                    dir="ltr"
                    className="text-left"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setFaqDialogOpen(false)}>إلغاء</Button>
              <Button onClick={saveFaq} className="bg-[#1a56db] hover:bg-[#1545b0] text-white">
                {editingFaq?.id ? 'تحديث' : 'إنشاء'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ─── Testimonial Dialog ────────────────────────────────────── */}
        <Dialog open={testimonialDialogOpen} onOpenChange={setTestimonialDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
            <DialogHeader>
              <DialogTitle>{editingTestimonial?.id ? 'تعديل الرأي' : 'إضافة رأي جديد'}</DialogTitle>
              <DialogDescription>
                {editingTestimonial?.id ? 'قم بتعديل بيانات الرأي' : 'أدخل بيانات الرأي الجديد'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>اسم العميل *</Label>
                <Input
                  value={testimonialForm.name}
                  onChange={e => setTestimonialForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="اسم العميل"
                />
              </div>
              <div className="space-y-2">
                <Label>المسمى الوظيفي</Label>
                <Input
                  value={testimonialForm.role}
                  onChange={e => setTestimonialForm(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="مثال: صاحب فيلا - الرياض"
                />
              </div>
              <div className="space-y-2">
                <Label>المحتوى *</Label>
                <Textarea
                  value={testimonialForm.content}
                  onChange={e => setTestimonialForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="نص الرأي..."
                  rows={5}
                />
              </div>
              <div className="space-y-2">
                <Label>التقييم</Label>
                <Select
                  value={String(testimonialForm.rating)}
                  onValueChange={val => setTestimonialForm(prev => ({ ...prev, rating: parseInt(val) }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر التقييم" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map(n => (
                      <SelectItem key={n} value={String(n)}>
                        <span className="flex items-center gap-1" dir="ltr">
                          {n} {'★'.repeat(n)}{'☆'.repeat(5 - n)}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>رابط الصورة (اختياري)</Label>
                <Input
                  value={testimonialForm.avatar}
                  onChange={e => setTestimonialForm(prev => ({ ...prev, avatar: e.target.value }))}
                  placeholder="https://example.com/avatar.jpg"
                  dir="ltr"
                  className="text-left"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setTestimonialDialogOpen(false)}>إلغاء</Button>
              <Button onClick={saveTestimonial} className="bg-[#1a56db] hover:bg-[#1545b0] text-white">
                {editingTestimonial?.id ? 'تحديث' : 'إنشاء'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ─── Message View Dialog ────────────────────────────────────── */}
        <Dialog open={messageViewOpen} onOpenChange={setMessageViewOpen}>
          <DialogContent className="max-w-lg" dir="rtl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="size-5 text-[#1a56db]" />
                تفاصيل الرسالة
              </DialogTitle>
              <DialogDescription>
                {viewingMessage?.subject || 'بدون موضوع'}
              </DialogDescription>
            </DialogHeader>
            {viewingMessage && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-50">
                    <p className="text-xs text-slate-400 mb-1">الاسم</p>
                    <p className="font-medium text-slate-700">{viewingMessage.name}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50">
                    <p className="text-xs text-slate-400 mb-1">البريد</p>
                    <p className="font-medium text-slate-700 text-sm" dir="ltr">{viewingMessage.email}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50">
                    <p className="text-xs text-slate-400 mb-1">الهاتف</p>
                    <p className="font-medium text-slate-700" dir="ltr">{viewingMessage.phone || '-'}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50">
                    <p className="text-xs text-slate-400 mb-1">التاريخ</p>
                    <p className="font-medium text-slate-700 text-sm">{formatDate(viewingMessage.createdAt)}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">نص الرسالة:</p>
                  <div className="p-4 rounded-lg bg-slate-50 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {viewingMessage.message}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => toggleMessageRead(viewingMessage!)}>
                {viewingMessage?.read ? (
                  <><EyeOff className="size-4 ml-1" /> تعليم كغير مقروء</>
                ) : (
                  <><Eye className="size-4 ml-1" /> تعليم كمقروء</>
                )}
              </Button>
              <Button variant="destructive" onClick={() => {
                if (viewingMessage) {
                  confirmDelete('messages', viewingMessage.id)
                  setMessageViewOpen(false)
                }
              }}>
                <Trash2 className="size-4 ml-1" />
                حذف
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ─── Delete Confirmation Dialog ─────────────────────────────── */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent dir="rtl">
            <AlertDialogHeader>
              <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
              <AlertDialogDescription>
                هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction onClick={executeDelete} className="bg-red-500 hover:bg-red-600 text-white">
                <Trash2 className="size-4 ml-1" />
                حذف
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* ─── Toast Notification ─────────────────────────────────────── */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 50, x: '-50%' }}
              className={`fixed bottom-6 left-1/2 z-[100] flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium ${
                toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
              }`}
            >
              {toast.type === 'success' ? <CheckCircle2 className="size-4" /> : <AlertCircle className="size-4" />}
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}
