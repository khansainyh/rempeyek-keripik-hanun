import './style.css';
import { products as localProducts, WHATSAPP_NUMBER, type Product } from './data/products';
import { fetchProductsFromSheet } from './sheets';

// ─── Helpers ────────────────────────────────────────────────────────────────

function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// ─── Loading skeleton ────────────────────────────────────────────────────────

function renderSkeletons(count: number): string {
  return Array.from({ length: count })
    .map(
      () => `
    <li class="menu-item menu-item--skeleton" aria-hidden="true">
      <div class="thumb thumb--skeleton"></div>
      <div class="skeleton-text">
        <div class="skeleton-line skeleton-line--title"></div>
        <div class="skeleton-line skeleton-line--desc"></div>
      </div>
      <div class="menu-side">
        <div class="skeleton-line skeleton-line--btn"></div>
      </div>
    </li>`,
    )
    .join('');
}

// ─── Render product row ──────────────────────────────────────────────────────

function renderProduct(product: Product): string {
  const tag = product.badge ? `<span class="menu-tag">${product.badge}</span>` : '';
  const msg = `Halo Hanun, saya mau pesan ${product.name}.`;
  // onerror: fallback ke uc?export=view jika thumbnail gagal load
  const fallbackSrc = product.image.includes('drive.google.com/thumbnail')
    ? product.image.replace(
        /https:\/\/drive\.google\.com\/thumbnail\?id=([\w-]+).*/,
        'https://drive.google.com/uc?export=view&id=$1',
      )
    : '';
  const onerror = fallbackSrc
    ? `onerror="if(this.dataset.fallback!=='1'){this.dataset.fallback='1';this.src='${fallbackSrc}'}"`
    : '';
  return `
    <li class="menu-item">
      <div class="thumb">
        <img src="${product.image}" alt="${product.name} Hanun" loading="lazy" width="112" height="112" ${onerror}/>
      </div>
      <div>
        <h3 class="menu-name">${product.name}${tag}</h3>
        <p class="menu-desc">${product.description}</p>
      </div>
      <div class="menu-side">
        <a href="${waLink(msg)}" class="btn btn-line btn-sm" target="_blank" rel="noopener noreferrer" id="order-${product.id}">Pesan</a>
      </div>
    </li>`;
}

function initImageSkeletons(root: HTMLElement): void {
  root.querySelectorAll<HTMLImageElement>('.thumb img').forEach((img) => {
    const done = (): void => img.parentElement?.classList.add('loaded');
    if (img.complete && img.naturalWidth > 0) done();
    else {
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
    }
  });
}

// ─── Links ───────────────────────────────────────────────────────────────────

function renderLinks(): void {
  document.getElementById('link-whatsapp')?.setAttribute('href', `https://wa.me/${WHATSAPP_NUMBER}`);
  document.querySelectorAll<HTMLAnchorElement>('[data-wa-msg]').forEach((btn) => {
    btn.href = waLink(btn.dataset.waMsg ?? 'Halo Hanun, saya mau bertanya.');
  });
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
}

// ─── Hamburger menu ──────────────────────────────────────────────────────────

function initHamburger(): void {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('mobileNav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target as Node) && !nav.contains(e.target as Node)) {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}

// ─── Init ────────────────────────────────────────────────────────────────────

async function init(): Promise<void> {
  renderLinks();
  initHamburger();

  const grid = document.getElementById('produkGrid');
  if (!grid) return;

  // Show skeleton while loading
  grid.innerHTML = renderSkeletons(5);

  // Try Google Sheets first, fall back to local data
  const sheetsProducts = await fetchProductsFromSheet();
  const products: Product[] = sheetsProducts ?? localProducts;

  grid.innerHTML = products.map(renderProduct).join('');
  initImageSkeletons(grid);
}

document.addEventListener('DOMContentLoaded', () => {
  void init();
});
