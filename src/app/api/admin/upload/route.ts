import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif']

function getFileExtension(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  return ext
}

// POST handle file upload
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const category = (formData.get('category') as string) || 'general'

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'لم يتم اختيار ملف' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'نوع الملف غير مدعوم. الأنواع المدعومة: JPEG, PNG, WebP, GIF' },
        { status: 400 }
      )
    }

    // Validate file extension
    const ext = getFileExtension(file.name)
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { success: false, error: 'امتداد الملف غير مدعوم' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'حجم الملف يتجاوز الحد الأقصى (10 ميجابايت)' },
        { status: 400 }
      )
    }

    // Read file buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Sanitize filename
    const sanitizedFilename = file.name
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/\s+/g, '_')

    // Generate unique filename with timestamp
    const timestamp = Date.now()
    const uniqueFilename = `${timestamp}-${sanitizedFilename}`

    // Build upload path
    const uploadsDir = path.join(
      process.cwd(),
      'public',
      'uploads',
      category
    )
    const filePath = path.join(uploadsDir, uniqueFilename)

    // Write file to filesystem
    await writeFile(filePath, buffer)

    // Return the public URL path
    const url = `/uploads/${category}/${uniqueFilename}`

    return NextResponse.json({
      success: true,
      url,
      filename: uniqueFilename,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error('خطأ في رفع الملف:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في رفع الملف' },
      { status: 500 }
    )
  }
}
