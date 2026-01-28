import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { db } from '@/lib/db';
import { items } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { itemId, imageUrl } = await request.json();

    if (!itemId || !imageUrl) {
      return NextResponse.json(
        { error: 'Item ID and image URL are required' },
        { status: 400 }
      );
    }

    // Fetch the image from the URL
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch image from URL' },
        { status: 400 }
      );
    }

    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

    // Generate a unique filename using hash
    const hash = crypto.createHash('md5').update(imageUrl).digest('hex');
    const filename = `${hash}.webp`;
    const iconsDir = path.join(process.cwd(), 'public', 'icons');
    const filepath = path.join(iconsDir, filename);

    // Ensure the icons directory exists
    if (!existsSync(iconsDir)) {
      await mkdir(iconsDir, { recursive: true });
    }

    // Process image: resize to max 400x400, convert to WebP with compression
    await sharp(imageBuffer)
      .resize(400, 400, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toFile(filepath);

    // Update database with local icon path
    const localIconPath = `/icons/${filename}`;
    await db
      .update(items)
      .set({ localIconPath })
      .where(eq(items.id, itemId));

    return NextResponse.json({
      success: true,
      localIconPath,
      message: 'Icon saved successfully',
    });
  } catch (error) {
    console.error('Error saving icon:', error);
    return NextResponse.json(
      { error: 'Failed to save icon' },
      { status: 500 }
    );
  }
}
