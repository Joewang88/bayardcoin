function money(value) {
  const n = Number(value);
  if (Number.isFinite(n)) return `$${n.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  return value || "Contact for price";
}

function renderProducts() {
  const mount = document.getElementById('inventory-grid');
  const empty = document.getElementById('empty-inventory');
  const category = document.body.dataset.category;
  const products = (window.BAYARD_PRODUCTS || BAYARD_PRODUCTS || {})[category] || [];
  if (!products.length) {
    if (mount) mount.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';
  mount.innerHTML = products.map((p, i) => {
    const title = p.title || 'Untitled Coin';
    const image = p.image || '../assets/category-chinese-coins.jpg';
    const price = p.price || '';
    const item = p.itemNumber || `${category}-${i+1}`;
    const description = p.description || '';
    const status = p.status || 'Available';
    return `
      <article class="product-card reveal">
        <img src="${image}" alt="${title}">
        <div class="product-body">
          <h3>${title}</h3>
          <p class="product-description">${description}</p>
          <div class="product-meta">
            <strong class="product-price">${money(price)}</strong>
            <span class="product-status">${status}</span>
          </div>
          <form class="buy-form" action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
            <input type="hidden" name="cmd" value="_xclick">
            <input type="hidden" name="business" value="${PAYPAL_EMAIL}">
            <input type="hidden" name="item_name" value="${title}">
            <input type="hidden" name="item_number" value="${item}">
            <input type="hidden" name="amount" value="${price}">
            <input type="hidden" name="currency_code" value="USD">
            <button class="btn btn-primary" type="submit">Buy with PayPal</button>
          </form>
        </div>
      </article>`;
  }).join('');
}
renderProducts();
