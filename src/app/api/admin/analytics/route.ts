import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)

    // Generate last 6 months for monthly data
    const months: { month: string; year: number; monthIndex: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = d.toLocaleDateString('ar-SA', { month: 'long' })
      months.push({ month: monthName, year: d.getFullYear(), monthIndex: d.getMonth() })
    }

    // ─── Messages Stats ───────────────────────────────────────────────────
    const [totalMessages, unreadMessages, thisMonthMessages, lastMonthMessages, allMessages] = await Promise.all([
      db.contactMessage.count(),
      db.contactMessage.count({ where: { read: false } }),
      db.contactMessage.count({
        where: { createdAt: { gte: thisMonthStart } },
      }),
      db.contactMessage.count({
        where: { createdAt: { gte: lastMonthStart, lte: lastMonthEnd } },
      }),
      db.contactMessage.findMany({ select: { createdAt: true } }),
    ])

    // Calculate monthly message counts
    const messagesMonthly = months.map(m => {
      const count = allMessages.filter(msg => {
        const msgDate = new Date(msg.createdAt)
        return msgDate.getFullYear() === m.year && msgDate.getMonth() === m.monthIndex
      }).length
      return { month: m.month, count }
    })

    // ─── Blog Stats ──────────────────────────────────────────────────────
    const [totalBlogPosts, publishedBlogPosts, draftBlogPosts, allBlogPosts] = await Promise.all([
      db.blogPost.count(),
      db.blogPost.count({ where: { published: true } }),
      db.blogPost.count({ where: { published: false } }),
      db.blogPost.findMany({ select: { createdAt: true, published: true } }),
    ])

    const blogMonthly = months.map(m => {
      const count = allBlogPosts.filter(post => {
        const postDate = new Date(post.createdAt)
        return postDate.getFullYear() === m.year && postDate.getMonth() === m.monthIndex
      }).length
      return { month: m.month, count }
    })

    // ─── Projects Stats ──────────────────────────────────────────────────
    const [totalProjects, featuredProjects, allProjectsGrouped] = await Promise.all([
      db.project.count(),
      db.project.count({ where: { featured: true } }),
      db.project.groupBy({
        by: ['category'],
        where: { category: { not: null } },
        _count: { category: true },
      }),
    ])

    const projectsByCategory = allProjectsGrouped.map(g => ({
      category: g.category || 'أخرى',
      count: g._count.category,
    }))

    // ─── FAQ Stats ───────────────────────────────────────────────────────
    const allFaqsGrouped = await db.fAQ.groupBy({
      by: ['category'],
      where: { category: { not: null } },
      _count: { category: true },
    })

    const faqsByCategory = allFaqsGrouped.map(g => ({
      category: g.category || 'أخرى',
      count: g._count.category,
    }))

    const totalFaqs = await db.fAQ.count()

    // ─── Testimonials Stats ──────────────────────────────────────────────
    const [allTestimonials, totalTestimonials] = await Promise.all([
      db.testimonial.findMany({ select: { rating: true } }),
      db.testimonial.count(),
    ])

    const averageRating = allTestimonials.length > 0
      ? allTestimonials.reduce((sum, t) => sum + t.rating, 0) / allTestimonials.length
      : 0

    const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
      rating,
      count: allTestimonials.filter(t => t.rating === rating).length,
    }))

    // ─── Newsletter Stats ────────────────────────────────────────────────
    let totalNewsletter = 0
    let thisMonthNewsletter = 0
    let newsletterMonthly = months.map(m => ({ month: m.month, count: 0 }))

    try {
      const [nlTotal, nlThisMonth, nlAll] = await Promise.all([
        (db.newsletter as any).count?.() ?? Promise.resolve(0),
        (db.newsletter as any).count?.({ where: { createdAt: { gte: thisMonthStart } } }) ?? Promise.resolve(0),
        (db.newsletter as any).findMany?.({ select: { createdAt: true } }) ?? Promise.resolve([]),
      ])
      totalNewsletter = nlTotal || 0
      thisMonthNewsletter = nlThisMonth || 0
      const allNewsletters = nlAll || []
      newsletterMonthly = months.map(m => {
        const count = allNewsletters.filter((n: { createdAt: Date }) => {
          const nDate = new Date(n.createdAt)
          return nDate.getFullYear() === m.year && nDate.getMonth() === m.monthIndex
        }).length
        return { month: m.month, count }
      })
    } catch {
      // Newsletter model might not be available yet
    }

    // ─── Recent Activity (last 5 items across messages and blog posts) ───
    const recentMessages = await db.contactMessage.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, createdAt: true },
    })

    const recentBlogPosts = await db.blogPost.findMany({
      take: 2,
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, createdAt: true },
    })

    const recentActivity = [
      ...recentMessages.map(m => ({
        type: 'message' as const,
        title: `رسالة من ${m.name}`,
        date: m.createdAt.toISOString(),
      })),
      ...recentBlogPosts.map(p => ({
        type: 'blog' as const,
        title: `مقال جديد: ${p.title}`,
        date: p.createdAt.toISOString(),
      })),
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)

    return NextResponse.json({
      success: true,
      data: {
        messages: {
          total: totalMessages,
          unread: unreadMessages,
          thisMonth: thisMonthMessages,
          lastMonth: lastMonthMessages,
          monthly: messagesMonthly,
        },
        blog: {
          total: totalBlogPosts,
          published: publishedBlogPosts,
          drafts: draftBlogPosts,
          monthly: blogMonthly,
        },
        projects: {
          total: totalProjects,
          featured: featuredProjects,
          byCategory: projectsByCategory,
        },
        faqs: {
          total: totalFaqs,
          byCategory: faqsByCategory,
        },
        testimonials: {
          total: totalTestimonials,
          averageRating: Math.round(averageRating * 10) / 10,
          ratingDistribution,
        },
        newsletter: {
          total: totalNewsletter,
          thisMonth: thisMonthNewsletter,
          monthly: newsletterMonthly,
        },
        appointments: {
          total: 0,
          pending: 0,
          confirmed: 0,
          completed: 0,
          cancelled: 0,
          thisMonth: 0,
        },
        recentActivity,
      },
    })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في جلب البيانات التحليلية' },
      { status: 500 }
    )
  }
}
