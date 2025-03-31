const db = require("../config/firebaseConfig");

// Thêm danh mục
const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const docRef = await db.collection("categories").add({ name, description });
    res.json({ success: true, id: docRef.id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Lấy danh sách danh mục
const getCategories = async (req, res) => {
  try {
    const snapshot = await db.collection("categories").get();
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Cập nhật danh mục
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    await db.collection("categories").doc(id).update({ name, description });
    res.json({ success: true, message: "Danh mục đã được cập nhật" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Xóa danh mục
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("categories").doc(id).delete();
    res.json({ success: true, message: "Danh mục đã được xóa" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
