Bayard Coin & Collectibles V5

What changed:
1. Added admin.html: a browser-based coin manager.
2. Add/edit/delete coins without writing long product code manually.
3. Mark status as available or sold.
4. Export a new products.js file when ready.
5. Category pages automatically read the V5 saved inventory in your browser.

How to use:
1. Open admin.html.
2. Add coin information and image URLs.
3. Click Save Coin.
4. Check the category page.
5. When everything looks good, click Export products.js.
6. Replace the old products.js in GitHub with the exported file.
7. Deploy normally through Cloudflare Pages.

Important limitation:
This is still a static GitHub/Cloudflare website. The admin page can save in your own browser immediately, but to update the public site for all visitors, you still need to export products.js and upload/replace it in GitHub.

For a true login backend where Save updates the public website instantly, you would need a backend/CMS such as Decap CMS + GitHub, Sanity, Supabase, Firebase, Shopify, or a custom database.
