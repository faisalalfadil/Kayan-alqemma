'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { useAdminStore } from '@/store/admin-store'

// shadcn/ui components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

// Lucide icons
import {
  LayoutDashboard,
  BookOpen,
  FolderOpen,
  HelpCircle,
  Mail,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Send,
  Upload,
  X,
  RefreshCw,
  Loader2,
  Lock,
  Shield,
  ChevronLeft,
  Menu,
  ImageIcon,
  Phone,
  MessageSquare,
  Clock,
  Settings,
  Save,
} from 'lucide-react'

// ===================== TYPES =====================

interface Stats {
  blog: { total: number; published: number; drafts: number }
  projects: { total: number; featured: number }
  faqs: number
  messages: { total: number; unread: number }
  recentMessages: RecentMessage[]
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string | null
  metaDescription: string | null
  published: boolean
  createdAt: string
  updatedAt: string
}

interface Project {
  id: string
  title: string
  description: string
  image: string | null
  category: string
  clientName: string | null
  location: string | null
  featured: boolean
  createdAt: string
  updatedAt: string
}

interface FAQ {
  id: string
  question: string
  answer: string
  category: string | null
  order: number
  createdAt: string
  updatedAt: string
}

interface Message {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  read: boolean
  createdAt: string
}

interface RecentMessage {
  id: string
  name: string
  email: string
  subject: string
  read: boolean
  createdAt: string
}

interface BlogFormData {
  title: string
  excerpt: string
  content: string
  coverImage: string
  metaDescription: string
  published: boolean
}

interface ProjectFormData {
  title: string
  description: string
  category: string
  image: string
  location: string
  clientName: string
  featured: boolean
}

interface FAQFormData {
  question: string
  answer: string
  category: string
  order: number
}

// ===================== NAV ITEMS =====================

const NAV_ITEMS = [
  { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
  { id: 'blog', label: 'المدونة', icon: BookOpen },
  { id: 'projects', label: 'المشاريع', icon: FolderOpen },
  { id: 'faq', label: 'الأسئلة الشائعة', icon: HelpCircle },
  { id: 'messages', label: 'الرسائل', icon: Mail },
  { id: 'settings', label: 'الإعدادات', icon: Settings },
]

const PROJECT_CATEGORIES = [
  'مظلات كهربائية',
  'مظلات سيارات',
  'حدائق',
  'مسابح',
]

// ===================== HELPER =====================

function formatDate(dateStr: string): string {
  try {
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateStr))
  } catch {
    return dateStr
  }
}

// ===================== LOGIN SCREEN =====================

function LoginScreen() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const login = useAdminStore((s) => s.login)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) return
    setIsLoading(true)
    setError('')
    // Small delay for UX
    await new Promise((r) => setTimeout(r, 500))
    const success = login(password)
    if (success) {
      toast.success('تم تسجيل الدخول بنجاح')
    } else {
      setError('كلمة المرور غير صحيحة')
    }
    setIsLoading(false)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md mx-4"
      >
        <Card className="border-slate-700 bg-slate-800/80 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center space-y-4 pb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg"
            >
              <Shield className="w-10 h-10 text-white" />
            </motion.div>
            <div>
              <CardTitle className="text-2xl font-bold text-white">
                لوحة التحكم
              </CardTitle>
              <p className="text-slate-400 text-sm mt-1">
                شركة كيان القمة
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300 text-sm">كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError('')
                    }}
                    placeholder="أدخل كلمة المرور"
                    className="pr-10 pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs"
                  >
                    {error}
                  </motion.p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                disabled={isLoading || !password.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جاري التحقق...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 ml-2" />
                    تسجيل الدخول
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

// ===================== DASHBOARD TAB =====================

function DashboardTab() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/stats')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setStats(data)
    } catch {
      toast.error('فشل في تحميل الإحصائيات')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    )
  }

  if (!stats) return null

  const statCards = [
    {
      title: 'إجمالي المقالات',
      value: stats.blog.total,
      subtitle: `${stats.blog.published} منشور · ${stats.blog.drafts} مسودة`,
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      title: 'المشاريع',
      value: stats.projects.total,
      subtitle: `${stats.projects.featured} مشاريع مميزة`,
      icon: FolderOpen,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    },
    {
      title: 'الرسائل غير المقروءة',
      value: stats.messages.unread,
      subtitle: `من أصل ${stats.messages.total} رسالة`,
      icon: Mail,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/30',
    },
    {
      title: 'الأسئلة الشائعة',
      value: stats.faqs,
      subtitle: 'إجمالي الأسئلة',
      icon: HelpCircle,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {statCards.map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{card.title}</p>
                    <p className="text-3xl font-bold">{card.value}</p>
                    <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                  </div>
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-sm`}
                  >
                    <card.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Messages */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base font-semibold">آخر الرسائل</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchStats}
            className="text-xs"
          >
            <RefreshCw className="w-3 h-3 ml-1" />
            تحديث
          </Button>
        </CardHeader>
        <CardContent>
          {stats.recentMessages && stats.recentMessages.length > 0 ? (
            <div className="space-y-2">
              {stats.recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      msg.read ? 'bg-muted-foreground/30' : 'bg-blue-500'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">
                        {msg.name}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {msg.email}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {msg.subject}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatDate(msg.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              لا توجد رسائل حتى الآن
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ===================== BLOG TAB =====================

function BlogTab() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<BlogFormData>({
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    metaDescription: '',
    published: false,
  })

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/blog')
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setPosts(data)
    } catch {
      toast.error('فشل في تحميل المقالات')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const openCreate = () => {
    setEditingPost(null)
    setForm({
      title: '',
      excerpt: '',
      content: '',
      coverImage: '',
      metaDescription: '',
      published: false,
    })
    setDialogOpen(true)
  }

  const openEdit = (post: BlogPost) => {
    setEditingPost(post)
    setForm({
      title: post.title,
      excerpt: post.excerpt || '',
      content: post.content,
      coverImage: post.coverImage || '',
      metaDescription: post.metaDescription || '',
      published: post.published,
    })
    setDialogOpen(true)
  }

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', 'blog')
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()
      if (data.url) {
        setForm((f) => ({ ...f, coverImage: data.url }))
        toast.success('تم رفع الصورة بنجاح')
      }
    } catch {
      toast.error('فشل في رفع الصورة')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('يرجى ملء الحقول المطلوبة')
      return
    }
    setSaving(true)
    try {
      const url = editingPost ? `/api/admin/blog/${editingPost.id}` : '/api/admin/blog'
      const method = editingPost ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Save failed')
      toast.success(editingPost ? 'تم تحديث المقال بنجاح' : 'تم إنشاء المقال بنجاح')
      setDialogOpen(false)
      fetchPosts()
    } catch {
      toast.error('فشل في حفظ المقال')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      const res = await fetch(`/api/admin/blog/${deletingId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      toast.success('تم حذف المقال بنجاح')
      setDeleteOpen(false)
      setDeletingId(null)
      fetchPosts()
    } catch {
      toast.error('فشل في حذف المقال')
    }
  }

  const confirmDelete = (id: string) => {
    setDeletingId(id)
    setDeleteOpen(true)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">إدارة المدونة</h2>
        <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 ml-1" />
          إضافة مقال جديد
        </Button>
      </div>

      {posts.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-12 text-center">
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">لا توجد مقالات حتى الآن</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">العنوان</TableHead>
                <TableHead className="font-semibold">الحالة</TableHead>
                <TableHead className="font-semibold">التاريخ</TableHead>
                <TableHead className="font-semibold text-left">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {post.title}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={post.published ? 'default' : 'secondary'}
                      className={
                        post.published
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                      }
                    >
                      {post.published ? 'منشور' : 'مسودة'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(post.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEdit(post)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => confirmDelete(post.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? 'تعديل المقال' : 'إضافة مقال جديد'}
            </DialogTitle>
            <DialogDescription>
              {editingPost ? 'قم بتعديل بيانات المقال' : 'أدخل بيانات المقال الجديد'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>عنوان المقال *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="أدخل عنوان المقال"
              />
            </div>

            <div className="space-y-2">
              <Label>الوصف المختصر</Label>
              <Textarea
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                placeholder="أدخل وصف مختصر للمقال"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>المحتوى *</Label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                placeholder="أدخل محتوى المقال"
                rows={8}
                className="min-h-[200px]"
              />
            </div>

            <div className="space-y-2">
              <Label>صورة الغلاف</Label>
              <div className="flex items-center gap-3">
                {form.coverImage && (
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden border shrink-0">
                    <img
                      src={form.coverImage}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setForm((f) => ({ ...f, coverImage: '' }))}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                )}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleUpload(file)
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <Loader2 className="w-4 h-4 ml-1 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 ml-1" />
                    )}
                    {uploading ? 'جاري الرفع...' : 'رفع صورة'}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>وصف ميتا</Label>
              <Input
                value={form.metaDescription}
                onChange={(e) =>
                  setForm((f) => ({ ...f, metaDescription: e.target.value }))
                }
                placeholder="وصف ميتا للمقال (SEO)"
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={form.published}
                onCheckedChange={(checked) =>
                  setForm((f) => ({ ...f, published: checked }))
                }
              />
              <Label>منشور</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              إلغاء
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 ml-1 animate-spin" />
              ) : (
                <Send className="w-4 h-4 ml-1" />
              )}
              {editingPost ? 'تحديث' : 'حفظ'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف هذا المقال؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ===================== PROJECTS TAB =====================

function ProjectsTab() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<ProjectFormData>({
    title: '',
    description: '',
    category: PROJECT_CATEGORIES[0],
    image: '',
    location: '',
    clientName: '',
    featured: false,
  })

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/projects')
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setProjects(data)
    } catch {
      toast.error('فشل في تحميل المشاريع')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const openCreate = () => {
    setEditingProject(null)
    setForm({
      title: '',
      description: '',
      category: PROJECT_CATEGORIES[0],
      image: '',
      location: '',
      clientName: '',
      featured: false,
    })
    setDialogOpen(true)
  }

  const openEdit = (project: Project) => {
    setEditingProject(project)
    setForm({
      title: project.title,
      description: project.description || '',
      category: project.category || PROJECT_CATEGORIES[0],
      image: project.image || '',
      location: project.location || '',
      clientName: project.clientName || '',
      featured: project.featured,
    })
    setDialogOpen(true)
  }

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', 'projects')
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()
      if (data.url) {
        setForm((f) => ({ ...f, image: data.url }))
        toast.success('تم رفع الصورة بنجاح')
      }
    } catch {
      toast.error('فشل في رفع الصورة')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error('يرجى إدخال عنوان المشروع')
      return
    }
    setSaving(true)
    try {
      const url = editingProject
        ? `/api/admin/projects/${editingProject.id}`
        : '/api/admin/projects'
      const method = editingProject ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Save failed')
      toast.success(
        editingProject ? 'تم تحديث المشروع بنجاح' : 'تم إنشاء المشروع بنجاح'
      )
      setDialogOpen(false)
      fetchProjects()
    } catch {
      toast.error('فشل في حفظ المشروع')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      const res = await fetch(`/api/admin/projects/${deletingId}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Delete failed')
      toast.success('تم حذف المشروع بنجاح')
      setDeleteOpen(false)
      setDeletingId(null)
      fetchProjects()
    } catch {
      toast.error('فشل في حذف المشروع')
    }
  }

  const confirmDelete = (id: string) => {
    setDeletingId(id)
    setDeleteOpen(true)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">إدارة المشاريع</h2>
        <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 ml-1" />
          إضافة مشروع جديد
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-12 text-center">
            <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">لا توجد مشاريع حتى الآن</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">العنوان</TableHead>
                <TableHead className="font-semibold">التصنيف</TableHead>
                <TableHead className="font-semibold">مميز</TableHead>
                <TableHead className="font-semibold">التاريخ</TableHead>
                <TableHead className="font-semibold text-left">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {project.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{project.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        project.featured
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-100'
                      }
                    >
                      {project.featured ? 'نعم' : 'لا'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(project.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEdit(project)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => confirmDelete(project.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? 'تعديل المشروع' : 'إضافة مشروع جديد'}
            </DialogTitle>
            <DialogDescription>
              {editingProject
                ? 'قم بتعديل بيانات المشروع'
                : 'أدخل بيانات المشروع الجديد'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>عنوان المشروع *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="أدخل عنوان المشروع"
              />
            </div>

            <div className="space-y-2">
              <Label>الوصف</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="أدخل وصف المشروع"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>التصنيف *</Label>
              <Select
                value={form.category}
                onValueChange={(val) => setForm((f) => ({ ...f, category: val }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر التصنيف" />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>الصورة</Label>
              <div className="flex items-center gap-3">
                {form.image && (
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden border shrink-0">
                    <img
                      src={form.image}
                      alt="Project"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setForm((f) => ({ ...f, image: '' }))}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                )}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleUpload(file)
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <Loader2 className="w-4 h-4 ml-1 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 ml-1" />
                    )}
                    {uploading ? 'جاري الرفع...' : 'رفع صورة'}
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الموقع</Label>
                <Input
                  value={form.location}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, location: e.target.value }))
                  }
                  placeholder="موقع المشروع"
                />
              </div>
              <div className="space-y-2">
                <Label>اسم العميل</Label>
                <Input
                  value={form.clientName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, clientName: e.target.value }))
                  }
                  placeholder="اسم العميل"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={form.featured}
                onCheckedChange={(checked) =>
                  setForm((f) => ({ ...f, featured: checked }))
                }
              />
              <Label>مميز</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              إلغاء
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 ml-1 animate-spin" />
              ) : (
                <Send className="w-4 h-4 ml-1" />
              )}
              {editingProject ? 'تحديث' : 'حفظ'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف هذا المشروع؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ===================== FAQ TAB =====================

function FAQTab() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState<FAQFormData>({
    question: '',
    answer: '',
    category: '',
    order: 0,
  })

  const fetchFaqs = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/faq')
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setFaqs(data)
    } catch {
      toast.error('فشل في تحميل الأسئلة الشائعة')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFaqs()
  }, [fetchFaqs])

  const openCreate = () => {
    setEditingFaq(null)
    setForm({ question: '', answer: '', category: '', order: 0 })
    setDialogOpen(true)
  }

  const openEdit = (faq: FAQ) => {
    setEditingFaq(faq)
    setForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || '',
      order: faq.order,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      toast.error('يرجى ملء الحقول المطلوبة')
      return
    }
    setSaving(true)
    try {
      const url = editingFaq
        ? `/api/admin/faq/${editingFaq.id}`
        : '/api/admin/faq'
      const method = editingFaq ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Save failed')
      toast.success(
        editingFaq
          ? 'تم تحديث السؤال بنجاح'
          : 'تم إضافة السؤال بنجاح'
      )
      setDialogOpen(false)
      fetchFaqs()
    } catch {
      toast.error('فشل في حفظ السؤال')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      const res = await fetch(`/api/admin/faq/${deletingId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      toast.success('تم حذف السؤال بنجاح')
      setDeleteOpen(false)
      setDeletingId(null)
      fetchFaqs()
    } catch {
      toast.error('فشل في حذف السؤال')
    }
  }

  const confirmDelete = (id: string) => {
    setDeletingId(id)
    setDeleteOpen(true)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">الأسئلة الشائعة</h2>
        <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 ml-1" />
          إضافة سؤال جديد
        </Button>
      </div>

      {faqs.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-12 text-center">
            <HelpCircle className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">
              لا توجد أسئلة شائعة حتى الآن
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {faqs.map((faq) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs shrink-0">
                          #{faq.order}
                        </Badge>
                        {faq.category && (
                          <Badge variant="secondary" className="text-xs shrink-0">
                            {faq.category}
                          </Badge>
                        )}
                      </div>
                      <p className="font-medium text-sm mb-1">{faq.question}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {faq.answer}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEdit(faq)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => confirmDelete(faq.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingFaq ? 'تعديل السؤال' : 'إضافة سؤال جديد'}
            </DialogTitle>
            <DialogDescription>
              {editingFaq
                ? 'قم بتعديل بيانات السؤال'
                : 'أدخل بيانات السؤال الجديد'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>السؤال *</Label>
              <Input
                value={form.question}
                onChange={(e) =>
                  setForm((f) => ({ ...f, question: e.target.value }))
                }
                placeholder="أدخل السؤال"
              />
            </div>

            <div className="space-y-2">
              <Label>الإجابة *</Label>
              <Textarea
                value={form.answer}
                onChange={(e) =>
                  setForm((f) => ({ ...f, answer: e.target.value }))
                }
                placeholder="أدخل الإجابة"
                rows={5}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>التصنيف</Label>
                <Input
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                  placeholder="تصنيف السؤال"
                />
              </div>
              <div className="space-y-2">
                <Label>الترتيب</Label>
                <Input
                  type="number"
                  value={form.order}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      order: parseInt(e.target.value) || 0,
                    }))
                  }
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              إلغاء
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 ml-1 animate-spin" />
              ) : (
                <Send className="w-4 h-4 ml-1" />
              )}
              {editingFaq ? 'تحديث' : 'حفظ'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف هذا السؤال؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ===================== MESSAGES TAB =====================

function MessagesTab() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchMessages = useCallback(async () => {
    try {
      const params = filter !== 'all' ? `?read=${filter === 'read'}` : ''
      const res = await fetch(`/api/admin/messages${params}`)
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setMessages(data)
    } catch {
      toast.error('فشل في تحميل الرسائل')
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const toggleRead = async (id: string, currentRead: boolean) => {
    try {
      const res = await fetch('/api/admin/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, read: !currentRead }),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success(currentRead ? 'تم تعليم الرسالة كغير مقروءة' : 'تم تعليم الرسالة كمقروءة')
      fetchMessages()
    } catch {
      toast.error('فشل في تحديث حالة الرسالة')
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      const res = await fetch('/api/admin/messages', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deletingId }),
      })
      if (!res.ok) throw new Error('Delete failed')
      toast.success('تم حذف الرسالة بنجاح')
      setDeleteOpen(false)
      setDeletingId(null)
      setExpandedId(null)
      fetchMessages()
    } catch {
      toast.error('فشل في حذف الرسالة')
    }
  }

  const confirmDelete = (id: string) => {
    setDeletingId(id)
    setDeleteOpen(true)
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
    )
  }

  const filterTabs = [
    { value: 'all' as const, label: 'الكل' },
    { value: 'unread' as const, label: 'غير مقروء' },
    { value: 'read' as const, label: 'مقروء' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">إدارة الرسائل</h2>
        <Button variant="outline" size="sm" onClick={fetchMessages}>
          <RefreshCw className="w-4 h-4 ml-1" />
          تحديث
        </Button>
      </div>

      <Tabs
        value={filter}
        onValueChange={(val) => setFilter(val as typeof filter)}
      >
        <TabsList>
          {filterTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {messages.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-12 text-center">
            <Mail className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">لا توجد رسائل</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              layout
            >
              <Card
                className={`border-0 shadow-sm cursor-pointer transition-all hover:shadow-md ${
                  !msg.read ? 'ring-1 ring-blue-200 bg-blue-50/50 dark:bg-blue-950/10' : ''
                }`}
                onClick={() => toggleExpand(msg.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Read indicator */}
                    <div
                      className={`mt-2 w-2.5 h-2.5 rounded-full shrink-0 ${
                        msg.read
                          ? 'bg-muted-foreground/20'
                          : 'bg-blue-500 shadow-sm shadow-blue-500/50'
                      }`}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={`font-medium text-sm truncate ${
                              !msg.read ? 'font-bold' : ''
                            }`}
                          >
                            {msg.name}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            {msg.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-xs text-muted-foreground">
                            {formatDate(msg.createdAt)}
                          </span>
                          <ChevronLeft
                            className={`w-4 h-4 text-muted-foreground transition-transform ${
                              expandedId === msg.id ? 'rotate-90' : ''
                            }`}
                          />
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-0.5">
                        {msg.subject}
                      </p>

                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {msg.message}
                      </p>

                      {/* Expanded Content */}
                      <AnimatePresence>
                        {expandedId === msg.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <Separator className="my-3" />
                            <div className="space-y-2">
                              {msg.phone && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                                  <span>{msg.phone}</span>
                                </div>
                              )}
                              <div className="flex items-start gap-2 text-sm">
                                <MessageSquare className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
                                <p className="whitespace-pre-wrap">{msg.message}</p>
                              </div>
                              <div className="flex items-center gap-2 pt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleRead(msg.id, msg.read)
                                  }}
                                >
                                  {msg.read ? (
                                    <EyeOff className="w-3.5 h-3.5 ml-1" />
                                  ) : (
                                    <Eye className="w-3.5 h-3.5 ml-1" />
                                  )}
                                  {msg.read ? 'تعليم كغير مقروءة' : 'تعليم كمقروءة'}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs text-destructive hover:text-destructive"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    confirmDelete(msg.id)
                                  }}
                                >
                                  <Trash2 className="w-3.5 h-3.5 ml-1" />
                                  حذف
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف هذه الرسالة؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ===================== SETTINGS TAB =====================

function SettingsTab() {
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    siteName: '',
    phone: '',
    email: '',
    address: '',
    workingHours: '',
    whatsapp: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    description: '',
    chatbotPrompt: '',
  })

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings')
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      if (data.success && data.data) {
        setSettings(data.data)
        setForm({
          siteName: data.data.siteName || '',
          phone: data.data.phone || '',
          email: data.data.email || '',
          address: data.data.address || '',
          workingHours: data.data.workingHours || '',
          whatsapp: data.data.whatsapp || '',
          twitter: data.data.twitter || '',
          instagram: data.data.instagram || '',
          linkedin: data.data.linkedin || '',
          description: data.data.description || '',
          chatbotPrompt: data.data.chatbotPrompt || '',
        })
      }
    } catch {
      toast.error('فشل في تحميل الإعدادات')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Save failed')
      const data = await res.json()
      if (data.success) {
        toast.success('تم حفظ الإعدادات بنجاح')
        fetchSettings()
      } else {
        throw new Error(data.error || 'Save failed')
      }
    } catch (error) {
      toast.error('فشل في حفظ الإعدادات')
      console.error('Settings save error:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-20 rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">إعدادات الموقع</h2>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 ml-1 animate-spin" />
          ) : (
            <Save className="w-4 h-4 ml-1" />
          )}
          حفظ التغييرات
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-6 space-y-6">
          {/* معلومات الشركة */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-[#0f172a] flex items-center gap-2">
              <Shield className="w-4 h-4" />
              معلومات الشركة
            </h3>
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>اسم الشركة</Label>
                <Input
                  value={form.siteName}
                  onChange={(e) => setForm((f) => ({ ...f, siteName: e.target.value }))}
                  placeholder="شركة كيان القمة"
                />
              </div>

              <div className="space-y-2">
                <Label>رقم الهاتف</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+966 50 123 4567"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <Label>البريد الإلكتروني</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="info@kayan-alaqma.sa"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <Label>رقم الواتساب</Label>
                <Input
                  value={form.whatsapp}
                  onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
                  placeholder="966501234567"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>العنوان</Label>
              <Input
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                placeholder="طريق الملك فهد، حي العليا، الرياض"
              />
            </div>

            <div className="space-y-2">
              <Label>ساعات العمل</Label>
              <Input
                value={form.workingHours}
                onChange={(e) => setForm((f) => ({ ...f, workingHours: e.target.value }))}
                placeholder="السبت - الخميس: 8 صباحًا - 6 مساءً"
              />
            </div>

            <div className="space-y-2">
              <Label>وصف الشركة</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="وصف مختصر عن الشركة"
                rows={3}
              />
            </div>
          </div>

          {/* روابط التواصل الاجتماعي */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-[#0f172a] flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              روابط التواصل الاجتماعي
            </h3>
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>تويتر (X)</Label>
                <Input
                  value={form.twitter}
                  onChange={(e) => setForm((f) => ({ ...f, twitter: e.target.value }))}
                  placeholder="https://twitter.com/kayan_alaqma"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <Label>إنستغرام</Label>
                <Input
                  value={form.instagram}
                  onChange={(e) => setForm((f) => ({ ...f, instagram: e.target.value }))}
                  placeholder="https://instagram.com/kayan_alaqma"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <Label>لينكد إن</Label>
                <Input
                  value={form.linkedin}
                  onChange={(e) => setForm((f) => ({ ...f, linkedin: e.target.value }))}
                  placeholder="https://linkedin.com/company/kayan_alaqma"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* إعدادات الشات بوت */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-[#0f172a] flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              إعدادات الشات بوت
            </h3>
            <Separator />

            <div className="space-y-2">
              <Label>تعليمات إضافية للشات بوت</Label>
              <Textarea
                value={form.chatbotPrompt}
                onChange={(e) => setForm((f) => ({ ...f, chatbotPrompt: e.target.value }))}
                placeholder="أضف تعليمات خاصة للشات بوت (اختياري)"
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                يمكنك إضافة تعليمات إضافية لتخصيص سلوك الشات بوت
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* زر الحفظ السفلي */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 ml-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 ml-2" />
          )}
          حفظ جميع التغييرات
        </Button>
      </div>
    </div>
  )
}

// ===================== SIDEBAR =====================

function Sidebar({
  activeTab,
  onTabChange,
  unreadCount,
  onLogout,
  onToggleSidebar,
  mobileOpen,
}: {
  activeTab: string
  onTabChange: (tab: string) => void
  unreadCount: number
  onLogout: () => void
  onToggleSidebar: () => void
  mobileOpen: boolean
}) {
  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[101] md:hidden"
            onClick={onToggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed top-0 right-0 h-full w-[260px] bg-[#0f172a] z-[102] flex flex-col shadow-2xl
          md:static md:z-auto md:shadow-none
          ${mobileOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
        `}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        {/* Logo */}
        <div className="p-5 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-sm">لوحة التحكم</h2>
              <p className="text-slate-400 text-xs">شركة كيان القمة</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-3">
          <nav className="space-y-1 px-3">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id)
                    onToggleSidebar()
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                    ${
                      isActive
                        ? 'bg-blue-600/20 text-blue-400 shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="flex-1 text-right">{item.label}</span>
                  {item.id === 'messages' && unreadCount > 0 && (
                    <Badge className="bg-red-500 text-white text-[10px] px-1.5 py-0 min-w-[20px] h-5 flex items-center justify-center">
                      {unreadCount}
                    </Badge>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute right-0 w-1 h-6 rounded-l bg-blue-400"
                      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    />
                  )}
                </button>
              )
            })}
          </nav>
        </ScrollArea>

        {/* Logout */}
        <div className="p-3 border-t border-slate-700/50">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </motion.aside>
    </>
  )
}

// ===================== MAIN ADMIN PANEL =====================

export default function AdminPanel() {
  const { isOpen, isAuthenticated, activeTab, setActiveTab, logout, close } =
    useAdminStore()
  const [unreadCount, setUnreadCount] = useState(0)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Fetch unread count periodically
  useEffect(() => {
    if (!isOpen || !isAuthenticated) return
    const fetchUnread = async () => {
      try {
        const res = await fetch('/api/admin/messages?count=unread')
        if (res.ok) {
          const data = await res.json()
          setUnreadCount(typeof data === 'number' ? data : data.count || 0)
        }
      } catch {
        // silent
      }
    }
    fetchUnread()
    const interval = setInterval(fetchUnread, 30000)
    return () => clearInterval(interval)
  }, [isOpen, isAuthenticated])

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && isAuthenticated) {
        close()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, isAuthenticated, close])

  if (!isOpen) return null

  // Show login screen if not authenticated
  if (!isAuthenticated) return <LoginScreen />

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />
      case 'blog':
        return <BlogTab />
      case 'projects':
        return <ProjectsTab />
      case 'faq':
        return <FAQTab />
      case 'messages':
        return <MessagesTab />
      case 'settings':
        return <SettingsTab />
      default:
        return <DashboardTab />
    }
  }

  const currentNav = NAV_ITEMS.find((n) => n.id === activeTab)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex bg-background"
    >
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        unreadCount={unreadCount}
        onLogout={() => {
          logout()
          toast.success('تم تسجيل الخروج')
        }}
        onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        mobileOpen={mobileSidebarOpen}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 border-b bg-white/80 backdrop-blur-sm flex items-center justify-between px-4 md:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              {currentNav && (
                <>
                  <currentNav.icon className="w-5 h-5 text-muted-foreground" />
                  <h1 className="text-base font-semibold">{currentNav.label}</h1>
                </>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={close}
          >
            <X className="w-5 h-5" />
          </Button>
        </header>

        {/* Content Area */}
        <ScrollArea className="flex-1">
          <div className="p-4 md:p-6 max-w-5xl">{renderContent()}</div>
        </ScrollArea>
      </main>
    </motion.div>
  )
}
