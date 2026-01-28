import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { items } from '@/lib/db/schema';
import { readdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST() {
  try {
    const iconsDir = path.join(process.cwd(), 'public', 'icons');
    
    if (!existsSync(iconsDir)) {
      return NextResponse.json({
        success: true,
        deletedCount: 0,
        message: 'Icons directory does not exist',
      });
    }

    // Get all files in the icons directory
    const files = await readdir(iconsDir);

    // Get all local icon paths from database
    const allItems = await db.select({ localIconPath: items.localIconPath }).from(items);
    const usedIcons = new Set(
      allItems
        .filter(item => item.localIconPath)
        .map(item => path.basename(item.localIconPath!))
    );

    // Delete files that are not in the database
    let deletedCount = 0;
    for (const file of files) {
      if (!usedIcons.has(file)) {
        const filepath = path.join(iconsDir, file);
        await unlink(filepath);
        deletedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      deletedCount,
      message: `Cleaned up ${deletedCount} unused icon(s)`,
    });
  } catch (error) {
    console.error('Error cleaning up icons:', error);
    return NextResponse.json(
      { error: 'Failed to clean up icons' },
      { status: 500 }
    );
  }
}
