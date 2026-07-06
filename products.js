// Bayard Coin inventory configuration
// Products are managed through admin.html and stored in Supabase.
// Do not add hardcoded/demo product data here.

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

// Kept only as an empty fallback so older pages do not break if Supabase is unavailable.
const BAYARD_PRODUCTS = {
  "chinese-machine-struck-coins": [],
  "chinese-paper-money": [],
  "chinese-bullion": [],
  "chinese-ancient-coins": [],
  "world-coins": [],
  "us-coins": []
};
