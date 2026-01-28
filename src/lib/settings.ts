import { db } from '@/lib/db';
import { settings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function getSetting(key: string, defaultValue: string = ''): Promise<string> {
  const [setting] = await db
    .select()
    .from(settings)
    .where(eq(settings.key, key));
  
  return setting?.value || defaultValue;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const [existing] = await db
    .select()
    .from(settings)
    .where(eq(settings.key, key));

  if (existing) {
    await db
      .update(settings)
      .set({ value, updatedAt: new Date() })
      .where(eq(settings.key, key));
  } else {
    await db.insert(settings).values({ key, value });
  }
}

export async function getCurrency(): Promise<string> {
  return await getSetting('currency', '$');
}

export async function getApiEnabled(): Promise<boolean> {
  const value = await getSetting('api_enabled', 'false');
  return value === 'true';
}

export async function setApiEnabled(enabled: boolean): Promise<void> {
  await setSetting('api_enabled', enabled ? 'true' : 'false');
}

export function formatCurrency(amount: number, currency: string): string {
  return `${currency}${amount.toFixed(2)}`;
}
