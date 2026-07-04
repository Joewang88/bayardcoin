function money(value) {
  const n = Number(String(value || '').replace(/[^0-9.]/g, ''));
  if (Number.isFinite(n) && n > 0) return `$${n.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  return value || "Contact for price";
}

function productText(p) {
  return [p.title, p.year, p.grade, p.variety, p.description, p.itemNumber, p.status].filter(Boolean).join(' ').toLowerCase();
}

function priceNumber(p) {
  const n = Number(String(p.price || '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function renderCard(p, i, category) {
  const title = p.title || 'Untitled Coin';
  const image = p.image || '../assets/category-chinese-coins.jpg';
  const price = p.price || '';
  const item = p.itemNumber || `${category}-${i+1}`;
  const status = p.status || 'Available';
  const paypalLink = p.paypalLink || '';
  const badges = [status, p.featured ? 'Featured' : '', p.grade || '', p.year || '', p.variety || ''].filter(Boolean);
  const details = [p.year, p.grade, p.variety].filter(Boolean).join(' · ');
  const buyHtml = paypalLink
    ? `<a class="btn btn-primary buy-link" href="${paypalLink}" target="_blank" rel="noopener noreferrer">Buy with PayPal</a>`
    : `<form class="buy-form" action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
        <input type="hidden" name="cmd" value="_xclick">
        <input type="hidden" name="business" value="${PAYPAL_EMAIL}">
        <input type="hidden" name="item_name" value="${title}">
        <input type="hidden" name="item_number" value="${item}">
        <input type="hidden" name="amount" value="${price}">
        <input type="hidden" name="currency_code" value="USD">
        <button class="btn btn-primary" type="submit">Buy with PayPal</button>
      </form>`;
  return `
    <article class="product-card reveal">
      <button class="product-image-button" type="button" data-image="${image}" data-title="${title}" aria-label="View larger image of ${title}">
        <img src="${image}" alt="${title}" loading="lazy">
      </button>
      <div class="product-body">
        <div class="product-badges">${badges.map(b => `<span>${b}</span>`).join('')}</div>
        <h3>${title}</h3>
        ${details ? `<p class="product-details">${details}</p>` : ''}
        <p class="product-description">${p.description || ''}</p>
        <div class="product-meta">
          <strong class="product-price">${money(price)}</strong>
          <span class="product-status">${status}</span>
        </div>
        ${buyHtml}
      </div>
    </article>`;
}

function renderProducts() {
  const mount = document.getElementById('inventory-grid');
  const empty = document.getElementById('empty-inventory');
  const search = document.getElementById('product-search');
  const sort = document.getElementById('product-sort');
  const category = document.body.dataset.category;
  const all = (window.BAYARD_PRODUCTS || BAYARD_PRODUCTS || {})[category] || [];
  const q = (search?.value || '').trim().toLowerCase();
  let products = all.filter(p => !q || productText(p).includes(q));
  const sortValue = sort?.value || 'newest';
  products = products.slice().sort((a,b) => {
    if (sortValue === 'price-low') return priceNumber(a) - priceNumber(b);
    if (sortValue === 'price-high') return priceNumber(b) - priceNumber(a);
    if (sortValue === 'title') return String(a.title || '').localeCompare(String(b.title || ''));
    return 0;
  });
  if (!products.length) {
    if (mount) mount.innerHTML = '';
    if (empty) {
      empty.style.display = 'block';
      const h = empty.querySelector('h3');
      const p = empty.querySelector('p');
      if (all.length && q) {
        if (h) h.textContent = 'No Matching Items';
        if (p) p.textContent = 'Try a different search term or clear the search box.';
      }
    }
    return;
  }
  if (empty) empty.style.display = 'none';
  mount.innerHTML = products.map((p, i) => renderCard(p, i, category)).join('');
  if (window.observeReveals) window.observeReveals();
}

document.getElementById('product-search')?.addEventListener('input', renderProducts);
document.getElementById('product-sort')?.addEventListener('change', renderProducts);

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.product-image-button');
  if (!btn) return;
  const overlay = document.createElement('div');
  overlay.className = 'image-modal';
  overlay.innerHTML = `<button class="modal-close" aria-label="Close image">×</button><img src="${btn.dataset.image}" alt="${btn.dataset.title}"><p>${btn.dataset.title}</p>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay || event.target.classList.contains('modal-close')) overlay.remove();
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') document.querySelector('.image-modal')?.remove();
});

renderProducts();
