class Product {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.price = data.price;
    this.categoryId = data.categoryId;
    this.images = data.images || [];
    this.brand = data.brand;
    this.stock = data.stock || 0;
    this.status = data.status || "active";
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  toFirestore() {
    return {
      name: this.name,
      description: this.description,
      price: this.price,
      categoryId: this.categoryId,
      images: this.images,
      brand: this.brand,
      stock: this.stock,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new Product({
      id: doc.id,
      ...data,
    });
  }
}

module.exports = Product;
