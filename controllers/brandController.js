const db = require("../config/firebaseConfig");

// Thêm nhãn hàng
const addBrand = async (req, res) => {
  try {
    const { name, country, logo, description, website, foundedYear } = req.body;

    // Validate required fields
    const missingFields = [];
    if (!name) missingFields.push("name");
    if (!country) missingFields.push("country");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Thiếu dữ liệu đầu vào: ${missingFields.join(", ")}`,
      });
    }

    // Create brand object
    const timestamp = new Date();
    const brandData = {
      name,
      country,
      logo: logo || null,
      description: description || "",
      website: website || null,
      foundedYear: foundedYear || null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const docRef = await db.collection("brands").add(brandData);

    res.status(201).json({
      success: true,
      id: docRef.id,
      message: "Nhãn hàng đã được tạo thành công",
    });
  } catch (error) {
    console.error("Error adding brand:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Lấy danh sách nhãn hàng
const getBrands = async (req, res) => {
  try {
    const snapshot = await db.collection("brands").get();
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (error) {
    console.error("Error getting brands:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Lấy chi tiết 1 nhãn hàng
const getBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection("brands").doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy nhãn hàng",
      });
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Error getting brand:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Cập nhật nhãn hàng
const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedAt: new Date(),
    };

    // Check if brand exists
    const doc = await db.collection("brands").doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy nhãn hàng",
      });
    }

    await db.collection("brands").doc(id).update(updateData);

    res.json({
      success: true,
      message: "Nhãn hàng đã được cập nhật",
    });
  } catch (error) {
    console.error("Error updating brand:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Xóa nhãn hàng
const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if brand exists
    const doc = await db.collection("brands").doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy nhãn hàng",
      });
    }

    await db.collection("brands").doc(id).delete();

    res.json({
      success: true,
      message: "Nhãn hàng đã được xóa",
    });
  } catch (error) {
    console.error("Error deleting brand:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  addBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
};
