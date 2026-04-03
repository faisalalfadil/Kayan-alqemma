import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export interface AuthAdmin {
  id: string;
  username: string;
  phone1: string | null;
  phone2: string | null;
}

export async function getAuthenticatedAdmin(): Promise<AuthAdmin | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;

  if (!token) return null;

  const admin = await db.admin.findFirst({
    where: { sessionToken: token },
    select: { id: true, username: true, phone1: true, phone2: true },
  });

  return admin;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateSessionToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
}
