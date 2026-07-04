BayardCoin V3.1 Professional

New features:
- PayPal checkout uses wangjihang88@gmail.com.
- Zelle purchase popup uses 412-330-8868.
- Sold status is supported. Change status: "Available" to status: "Sold" in products.js.
- Sold items hide Buy buttons and show SOLD ribbon.
- Homepage Previous Sold Highlights is generated automatically from sold products.
- Category numbers 01/02/03 are hidden/removed.

How to add a coin:
1. Upload the coin photo to assets/coins/
2. Open products.js
3. Add a product block under the correct category.
4. Set price, itemNumber, grade, description, status.

Example:
{
  title: "1908 Chihli Dragon Dollar",
  year: "1908",
  grade: "PCGS AU55",
  variety: "Y-73",
  image: "../assets/coins/1908-chihli-dragon-dollar.jpg",
  price: "1250.00",
  description: "Original luster with attractive toning.",
  itemNumber: "BC-0001",
  status: "Available",
  featured: true,
  paypalLink: ""
}

When sold, change only this line:
status: "Sold"
