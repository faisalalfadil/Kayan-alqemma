'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowLeft, BookOpen, Share2, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

interface BlogArticle {
  id: string
  title: string
  slug?: string
  excerpt?: string
  content: string
  coverImage?: string | null
  metaDescription?: string | null
  published: boolean
  createdAt: string
  updatedAt: string
}

const gradients = [
  'from-[#1a56db] to-[#3b82f6]',
  'from-[#ea580c] to-[#f97316]',
  'from-[#0f172a] to-[#334155]',
  'from-[#1a56db] to-[#ea580c]',
  'from-[#3b82f6] to-[#8b5cf6]',
  'from-[#059669] to-[#34d399]',
]

const categoryGradients: Record<string, string> = {
  'نصائح': 'bg-blue-100 text-blue-800',
  'تصميم': 'bg-orange-100 text-orange-800',
  'صيانة': 'bg-gray-100 text-gray-800',
  'فوائد': 'bg-green-100 text-green-800',
  'مقارنات': 'bg-purple-100 text-purple-800',
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

function BlogSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="overflow-hidden border border-gray-100 bg-white py-0 gap-0">
          <Skeleton className="h-48 w-full" />
          <CardContent className="p-5">
            <div className="flex items-center gap-4 mb-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-3/4 mb-3" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function Blog() {
  const [articles, setArticles] = useState<BlogArticle[]>([])
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/blog')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const published = (data.data || []).filter(
            (post: BlogArticle) => post.published !== false
          )
          setArticles(published)
        } else {
          setError('حدث خطأ أثناء تحميل المقالات')
        }
      })
      .catch(() => {
        setError('تعذر الاتصال بالخادم')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getReadTime = (content: string) => {
    const words = content.split(/\s+/).length
    const minutes = Math.max(1, Math.ceil(words / 200))
    return `${minutes} دقائق`
  }

  const handleShare = (platform: string) => {
    if (!selectedArticle) return
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(selectedArticle.title)
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
        break
      case 'whatsapp':
        window.open(`https://wa.me/?text=${text}%20${url}`, '_blank')
        break
      case 'copy':
        navigator.clipboard.writeText(window.location.href)
        break
    }
  }

  return (
    <section id="blog" className="py-20 gradient-section">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] mb-4">
            المدونة
          </h2>
          <div className="w-20 h-1 bg-[#1a56db] mx-auto rounded-full mb-4" />
          <p className="text-[#64748b] text-lg max-w-2xl mx-auto">
            اطلع على أحدث المقالات والأخبار المتعلقة بعالم المظلات الكهربائية
          </p>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-[#64748b] text-lg mb-4">{error}</p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="text-[#1a56db] border-[#1a56db] hover:bg-[#1a56db] hover:text-white"
            >
              إعادة المحاولة
            </Button>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && !error && <BlogSkeleton />}

        {/* Blog Grid */}
        {!isLoading && !error && articles.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {articles.map((article, index) => {
              const gradient = gradients[index % gradients.length]
              return (
                <motion.div key={article.id} variants={itemVariants}>
                  <Card
                    className="group overflow-hidden border border-gray-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer py-0 gap-0"
                    onClick={() => setSelectedArticle(article)}
                  >
                    {/* Image */}
                    <div
                      className={`h-48 bg-gradient-to-br ${gradient} relative overflow-hidden`}
                    >
                      {article.coverImage ? (
                        <img
                          src={article.coverImage}
                          alt={article.title}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.currentTarget
                            target.style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-white/30" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-white/90 text-[#0f172a] hover:bg-white border-0 text-xs font-medium px-3 py-1 backdrop-blur-sm">
                          مقال
                        </Badge>
                      </div>
                      {/* Decorative pattern */}
                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/10 to-transparent" />
                    </div>

                    <CardContent className="p-5">
                      {/* Date & Read Time */}
                      <div className="flex items-center gap-4 text-xs text-[#64748b] mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(article.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {getReadTime(article.content)}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-[#0f172a] mb-2 line-clamp-2 group-hover:text-[#1a56db] transition-colors">
                        {article.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-sm text-[#64748b] mb-4 line-clamp-2">
                        {article.excerpt || article.content.substring(0, 120) + '...'}
                      </p>

                      {/* Read More */}
                      <Button
                        variant="ghost"
                        className="text-[#1a56db] hover:text-[#ea580c] hover:bg-blue-50 p-0 h-auto font-medium text-sm"
                      >
                        اقرأ المزيد
                        <ArrowLeft className="w-4 h-4 mr-1" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !error && articles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <BookOpen className="w-12 h-12 text-[#64748b] mx-auto mb-4" />
            <p className="text-[#64748b] text-lg">
              لا توجد مقالات حالياً
            </p>
          </motion.div>
        )}

        {/* View All Button */}
        {!isLoading && !error && articles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Button
              size="lg"
              className="bg-[#1a56db] hover:bg-[#1444b0] text-white px-8 py-3 rounded-lg font-semibold text-base"
            >
              عرض جميع المقالات
              <ArrowLeft className="w-5 h-5 mr-2" />
            </Button>
          </motion.div>
        )}
      </div>

      {/* Article Dialog */}
      <Dialog
        open={!!selectedArticle}
        onOpenChange={(open) => !open && setSelectedArticle(null)}
      >
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-0">
          {selectedArticle && (
            <>
              {/* Header Image */}
              <div className="h-56 sm:h-64 bg-gradient-to-br from-[#1a56db] to-[#3b82f6] relative">
                {selectedArticle.coverImage ? (
                  <img
                    src={selectedArticle.coverImage}
                    alt={selectedArticle.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget
                      target.style.display = 'none'
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-white/30" />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/90 text-[#0f172a] hover:bg-white border-0 text-sm font-medium px-4 py-1.5 backdrop-blur-sm">
                    مقال
                  </Badge>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-6 sm:p-8">
                <DialogHeader className="text-right mb-4">
                  <DialogTitle className="text-2xl sm:text-3xl font-bold text-[#0f172a] leading-relaxed">
                    {selectedArticle.title}
                  </DialogTitle>
                  <DialogDescription className="flex items-center gap-4 text-sm text-[#64748b] mt-2">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {formatDate(selectedArticle.createdAt)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {getReadTime(selectedArticle.content)}
                    </span>
                  </DialogDescription>
                </DialogHeader>

                <div className="border-t border-gray-100 my-6" />

                {/* Article Body */}
                <div className="prose prose-lg max-w-none text-[#334155] leading-relaxed">
                  {selectedArticle.content.split('\n\n').map((paragraph, index) => {
                    if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                      return (
                        <h3
                          key={index}
                          className="text-lg font-bold text-[#0f172a] mt-6 mb-3"
                        >
                          {paragraph.replace(/\*\*/g, '')}
                        </h3>
                      )
                    }
                    return (
                      <p
                        key={index}
                        className="text-base leading-loose mb-4"
                      >
                        {paragraph.replace(/\*\*/g, '')}
                      </p>
                    )
                  })}
                </div>

                {/* Share Buttons */}
                <div className="border-t border-gray-100 mt-8 pt-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <Share2 className="w-5 h-5 text-[#64748b]" />
                      <span className="text-sm font-medium text-[#64748b]">
                        مشاركة المقال
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-sm"
                        onClick={() => handleShare('twitter')}
                      >
                        تويتر
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-sm"
                        onClick={() => handleShare('whatsapp')}
                      >
                        واتساب
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-sm"
                        onClick={() => handleShare('copy')}
                      >
                        نسخ الرابط
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
