import { PrismaClient } from '@prisma/client'

// Force-set DATABASE_URL to ensure Prisma can connect to Neon
if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith('postgresql://')) {
  process.env.DATABASE_URL = 'postgresql://neondb_owner:npg_dn0eyzt6UcOo@ep-wandering-mouse-alqlqflp-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require'
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
