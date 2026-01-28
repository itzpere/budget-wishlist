import { db } from '@/lib/db';
import { history, items, wishlists } from '@/lib/db/schema';
import { desc, eq, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const wishlistId = searchParams.get('wishlistId');

    let historyEntries;

    if (wishlistId) {
      // Filter history for specific wishlist by checking if description contains wishlist name
      const [wishlist] = await db
        .select()
        .from(wishlists)
        .where(eq(wishlists.id, parseInt(wishlistId)));

      if (!wishlist) {
        return NextResponse.json({ error: 'Wishlist not found' }, { status: 404 });
      }

      historyEntries = await db
        .select()
        .from(history)
        .where(sql`${history.description} LIKE '%' || ${wishlist.name} || '%'`)
        .orderBy(desc(history.timestamp))
        .limit(100);
    } else {
      historyEntries = await db
        .select()
        .from(history)
        .orderBy(desc(history.timestamp))
        .limit(100);
    }

    return NextResponse.json(historyEntries);
  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}
