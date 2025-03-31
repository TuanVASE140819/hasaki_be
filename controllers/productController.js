const db = require("../config/firebaseConfig");

// Hàm thêm sản phẩm mới
const addProduct = async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const {
      name,
      image,
      price,
      priceRange,
      duration,
      subscriptionPlan,
      purchased,
      reviewCount,
      salesCount,
      warranty,
      rating,
      shortDescription,
      productDetails,
      categories,
    } = req.body;

    // More detailed validation
    const missingFields = [];
    if (!name) missingFields.push("name");
    if (!image) missingFields.push("image");
    if (!price && !priceRange) missingFields.push("price hoặc priceRange");
    if (!categories) missingFields.push("categories");

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Thiếu dữ liệu đầu vào: ${missingFields.join(", ")}`,
      });
    }

    // Ensure price is a number
    let numPrice = null;
    if (price) {
      numPrice = Number(price);
      if (isNaN(numPrice)) {
        return res.status(400).json({ message: "Price phải là số" });
      }
    }

    // Ensure categories is an array
    if (!Array.isArray(categories)) {
      return res.status(400).json({ message: "Categories phải là mảng" });
    }

    const timestamp = new Date();

    const newProduct = {
      name,
      image,
      price: numPrice,
      priceRange: priceRange || null,
      duration: duration || null, // 3 tháng, 6 tháng, 12 tháng
      subscriptionPlan: subscriptionPlan || null,
      purchased: purchased || 0,
      reviewCount: reviewCount || 0,
      salesCount: salesCount || 0,
      warranty: warranty || null,
      rating: rating || 0,
      shortDescription: shortDescription || "",
      productDetails: productDetails || "",
      categories,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const docRef = await db.collection("products").add(newProduct);

    // Sử dụng status code 201 cho việc tạo thành công một tài nguyên mới
    res.status(201).json({
      id: docRef.id,
      ...newProduct,
      message: "Sản phẩm đã được thêm thành công",
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({
      message: "Lỗi server!",
      error: error.message,
      stack: error.stack,
    });
  }
};

// Hàm cập nhật thông tin của 1 sản phẩm
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra nếu sản phẩm tồn tại
    const productDoc = await db.collection("products").doc(id).get();
    if (!productDoc.exists) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date(),
    };

    // Đảm bảo price là số nếu được cung cấp
    if (updateData.price) {
      const numPrice = Number(updateData.price);
      if (isNaN(numPrice)) {
        return res.status(400).json({ message: "Price phải là số" });
      }
      updateData.price = numPrice;
    }

    // Đảm bảo categories là mảng nếu được cung cấp
    if (updateData.categories && !Array.isArray(updateData.categories)) {
      return res.status(400).json({ message: "Categories phải là mảng" });
    }

    await db.collection("products").doc(id).update(updateData);

    // Lấy dữ liệu mới sau khi cập nhật
    const updatedDoc = await db.collection("products").doc(id).get();

    res.json({
      message: "Sản phẩm đã được cập nhật",
      data: {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      },
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      message: "Lỗi server!",
      error: error.message,
    });
  }
};

// Hàm lấy danh sách tất cả sản phẩm
const getProducts = async (req, res) => {
  try {
    const snapshot = await db.collection("products").get();
    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(products);
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({
      message: "Lỗi server!",
      error: error.message,
    });
  }
};

// Hàm lấy thông tin chi tiết của 1 sản phẩm
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection("products").doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Error getting product detail:", error);
    res.status(500).json({
      message: "Lỗi server!",
      error: error.message,
    });
  }
};

// Hàm xóa 1 sản phẩm
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    // Kiểm tra sản phẩm có tồn tại không
    const doc = await db.collection("products").doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    await db.collection("products").doc(id).delete();
    res.json({ message: "Sản phẩm đã được xóa thành công" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      message: "Lỗi server!",
      error: error.message,
    });
  }
};

// Hàm lấy sản phẩm bán chạy
const getPopularProducts = async (req, res) => {
  try {
    // Số lượng sản phẩm muốn lấy, mặc định là 10
    const limit = parseInt(req.query.limit) || 10;

    // Lấy sản phẩm và sắp xếp theo salesCount giảm dần
    const snapshot = await db
      .collection("products")
      .orderBy("salesCount", "desc")
      .limit(limit)
      .get();

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(products);
  } catch (error) {
    console.error("Error getting popular products:", error);
    res.status(500).json({
      message: "Lỗi server!",
      error: error.message,
    });
  }
};

// Hàm lấy sản phẩm mới
const getNewProducts = async (req, res) => {
  try {
    // Số lượng sản phẩm muốn lấy, mặc định là 10
    const limit = parseInt(req.query.limit) || 10;

    // Lấy sản phẩm và sắp xếp theo thời gian tạo mới nhất
    const snapshot = await db
      .collection("products")
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(products);
  } catch (error) {
    console.error("Error getting new products:", error);
    res.status(500).json({
      message: "Lỗi server!",
      error: error.message,
    });
  }
};

// Hàm tìm kiếm sản phẩm
const searchProducts = async (req, res) => {
  try {
    const {
      query, // search text
      category, // category id
      brand, // brand id
      minPrice, // minimum price
      maxPrice, // maximum price
      sortBy = "popularity", // popularity, newest, priceAsc, priceDesc
      limit = 10, // số lượng kết quả trả về
    } = req.query;

    let productsRef = db.collection("products");

    // Build the query based on criteria
    if (query) {
      // Using Firebase's compound queries - create a composite index in Firebase if needed
      productsRef = productsRef
        .where("name", ">=", query)
        .where("name", "<=", query + "\uf8ff");
    }

    if (category) {
      productsRef = productsRef.where("categories", "array-contains", category);
    }

    if (brand) {
      productsRef = productsRef.where("brand", "==", brand);
    }

    // Get all results first as Firestore doesn't support multiple range filters
    let snapshot = await productsRef.get();
    let products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Apply price filters in memory
    if (minPrice) {
      const min = parseFloat(minPrice);
      products = products.filter((product) => product.price >= min);
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice);
      products = products.filter((product) => product.price <= max);
    }

    // Apply sorting
    switch (sortBy) {
      case "popularity":
        products.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
        break;
      case "newest":
        products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "priceAsc":
        products.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        products.sort((a, b) => b.price - a.price);
        break;
    }

    // Apply limit
    products = products.slice(0, parseInt(limit));

    res.json({
      total: products.length,
      products,
    });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({
      message: "Lỗi server!",
      error: error.message,
    });
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getPopularProducts,
  getNewProducts,
  searchProducts, // Added searchProducts function to exports
};
