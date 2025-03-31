class Review {
  constructor(data) {
    this.id = data.id;
    this.userId = data.userId;
    this.productId = data.productId;
    this.orderId = data.orderId;
    this.rating = data.rating; // 1-5
    this.comment = data.comment;
    this.images = data.images || [];
    this.likes = data.likes || 0;
    this.status = data.status || "active"; // active, hidden, deleted
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  toFirestore() {
    return {
      userId: this.userId,
      productId: this.productId,
      orderId: this.orderId,
      rating: this.rating,
      comment: this.comment,
      images: this.images,
      likes: this.likes,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new Review({
      id: doc.id,
      ...data,
    });
  }

  // Kiểm tra rating hợp lệ
  static isValidRating(rating) {
    return Number.isInteger(rating) && rating >= 1 && rating <= 5;
  }

  // Thêm lượt thích
  addLike() {
    this.likes += 1;
    this.updatedAt = new Date();
  }

  // Bỏ lượt thích
  removeLike() {
    if (this.likes > 0) {
      this.likes -= 1;
      this.updatedAt = new Date();
    }
  }
}

module.exports = Review;
