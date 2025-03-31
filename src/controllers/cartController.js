const { db } = require("../config/firebaseConfig");
const { Cart } = require("../models/Cart");
const Product = require("../models/Product");

// Lấy giỏ hàng của user
const getCart = async (req, res) => {
  try {
    const userId = req.user.id; // Giả sử có middleware auth
    const cartRef = db.collection("carts").doc(userId);
    const cartDoc = await cartRef.get();

    if (!cartDoc.exists) {
      // Tạo giỏ hàng mới nếu chưa có
      const newCart = new Cart({ userId });
      await cartRef.set(newCart.toFirestore());
      return res.json({
        success: true,
        data: newCart,
      });
    }

    res.json({
      success: true,
      data: Cart.fromFirestore(cartDoc),
    });
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Thêm sản phẩm vào giỏ hàng
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    // Kiểm tra sản phẩm tồn tại
    const productDoc = await db.collection("products").doc(productId).get();
    if (!productDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Sản phẩm không tồn tại",
      });
    }

    const product = Product.fromFirestore(productDoc);

    // Kiểm tra số lượng tồn kho
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        error: "Số lượng sản phẩm trong kho không đủ",
      });
    }

    // Lấy hoặc tạo giỏ hàng
    const cartRef = db.collection("carts").doc(userId);
    const cartDoc = await cartRef.get();

    let cart;
    if (!cartDoc.exists) {
      cart = new Cart({ userId });
    } else {
      cart = Cart.fromFirestore(cartDoc);
    }

    // Thêm sản phẩm vào giỏ
    cart.addItem(product, quantity);

    // Lưu giỏ hàng
    await cartRef.set(cart.toFirestore());

    res.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Cập nhật số lượng sản phẩm trong giỏ
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        error: "Số lượng phải lớn hơn 0",
      });
    }

    // Kiểm tra sản phẩm tồn tại và số lượng tồn kho
    const productDoc = await db.collection("products").doc(productId).get();
    if (!productDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Sản phẩm không tồn tại",
      });
    }

    const product = Product.fromFirestore(productDoc);
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        error: "Số lượng sản phẩm trong kho không đủ",
      });
    }

    // Cập nhật giỏ hàng
    const cartRef = db.collection("carts").doc(userId);
    const cartDoc = await cartRef.get();

    if (!cartDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy giỏ hàng",
      });
    }

    const cart = Cart.fromFirestore(cartDoc);
    cart.updateItemQuantity(productId, quantity);
    await cartRef.set(cart.toFirestore());

    res.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const cartRef = db.collection("carts").doc(userId);
    const cartDoc = await cartRef.get();

    if (!cartDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy giỏ hàng",
      });
    }

    const cart = Cart.fromFirestore(cartDoc);
    cart.removeItem(productId);
    await cartRef.set(cart.toFirestore());

    res.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Xóa toàn bộ giỏ hàng
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartRef = db.collection("carts").doc(userId);
    const cartDoc = await cartRef.get();

    if (!cartDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy giỏ hàng",
      });
    }

    const cart = Cart.fromFirestore(cartDoc);
    cart.clear();
    await cartRef.set(cart.toFirestore());

    res.json({
      success: true,
      message: "Đã xóa toàn bộ giỏ hàng",
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
