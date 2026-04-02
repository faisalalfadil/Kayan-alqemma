# نشر الموقع على Vercel

## الخطوات المطلوبة:

### 1. إنشاء قاعدة بيانات PostgreSQL

يمكنك استخدام أحد الخيارات التالية:
- **Vercel Postgres** (مجاني حتى 256 MB)
- **Neon** (https://neon.tech) - مجاني
- **Supabase** (https://supabase.com) - مجاني
- **Railway** (https://railway.app) - مجاني

### 2. إعداد متغيرات البيئة في Vercel

في لوحة تحكم Vercel، أضف المتغيرات التالية:

```
DATABASE_URL=postgresql://user:password@host:5432/database
OPENROUTER_API_KEY=sk-or-v1-your-api-key-here
```

### 3. نشر المشروع

```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# نشر المشروع
vercel --prod
```

### 4. تشغيل migrations بعد النشر

بعد النشر الأول، قم بتشغيل:

```bash
# من لوحة تحكم Vercel أو من terminal
npx prisma db push
npx tsx prisma/seed.ts
```

## ملاحظات مهمة:

1. **SQLite لا يعمل على Vercel** - يجب استخدام PostgreSQL
2. تأكد من إضافة `DATABASE_URL` في Environment Variables
3. تأكد من إضافة `OPENROUTER_API_KEY` في Environment Variables
4. بعد أول deployment، قم بتشغيل seed script لملء قاعدة البيانات

## استخدام Vercel Postgres (الأسهل):

1. في مشروعك على Vercel، اذهب إلى Storage
2. اضغط Create Database
3. اختر Postgres
4. سيتم إضافة `DATABASE_URL` تلقائياً
5. قم بعمل redeploy للمشروع

