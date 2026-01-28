import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { db } from '@/lib/db';
import { items } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const itemId = formData.get('itemId') as string;

    if (!file || !itemId) {
      return NextResponse.json(
        { error: 'File and item ID are required' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate a unique filename using hash of file content
    const hash = crypto.createHash('md5').update(buffer).digest('hex');
    const filename = `${hash}.webp`;
    const iconsDir = path.join(process.cwd(), 'public', 'icons');
    const filepath = path.join(iconsDir, filename);

    // Ensure the icons directory exists
    if (!existsSync(iconsDir)) {
      await mkdir(iconsDir, { recursive: true });
    }

    // Process image: resize to max 400x400, convert to WebP with compression
    await sharp(buffer)
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
      .where(eq(items.id, parseInt(itemId)));

    return NextResponse.json({
      success: true,
      localIconPath,
      message: 'Icon uploaded successfully',
    });
  } catch (error) {
    console.error('Error uploading icon:', error);
    return NextResponse.json(
      { error: 'Failed to upload icon' },
      { status: 500 }
    );
  }
}
