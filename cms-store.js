(function(){
  const CATEGORIES = {
    "chinese-machine-struck-coins": "Chinese Machine Struck Coin",
    "chinese-paper-money": "Chinese Paper Money",
    "chinese-bullion": "Chinese Bullion",
    "chinese-ancient-coins": "Chinese Ancient Coin",
    "world-coins": "World Coin",
    "us-coins": "US Coins"
  };
  window.BAYARD_CATEGORIES = CATEGORIES;

  function cfg(){
    const c = window.BAYARD_SUPABASE || {};
    const key = c.publishableKey || c.anonKey || c.SUPABASE_PUBLISHABLE_KEY || c.SUPABASE_ANON_KEY;
    return { url: c.url || c.SUPABASE_URL, key, bucket: c.storageBucket || "product-images" };
  }
  function client(){
    const c = cfg();
    if(!window.supabase) throw new Error("Supabase library not loaded");
    if(!c.url || !c.key || c.key.includes("PASTE_")) throw new Error("Please set Supabase URL and Publishable key in config.js");
    return window.supabase.createClient(c.url, c.key);
  }
  function money(v,currency){
    if(v === null || v === undefined || v === "") return "Price on request";
    return new Intl.NumberFormat("en-US", {style:"currency", currency: currency || "USD", maximumFractionDigits:0}).format(Number(v));
  }
  function img(p){ return (Array.isArray(p.images) && p.images.length) ? p.images[0] : "assets/hero/hero-chinese-coins.jpg"; }
  function esc(s){ return String(s ?? "").replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  async function fetchProducts(options={}){
    const sb = client();
    let q = sb.from("products").select("*").order("featured", {ascending:false}).order("created_at", {ascending:false});
    if(options.category) q = q.eq("category", options.category);
    if(options.status && options.status !== "all") q = q.eq("status", options.status);
    if(options.featured) q = q.eq("featured", true);
    const {data,error} = await q;
    if(error) throw error;
    return data || [];
  }
  function productCard(p){
    const sold = (p.status || "").toLowerCase() === "sold";
    const cert = p.cert_link ? `<a href="${esc(p.cert_link)}" target="_blank" rel="noopener">${esc(p.grading_service||p.certification||"Cert")} ${esc(p.cert_number||"")}</a>` : esc([p.grading_service||p.certification,p.cert_number].filter(Boolean).join(" "));
    return `<article class="product-card reveal">
      <a class="product-image" href="product.html?id=${encodeURIComponent(p.id)}"><img src="${esc(img(p))}" alt="${esc(p.title)}"></a>
      <div class="product-body">
        <div class="product-meta"><span>${esc(CATEGORIES[p.category]||p.category||"")}</span>${sold?'<span class="sold-badge">SOLD</span>':'<span>Available</span>'}</div>
        <h3><a href="product.html?id=${encodeURIComponent(p.id)}">${esc(p.title)}</a></h3>
        <p>${esc([p.year,p.denomination,p.grade].filter(Boolean).join(" · "))}</p>
        <p>${cert}</p>
        <div class="product-footer"><strong>${money(p.price,p.currency)}</strong><a class="btn btn-secondary" href="product.html?id=${encodeURIComponent(p.id)}">View</a></div>
      </div>
    </article>`;
  }
  async function renderGrid(el, options){
    const node = typeof el === "string" ? document.querySelector(el) : el;
    if(!node) return;
    node.innerHTML = `<p class="muted">Loading inventory...</p>`;
    try{
      const products = await fetchProducts(options);
      if(!products.length){ node.innerHTML = `<p class="muted">No products in this category yet.</p>`; return; }
      node.innerHTML = products.map(productCard).join("");
    }catch(e){ node.innerHTML = `<p class="muted">Inventory could not load: ${esc(e.message)}</p>`; }
  }
  async function renderProduct(){
    const box = document.querySelector("[data-product-detail]"); if(!box) return;
    const id = new URLSearchParams(location.search).get("id");
    if(!id){ box.innerHTML = "<p>Missing product id.</p>"; return; }
    try{
      const sb = client();
      const {data:p,error} = await sb.from("products").select("*").eq("id", id).single();
      if(error) throw error;
      const images = Array.isArray(p.images)?p.images:[];
      document.title = `${p.title} | BayardCoin`;
      box.innerHTML = `<div class="detail-layout">
        <div class="detail-gallery">${images.map(u=>`<img src="${esc(u)}" alt="${esc(p.title)}">`).join("") || `<img src="${esc(img(p))}" alt="${esc(p.title)}">`}</div>
        <div class="detail-info"><p class="eyebrow">${esc(CATEGORIES[p.category]||p.category)}</p><h1>${esc(p.title)}</h1>
        <h2>${money(p.price,p.currency)}</h2>
        <p>${esc(p.description||"")}</p>
        <dl class="specs">${[["Item",p.item_number],["Country",p.country],["Province",p.province],["Year",p.year],["Denomination",p.denomination],["Variety",p.variety],["Grade",p.grade],["Certification",p.grading_service],["Cert #",p.cert_number],["Status",p.status]].filter(x=>x[1]).map(([k,v])=>`<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl>
        ${p.cert_link?`<a class="btn btn-secondary" target="_blank" rel="noopener" href="${esc(p.cert_link)}">Verify Certificate</a>`:""}
        <a class="btn btn-primary" href="mailto:${esc((window.BAYARD_STORE||{}).contactEmail)}?subject=BayardCoin Inquiry ${encodeURIComponent(p.id)}">Contact to Buy</a>
        <p class="muted">PayPal: ${esc((window.BAYARD_STORE||{}).paypalEmail)} · Zelle: ${esc((window.BAYARD_STORE||{}).zellePhone)}</p>
        </div></div>`;
    }catch(e){ box.innerHTML = `<p class="muted">Product could not load: ${esc(e.message)}</p>`; }
  }
  window.BayardCMS = {client, cfg, fetchProducts, renderGrid, renderProduct, productCard, money, esc};
  document.addEventListener("DOMContentLoaded", ()=>{
    document.querySelectorAll("[data-products]").forEach(el=>renderGrid(el,{category:el.dataset.category,status:el.dataset.status||"available",featured:el.dataset.featured==="true"}));
    renderProduct();
  });
})();
