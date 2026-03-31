'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sun,
  Car,
  TreePine,
  Waves,
  Sofa,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Calculator as CalculatorIcon,
  Check,
  RotateCcw,
  MessageCircle,
  Phone,
  Zap,
  Lightbulb,
  CloudRain,
  Tv,
  Ruler,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ServiceOption {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  basePrice: number;
  unit: string; // 'm²' or 'قطعة' or 'زيارة'
  category: 'canopy' | 'furniture' | 'maintenance';
}

interface FabricOption {
  id: string;
  label: string;
  multiplier: number;
}

interface ExtraOption {
  id: string;
  label: string;
  icon: React.ElementType;
  price: number;
}

interface FormData {
  serviceType: string;
  area: number;
  width: number;
  length: number;
  pieces: number;
  problemType: string;
  problemDescription: string;
  fabric: string;
  color: string;
  motor: boolean;
  led: boolean;
  rainSensor: boolean;
  remote: boolean;
  notes: string;
}

interface PriceBreakdown {
  basePrice: number;
  fabricCost: number;
  extrasCost: number;
  subtotal: number;
  vat: number;
  total: number;
  estimatedTime: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const SERVICES: ServiceOption[] = [
  {
    id: 'electric',
    title: 'مظلات كهربائية',
    description: 'مظلات تراجعية كهربائية بأحدث التقنيات والتحكم الذكي',
    icon: Sun,
    gradient: 'from-[#1a56db] to-[#3b82f6]',
    basePrice: 350,
    unit: 'm²',
    category: 'canopy',
  },
  {
    id: 'car',
    title: 'مظلات سيارات',
    description: 'حماية متكاملة لسيارتك من الشمس والأمطار والغبار',
    icon: Car,
    gradient: 'from-[#ea580c] to-[#f97316]',
    basePrice: 200,
    unit: 'm²',
    category: 'canopy',
  },
  {
    id: 'garden',
    title: 'مظلات حدائق',
    description: 'تصاميم أنيقة وعملية لمساحاتك الخارجية والحدائق',
    icon: TreePine,
    gradient: 'from-[#059669] to-[#34d399]',
    basePrice: 280,
    unit: 'm²',
    category: 'canopy',
  },
  {
    id: 'pool',
    title: 'مظلات مسابح',
    description: 'مظلات مقاومة للماء والرطوبة مصممة خصيصاً للمسابح',
    icon: Waves,
    gradient: 'from-[#0891b2] to-[#22d3ee]',
    basePrice: 320,
    unit: 'm²',
    category: 'canopy',
  },
  {
    id: 'furniture',
    title: 'كنب حديقة',
    description: 'تشكيلة واسعة من الأثاث الخارجي المصمم لتحمل الطقس',
    icon: Sofa,
    gradient: 'from-[#7c3aed] to-[#a78bfa]',
    basePrice: 150,
    unit: 'قطعة',
    category: 'furniture',
  },
  {
    id: 'maintenance',
    title: 'صيانة وإصلاح',
    description: 'خدمة صيانة دورية وإصلاح طوارئ على مدار الساعة',
    icon: Wrench,
    gradient: 'from-[#dc2626] to-[#f87171]',
    basePrice: 500,
    unit: 'زيارة',
    category: 'maintenance',
  },
];

const FABRICS: FabricOption[] = [
  { id: 'standard', label: 'قماش عادي', multiplier: 1.0 },
  { id: 'uv', label: 'قماش مقاوم للأشعة', multiplier: 1.2 },
  { id: 'water', label: 'قماش مقاوم للماء', multiplier: 1.3 },
  { id: 'premium', label: 'قماش Premium', multiplier: 1.5 },
];

const COLORS = [
  'أبيض',
  'بيج',
  'رمادي',
  'بني',
  'أسود',
  'أخضر',
  'أزرق',
  'أحمر',
];

const EXTRAS: ExtraOption[] = [
  { id: 'motor', label: 'التحكم بالمحرك', icon: Zap, price: 500 },
  { id: 'led', label: 'إضاءة LED مدمجة', icon: Lightbulb, price: 300 },
  { id: 'rainSensor', label: 'مستشعر مطر', icon: CloudRain, price: 400 },
  { id: 'remote', label: 'التحكم عن بُعد', icon: Tv, price: 200 },
];

const PROBLEM_TYPES = [
  'عطل في المحرك',
  'تمزق في القماش',
  'مشكلة في الهيكل',
  'مشكلة كهربائية',
  'تنظيف وصيانة عامة',
  'أخرى',
];

const STEP_TITLES = [
  '',
  'نوع الخدمة',
  'المواصفات',
  'تفاصيل إضافية',
  'النتائج',
];

/* ------------------------------------------------------------------ */
/*  Animation Variants                                                 */
/* ------------------------------------------------------------------ */

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
};

const stepContainerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

/* ------------------------------------------------------------------ */
/*  Helper Functions                                                   */
/* ------------------------------------------------------------------ */

function getSelectedService(serviceId: string): ServiceOption | undefined {
  return SERVICES.find((s) => s.id === serviceId);
}

function getSelectedFabric(fabricId: string): FabricOption | undefined {
  return FABRICS.find((f) => f.id === fabricId);
}

function calculatePrice(data: FormData): PriceBreakdown {
  const service = getSelectedService(data.serviceType);
  const fabric = getSelectedFabric(data.fabric);

  if (!service || !fabric) {
    return { basePrice: 0, fabricCost: 0, extrasCost: 0, subtotal: 0, vat: 0, total: 0, estimatedTime: '' };
  }

  let basePrice = 0;
  let estimatedTime = '';

  if (service.category === 'canopy') {
    const area = data.area;
    basePrice = area * service.basePrice;
    if (area <= 20) estimatedTime = 'يوم - 3 أيام';
    else if (area <= 50) estimatedTime = '3 - 7 أيام';
    else if (area <= 100) estimatedTime = '7 - 14 يوم';
    else estimatedTime = '14 - 21 يوم';
  } else if (service.category === 'furniture') {
    basePrice = data.pieces * service.basePrice;
    if (data.pieces <= 5) estimatedTime = 'يوم - 3 أيام';
    else if (data.pieces <= 15) estimatedTime = '3 - 7 أيام';
    else estimatedTime = '7 - 14 يوم';
  } else {
    basePrice = service.basePrice;
    estimatedTime = 'يوم واحد';
  }

  const fabricCost = basePrice * (fabric.multiplier - 1);
  const totalBase = basePrice + fabricCost;

  const extrasCost =
    (data.motor ? EXTRAS[0].price : 0) +
    (data.led ? EXTRAS[1].price : 0) +
    (data.rainSensor ? EXTRAS[2].price : 0) +
    (data.remote ? EXTRAS[3].price : 0);

  const subtotal = totalBase + extrasCost;
  const vat = Math.round(subtotal * 0.15);
  const total = subtotal + vat;

  return { basePrice, fabricCost, extrasCost, subtotal, vat, total, estimatedTime };
}

function formatPrice(amount: number): string {
  return amount.toLocaleString('ar-SA');
}

/* ------------------------------------------------------------------ */
/*  Step 1: Service Type Selection                                     */
/* ------------------------------------------------------------------ */

function Step1({
  formData,
  onChange,
}: {
  formData: FormData;
  onChange: (data: FormData) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-[#0f172a] mb-2">
          اختر نوع الخدمة
        </h3>
        <p className="text-[#64748b] text-sm">
          حدد الخدمة التي ترغب في الحصول على تقدير سعر لها
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SERVICES.map((service) => {
          const Icon = service.icon;
          const isSelected = formData.serviceType === service.id;
          return (
            <motion.div
              key={service.id}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`relative cursor-pointer transition-all duration-300 overflow-hidden ${
                  isSelected
                    ? 'border-2 border-[#1a56db] shadow-lg shadow-[#1a56db]/10'
                    : 'border border-gray-100 hover:border-[#1a56db]/30 hover:shadow-md'
                }`}
                onClick={() => onChange({ ...formData, serviceType: service.id })}
              >
                {isSelected && (
                  <div className="absolute top-3 left-3 z-10">
                    <div className="w-6 h-6 rounded-full bg-[#1a56db] flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                )}
                <CardContent className="p-5 text-center">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mx-auto mb-4 shadow-lg`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="font-bold text-[#0f172a] mb-1.5 text-base">
                    {service.title}
                  </h4>
                  <p className="text-[#64748b] text-xs leading-relaxed mb-3">
                    {service.description}
                  </p>
                  <Badge variant="secondary" className="text-xs font-semibold">
                    {service.basePrice} ريال / {service.unit}
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 2: Specifications                                             */
/* ------------------------------------------------------------------ */

function Step2({
  formData,
  onChange,
}: {
  formData: FormData;
  onChange: (data: FormData) => void;
}) {
  const service = getSelectedService(formData.serviceType);

  const handleAreaSliderChange = (value: number[]) => {
    const area = value[0];
    // Auto-calculate width/length maintaining aspect
    const width = Math.round(Math.sqrt(area) * 10) / 10;
    const length = Math.round((area / width) * 10) / 10;
    onChange({ ...formData, area, width, length });
  };

  const handleWidthChange = (val: string) => {
    const w = parseFloat(val) || 0;
    const l = formData.length;
    const area = Math.round(w * l);
    onChange({ ...formData, width: w, area });
  };

  const handleLengthChange = (val: string) => {
    const l = parseFloat(val) || 0;
    const w = formData.width;
    const area = Math.round(w * l);
    onChange({ ...formData, length: l, area });
  };

  if (!service) return null;

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-[#0f172a] mb-2">
          حدد المواصفات
        </h3>
        <p className="text-[#64748b] text-sm">
          أدخل تفاصيل المشروع لاحتساب التكلفة بدقة
        </p>
      </div>

      {/* Area / Pieces / Problem Section */}
      {service.category === 'canopy' && (
        <div className="space-y-6">
          {/* Area Slider */}
          <div className="bg-[#f8fafc] rounded-xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#1a56db]/10 flex items-center justify-center">
                <Ruler className="w-5 h-5 text-[#1a56db]" />
              </div>
              <div>
                <Label className="text-base font-bold text-[#0f172a]">
                  المساحة
                </Label>
                <p className="text-[#64748b] text-xs">
                  حدد المساحة الكلية بالمتر المربع
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl font-bold text-[#1a56db]">
                {formData.area}
              </span>
              <span className="text-lg text-[#64748b] mr-2">م²</span>
            </div>

            <Slider
              min={5}
              max={200}
              step={1}
              value={[formData.area]}
              onValueChange={handleAreaSliderChange}
              className="w-full mb-6"
            />

            <div className="flex justify-between text-xs text-[#94a3b8] mb-6">
              <span>5 م²</span>
              <span>200 م²</span>
            </div>

            {/* Width & Length */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-[#334155]">
                  العرض (متر)
                </Label>
                <Input
                  type="number"
                  min={0.5}
                  max={20}
                  step={0.1}
                  value={formData.width}
                  onChange={(e) => handleWidthChange(e.target.value)}
                  className="text-center font-semibold"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-[#334155]">
                  الطول (متر)
                </Label>
                <Input
                  type="number"
                  min={0.5}
                  max={50}
                  step={0.1}
                  value={formData.length}
                  onChange={(e) => handleLengthChange(e.target.value)}
                  className="text-center font-semibold"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {service.category === 'furniture' && (
        <div className="bg-[#f8fafc] rounded-xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-[#7c3aed]/10 flex items-center justify-center">
              <Sofa className="w-5 h-5 text-[#7c3aed]" />
            </div>
            <div>
              <Label className="text-base font-bold text-[#0f172a]">
                عدد القطع
              </Label>
              <p className="text-[#64748b] text-xs">
                حدد عدد قطع الأثاث المطلوبة
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center mb-4">
            <span className="text-4xl font-bold text-[#7c3aed]">
              {formData.pieces}
            </span>
            <span className="text-lg text-[#64748b] mr-2">قطعة</span>
          </div>

          <Slider
            min={1}
            max={50}
            step={1}
            value={[formData.pieces]}
            onValueChange={(value) =>
              onChange({ ...formData, pieces: value[0] })
            }
            className="w-full mb-6"
          />

          <div className="flex justify-between text-xs text-[#94a3b8]">
            <span>1 قطعة</span>
            <span>50 قطعة</span>
          </div>
        </div>
      )}

      {service.category === 'maintenance' && (
        <div className="space-y-4">
          <div className="bg-[#f8fafc] rounded-xl p-6 border border-gray-100">
            <div className="space-y-3">
              <Label className="text-base font-bold text-[#0f172a]">
                نوع المشكلة
              </Label>
              <Select
                value={formData.problemType}
                onValueChange={(value) =>
                  onChange({ ...formData, problemType: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر نوع المشكلة" />
                </SelectTrigger>
                <SelectContent>
                  {PROBLEM_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-[#f8fafc] rounded-xl p-6 border border-gray-100">
            <div className="space-y-3">
              <Label className="text-base font-bold text-[#0f172a]">
                وصف المشكلة
              </Label>
              <Textarea
                placeholder="اكتب وصفاً تفصيلياً للمشكلة التي تواجهها..."
                value={formData.problemDescription}
                onChange={(e) =>
                  onChange({ ...formData, problemDescription: e.target.value })
                }
                rows={4}
                className="resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Fabric Type */}
      {service.category !== 'maintenance' && (
        <div className="bg-[#f8fafc] rounded-xl p-6 border border-gray-100">
          <div className="space-y-3">
            <Label className="text-base font-bold text-[#0f172a]">
              نوع القماش
            </Label>
            <Select
              value={formData.fabric}
              onValueChange={(value) => onChange({ ...formData, fabric: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر نوع القماش" />
              </SelectTrigger>
              <SelectContent>
                {FABRICS.map((fabric) => (
                  <SelectItem key={fabric.id} value={fabric.id}>
                    <span className="flex items-center gap-2">
                      {fabric.label}
                      <Badge variant="outline" className="text-[10px] mr-2">
                        ×{fabric.multiplier}
                      </Badge>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Color */}
      <div className="bg-[#f8fafc] rounded-xl p-6 border border-gray-100">
        <div className="space-y-3">
          <Label className="text-base font-bold text-[#0f172a]">
            اللون المفضل
          </Label>
          <Select
            value={formData.color}
            onValueChange={(value) => onChange({ ...formData, color: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="اختر اللون" />
            </SelectTrigger>
            <SelectContent>
              {COLORS.map((color) => (
                <SelectItem key={color} value={color}>
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 3: Additional Extras                                          */
/* ------------------------------------------------------------------ */

function Step3({
  formData,
  onChange,
}: {
  formData: FormData;
  onChange: (data: FormData) => void;
}) {
  const service = getSelectedService(formData.serviceType);
  if (!service) return null;

  const toggleExtra = (key: 'motor' | 'led' | 'rainSensor' | 'remote') => {
    onChange({ ...formData, [key]: !formData[key] });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-[#0f172a] mb-2">
          إضافات اختيارية
        </h3>
        <p className="text-[#64748b] text-sm">
          اختر الإضافات التي ترغب بإضافتها لمشروعك
        </p>
      </div>

      {/* Extras Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {EXTRAS.map((extra) => {
          const Icon = extra.icon;
          const isEnabled =
            formData[extra.id as keyof FormData] as boolean;
          return (
            <motion.div
              key={extra.id}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                className={`transition-all duration-300 overflow-hidden ${
                  isEnabled
                    ? 'border-2 border-[#1a56db] bg-[#1a56db]/5 shadow-md'
                    : 'border border-gray-100 hover:border-gray-200'
                }`}
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                          isEnabled
                            ? 'bg-[#1a56db]/15'
                            : 'bg-gray-100'
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 transition-colors duration-300 ${
                            isEnabled ? 'text-[#1a56db]' : 'text-[#64748b]'
                          }`}
                        />
                      </div>
                      <div>
                        <h4
                          className={`font-bold text-sm transition-colors duration-300 ${
                            isEnabled ? 'text-[#1a56db]' : 'text-[#0f172a]'
                          }`}
                        >
                          {extra.label}
                        </h4>
                        <span className="text-xs text-[#ea580c] font-semibold">
                          +{formatPrice(extra.price)} ريال
                        </span>
                      </div>
                    </div>
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={() =>
                        toggleExtra(extra.id as 'motor' | 'led' | 'rainSensor' | 'remote')
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Additional Notes */}
      <div className="bg-[#f8fafc] rounded-xl p-6 border border-gray-100">
        <div className="space-y-3">
          <Label className="text-base font-bold text-[#0f172a]">
            ملاحظات إضافية
          </Label>
          <p className="text-[#64748b] text-xs mb-2">
            أي متطلبات خاصة أو تفاصيل إضافية ترغب بإضافتها (اختياري)
          </p>
          <Textarea
            placeholder="أضف ملاحظاتك هنا..."
            value={formData.notes}
            onChange={(e) => onChange({ ...formData, notes: e.target.value })}
            rows={3}
            className="resize-none"
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 4: Results                                                    */
/* ------------------------------------------------------------------ */

function Step4({
  formData,
  onReset,
}: {
  formData: FormData;
  onReset: () => void;
}) {
  const breakdown = useMemo(() => calculatePrice(formData), [formData]);
  const service = getSelectedService(formData.serviceType);
  const fabric = getSelectedFabric(formData.fabric);

  const activeExtras = EXTRAS.filter(
    (e) => formData[e.id as keyof FormData] as boolean
  );

  // WhatsApp message
  const whatsappMessage = encodeURIComponent(
    `مرحباً، أرغب في الحصول على عرض سعر من شركة كيان القمة\n\n` +
      `📋 نوع الخدمة: ${service?.title || ''}\n` +
      (service?.category === 'canopy'
        ? `📐 المساحة: ${formData.area} م²\n`
        : service?.category === 'furniture'
          ? `🪑 عدد القطع: ${formData.pieces} قطعة\n`
          : `🔧 نوع المشكلة: ${formData.problemType}\n`) +
      `🧵 نوع القماش: ${fabric?.label || ''}\n` +
      `🎨 اللون: ${formData.color}\n` +
      (activeExtras.length > 0
        ? `✨ الإضافات: ${activeExtras.map((e) => e.label).join('، ')}\n`
        : '') +
      (formData.notes ? `📝 ملاحظات: ${formData.notes}\n` : '') +
      `\n💰 التقدير التقريبي: ${formatPrice(breakdown.total)} ريال (شامل الضريبة)\n\n` +
      `أرجو التواصل معي لتأكيد التفاصيل والعرض النهائي. شكراً!`
  );

  const handleWhatsApp = () => {
    window.open(
      `https://wa.me/966501234567?text=${whatsappMessage}`,
      '_blank'
    );
  };

  const handleContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-[#059669] to-[#34d399] flex items-center justify-center mx-auto mb-4 shadow-lg"
        >
          <Check className="w-8 h-8 text-white" />
        </motion.div>
        <h3 className="text-xl font-bold text-[#0f172a] mb-1">
          التقدير جاهز!
        </h3>
        <p className="text-[#64748b] text-sm">
          إليك تفاصيل التقدير السعر لمشروعك
        </p>
      </div>

      {/* Total Price Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-[#1a56db] to-[#2563eb] rounded-2xl p-6 text-center text-white shadow-xl"
      >
        <p className="text-white/80 text-sm mb-1">الإجمالي المقدر</p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-4xl md:text-5xl font-bold"
        >
          {formatPrice(breakdown.total)}
        </motion.p>
        <p className="text-white/80 text-sm mt-1">ريال سعودي (شامل ضريبة 15%)</p>
        <p className="text-white/60 text-xs mt-3">
          المدة المتوقعة للتنفيذ: {breakdown.estimatedTime}
        </p>
      </motion.div>

      {/* Price Breakdown Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-[#f8fafc] px-5 py-3 border-b border-gray-100">
              <h4 className="font-bold text-[#0f172a] text-sm">
                تفاصيل التسعير
              </h4>
            </div>

            <div className="divide-y divide-gray-50">
              {/* Base */}
              <div className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#1a56db]/10 flex items-center justify-center">
                    <CalculatorIcon className="w-4 h-4 text-[#1a56db]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0f172a]">الأساس</p>
                    <p className="text-xs text-[#64748b]">
                      {service?.title} -{' '}
                      {service?.category === 'canopy'
                        ? `${formData.area} م²`
                        : service?.category === 'furniture'
                          ? `${formData.pieces} قطعة`
                          : 'زيارة واحدة'}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-sm text-[#0f172a]">
                  {formatPrice(breakdown.basePrice)} ريال
                </span>
              </div>

              {/* Fabric */}
              <div className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#ea580c]/10 flex items-center justify-center">
                    <Sun className="w-4 h-4 text-[#ea580c]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0f172a]">القماش</p>
                    <p className="text-xs text-[#64748b]">{fabric?.label}</p>
                  </div>
                </div>
                <span className="font-bold text-sm text-[#0f172a]">
                  {breakdown.fabricCost > 0
                    ? `+${formatPrice(breakdown.fabricCost)} ريال`
                    : 'مضمن'}
                </span>
              </div>

              {/* Extras */}
              <div className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#7c3aed]/10 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-[#7c3aed]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0f172a]">الإضافات</p>
                    <p className="text-xs text-[#64748b]">
                      {activeExtras.length > 0
                        ? activeExtras.map((e) => e.label).join('، ')
                        : 'لا توجد إضافات'}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-sm text-[#0f172a]">
                  {breakdown.extrasCost > 0
                    ? `+${formatPrice(breakdown.extrasCost)} ريال`
                    : '—'}
                </span>
              </div>

              <Separator />

              {/* Subtotal */}
              <div className="flex items-center justify-between px-5 py-3.5 bg-[#f8fafc]">
                <p className="text-sm font-semibold text-[#334155]">
                  المجموع الفرعي
                </p>
                <span className="font-bold text-sm text-[#0f172a]">
                  {formatPrice(breakdown.subtotal)} ريال
                </span>
              </div>

              {/* VAT */}
              <div className="flex items-center justify-between px-5 py-3.5">
                <p className="text-sm text-[#64748b]">
                  ضريبة القيمة المضافة (15%)
                </p>
                <span className="font-semibold text-sm text-[#64748b]">
                  {formatPrice(breakdown.vat)} ريال
                </span>
              </div>

              <Separator />

              {/* Total */}
              <div className="flex items-center justify-between px-5 py-4 bg-[#1a56db]/5">
                <p className="text-base font-bold text-[#1a56db]">الإجمالي</p>
                <span className="text-lg font-bold text-[#1a56db]">
                  {formatPrice(breakdown.total)} ريال
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Summary Badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap gap-2 justify-center"
      >
        <Badge variant="outline" className="px-3 py-1.5 text-xs">
          {service?.title}
        </Badge>
        {service?.category === 'canopy' && (
          <Badge variant="outline" className="px-3 py-1.5 text-xs">
            {formData.area} م²
          </Badge>
        )}
        {service?.category === 'furniture' && (
          <Badge variant="outline" className="px-3 py-1.5 text-xs">
            {formData.pieces} قطعة
          </Badge>
        )}
        <Badge variant="outline" className="px-3 py-1.5 text-xs">
          {fabric?.label}
        </Badge>
        <Badge variant="outline" className="px-3 py-1.5 text-xs">
          {formData.color}
        </Badge>
        {activeExtras.map((e) => (
          <Badge
            key={e.id}
            variant="secondary"
            className="px-3 py-1.5 text-xs bg-[#1a56db]/10 text-[#1a56db] border-[#1a56db]/20"
          >
            {e.label}
          </Badge>
        ))}
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-3"
      >
        <Button
          size="lg"
          className="w-full py-6 text-base font-bold rounded-xl bg-[#1a56db] hover:bg-[#1648c5] transition-all duration-300 shadow-lg shadow-[#1a56db]/20"
          onClick={handleContact}
        >
          <Phone className="w-5 h-5 ml-2" />
          تواصل معنا للحصول على عرض سعر رسمي
        </Button>

        <Button
          size="lg"
          className="w-full py-6 text-base font-bold rounded-xl bg-[#25D366] hover:bg-[#1da851] text-white transition-all duration-300 shadow-lg shadow-[#25D366]/20"
          onClick={handleWhatsApp}
        >
          <MessageCircle className="w-5 h-5 ml-2" />
          مشاركة التقدير عبر واتساب
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="w-full py-6 text-base font-semibold rounded-xl border-2 border-gray-200 text-[#64748b] hover:text-[#0f172a] hover:border-[#0f172a] transition-all duration-300"
          onClick={onReset}
        >
          <RotateCcw className="w-5 h-5 ml-2" />
          إعادة الحساب
        </Button>
      </motion.div>

      {/* Disclaimer */}
      <p className="text-center text-[#94a3b8] text-xs leading-relaxed">
        * هذا التقدير تقريبي وقد يختلف السعر النهائي حسب التفاصيل الفنية
        وموقع المشروع. تواصل معنا للحصول على عرض سعر رسمي ودقيق.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Calculator Component                                          */
/* ------------------------------------------------------------------ */

const INITIAL_FORM_DATA: FormData = {
  serviceType: '',
  area: 20,
  width: 4.5,
  length: 4.4,
  pieces: 5,
  problemType: '',
  problemDescription: '',
  fabric: 'standard',
  color: 'أبيض',
  motor: false,
  led: false,
  rainSensor: false,
  remote: false,
  notes: '',
};

export default function Calculator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

  const goToNext = () => {
    if (currentStep < 4) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
    }
  };

  const goToPrev = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep((s) => s - 1);
    }
  };

  const resetCalculator = () => {
    setFormData(INITIAL_FORM_DATA);
    setDirection(-1);
    setCurrentStep(1);
  };

  const isNextDisabled = () => {
    if (currentStep === 1) return !formData.serviceType;
    if (currentStep === 2) {
      if (formData.serviceType === 'maintenance') {
        return !formData.problemType;
      }
      return false;
    }
    return false;
  };

  const progress = ((currentStep - 1) / 3) * 100;

  return (
    <section
      id="calculator"
      className="relative py-20 lg:py-28 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #f0f7ff 0%, #ffffff 50%, #fef7ed 100%)' }}
    >
      {/* Subtle pattern background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #1a56db 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <CalculatorIcon className="h-5 w-5 text-[#ea580c]" />
            <span className="text-sm font-semibold text-[#ea580c] tracking-wide">
              أداة تفاعلية
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0f172a] mb-4">
            حاسبة الأسعار
          </h2>
          <div className="w-20 h-1 bg-[#1a56db] mx-auto rounded-full mb-6" />
          <p className="text-[#64748b] text-lg max-w-2xl mx-auto leading-relaxed">
            احصل على تقدير سريع لتكلفة مشروعك
          </p>
        </motion.div>

        {/* Calculator Card */}
        <motion.div
          variants={stepContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="max-w-3xl mx-auto"
        >
          <Card className="shadow-xl border-gray-100 overflow-hidden">
            {/* Progress Bar */}
            <div className="bg-[#f8fafc] px-6 py-4 border-b border-gray-100">
              {/* Step indicators */}
              <div className="flex items-center justify-between mb-4">
                {STEP_TITLES.slice(1).map((title, idx) => {
                  const step = idx + 1;
                  const isCompleted = step < currentStep;
                  const isCurrent = step === currentStep;
                  return (
                    <div key={step} className="flex items-center gap-2 flex-1">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                            isCompleted
                              ? 'bg-[#059669] text-white shadow-md'
                              : isCurrent
                                ? 'bg-[#1a56db] text-white shadow-md shadow-[#1a56db]/30'
                                : 'bg-gray-200 text-[#94a3b8]'
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            step
                          )}
                        </div>
                        <span
                          className={`hidden sm:block text-xs font-semibold transition-colors duration-300 ${
                            isCurrent
                              ? 'text-[#1a56db]'
                              : isCompleted
                                ? 'text-[#059669]'
                                : 'text-[#94a3b8]'
                          }`}
                        >
                          {title}
                        </span>
                      </div>
                      {step < 4 && (
                        <div className="flex-1 mx-2">
                          <div className="h-0.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#1a56db] rounded-full transition-all duration-500"
                              style={{
                                width:
                                  step < currentStep ? '100%' : '0%',
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Overall progress bar */}
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-l from-[#1a56db] to-[#2563eb] rounded-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
              </div>
            </div>

            {/* Step Content */}
            <CardContent className="p-6 md:p-8 min-h-[400px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                >
                  {currentStep === 1 && (
                    <Step1 formData={formData} onChange={setFormData} />
                  )}
                  {currentStep === 2 && (
                    <Step2 formData={formData} onChange={setFormData} />
                  )}
                  {currentStep === 3 && (
                    <Step3 formData={formData} onChange={setFormData} />
                  )}
                  {currentStep === 4 && (
                    <Step4 formData={formData} onReset={resetCalculator} />
                  )}
                </motion.div>
              </AnimatePresence>
            </CardContent>

            {/* Navigation Buttons */}
            {currentStep < 4 && (
              <div className="px-6 md:px-8 pb-6 flex items-center justify-between gap-4">
                <Button
                  variant="outline"
                  onClick={goToPrev}
                  disabled={currentStep === 1}
                  className="rounded-xl px-6 disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4 ml-1" />
                  السابق
                </Button>

                <span className="text-xs text-[#94a3b8]">
                  {currentStep} من 4
                </span>

                <Button
                  onClick={goToNext}
                  disabled={isNextDisabled()}
                  className="rounded-xl px-6 bg-[#1a56db] hover:bg-[#1648c5] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {currentStep === 3 ? 'عرض النتائج' : 'التالي'}
                  <ChevronLeft className="w-4 h-4 mr-1" />
                </Button>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
