import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET dashboard statistics
export async function GET() {
  try {
    // Run all queries in parallel for performance
    const [
      totalBlogPosts,
      publishedPosts,
      draftPosts,
      totalProjects,
      featuredProjects,
      totalFAQs,
      totalMessages,
      unreadMessages,
      recentMessages,
    ] = await Promise.all([
      // Blog stats
      db.blogPost.count(),
      db.blogPost.count({ where: { published: true } }),
      db.blogPost.count({ where: { published: false } }),

      // Project stats
      db.project.count(),
      db.project.count({ where: { featured: true } }),

      // FAQ stats
      db.fAQ.count(),

      // Message stats
      db.contactMessage.count(),
      db.contactMessage.count({ where: { read: false } }),

      // Recent messages (last 5)
      db.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          subject: true,
          message: true,
          read: true,
          createdAt: true,
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        blog: {
          total: totalBlogPosts,
          published: publishedPosts,
          drafts: draftPosts,
        },
        projects: {
          total: totalProjects,
          featured: featuredProjects,
        },
        faqs: {
          total: totalFAQs,
        },
        messages: {
          total: totalMessages,
          unread: unreadMessages,
        },
        recentMessages,
      },
    })
  } catch (error) {
    console.error('خطأ في جلب الإحصائيات:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في جلب الإحصائيات' },
      { status: 500 }
    )
  }
}
