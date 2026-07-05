const CATEGORY_LABELS = {
  "chinese-machine-struck-coins": "Chinese Machine Struck Coin",
  "chinese-paper-money": "Chinese Paper Money",
  "chinese-bullion": "Chinese Bullion",
  "chinese-ancient-coins": "Chinese Ancient Coin",
  "world-coins": "World Coin",
  "us-coins": "US Coins"
};
const LS_KEY = "bayard_products_v5";
const baseProducts = (typeof BAYARD_PRODUCTS !== "undefined") ? structuredClone(BAYARD_PRODUCTS) : {};
function loadProducts(){try{return JSON.parse(localStorage.getItem(LS_KEY)) || structuredClone(baseProducts)}catch{return structuredClone(baseProducts)}}
function saveProducts(data){localStorage.setItem(LS_KEY, JSON.stringify(data));}
let data = loadProducts();
const $ = id => document.getElementById(id);
function fillCategories(){ $('category').innerHTML = Object.entries(CATEGORY_LABELS).map(([k,v])=>`<option value="${k}">${v}</option>`).join(''); }
function formToProduct(){
 const cat=$('category').value, item=$('itemNumber').value.trim();
 return {id:item,itemNumber:item,sku:item,category:cat,status:$('status').value,featured:false,title:$('title').value.trim(),country:$('country').value.trim(),province:$('province').value.trim(),denomination:$('denomination').value.trim(),year:$('year').value.trim(),variety:$('variety').value.trim(),certification:$('certification').value.trim(),gradingService:$('certification').value.trim(),grade:$('grade').value.trim(),certNumber:$('certNumber').value.trim(),certLink:$('certLink').value.trim(),price:$('price').value.trim(),currency:'USD',images:$('images').value.split('\n').map(s=>s.trim()).filter(Boolean),description:$('description').value.trim()};
}
function productToForm(p){
 $('editKey').value = `${p.category}:${p.itemNumber||p.id}`; $('category').value=p.category||'chinese-machine-struck-coins'; $('itemNumber').value=p.itemNumber||p.id||''; $('status').value=p.status||'available'; $('title').value=p.title||''; $('country').value=p.country||''; $('province').value=p.province||''; $('denomination').value=p.denomination||''; $('year').value=p.year||''; $('variety').value=p.variety||''; $('certification').value=p.certification||p.gradingService||''; $('grade').value=p.grade||''; $('certNumber').value=p.certNumber||''; $('certLink').value=p.certLink||''; $('price').value=p.price||''; $('images').value=(p.images||[]).join('\n'); $('description').value=p.description||''; window.scrollTo({top:0,behavior:'smooth'});
}
function clearForm(){ $('coinForm').reset(); $('editKey').value=''; $('category').value='chinese-machine-struck-coins'; }
function allProducts(){ return Object.values(data).flat(); }
function renderList(){
 const q=($('searchAdmin').value||'').toLowerCase(); const list=allProducts().filter(p=>JSON.stringify(p).toLowerCase().includes(q));
 $('adminList').innerHTML = list.length ? list.map(p=>`<div class="admin-item"><img src="${(p.images&&p.images[0])||'assets/category/chinese-machine-struck.jpg'}" onerror="this.style.opacity=.25"><div><h3>${p.title||'Untitled'} <span class="admin-badge">${p.status||'available'}</span></h3><p>${p.itemNumber||p.id} · ${CATEGORY_LABELS[p.category]||p.category} · ${p.grade||''} · $${p.price||'0'}</p></div><button class="btn btn-secondary" data-edit="${p.category}:${p.itemNumber||p.id}">Edit</button></div>`).join('') : '<div class="admin-empty">No coins found.</div>';
}
function removeByKey(key){ const [cat,id]=key.split(':'); data[cat]=(data[cat]||[]).filter(p=>(p.itemNumber||p.id)!==id); }
function exportJs(){
 const body = `// Bayard Coin V5 inventory data\n// Generated from admin.html\n\nconst PAYPAL_EMAIL = ${JSON.stringify(typeof PAYPAL_EMAIL!== 'undefined'?PAYPAL_EMAIL:'wangjihang88@gmail.com')};\nconst ZELLE_PHONE = ${JSON.stringify(typeof ZELLE_PHONE!== 'undefined'?ZELLE_PHONE:'412-330-8868')};\nconst CONTACT_EMAIL = ${JSON.stringify(typeof CONTACT_EMAIL!== 'undefined'?CONTACT_EMAIL:'info@bayardcoin.com')};\nconst CURRENCY_CODE = "USD";\n\nconst BAYARD_CATEGORY_IMAGES = ${JSON.stringify(typeof BAYARD_CATEGORY_IMAGES!== 'undefined'?BAYARD_CATEGORY_IMAGES:{}, null, 2)};\n\nconst BAYARD_PRODUCTS = ${JSON.stringify(data, null, 2)};\n`;
 const blob=new Blob([body],{type:'text/javascript'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='products.js'; a.click(); URL.revokeObjectURL(url);
}
fillCategories(); renderList();
$('coinForm').addEventListener('submit',e=>{e.preventDefault(); const p=formToProduct(); if($('editKey').value) removeByKey($('editKey').value); data[p.category]=data[p.category]||[]; data[p.category].push(p); saveProducts(data); renderList(); clearForm(); alert('Saved in this browser. Export products.js when ready.');});
$('adminList').addEventListener('click',e=>{const btn=e.target.closest('[data-edit]'); if(!btn)return; const [cat,id]=btn.dataset.edit.split(':'); const p=(data[cat]||[]).find(x=>(x.itemNumber||x.id)===id); if(p) productToForm(p);});
$('clearForm').addEventListener('click',clearForm); $('deleteCoin').addEventListener('click',()=>{if(!$('editKey').value)return; if(confirm('Delete this coin?')){removeByKey($('editKey').value); saveProducts(data); renderList(); clearForm();}});
$('searchAdmin').addEventListener('input',renderList); $('exportJs').addEventListener('click',exportJs);
