class OrderItem {
  constructor(data) {
    this.productId = data.productId;
    this.quantity = data.quantity;
    this.price = data.price;
    this.name = data.name;
    this.image = data.image;
    this.subtotal = data.price * data.quantity;
  }

  toFirestore() {
    return {
      productId: this.productId,
      quantity: this.quantity,
      price: this.price,
      name: this.name,
      image: this.image,
      subtotal: this.subtotal,
    };
  }
}

class Order {
  constructor(data) {
    this.id = data.id;
    this.userId = data.userId;
    this.items = (data.items || []).map((item) => new OrderItem(item));
    this.status = data.status || "pending"; // pending, confirmed, shipping, delivered, cancelled
    this.totalAmount = data.totalAmount || 0;
    this.shippingAddress = data.shippingAddress;
    this.shippingFee = data.shippingFee || 0;
    this.paymentMethod = data.paymentMethod;
    this.paymentStatus = data.paymentStatus || "pending"; // pending, paid, failed
    this.note = data.note;
    this.trackingNumber = data.trackingNumber;
    this.estimatedDeliveryDate = data.estimatedDeliveryDate;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  toFirestore() {
    return {
      userId: this.userId,
      items: this.items.map((item) => item.toFirestore()),
      status: this.status,
      totalAmount: this.totalAmount,
      shippingAddress: this.shippingAddress,
      shippingFee: this.shippingFee,
      paymentMethod: this.paymentMethod,
      paymentStatus: this.paymentStatus,
      note: this.note,
      trackingNumber: this.trackingNumber,
      estimatedDeliveryDate: this.estimatedDeliveryDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new Order({
      id: doc.id,
      ...data,
    });
  }

  // Tính tổng tiền đơn hàng
  calculateTotal() {
    const itemsTotal = this.items.reduce((total, item) => {
      return total + item.subtotal;
    }, 0);
    this.totalAmount = itemsTotal + this.shippingFee;
    return this.totalAmount;
  }

  // Cập nhật trạng thái đơn hàng
  updateStatus(status) {
    const validStatuses = [
      "pending",
      "confirmed",
      "shipping",
      "delivered",
      "cancelled",
    ];
    if (validStatuses.includes(status)) {
      this.status = status;
      this.updatedAt = new Date();
    }
  }

  // Cập nhật trạng thái thanh toán
  updatePaymentStatus(status) {
    const validStatuses = ["pending", "paid", "failed"];
    if (validStatuses.includes(status)) {
      this.paymentStatus = status;
      this.updatedAt = new Date();
    }
  }
}

module.exports = { Order, OrderItem };
