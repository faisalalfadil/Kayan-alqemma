import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const baseUrl = 'https://kayan-alaqma.sa'

    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily', page: 'home' },
      { url: '/#about', priority: '0.8', changefreq: 'monthly', page: 'about' },
      { url: '/#services', priority: '0.9', changefreq: 'weekly', page: 'services' },
      { url: '/#projects', priority: '0.8', changefreq: 'weekly', page: 'projects' },
      { url: '/#blog', priority: '0.7', changefreq: 'daily', page: 'blog' },
      { url: '/#contact', priority: '0.8', changefreq: 'monthly', page: 'contact' },
      { url: '/#faq', priority: '0.6', changefreq: 'monthly', page: 'faq' },
    ]

    const blogPosts = await db.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
    })

    const blogUrls = blogPosts.map(post => ({
      url: `/blog/${post.slug}`,
      priority: '0.7',
      changefreq: 'weekly' as const,
      lastmod: post.updatedAt,
      page: post.slug,
    }))

    const allPages = [...staticPages, ...blogUrls]

    const today = new Date().toISOString().split('T')[0]

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${(page as { lastmod?: string }).lastmod || today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch {
    return NextResponse.json(
      { error: 'فشل في إنشاء خريطة الموقع' },
      { status: 500 }
    )
  }
}
