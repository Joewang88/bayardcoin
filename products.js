// Bayard Coin inventory data
// How to add a coin:
// 1) Put your image in the assets folder, for example: assets/my-coin.jpg
// 2) Copy one product block below into the correct category array
// 3) Change title, image, price, description, and item number
// 4) If PayPal email is different, change PAYPAL_EMAIL below

const PAYPAL_EMAIL = "info@bayardcoin.com";

const BAYARD_PRODUCTS = {
  "chinese-coins": [
    // Example:
    // {
    //   title: "China Dragon Dollar",
    //   image: "../assets/category-chinese-coins.jpg",
    //   price: "1280.00",
    //   description: "Add year, province, grade, certification, and condition notes here.",
    //   itemNumber: "CC-001",
    //   status: "Available"
    // }
  ],
  "chinese-paper-money": [],
  "bullion": [],
  "ancient-coins": [],
  "world-coins": [],
  "us-coins": []
};
