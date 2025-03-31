const db = require("../config/firebaseConfig");

// Get the user's shopping cart
const getCart = async (req, res) => {
  try {
    const userId = req.user.id; // From authenticateToken middleware

    // Get cart items from database
    const snapshot = await db
      .collection("carts")
      .where("userId", "==", userId)
      .get();

    if (snapshot.empty) {
      // If no cart exists, return an empty cart
      return res.json({
        success: true,
        items: [],
        total: 0,
      });
    }

    // Get the cart document
    const cartDoc = snapshot.docs[0];
    const cartData = cartDoc.data();

    // Get cart items with product details
    const cartItemsWithDetails = [];
    let total = 0;

    // If there are items in the cart
    if (cartData.items && cartData.items.length > 0) {
      // Get product details for each item
      for (const item of cartData.items) {
        const productDoc = await db
          .collection("products")
          .doc(item.productId)
          .get();

        if (productDoc.exists) {
          const productData = productDoc.data();
          const itemTotal = item.quantity * productData.price;
          total += itemTotal;

          cartItemsWithDetails.push({
            id: item.id,
            productId: item.productId,
            quantity: item.quantity,
            name: productData.name,
            price: productData.price,
            image: productData.image,
            subtotal: itemTotal,
          });
        }
      }
    }

    res.json({
      success: true,
      id: cartDoc.id,
      items: cartItemsWithDetails,
      total: total,
    });
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({
      success: false,
      message: "Error getting cart",
      error: error.message,
    });
  }
};

// Add a product to the cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id; // From authenticateToken middleware
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Validate product exists
    const productDoc = await db.collection("products").doc(productId).get();
    if (!productDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Find if user has a cart
    const cartSnapshot = await db
      .collection("carts")
      .where("userId", "==", userId)
      .get();

    let cartId;
    let cartItems = [];

    if (cartSnapshot.empty) {
      // Create a new cart if one doesn't exist
      const newCart = {
        userId,
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const newCartRef = await db.collection("carts").add(newCart);
      cartId = newCartRef.id;
    } else {
      // Use existing cart
      const cartDoc = cartSnapshot.docs[0];
      cartId = cartDoc.id;
      cartItems = cartDoc.data().items || [];
    }

    // Generate a unique ID for the cart item
    const itemId = `${productId}_${Date.now()}`;

    // Check if product already exists in cart
    const existingItemIndex = cartItems.findIndex(
      (item) => item.productId === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity if product already in cart
      cartItems[existingItemIndex].quantity += quantity;
    } else {
      // Add new item if product not in cart
      cartItems.push({
        id: itemId,
        productId,
        quantity,
      });
    }

    // Update the cart in the database
    await db.collection("carts").doc(cartId).update({
      items: cartItems,
      updatedAt: new Date(),
    });

    // Get product details for response
    const productData = productDoc.data();

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      item: {
        id: itemId,
        productId,
        quantity,
        name: productData.name,
        price: productData.price,
        image: productData.image,
      },
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      success: false,
      message: "Error adding to cart",
      error: error.message,
    });
  }
};

// Update the quantity of an item in the cart
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id; // From authenticateToken middleware
    const { id } = req.params; // Cart item ID
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    // Find user's cart
    const cartSnapshot = await db
      .collection("carts")
      .where("userId", "==", userId)
      .get();

    if (cartSnapshot.empty) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const cartDoc = cartSnapshot.docs[0];
    const cartData = cartDoc.data();
    const cartItems = cartData.items || [];

    // Find the item to update
    const itemIndex = cartItems.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    // Update the quantity
    cartItems[itemIndex].quantity = quantity;

    // Update the cart in the database
    await db.collection("carts").doc(cartDoc.id).update({
      items: cartItems,
      updatedAt: new Date(),
    });

    // Get product details for response
    const productId = cartItems[itemIndex].productId;
    const productDoc = await db.collection("products").doc(productId).get();
    const productData = productDoc.data();

    res.json({
      success: true,
      message: "Cart item updated",
      item: {
        id,
        productId,
        quantity,
        name: productData.name,
        price: productData.price,
        image: productData.image,
        subtotal: quantity * productData.price,
      },
    });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({
      success: false,
      message: "Error updating cart item",
      error: error.message,
    });
  }
};

// Remove an item from the cart
const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id; // From authenticateToken middleware
    const { id } = req.params; // Cart item ID

    // Find user's cart
    const cartSnapshot = await db
      .collection("carts")
      .where("userId", "==", userId)
      .get();

    if (cartSnapshot.empty) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const cartDoc = cartSnapshot.docs[0];
    const cartData = cartDoc.data();
    const cartItems = cartData.items || [];

    // Find the item to remove
    const itemIndex = cartItems.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    // Store item info for response
    const removedItem = cartItems[itemIndex];

    // Remove the item
    cartItems.splice(itemIndex, 1);

    // Update the cart in the database
    await db.collection("carts").doc(cartDoc.id).update({
      items: cartItems,
      updatedAt: new Date(),
    });

    res.json({
      success: true,
      message: "Item removed from cart",
      itemId: id,
      productId: removedItem.productId,
    });
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({
      success: false,
      message: "Error removing cart item",
      error: error.message,
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
};
