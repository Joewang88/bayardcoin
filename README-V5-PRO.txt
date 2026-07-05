BayardCoin V5 Pro
=================

This version adds a real admin dashboard using Supabase.
After setup, you can add/edit/delete coins, upload images, and mark sold without editing products.js or GitHub files.

Files added:
- admin-pro.html          Admin dashboard
- config.js              Supabase connection settings
- supabase-schema.sql    Database setup SQL

Setup steps:
1. Create a free Supabase account and project.
2. In Supabase > SQL Editor, run supabase-schema.sql.
3. In Supabase > Storage, create a public bucket named product-images.
4. In Supabase > Authentication > Users, add your admin user email/password.
5. Open config.js and paste:
   - Project URL
   - anon public key
6. Upload the whole folder to GitHub / Cloudflare Pages.
7. Visit /admin-pro.html, log in, and add inventory.

Important:
- Do NOT share the admin password.
- The anon public key is okay to publish; Row Level Security protects writes.
- products.js remains as fallback data if Supabase is not configured.
