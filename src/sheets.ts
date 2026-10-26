/**
 * sheets.ts
 * Fetch product data from a public Google Spreadsheet.
 *
 * HOW IT WORKS:
 * - Google Sheets has a public JSON export endpoint (no API key required).
 * - URL format: https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:json&sheet={SHEET_NAME}
 * - The sheet must be shared as "Anyone with the link can view".
 *
 * SPREADSHEET COLUMNS (row 1 = header, row 2+ = data):
 *   A: id          – unique slug, e.g. "keripik-tempe"
 *   B: name        – product name, e.g. "Keripik Tempe"
 *   C: price       – number only, e.g. 10000
 *   D: description – short description
 *   E: image       – full URL to image (Google Drive, Imgur, etc.)
 *   F: badge       – optional label like "Best Seller" (leave empty if none)
 *   G: active      – TRUE to show, FALSE to hide
 */

import type { Product } from './data/products';

// ─── Config ─────────────────────────────────────────────────────────────────

/**
 * Replace this with your own Google Sheet ID.
 * Found in the URL: docs.google.com/spreadsheets/d/THIS_PART/edit
 *
 * Set to empty string '' to always use fallback (local) data.
 */
export const SHEET_ID = '1gSagIU2ln1aNoGLehBe7jz5P0v-0AJYjF8rEhYmq1sU';

/** The tab/sheet name inside the spreadsheet. */
export const SHEET_NAME = 'Produk';

// ─── Types ───────────────────────────────────────────────────────────────────

interface GVizResponse {
  table: {
    cols: Array<{ label: string; type: string }>;
    rows: Array<{ c: Array<{ v: string | number | boolean | null } | null> }>;
  };
}

// ─── Fetch ───────────────────────────────────────────────────────────────────

/**
 * Build the Google Sheets GViz JSON URL.
 */
function buildSheetUrl(sheetId: string, sheetName: string): string {
  const encoded = encodeURIComponent(sheetName);
  return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encoded}`;
}

/**
 * Parse the GViz JSONP-like response string into a proper object.
 * Google wraps the JSON in a JSONP callback string that must be stripped.
 */
function parseGVizResponse(raw: string): GVizResponse {
  // Strip the JSONP wrapper: google.visualization.Query.setResponse({...});
  const match = raw.match(/google\.visualization\.Query\.setResponse\((.+)\);?\s*$/s);
  if (!match) throw new Error('Invalid GViz response format');
  return JSON.parse(match[1]) as GVizResponse;
}

/**
 * Normalize a Google Drive URL or bare file ID into an embeddable thumbnail URL.
 * Accepts:
 *   - Bare file ID:              1n1mL4ixcQPgznCzIXbuoMK2fiQ7vlM6k
 *   - Share/view URL:            https://drive.google.com/file/d/ID/view
 *   - Open URL:                  https://drive.google.com/open?id=ID
 *   - Already a thumbnail URL:   https://drive.google.com/thumbnail?id=ID
 * Non-Drive URLs are returned as-is.
 */
function normalizeImageUrl(raw: string): string {
  if (!raw) return raw;

  // Already a usable non-Drive URL
  if (!raw.includes('drive.google.com') && raw.startsWith('http')) return raw;

  let fileId: string | null = null;

  // Pattern: /file/d/FILE_ID/
  const fileMatch = raw.match(/\/file\/d\/([\w-]+)/);
  if (fileMatch) fileId = fileMatch[1];

  // Pattern: ?id=FILE_ID or &id=FILE_ID
  if (!fileId) {
    const idMatch = raw.match(/[?&]id=([\w-]+)/);
    if (idMatch) fileId = idMatch[1];
  }

  // Bare file ID (no slashes, no dots, alphanumeric + dash + underscore, 20+ chars)
  if (!fileId && /^[\w-]{20,}$/.test(raw.trim())) {
    fileId = raw.trim();
  }

  if (fileId) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w600`;
  }

  // Fallback: return as-is
  return raw;
}

/**
 * Convert a GViz table row into a Product object.
 * Column order: id, name, price, description, image, badge, active
 */
function rowToProduct(row: GVizResponse['table']['rows'][number]): Product | null {
  const cells = row.c;
  const get = (i: number): string => String(cells[i]?.v ?? '').trim();
  const getNum = (i: number): number => Number(cells[i]?.v ?? 0);
  const getBool = (i: number): boolean => {
    const v = cells[i]?.v;
    if (typeof v === 'boolean') return v;
    return String(v).toLowerCase() === 'true';
  };

  const id = get(0);
  const name = get(1);
  if (!id || !name) return null; // skip empty rows

  // Column G (index 6) = active flag; default to true if column is missing
  const active = cells.length > 6 ? getBool(6) : true;
  if (!active) return null;

  return {
    id,
    name,
    price: getNum(2),
    description: get(3),
    image: normalizeImageUrl(get(4)),
    badge: get(5) || undefined,
  };
}

/**
 * Fetch products from a public Google Sheet.
 * Returns null if SHEET_ID is not configured or the fetch fails.
 */
export async function fetchProductsFromSheet(): Promise<Product[] | null> {
  if (!SHEET_ID) return null;

  const url = buildSheetUrl(SHEET_ID, SHEET_NAME);

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const raw = await res.text();
    const parsed = parseGVizResponse(raw);

    // Skip header row (row index 0) if present – GViz usually skips it,
    // but guard anyway by filtering rows where id looks like 'id' (header)
    const products: Product[] = parsed.table.rows
      .map(rowToProduct)
      .filter((p): p is Product => p !== null)
      .filter((p) => p.id.toLowerCase() !== 'id');

    return products.length > 0 ? products : null;
  } catch (err) {
    console.warn('[Hanun] Google Sheets fetch failed, using local data.', err);
    return null;
  }
}
