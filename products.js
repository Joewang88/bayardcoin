// Bayard Coin V3.1 Professional inventory data
// Directory rule:
// assets/products/chinese-machine-struck/
// assets/products/chinese-paper-money/
// assets/products/chinese-bullion/
// assets/products/chinese-ancient-coin/
// assets/products/world-coin/
// assets/products/us-coin/
//
// For each product, upload images using the global item naming rule:
// 00001-1.jpg, 00001-2.jpg, 00001-3.jpg
// Sold: change status from "available" to "sold" and buy buttons disappear.

const PAYPAL_EMAIL = "wangjihang88@gmail.com";
const ZELLE_PHONE = "412-330-8868";
const CONTACT_EMAIL = "info@bayardcoin.com";
const CURRENCY_CODE = "USD";

const BAYARD_CATEGORY_IMAGES = {
  "chinese-machine-struck-coins": "assets/category/chinese-machine-struck.jpg",
  "chinese-paper-money": "assets/category/chinese-paper-money.JPG",
  "chinese-bullion": "assets/category/chinese-bullion.jpg",
  "chinese-ancient-coins": "assets/category/chinese-ancient-coin.jpg",
  "world-coins": "assets/category/world-coin.jpg",
  "us-coins": "assets/category/us-coin.jpg"
};

const BAYARD_PRODUCTS = {
  "chinese-machine-struck-coins": [
    {
      id: "00001",
      itemNumber: "00001",
      sku: "00001",
      category: "chinese-machine-struck-coins",
      status: "available",
      featured: true,

      title: "CHINA. Yunnan. Tael, ND (1943–44)",
      country: "China",
      province: "Yunnan",
      denomination: "Tael",
      year: "ND (1943–44)",
      variety: "Small stag's head",

      certification: "PCGS",
      gradingService: "PCGS",
      grade: "AU-58",
      certNumber: "42439997",
      certLink: "https://www.pcgs.com/cert/42439997",

      price: "6000.00",
      currency: "USD",

      images: [
        "../assets/products/chinese-machine-struck/00001-1.jpg",
        "../assets/products/chinese-machine-struck/00001-2.jpg",
        "../assets/products/chinese-machine-struck/00001-3.jpg"
      ],

      description: "Variety with small stag's head. A lovely Mint State Tael, displaying softly glowing luster and attractive, balanced coloration. Strong cartwheel luster radiates across both surfaces, enhancing the overall eye appeal."
    }
  ],
  "chinese-paper-money": [],
  "chinese-bullion": [],
  "chinese-ancient-coins": [],
  "world-coins": [],
  "us-coins": []
};
