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
      <img src="${(p.image || 'assets/category-chinese-coins.jpg').replace('../','')}" alt="${p.title || 'Sold coin'}" loading="lazy">
      <div><span>SOLD</span><h3>${p.title || 'Sold Coin'}</h3><p>${[p.itemNumber, p.year, p.grade].filter(Boolean).join(' · ')}</p></div>
    </article>`).join('');
  observeReveals();
}
renderSoldHighlights();
