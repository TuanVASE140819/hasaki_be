const express = require("express");
const router = express.Router();
const {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getPopularProducts,
  getNewProducts,
  searchProducts, // Add this
} = require("../controllers/productController");

router.post("/", addProduct);
router.get("/", getProducts);
router.get("/search", searchProducts); // Add this new route before /:id to avoid conflicts
router.get("/popular", getPopularProducts);
router.get("/new", getNewProducts);
router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
