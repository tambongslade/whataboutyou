const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC = path.join(__dirname, '..', 'public');
const MAX_WIDTH = 1600;
const QUALITY_WEBP = 75;
const QUALITY_JPG = 75;

const EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const SKIP_DIRS = ['fonts', 'icons'];

let totalBefore = 0;
let totalAfter = 0;
let count = 0;

function walk(dir) {
  const entries = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.includes(entry.name)) {
        entries.push(...walk(full));
      }
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (EXTENSIONS.includes(ext)) {
        entries.push(full);
      }
    }
  }
  return entries;
}

async function optimizeImage(filePath) {
  const stat = fs.statSync(filePath);
  const sizeBefore = stat.size;

  // Skip small files (< 50KB)
  if (sizeBefore < 50 * 1024) return;

  const ext = path.extname(filePath).toLowerCase();

  try {
    let pipeline = sharp(filePath).rotate(); // auto-rotate based on EXIF

    const metadata = await sharp(filePath).metadata();
    if (metadata.width && metadata.width > MAX_WIDTH) {
      pipeline = pipeline.resize(MAX_WIDTH, null, { withoutEnlargement: true });
    }

    let buffer;
    if (ext === '.webp') {
      buffer = await pipeline.webp({ quality: QUALITY_WEBP }).toBuffer();
    } else if (ext === '.png') {
      // Convert PNG to WebP for better compression
      buffer = await pipeline.webp({ quality: QUALITY_WEBP }).toBuffer();
      // Rename to .webp
      const newPath = filePath.replace(/\.png$/i, '.webp');
      fs.writeFileSync(newPath, buffer);
      if (newPath !== filePath) fs.unlinkSync(filePath);
      const sizeAfter = buffer.length;
      totalBefore += sizeBefore;
      totalAfter += sizeAfter;
      count++;
      const saved = ((1 - sizeAfter / sizeBefore) * 100).toFixed(1);
      console.log(`  ${path.relative(PUBLIC, filePath)} → .webp | ${fmt(sizeBefore)} → ${fmt(sizeAfter)} (${saved}% saved)`);
      return;
    } else {
      // JPG/JPEG → WebP
      buffer = await pipeline.webp({ quality: QUALITY_WEBP }).toBuffer();
      const newPath = filePath.replace(/\.(jpe?g|JPG)$/i, '.webp');
      fs.writeFileSync(newPath, buffer);
      if (newPath !== filePath) fs.unlinkSync(filePath);
      const sizeAfter = buffer.length;
      totalBefore += sizeBefore;
      totalAfter += sizeAfter;
      count++;
      const saved = ((1 - sizeAfter / sizeBefore) * 100).toFixed(1);
      console.log(`  ${path.relative(PUBLIC, filePath)} → .webp | ${fmt(sizeBefore)} → ${fmt(sizeAfter)} (${saved}% saved)`);
      return;
    }

    // For webp files, overwrite in place
    fs.writeFileSync(filePath, buffer);
    const sizeAfter = buffer.length;
    totalBefore += sizeBefore;
    totalAfter += sizeAfter;
    count++;
    const saved = ((1 - sizeAfter / sizeBefore) * 100).toFixed(1);
    console.log(`  ${path.relative(PUBLIC, filePath)} | ${fmt(sizeBefore)} → ${fmt(sizeAfter)} (${saved}% saved)`);
  } catch (err) {
    console.error(`  SKIP ${path.relative(PUBLIC, filePath)}: ${err.message}`);
  }
}

function fmt(bytes) {
  if (bytes < 1024) return bytes + 'B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + 'KB';
  return (bytes / (1024 * 1024)).toFixed(1) + 'MB';
}

async function main() {
  console.log('Scanning public/ for images...\n');
  const files = walk(PUBLIC);
  console.log(`Found ${files.length} images to optimize.\n`);

  for (const file of files) {
    await optimizeImage(file);
  }

  console.log(`\n✅ Done! ${count} images optimized.`);
  console.log(`   Before: ${fmt(totalBefore)}`);
  console.log(`   After:  ${fmt(totalAfter)}`);
  console.log(`   Saved:  ${fmt(totalBefore - totalAfter)} (${((1 - totalAfter / totalBefore) * 100).toFixed(1)}%)`);
}

main();
