const { db } = require("../config/firebaseConfig");
const Product = require("../models/Product");

// Tạo sản phẩm mới
const createProduct = async (req, res) => {
  try {
    const productData = req.body;

    // Kiểm tra danh mục tồn tại
    const categoryRef = db.collection("categories").doc(productData.categoryId);
    const categoryDoc = await categoryRef.get();

    if (!categoryDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Danh mục không tồn tại",
      });
    }

    // Tạo sản phẩm mới
    const product = new Product(productData);
    const productRef = await db
      .collection("products")
      .add(product.toFirestore());

    // Lấy sản phẩm vừa tạo
    const newProduct = await productRef.get();

    res.status(201).json({
      success: true,
      data: Product.fromFirestore(newProduct),
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Lấy danh sách sản phẩm theo danh mục
const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Kiểm tra danh mục tồn tại
    const categoryRef = db.collection("categories").doc(categoryId);
    const categoryDoc = await categoryRef.get();

    if (!categoryDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Danh mục không tồn tại",
      });
    }

    // Lấy sản phẩm theo danh mục
    const productsSnapshot = await db
      .collection("products")
      .where("categoryId", "==", categoryId)
      .get();

    const products = productsSnapshot.docs.map((doc) =>
      Product.fromFirestore(doc)
    );

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Lấy chi tiết sản phẩm
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productDoc = await db.collection("products").doc(id).get();

    if (!productDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Sản phẩm không tồn tại",
      });
    }

    res.json({
      success: true,
      data: Product.fromFirestore(productDoc),
    });
  } catch (error) {
    console.error("Error getting product:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Cập nhật sản phẩm
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Kiểm tra sản phẩm tồn tại
    const productRef = db.collection("products").doc(id);
    const productDoc = await productRef.get();

    if (!productDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Sản phẩm không tồn tại",
      });
    }

    // Nếu có thay đổi danh mục, kiểm tra danh mục mới tồn tại
    if (updateData.categoryId) {
      const categoryRef = db
        .collection("categories")
        .doc(updateData.categoryId);
      const categoryDoc = await categoryRef.get();

      if (!categoryDoc.exists) {
        return res.status(404).json({
          success: false,
          error: "Danh mục không tồn tại",
        });
      }
    }

    // Cập nhật sản phẩm
    updateData.updatedAt = new Date();
    await productRef.update(updateData);

    // Lấy sản phẩm sau khi cập nhật
    const updatedDoc = await productRef.get();

    res.json({
      success: true,
      data: Product.fromFirestore(updatedDoc),
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Xóa sản phẩm
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productRef = db.collection("products").doc(id);
    const productDoc = await productRef.get();

    if (!productDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Sản phẩm không tồn tại",
      });
    }

    await productRef.delete();

    res.json({
      success: true,
      message: "Đã xóa sản phẩm thành công",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getProductsByCategory,
  getProduct,
  updateProduct,
  deleteProduct,
};
