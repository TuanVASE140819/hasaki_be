const {
  db,
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} = require("../config/firebaseConfig");

// Lấy danh sách categories
const getCategories = async (req, res) => {
  try {
    const categoriesCol = collection(db, "categories");
    const categorySnapshot = await getDocs(categoriesCol);
    const categoryList = categorySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(categoryList);
  } catch (error) {
    console.error("Error getting categories:", error);
    res.status(500).json({ error: error.message });
  }
};

// Thêm category mới
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const categoriesCol = collection(db, "categories");
    const docRef = await addDoc(categoriesCol, {
      name,
      description,
      createdAt: new Date().toISOString(),
    });
    res.status(201).json({
      id: docRef.id,
      name,
      description,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const categoryRef = doc(db, "categories", id);
    await updateDoc(categoryRef, {
      name,
      description,
      updatedAt: new Date().toISOString(),
    });
    res.json({ message: "Category updated successfully" });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: error.message });
  }
};

// Xóa category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryRef = doc(db, "categories", id);
    await deleteDoc(categoryRef);
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
