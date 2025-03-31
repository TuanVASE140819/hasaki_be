class InventoryTransaction {
  constructor(data) {
    this.id = data.id;
    this.productId = data.productId;
    this.type = data.type; // import, export, adjust
    this.quantity = data.quantity;
    this.previousStock = data.previousStock;
    this.currentStock = data.currentStock;
    this.note = data.note;
    this.createdBy = data.createdBy; // userId
    this.createdAt = data.createdAt || new Date();
  }

  toFirestore() {
    return {
      productId: this.productId,
      type: this.type,
      quantity: this.quantity,
      previousStock: this.previousStock,
      currentStock: this.currentStock,
      note: this.note,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
    };
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new InventoryTransaction({
      id: doc.id,
      ...data,
    });
  }
}

class Inventory {
  constructor(data) {
    this.id = data.id;
    this.productId = data.productId;
    this.stock = data.stock || 0;
    this.minStock = data.minStock || 0;
    this.maxStock = data.maxStock;
    this.status = data.status || "active"; // active, inactive
    this.lastUpdated = data.lastUpdated || new Date();
  }

  toFirestore() {
    return {
      productId: this.productId,
      stock: this.stock,
      minStock: this.minStock,
      maxStock: this.maxStock,
      status: this.status,
      lastUpdated: this.lastUpdated,
    };
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new Inventory({
      id: doc.id,
      ...data,
    });
  }

  // Kiểm tra có thể xuất kho không
  canExport(quantity) {
    return this.stock >= quantity;
  }

  // Kiểm tra có thể nhập kho không
  canImport(quantity) {
    if (!this.maxStock) return true;
    return this.stock + quantity <= this.maxStock;
  }

  // Kiểm tra tồn kho tối thiểu
  isLowStock() {
    return this.stock <= this.minStock;
  }

  // Cập nhật số lượng tồn kho
  updateStock(quantity, type) {
    const previousStock = this.stock;

    if (type === "import") {
      this.stock += quantity;
    } else if (type === "export") {
      this.stock -= quantity;
    } else {
      this.stock = quantity;
    }

    this.lastUpdated = new Date();

    return {
      previousStock,
      currentStock: this.stock,
    };
  }
}

module.exports = { Inventory, InventoryTransaction };
