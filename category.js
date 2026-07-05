function money(value) {
  const n = Number(String(value || '').replace(/[^0-9.]/g, ''));
  if (Number.isFinite(n) && n > 0) return `$${n.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  return value || "Contact for price";
}
function productText(p) {
  return [p.title, p.country, p.province, p.denomination, p.year, p.grade, p.variety, p.certNumber, p.description, p.itemNumber, p.status].filter(Boolean).join(' ').toLowerCase();
}
function priceNumber(p) {
  const n = Number(String(p.price || '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : 0;
}
function isSold(p) {
  return String(p.status || '').toLowerCase() === 'sold';
}
function firstImage(p, category) {
  if (Array.isArray(p.images) && p.images.length) return p.images[0];
  if (p.image) return p.image;
  const categoryImg = (window.BAYARD_CATEGORY_IMAGES || {})[category] || 'assets/category/chinese-machine-struck.jpg';
  return '../' + categoryImg.replace(/^\.\.\//, '');
}
function fixImagePath(path) {
  if (!path) return path;
  if (/^https?:\/\//.test(path)) return path;
  if (path.startsWith("../")) return path;
  if (path.startsWith("assets/")) return "../" + path;
  return path;
}
function paypalForm(p, title, item, price) {
  if (p.paypalLink) return `<a class="btn btn-primary buy-link" href="${p.paypalLink}" target="_blank" rel="noopener noreferrer">Buy with PayPal</a>`;
  return `<form class="buy-form" action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
    <input type="hidden" name="cmd" value="_xclick">
    <input type="hidden" name="business" value="${PAYPAL_EMAIL}">
    <input type="hidden" name="item_name" value="${title}">
    <input type="hidden" name="item_number" value="${item}">
    <input type="hidden" name="amount" value="${price}">
    <input type="hidden" name="currency_code" value="${p.currency || CURRENCY_CODE || 'USD'}">
    <button class="btn btn-primary" type="submit">Buy with PayPal</button>
  </form>`;
}
function renderGallery(p, category, title) {
  const imgs = (Array.isArray(p.images) && p.images.length ? p.images : [firstImage(p, category)]);
  const main = imgs[0];
  return `<div class="product-gallery">
    <button class="product-image-button" type="button" data-image="${main}" data-title="${title}" aria-label="View larger image of ${title}">
      <img class="product-main-img" src="${main}" alt="${title}" loading="lazy" onerror="this.src='../assets/category/chinese-machine-struck.jpg'">
    </button>
    ${imgs.length > 1 ? `<div class="thumb-row">${imgs.map((src, idx) => `<button class="thumb-button ${idx===0?'active':''}" type="button" data-src="${src}" aria-label="Show image ${idx+1}"><img src="${src}" alt="${title} image ${idx+1}" loading="lazy" onerror="this.style.opacity=.25"></button>`).join('')}</div>` : ''}
  </div>`;
}
function renderCard(p, i, category) {
  const title = p.title || 'Untitled Coin';
  const price = p.price || '';
  const item = p.itemNumber || p.sku || `${category}-${i+1}`;
  const status = p.status || 'available';
  const sold = isSold(p);
  const cert = p.certLink ? `<a class="cert-link" href="${p.certLink}" target="_blank" rel="noopener noreferrer">${p.certification || p.gradingService || 'Cert'} #${p.certNumber || ''}</a>` : '';
  const badges = [sold ? 'Sold' : 'Available', p.featured ? 'Featured' : '', p.gradingService || p.certification || '', p.grade || '', p.year || ''].filter(Boolean);
  const details = [item, p.country, p.province, p.denomination, p.variety].filter(Boolean).join(' · ');
  const buyHtml = sold
    ? `<div class="sold-box">SOLD</div>`
    : `<div class="purchase-actions">
        ${paypalForm(p, title, item, price)}
        <button class="btn btn-secondary zelle-button" type="button" data-title="${title}" data-item="${item}" data-price="${money(price)}">Buy with Zelle</button>
        <a class="btn btn-secondary contact-seller" href="mailto:${CONTACT_EMAIL}?subject=Inquiry%20about%20${encodeURIComponent(item)}%20-%20${encodeURIComponent(title)}">Contact Seller</a>
      </div>`;
  return `
    <article class="product-card reveal ${sold ? 'sold-card' : ''}">
      ${sold ? '<div class="sold-ribbon">SOLD</div>' : ''}
      ${renderGallery(p, category, title)}
      <div class="product-body">
        <div class="product-badges">${badges.map(b => `<span>${b}</span>`).join('')}</div>
        <h3>${title}</h3>
        ${details ? `<p class="product-details">${details}</p>` : ''}
        ${cert ? `<p class="product-cert">${cert}</p>` : ''}
        <p class="product-description">${p.description || ''}</p>
        <div class="product-meta"><strong class="product-price">${money(price)}</strong><span class="product-status">${sold ? 'Sold' : 'Available'}</span></div>
        ${buyHtml}
      </div>
    </article>`;
}
function normalizeProduct(p) {
  const normalized = { ...p };

  normalized.itemNumber = p.itemNumber || p.item_number || p.sku || p.id;
  normalized.certNumber = p.certNumber || p.cert_number;
  normalized.certLink = p.certLink || p.cert_link || p.cert_url;
  normalized.gradingService = p.gradingService || p.grading_service;
  normalized.paypalLink = p.paypalLink || p.paypal_link;

  if (!normalized.images) {
    if (Array.isArray(p.image_urls)) normalized.images = p.image_urls;
    else if (Array.isArray(p.images)) normalized.images = p.images;
    else if (p.cover_image) normalized.images = [p.cover_image];
    else if (p.image_url) normalized.images = [p.image_url];
  }

  if (Array.isArray(normalized.images)) {
  normalized.images = normalized.images.map(fixImagePath);
  }
  
  if (normalized.image) {
    normalized.image = fixImagePath(normalized.image);

  return normalized;
}

let categoryProductsCache = null;

async function loadCategoryProducts(category) {
  const localProducts = (window.BAYARD_PRODUCTS || BAYARD_PRODUCTS || {})[category] || [];

  if (typeof getProducts !== "function") {
    return localProducts;
  }

  try {
    if (!categoryProductsCache) {
      categoryProductsCache = await getProducts(category);
    }

    if (Array.isArray(categoryProductsCache) && categoryProductsCache.length) {
      return categoryProductsCache.map(normalizeProduct);
    }
  } catch (err) {
    console.error("Could not load Supabase products. Falling back to products.js.", err);
  }

  return localProducts;
}

async function renderProducts() {
  const mount = document.getElementById('inventory-grid');
  const empty = document.getElementById('empty-inventory');
  const search = document.getElementById('product-search');
  const sort = document.getElementById('product-sort');
  const category = document.body.dataset.category;
  const all = await loadCategoryProducts(category);
  const q = (search?.value || '').trim().toLowerCase();
  let products = all.filter(p => !q || productText(p).includes(q));
  const sortValue = sort?.value || 'newest';
  products = products.slice().sort((a,b) => {
    if (sortValue === 'price-low') return priceNumber(a) - priceNumber(b);
    if (sortValue === 'price-high') return priceNumber(b) - priceNumber(a);
    if (sortValue === 'title') return String(a.title || '').localeCompare(String(b.title || ''));
    if (sortValue === 'status') return String(a.status || '').localeCompare(String(b.status || ''));
    return 0;
  });
  if (!products.length) {
    if (mount) mount.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';
  mount.innerHTML = products.map((p, i) => renderCard(p, i, category)).join('');
  if (window.observeReveals) window.observeReveals();
}
document.getElementById('product-search')?.addEventListener('input', renderProducts);
document.getElementById('product-sort')?.addEventListener('change', renderProducts);
document.addEventListener('click', (e) => {
  const thumb = e.target.closest('.thumb-button');
  if (thumb) {
    const gallery = thumb.closest('.product-gallery');
    const main = gallery?.querySelector('.product-main-img');
    const imgBtn = gallery?.querySelector('.product-image-button');
    if (main && imgBtn) { main.src = thumb.dataset.src; imgBtn.dataset.image = thumb.dataset.src; }
    gallery?.querySelectorAll('.thumb-button').forEach(b => b.classList.remove('active'));
    thumb.classList.add('active');
    return;
  }
  const imgBtn = e.target.closest('.product-image-button');
  if (imgBtn) {
    const overlay = document.createElement('div');
    overlay.className = 'image-modal';
    overlay.innerHTML = `<button class="modal-close" aria-label="Close image">×</button><img src="${imgBtn.dataset.image}" alt="${imgBtn.dataset.title}"><p>${imgBtn.dataset.title}</p>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (event) => { if (event.target === overlay || event.target.classList.contains('modal-close')) overlay.remove(); });
    return;
  }
  const zelleBtn = e.target.closest('.zelle-button');
  if (zelleBtn) {
    const modal = document.createElement('div');
    modal.className = 'zelle-modal';
    modal.innerHTML = `<div class="zelle-card"><button class="modal-close" aria-label="Close Zelle instructions">×</button><p class="eyebrow">Buy with Zelle</p><h2>${zelleBtn.dataset.title}</h2><div class="zelle-row"><span>Recipient</span><strong>${ZELLE_PHONE}</strong></div><div class="zelle-row"><span>Amount</span><strong>${zelleBtn.dataset.price}</strong></div><div class="zelle-row"><span>Reference</span><strong>${zelleBtn.dataset.item}</strong></div><p class="zelle-note">After payment, please email ${CONTACT_EMAIL} with your shipping address and item reference.</p><button class="btn btn-primary copy-zelle" type="button">Copy Zelle Phone</button></div>`;
    document.body.appendChild(modal);
    modal.querySelector('.copy-zelle')?.addEventListener('click', async () => { try { await navigator.clipboard.writeText(ZELLE_PHONE.replace(/[^0-9]/g, '')); modal.querySelector('.copy-zelle').textContent = 'Copied'; } catch (_) { modal.querySelector('.copy-zelle').textContent = ZELLE_PHONE; } });
    modal.addEventListener('click', (event) => { if (event.target === modal || event.target.classList.contains('modal-close')) modal.remove(); });
  }
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { document.querySelector('.image-modal')?.remove(); document.querySelector('.zelle-modal')?.remove(); } });
renderProducts();
