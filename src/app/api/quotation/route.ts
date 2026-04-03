import { NextRequest, NextResponse } from 'next/server';

/* ------------------------------------------------------------------ */
/*  Service Pricing Config                                             */
/* ------------------------------------------------------------------ */

const SERVICE_PRICES: Record<string, { basePrice: number; unit: string; category: string }> = {
  electric: { basePrice: 350, unit: 'm²', category: 'canopy' },
  car: { basePrice: 200, unit: 'm²', category: 'canopy' },
  garden: { basePrice: 280, unit: 'm²', category: 'canopy' },
  pool: { basePrice: 320, unit: 'm²', category: 'canopy' },
  furniture: { basePrice: 150, unit: 'قطعة', category: 'furniture' },
  maintenance: { basePrice: 500, unit: 'زيارة', category: 'maintenance' },
};

const FABRIC_MULTIPLIERS: Record<string, number> = {
  standard: 1.0,
  uv: 1.2,
  water: 1.3,
  premium: 1.5,
};

const EXTRAS_PRICES: Record<string, number> = {
  motor: 500,
  led: 300,
  rainSensor: 400,
  remote: 200,
};

const VAT_RATE = 0.15;

/* ------------------------------------------------------------------ */
/*  POST: Calculate Quotation                                          */
/* ------------------------------------------------------------------ */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serviceType, area, pieces, fabric, extras, notes } = body;

    // Validate required fields
    if (!serviceType) {
      return NextResponse.json(
        { success: false, error: 'يرجى اختيار نوع الخدمة' },
        { status: 400 }
      );
    }

    const serviceConfig = SERVICE_PRICES[serviceType];
    if (!serviceConfig) {
      return NextResponse.json(
        { success: false, error: 'نوع الخدمة غير صالح' },
        { status: 400 }
      );
    }

    // Calculate base price
    let basePrice = 0;
    let estimatedTime = '';

    if (serviceConfig.category === 'canopy') {
      const effectiveArea = Math.max(1, Number(area) || 1);
      basePrice = effectiveArea * serviceConfig.basePrice;
      if (effectiveArea <= 20) estimatedTime = 'يوم - 3 أيام';
      else if (effectiveArea <= 50) estimatedTime = '3 - 7 أيام';
      else if (effectiveArea <= 100) estimatedTime = '7 - 14 يوم';
      else estimatedTime = '14 - 21 يوم';
    } else if (serviceConfig.category === 'furniture') {
      const effectivePieces = Math.max(1, Number(pieces) || 1);
      basePrice = effectivePieces * serviceConfig.basePrice;
      if (effectivePieces <= 5) estimatedTime = 'يوم - 3 أيام';
      else if (effectivePieces <= 15) estimatedTime = '3 - 7 أيام';
      else estimatedTime = '7 - 14 يوم';
    } else {
      basePrice = serviceConfig.basePrice;
      estimatedTime = 'يوم واحد';
    }

    // Fabric cost
    const fabricMultiplier = FABRIC_MULTIPLIERS[fabric] || 1.0;
    const fabricCost = Math.round(basePrice * (fabricMultiplier - 1));
    const totalBase = basePrice + fabricCost;

    // Extras cost
    const extrasData = extras || {};
    let extrasCost = 0;
    for (const [key, enabled] of Object.entries(extrasData)) {
      if (enabled && EXTRAS_PRICES[key]) {
        extrasCost += EXTRAS_PRICES[key];
      }
    }

    // Totals
    const subtotal = totalBase + extrasCost;
    const vat = Math.round(subtotal * VAT_RATE);
    const total = subtotal + vat;

    return NextResponse.json({
      success: true,
      data: {
        basePrice,
        fabricCost,
        extrasCost,
        subtotal,
        vat,
        total,
        estimatedTime,
      },
    });
  } catch (error) {
    console.error('Quotation calculation error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء حساب التقدير' },
      { status: 500 }
    );
  }
}
