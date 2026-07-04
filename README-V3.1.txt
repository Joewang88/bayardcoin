BayardCoin V3.1 Professional

What's new:
- Assets are organized by folder: logo, hero, category, icons, products.
- Product images are organized by category under assets/products/.
- Product BC-00001 has been added under Chinese Machine-Struck Coins.
- PayPal is set to wangjihang88@gmail.com.
- Zelle is set to 412-330-8868.
- PCGS cert link is supported.
- Product gallery supports multiple images.
- Sold status is supported. Change status: "available" to status: "sold" in products.js.

Folder structure:
assets/
  logo/
  hero/
  category/
  icons/
  products/
    chinese-machine-struck/
    chinese-paper-money/
    chinese-bullion/
    chinese-ancient-coin/
    world-coin/
    us-coin/

First product image names to upload:
assets/products/chinese-machine-struck/bc-00001-1.jpg
assets/products/chinese-machine-struck/bc-00001-2.jpg
assets/products/chinese-machine-struck/bc-00001-3.jpg

How to add a new product:
1. Upload images into the matching assets/products/category-folder.
2. Open products.js.
3. Copy an existing product block.
4. Change id, itemNumber, title, price, status, images, description, grade, and certLink.
5. Commit changes to GitHub.
6. Cloudflare Pages will redeploy automatically.
