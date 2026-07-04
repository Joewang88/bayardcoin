const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (toggle && nav) toggle.addEventListener('click', () => nav.classList.toggle('open'));
document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => nav?.classList.remove('open')));
document.getElementById('year').textContent = new Date().getFullYear();

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.12 });
function observeReveals() {
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
window.observeReveals = observeReveals;
observeReveals();

function soldImage(p) {
  const img = (Array.isArray(p.images) && p.images.length) ? p.images[0] : (p.image || 'assets/category/chinese-machine-struck.jpg');
  return img.replace(/^\.\.\//, '');
}
function renderSoldHighlights() {
  const mount = document.getElementById('sold-highlights-grid');
  const empty = document.querySelector('.empty-highlight');
  if (!mount || typeof BAYARD_PRODUCTS === 'undefined') return;
  const sold = Object.entries(BAYARD_PRODUCTS).flatMap(([category, items]) =>
    (items || []).filter(p => String(p.status || '').toLowerCase() === 'sold').map(p => ({...p, category}))
  ).slice(0, 6);
  if (!sold.length) {
    if (empty) empty.style.display = 'block';
    mount.innerHTML = '';
    return;
  }
  if (empty) empty.style.display = 'none';
  mount.innerHTML = sold.map(p => `
    <article class="highlight-card reveal">
      <img src="${soldImage(p)}" alt="${p.title || 'Sold coin'}" loading="lazy" onerror="this.src='assets/category/chinese-machine-struck.jpg'">
      <div><span>SOLD</span><h3>${p.title || 'Sold Coin'}</h3><p>${[p.itemNumber, p.year, p.grade].filter(Boolean).join(' · ')}</p></div>
    </article>`).join('');
  observeReveals();
}
renderSoldHighlights();
