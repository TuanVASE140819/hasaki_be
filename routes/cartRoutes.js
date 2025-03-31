const express = require("express");
const router = express.Router();
const {
  authenticateToken,
} = require("../controllers/authenticationController");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} = require("../controllers/cartController");

// All cart routes require authentication
router.use(authenticateToken);

router.get("/", getCart);
router.post("/", addToCart);
router.put("/:id", updateCartItem);
router.delete("/:id", removeCartItem);

module.exports = router;
