const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (toggle && nav) toggle.addEventListener('click', () => nav.classList.toggle('open'));
document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => nav?.classList.remove('open')));
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.12 });
function observeReveals() {
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
window.observeReveals = observeReveals;
observeReveals();

function normalizeHomeProduct(p) {
  const normalized = { ...p };
  normalized.itemNumber = p.itemNumber || p.item_number || p.sku || p.id;
  normalized.certNumber = p.certNumber || p.cert_number;
  normalized.gradingService = p.gradingService || p.grading_service || p.certification;
  if (!normalized.images) {
    if (Array.isArray(p.image_urls)) normalized.images = p.image_urls;
    else if (Array.isArray(p.images)) normalized.images = p.images;
    else if (p.cover_image) normalized.images = [p.cover_image];
    else if (p.image_url) normalized.images = [p.image_url];
  }
  return normalized;
}

function homeImage(p) {
  const img = (Array.isArray(p.images) && p.images.length) ? p.images[0] : (p.image || 'assets/category/chinese-machine-struck.jpg');
  if (!img) return 'assets/category/chinese-machine-struck.jpg';
  if (/^https?:\/\//.test(img)) return img;
  if (img.startsWith('../')) return img.replace(/^\.\.\//, '');
  if (img.startsWith('assets/')) return img;
  if (window.bayardSupabase) {
    const cleanPath = img.replace(/^product-images\//, '');
    const { data } = window.bayardSupabase.storage.from('product-images').getPublicUrl(cleanPath);
    return data.publicUrl;
  }
  return img;
}

function productUrl(p) {
  const category = p.category || 'chinese-machine-struck-coins';
  const id = p.id || p.itemNumber || p.sku || '';
  return `categories/${category}.html${id ? '?coin=' + encodeURIComponent(String(id).toLowerCase()) : ''}`;
}

function productLine(p) {
  return [p.itemNumber, p.year, p.grade, p.gradingService || p.certification].filter(Boolean).join(' · ');
}

async function loadAllProductsForHome() {
  if (typeof getProducts !== 'function') return [];

  try {
    const data = await getProducts();
    return Array.isArray(data) ? data.map(normalizeHomeProduct) : [];
  } catch (err) {
    console.error('Could not load Supabase products for homepage.', err);
    return [];
  }
}

async function renderFeaturedCoins() {
  const mount = document.getElementById('featured-coins-grid');
  const empty = document.querySelector('.empty-featured');
  if (!mount) return;

  const products = await loadAllProductsForHome();
  const featured = products
    .filter(p => p.featured === true || String(p.featured).toLowerCase() === 'true')
    .filter(p => String(p.status || '').toLowerCase() !== 'sold')
    .slice(0, 6);

  if (!featured.length) {
    if (empty) empty.style.display = 'block';
    mount.innerHTML = '';
    return;
  }

  if (empty) empty.style.display = 'none';
  mount.innerHTML = featured.map(p => `
    <a class="featured-card reveal" href="${productUrl(p)}">
      <img src="${homeImage(p)}" alt="${p.title || 'Featured coin'}" loading="lazy" onerror="this.src='assets/category/chinese-machine-struck.jpg'">
      <div class="featured-body">
        <span>FEATURED</span>
        <h3>${p.title || 'Featured Coin'}</h3>
        <p>${productLine(p)}</p>
      </div>
    </a>`).join('');
  observeReveals();
}

async function renderSoldHighlights() {
  const mount = document.getElementById('sold-highlights-grid');
  const empty = document.querySelector('.empty-highlight');
  if (!mount) return;

  const products = await loadAllProductsForHome();
  const sold = products
    .filter(p => String(p.status || '').toLowerCase() === 'sold')
    .slice(0, 6);

  if (!sold.length) {
    if (empty) empty.style.display = 'block';
    mount.innerHTML = '';
    return;
  }

  if (empty) empty.style.display = 'none';
  mount.innerHTML = sold.map(p => `
    <a class="highlight-card reveal" href="${productUrl(p)}">
      <img src="${homeImage(p)}" alt="${p.title || 'Sold coin'}" loading="lazy" onerror="this.src='assets/category/chinese-machine-struck.jpg'">
      <div><span>SOLD</span><h3>${p.title || 'Sold Coin'}</h3><p>${productLine(p)}</p></div>
    </a>`).join('');
  observeReveals();
}

async function renderHomeInventorySections() {
  await Promise.all([renderFeaturedCoins(), renderSoldHighlights()]);
}

if (document.getElementById('featured-coins-grid') || document.getElementById('sold-highlights-grid')) {
  renderHomeInventorySections();
}
