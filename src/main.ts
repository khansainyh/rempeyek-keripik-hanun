import './style.css';
import { products, WHATSAPP_NUMBER, INSTAGRAM_HANDLE, INSTAGRAM_URL, type Product } from './data/products';

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
}

function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// ─── Render product row ─────────────────────────────────────────────────────

function renderProduct(product: Product): string {
  const tag = product.badge ? `<span class="menu-tag">${product.badge}</span>` : '';
  const msg = `Halo Hanun, saya mau pesan ${product.name}.`;
  return `
    <li class="menu-item" >
      <div class="thumb">
        <img src="${product.image}" alt="${product.name} Hanun" loading="lazy" width="112" height="112" />
      </div>
      <div>
        <h3 class="menu-name">${product.name}${tag}</h3>
        <p class="menu-desc">${product.description}</p>
      </div>
      <div class="menu-side">
        <span class="menu-price">${formatPrice(product.price)}</span>
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

// ─── Links ──────────────────────────────────────────────────────────────────

function renderLinks(): void {
  document.getElementById('link-whatsapp')?.setAttribute('href', `https://wa.me/${WHATSAPP_NUMBER}`);
  const ig = document.getElementById('link-instagram');
  if (ig) {
    ig.setAttribute('href', INSTAGRAM_URL);
    ig.textContent = INSTAGRAM_HANDLE;
  }
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

  // Close on link click
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target as Node) && !nav.contains(e.target as Node)) {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}


// ─── Init ───────────────────────────────────────────────────────────────────

function init(): void {
  const grid = document.getElementById('produkGrid');
  if (grid) {
    grid.innerHTML = products.map(renderProduct).join('');
    initImageSkeletons(grid);
  }
  renderLinks();
  initHamburger();
}

document.addEventListener('DOMContentLoaded', init);
