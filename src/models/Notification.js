class Notification {
  constructor(data) {
    this.id = data.id;
    this.userId = data.userId;
    this.title = data.title;
    this.message = data.message;
    this.type = data.type; // order, promotion, system
    this.referenceId = data.referenceId; // ID của đơn hàng, khuyến mãi, etc.
    this.isRead = data.isRead || false;
    this.status = data.status || "active"; // active, deleted
    this.createdAt = data.createdAt || new Date();
  }

  toFirestore() {
    return {
      userId: this.userId,
      title: this.title,
      message: this.message,
      type: this.type,
      referenceId: this.referenceId,
      isRead: this.isRead,
      status: this.status,
      createdAt: this.createdAt,
    };
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new Notification({
      id: doc.id,
      ...data,
    });
  }

  // Đánh dấu là đã đọc
  markAsRead() {
    this.isRead = true;
  }

  // Đánh dấu là chưa đọc
  markAsUnread() {
    this.isRead = false;
  }

  // Xóa thông báo
  delete() {
    this.status = "deleted";
  }
}

module.exports = Notification;
