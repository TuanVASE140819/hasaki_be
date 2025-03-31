const express = require("express");
const router = express.Router();
const {
  addBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
} = require("../controllers/brandController");

router.post("/", addBrand);
router.get("/", getBrands);
router.get("/:id", getBrand);
router.put("/:id", updateBrand);
router.delete("/:id", deleteBrand);

module.exports = router;
