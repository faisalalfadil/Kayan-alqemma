import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all projects with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const where: Record<string, unknown> = {}

    if (featured !== null && featured !== undefined && featured !== '') {
      where.featured = featured === 'true'
    }

    if (category) {
      where.category = category
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { clientName: { contains: search } },
        { location: { contains: search } },
      ]
    }

    const projects = await db.project.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: projects })
  } catch (error) {
    console.error('خطأ في جلب المشاريع:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في جلب المشاريع' },
      { status: 500 }
    )
  }
}

// POST create new project (supports JSON and FormData)
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''

    let title = ''
    let description = ''
    let image = ''
    let category = ''
    let clientName = ''
    let location = ''
    let completedAt = ''
    let featured = false

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      title = (formData.get('title') as string) || ''
      description = (formData.get('description') as string) || ''
      image = (formData.get('image') as string) || ''
      category = (formData.get('category') as string) || ''
      clientName = (formData.get('clientName') as string) || ''
      location = (formData.get('location') as string) || ''
      completedAt = (formData.get('completedAt') as string) || ''
      featured = formData.get('featured') === 'true'
    } else {
      const body = await request.json()
      title = body.title || ''
      description = body.description || ''
      image = body.image || ''
      category = body.category || ''
      clientName = body.clientName || ''
      location = body.location || ''
      completedAt = body.completedAt || ''
      featured = body.featured === true
    }

    if (!title || title.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: 'عنوان المشروع مطلوب ويجب أن يكون 3 أحرف على الأقل' },
        { status: 400 }
      )
    }

    if (!description || description.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: 'وصف المشروع مطلوب ويجب أن يكون 5 أحرف على الأقل' },
        { status: 400 }
      )
    }

    const project = await db.project.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        image: image.trim() || null,
        category: category.trim() || null,
        clientName: clientName.trim() || null,
        location: location.trim() || null,
        completedAt: completedAt ? new Date(completedAt) : null,
        featured,
      },
    })

    return NextResponse.json({ success: true, data: project }, { status: 201 })
  } catch (error) {
    console.error('خطأ في إنشاء المشروع:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في إنشاء المشروع' },
      { status: 500 }
    )
  }
}
