import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PUT update project (supports JSON and FormData)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'معرف المشروع مطلوب' },
        { status: 400 }
      )
    }

    // Verify project exists
    const existing = await db.project.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'المشروع غير موجود' },
        { status: 404 }
      )
    }

    const contentType = request.headers.get('content-type') || ''

    const data: Record<string, unknown> = {}

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const title = formData.get('title') as string | null
      const description = formData.get('description') as string | null
      const image = formData.get('image') as string | null
      const category = formData.get('category') as string | null
      const clientName = formData.get('clientName') as string | null
      const location = formData.get('location') as string | null
      const completedAt = formData.get('completedAt') as string | null
      const featured = formData.get('featured') as string | null

      if (title !== null) data.title = title.trim()
      if (description !== null) data.description = description.trim()
      if (image !== null) data.image = image.trim() || null
      if (category !== null) data.category = category.trim() || null
      if (clientName !== null) data.clientName = clientName.trim() || null
      if (location !== null) data.location = location.trim() || null
      if (completedAt !== null) data.completedAt = completedAt ? new Date(completedAt) : null
      if (featured !== null) data.featured = featured === 'true'
    } else {
      const body = await request.json()
      if (body.title !== undefined) data.title = body.title.trim()
      if (body.description !== undefined) data.description = body.description.trim()
      if (body.image !== undefined) data.image = body.image?.trim() || null
      if (body.category !== undefined) data.category = body.category?.trim() || null
      if (body.clientName !== undefined) data.clientName = body.clientName?.trim() || null
      if (body.location !== undefined) data.location = body.location?.trim() || null
      if (body.completedAt !== undefined) data.completedAt = body.completedAt ? new Date(body.completedAt) : null
      if (body.featured !== undefined) data.featured = body.featured
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { success: false, error: 'لم يتم توفير بيانات للتحديث' },
        { status: 400 }
      )
    }

    const project = await db.project.update({
      where: { id },
      data,
    })

    return NextResponse.json({ success: true, data: project })
  } catch (error) {
    console.error('خطأ في تحديث المشروع:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في تحديث المشروع' },
      { status: 500 }
    )
  }
}

// DELETE project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'معرف المشروع مطلوب' },
        { status: 400 }
      )
    }

    // Verify project exists
    const existing = await db.project.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'المشروع غير موجود' },
        { status: 404 }
      )
    }

    await db.project.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: 'تم حذف المشروع بنجاح',
    })
  } catch (error) {
    console.error('خطأ في حذف المشروع:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في حذف المشروع' },
      { status: 500 }
    )
  }
}
