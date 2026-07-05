BayardCoin Real CMS

This package is a real Supabase-powered static CMS:
- admin-pro.html: login, add/edit/delete products, upload images to Supabase Storage
- index.html: live homepage reading products from Supabase
- category.html: live category inventory
- product.html: live product detail page
- cms-store.js: shared frontend database code
- config.js: paste Supabase URL and Publishable key here
- supabase-schema.sql: database + storage policies

Setup:
1. Supabase SQL Editor: run supabase-schema.sql.
2. Storage: confirm bucket product-images exists and is Public.
3. Authentication > Users: create your admin email/password.
4. Settings > API Keys: copy Publishable key.
5. Settings > General: copy project URL.
6. Open config.js and replace:
   url: "https://inqvouwyuejgbadygxjm.supabase.co"
   publishableKey: "PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY_HERE"
7. Upload all files to GitHub / Cloudflare Pages.
8. Visit /admin-pro.html and log in.

Important:
Do NOT put the Secret key in config.js. Only use the Publishable key.
