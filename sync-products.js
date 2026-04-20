#!/usr/bin/env node

/**
 * sync-products.js
 * 
 * Scans a local "dropzone" folder for product images organized by category,
 * parses the filename for product info, copies images into the project, and
 * generates the JSON data files the site needs.
 *
 * FOLDER STRUCTURE:
 *   <dropzone>/
 *     ├── Apparel/
 *     │   ├── Womans Clothing/                          ← subcategory (optional)
 *     │   │   ├── Punk Rock Jacket_89.99_APP001.jpg
 *     │   │   └── Punk Rock Jacket_89.99_APP001_2.jpg   (2nd photo, optional)
 *     │   └── Mens Clothing/
 *     │       └── Leather Vest_75.00_APP020.jpg
 *     ├── Shoes/
 *     │   └── Combat Boots_120.00_SH001.jpg
 *     └── Accessories/
 *         └── Spiked Choker_24.99_ACC001.jpg
 *
 * FILE NAMING:  {Product Name}_{Price}_{SKU}.ext
 *   - Price can optionally include a $ sign: _$50_ or _50.00_
 *   - For additional photos, append _2, _3:  {Name}_{Price}_{SKU}_2.ext
 *
 * USAGE:
 *   node sync-products.js /path/to/Shop\ Uploads
 *
 *   Or via npm script:
 *   npm run sync -- /path/to/Shop\ Uploads
 */

import fs from 'fs';
import path from 'path';

// ─── Configuration ────────────────────────────────────────────────────────────
const VALID_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);
const VALID_CATEGORIES = ['Apparel', 'Shoes', 'Accessories', 'Bits and Bobs', 'Unique Collectibles'];

// ─── Paths (relative to this script) ─────────────────────────────────────────
const PROJECT_ROOT  = path.dirname(new URL(import.meta.url).pathname);
const IMAGES_DIR    = path.join(PROJECT_ROOT, 'public', 'assets', 'products');
const DATA_DIR      = path.join(PROJECT_ROOT, 'src', 'data', 'products');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

/**
 * Recursively find all image files in a directory.
 */
function findImages(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findImages(fullPath));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (VALID_EXTENSIONS.has(ext)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

/**
 * Parse a product image filename.
 * Returns { name, price, sku, photoIndex } or null on failure.
 *
 * Examples:
 *   "Combat Boots_120.00_SH001.jpg"   → { name: "Combat Boots", price: 120, sku: "SH001", photoIndex: 1 }
 *   "Combat Boots_120.00_SH001_2.jpg" → { name: "Combat Boots", price: 120, sku: "SH001", photoIndex: 2 }
 *   "Cool Dress_$50_APP002.jpg"       → { name: "Cool Dress",   price: 50,  sku: "APP002", photoIndex: 1 }
 */
function parseFilename(filename) {
  const ext = path.extname(filename);
  const base = path.basename(filename, ext);

  // Split on underscores
  const parts = base.split('_');

  if (parts.length < 3) return null;

  // Check if last part is a photo index number (2 or 3)
  let photoIndex = 1;
  const lastPart = parts[parts.length - 1];
  if (/^[2-3]$/.test(lastPart)) {
    photoIndex = parseInt(lastPart, 10);
    parts.pop(); // remove the index
  }

  // Now the last part should be SKU, second-to-last should be price
  if (parts.length < 3) return null;

  const sku      = parts.pop();
  let priceStr = parts.pop();
  const name     = parts.join('_'); // rejoin in case name had underscores

  // Strip dollar sign if present, then parse
  priceStr = priceStr.replace(/^\$/, '');
  const price = parseFloat(priceStr);
  if (isNaN(price) || !name || !sku) return null;

  return { name: name.trim(), price, sku: sku.trim(), photoIndex };
}

/**
 * Match a folder name (case-insensitive) to a valid category.
 */
function matchCategory(folderName) {
  const lower = folderName.toLowerCase();
  return VALID_CATEGORIES.find(c => c.toLowerCase() === lower) || null;
}

/**
 * Make a filename safe for the filesystem (strip special chars).
 */
function safeFilename(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  const dropzone = process.argv[2];

  if (!dropzone) {
    console.error('\n❌  Please provide the path to your dropzone folder.');
    console.error('   Usage:  node sync-products.js /path/to/Shop\\ Uploads\n');
    process.exit(1);
  }

  const resolvedDropzone = path.resolve(dropzone);

  if (!fs.existsSync(resolvedDropzone)) {
    console.error(`\n❌  Folder not found: ${resolvedDropzone}\n`);
    process.exit(1);
  }

  console.log('\n🔄  Syncing products from:', resolvedDropzone);
  console.log('   → Images will be copied to:', IMAGES_DIR);
  console.log('   → JSON data will be written to:', DATA_DIR, '\n');

  ensureDir(IMAGES_DIR);
  ensureDir(DATA_DIR);

  // ── Determine the next available product ID ──────────────────────────────
  const existingJsonFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
  let nextId = 1;
  for (const file of existingJsonFiles) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf-8'));
      if (data.id && data.id >= nextId) nextId = data.id + 1;
    } catch { /* skip malformed files */ }
  }

  // ── Collect existing SKUs to avoid duplicates ────────────────────────────
  const existingSkus = new Set();
  for (const file of existingJsonFiles) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf-8'));
      if (data.sku) existingSkus.add(data.sku.toUpperCase());
    } catch { /* skip */ }
  }

  // ── Scan category folders (top-level dirs in dropzone) ───────────────────
  const categoryFolders = fs.readdirSync(resolvedDropzone, { withFileTypes: true })
    .filter(d => d.isDirectory());

  // Map<sku, { name, price, sku, category, images: { index: srcPath } }>
  const productMap = new Map();
  let skipped = 0;
  const warnings = [];

  for (const folder of categoryFolders) {
    const category = matchCategory(folder.name);
    if (!category) {
      const msg = `⚠️  Skipping unknown category folder: "${folder.name}"  (valid: ${VALID_CATEGORIES.join(', ')})`;
      console.warn(msg);
      warnings.push(msg);
      skipped++;
      continue;
    }

    // Recursively find all images in this category (supports subfolders)
    const folderPath = path.join(resolvedDropzone, folder.name);
    const imageFiles = findImages(folderPath);

    for (const imagePath of imageFiles) {
      const filename = path.basename(imagePath);
      const parsed = parseFilename(filename);

      if (!parsed) {
        const msg = `⚠️  Could not parse: "${filename}"  →  Expected: ProductName_Price_SKU.jpg`;
        console.warn(msg);
        warnings.push(msg);
        skipped++;
        continue;
      }

      const key = parsed.sku.toUpperCase();

      if (existingSkus.has(key)) {
        const msg = `⚠️  SKU "${parsed.sku}" already exists — skipping "${filename}"`;
        console.warn(msg);
        warnings.push(msg);
        skipped++;
        continue;
      }

      if (!productMap.has(key)) {
        productMap.set(key, {
          name: parsed.name,
          price: parsed.price,
          sku: parsed.sku,
          category,
          images: {},
        });
      }

      const product = productMap.get(key);
      product.images[parsed.photoIndex] = imagePath;
    }
  }

  // ── Process each product ─────────────────────────────────────────────────
  let added = 0;

  for (const [, product] of productMap) {
    const id = nextId++;
    const imageEntries = Object.entries(product.images)
      .sort(([a], [b]) => Number(a) - Number(b));

    // Copy images and build the images array
    const imagePaths = [];
    for (const [index, srcPath] of imageEntries) {
      const ext = path.extname(srcPath);
      const safeSku = safeFilename(product.sku);
      const destFilename = index === '1'
        ? `${safeSku}${ext}`
        : `${safeSku}_${index}${ext}`;
      const destPath = path.join(IMAGES_DIR, destFilename);
      fs.copyFileSync(srcPath, destPath);
      imagePaths.push(`/assets/products/${destFilename}`);
    }

    // Build JSON data
    const productData = {
      id,
      name: product.name,
      price: product.price,
      sku: product.sku,
      category: product.category,
      image: imagePaths[0],                        // primary image (backwards-compatible)
      images: imagePaths,                          // array of all images
    };

    const jsonFilename = `${id}-${safeFilename(product.sku)}.json`;
    fs.writeFileSync(
      path.join(DATA_DIR, jsonFilename),
      JSON.stringify(productData, null, 2) + '\n'
    );

    const photoLabel = imagePaths.length === 1 ? '1 photo' : `${imagePaths.length} photos`;
    console.log(`✅  [${product.category}]  ${product.name}  —  $${product.price}  (${product.sku})  →  ${photoLabel}`);
    added++;
  }

  // ── Summary ──────────────────────────────────────────────────────────────
  console.log('\n' + '─'.repeat(50));
  console.log(`✅  ${added} product(s) synced successfully.`);
  if (skipped > 0) {
    console.log(`⚠️  ${skipped} item(s) skipped.`);
  }
  if (warnings.length > 0) {
    console.log('\n📋 Issues to fix:');
    warnings.forEach(w => console.log('   ' + w));
  }
  console.log(`\nNext step: Run "npm run build" or "npm run dev" to see the changes.`);
  console.log('Then deploy once with "netlify deploy --prod" or push to GitHub.\n');
}

main();
