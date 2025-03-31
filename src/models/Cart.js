class CartItem {
  constructor(data) {
    this.productId = data.productId;
    this.quantity = data.quantity || 1;
    this.price = data.price;
    this.name = data.name;
    this.image = data.image;
  }

  toFirestore() {
    return {
      productId: this.productId,
      quantity: this.quantity,
      price: this.price,
      name: this.name,
      image: this.image,
    };
  }
}

class Cart {
  constructor(data) {
    this.id = data.id;
    this.userId = data.userId;
    this.items = (data.items || []).map((item) => new CartItem(item));
    this.totalAmount = data.totalAmount || 0;
    this.updatedAt = data.updatedAt || new Date();
  }

  toFirestore() {
    return {
      userId: this.userId,
      items: this.items.map((item) => item.toFirestore()),
      totalAmount: this.totalAmount,
      updatedAt: this.updatedAt,
    };
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new Cart({
      id: doc.id,
      ...data,
    });
  }

  // Tính tổng tiền giỏ hàng
  calculateTotal() {
    this.totalAmount = this.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
    return this.totalAmount;
  }

  // Thêm sản phẩm vào giỏ
  addItem(product, quantity = 1) {
    const existingItem = this.items.find(
      (item) => item.productId === product.id
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push(
        new CartItem({
          productId: product.id,
          quantity: quantity,
          price: product.price,
          name: product.name,
          image: product.images[0],
        })
      );
    }

    this.calculateTotal();
    this.updatedAt = new Date();
  }

  // Cập nhật số lượng sản phẩm
  updateItemQuantity(productId, quantity) {
    const item = this.items.find((item) => item.productId === productId);
    if (item) {
      item.quantity = quantity;
      this.calculateTotal();
      this.updatedAt = new Date();
    }
  }

  // Xóa sản phẩm khỏi giỏ
  removeItem(productId) {
    this.items = this.items.filter((item) => item.productId !== productId);
    this.calculateTotal();
    this.updatedAt = new Date();
  }

  // Xóa toàn bộ giỏ hàng
  clear() {
    this.items = [];
    this.totalAmount = 0;
    this.updatedAt = new Date();
  }
}

module.exports = { Cart, CartItem };
