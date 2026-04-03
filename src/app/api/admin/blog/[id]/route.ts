import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PUT update blog post (supports JSON and FormData)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'معرف المقال مطلوب' },
        { status: 400 }
      )
    }

    // Verify post exists
    const existing = await db.blogPost.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'المقال غير موجود' },
        { status: 404 }
      )
    }

    const contentType = request.headers.get('content-type') || ''

    const data: Record<string, unknown> = {}

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const title = formData.get('title') as string | null
      const slug = formData.get('slug') as string | null
      const excerpt = formData.get('excerpt') as string | null
      const content = formData.get('content') as string | null
      const coverImage = formData.get('coverImage') as string | null
      const metaDescription = formData.get('metaDescription') as string | null
      const published = formData.get('published') as string | null

      if (title !== null) data.title = title.trim()
      if (slug !== null) data.slug = slug.trim()
      if (excerpt !== null) data.excerpt = excerpt.trim() || null
      if (content !== null) data.content = content.trim()
      if (coverImage !== null) data.coverImage = coverImage.trim() || null
      if (metaDescription !== null) data.metaDescription = metaDescription.trim() || null
      if (published !== null) data.published = published === 'true'
    } else {
      const body = await request.json()
      if (body.title !== undefined) data.title = body.title.trim()
      if (body.slug !== undefined) data.slug = body.slug.trim()
      if (body.excerpt !== undefined) data.excerpt = body.excerpt?.trim() || null
      if (body.content !== undefined) data.content = body.content.trim()
      if (body.coverImage !== undefined) data.coverImage = body.coverImage?.trim() || null
      if (body.metaDescription !== undefined) data.metaDescription = body.metaDescription?.trim() || null
      if (body.published !== undefined) data.published = body.published
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { success: false, error: 'لم يتم توفير بيانات للتحديث' },
        { status: 400 }
      )
    }

    const post = await db.blogPost.update({
      where: { id },
      data,
    })

    return NextResponse.json({ success: true, data: post })
  } catch (error) {
    console.error('خطأ في تحديث المقال:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في تحديث المقال' },
      { status: 500 }
    )
  }
}

// DELETE blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'معرف المقال مطلوب' },
        { status: 400 }
      )
    }

    // Verify post exists
    const existing = await db.blogPost.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'المقال غير موجود' },
        { status: 404 }
      )
    }

    await db.blogPost.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: 'تم حذف المقال بنجاح',
    })
  } catch (error) {
    console.error('خطأ في حذف المقال:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في حذف المقال' },
      { status: 500 }
    )
  }
}
