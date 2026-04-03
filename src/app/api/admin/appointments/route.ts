import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: Record<string, unknown> = {}

    if (status && status !== 'all') {
      where.status = status
    }

    if (startDate && endDate) {
      where.date = {
        gte: startDate,
        lte: endDate,
      }
    } else if (startDate) {
      where.date = { gte: startDate }
    } else if (endDate) {
      where.date = { lte: endDate }
    }

    const appointments = await db.appointment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    const count = await db.appointment.count({ where })

    return NextResponse.json({ success: true, data: appointments, count })
  } catch {
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في جلب المواعيد' },
      { status: 500 }
    )
  }
}
