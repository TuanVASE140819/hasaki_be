const { db } = require("../config/firebaseConfig");
const Review = require("../models/Review");
const { Order } = require("../models/Order");

// Tạo đánh giá mới
const createReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, orderId, rating, comment, images = [] } = req.body;

    // Kiểm tra rating hợp lệ
    if (!Review.isValidRating(rating)) {
      return res.status(400).json({
        success: false,
        error: "Đánh giá phải từ 1-5 sao",
      });
    }

    // Kiểm tra đơn hàng tồn tại và thuộc về user
    const orderDoc = await db.collection("orders").doc(orderId).get();
    if (!orderDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Đơn hàng không tồn tại",
      });
    }

    const order = Order.fromFirestore(orderDoc);
    if (order.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: "Không có quyền đánh giá đơn hàng này",
      });
    }

    // Kiểm tra đơn hàng đã hoàn thành
    if (order.status !== "delivered") {
      return res.status(400).json({
        success: false,
        error: "Chỉ có thể đánh giá đơn hàng đã hoàn thành",
      });
    }

    // Kiểm tra sản phẩm có trong đơn hàng
    const hasProduct = order.items.some((item) => item.productId === productId);
    if (!hasProduct) {
      return res.status(400).json({
        success: false,
        error: "Sản phẩm không có trong đơn hàng",
      });
    }

    // Kiểm tra đã đánh giá chưa
    const existingReview = await db
      .collection("reviews")
      .where("userId", "==", userId)
      .where("productId", "==", productId)
      .where("orderId", "==", orderId)
      .get();

    if (!existingReview.empty) {
      return res.status(400).json({
        success: false,
        error: "Bạn đã đánh giá sản phẩm này",
      });
    }

    // Tạo đánh giá mới
    const review = new Review({
      userId,
      productId,
      orderId,
      rating,
      comment,
      images,
    });

    const reviewRef = await db.collection("reviews").add(review.toFirestore());
    const newReview = await reviewRef.get();

    res.status(201).json({
      success: true,
      data: Review.fromFirestore(newReview),
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Lấy danh sách đánh giá của sản phẩm
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, rating } = req.query;

    let query = db
      .collection("reviews")
      .where("productId", "==", productId)
      .where("status", "==", "active");

    if (rating) {
      query = query.where("rating", "==", parseInt(rating));
    }

    // Lấy tổng số đánh giá
    const totalSnapshot = await query.count().get();
    const total = totalSnapshot.data().count;

    // Phân trang
    const startAt = (page - 1) * limit;
    const reviewsSnapshot = await query
      .orderBy("createdAt", "desc")
      .limit(parseInt(limit))
      .startAt(startAt)
      .get();

    const reviews = reviewsSnapshot.docs.map((doc) =>
      Review.fromFirestore(doc)
    );

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error getting product reviews:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Cập nhật đánh giá
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { rating, comment, images } = req.body;

    const reviewRef = db.collection("reviews").doc(id);
    const reviewDoc = await reviewRef.get();

    if (!reviewDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Đánh giá không tồn tại",
      });
    }

    const review = Review.fromFirestore(reviewDoc);

    // Kiểm tra quyền cập nhật
    if (review.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: "Không có quyền cập nhật đánh giá này",
      });
    }

    // Cập nhật đánh giá
    if (rating) {
      if (!Review.isValidRating(rating)) {
        return res.status(400).json({
          success: false,
          error: "Đánh giá phải từ 1-5 sao",
        });
      }
      review.rating = rating;
    }

    if (comment) review.comment = comment;
    if (images) review.images = images;

    await reviewRef.update(review.toFirestore());

    res.json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Xóa đánh giá
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const reviewRef = db.collection("reviews").doc(id);
    const reviewDoc = await reviewRef.get();

    if (!reviewDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Đánh giá không tồn tại",
      });
    }

    const review = Review.fromFirestore(reviewDoc);

    // Kiểm tra quyền xóa
    if (review.userId !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Không có quyền xóa đánh giá này",
      });
    }

    // Xóa đánh giá
    await reviewRef.delete();

    res.json({
      success: true,
      message: "Đã xóa đánh giá thành công",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Thêm lượt thích cho đánh giá
const likeReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const reviewRef = db.collection("reviews").doc(id);
    const reviewDoc = await reviewRef.get();

    if (!reviewDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Đánh giá không tồn tại",
      });
    }

    const review = Review.fromFirestore(reviewDoc);
    review.addLike();
    await reviewRef.update({
      likes: review.likes,
      updatedAt: review.updatedAt,
    });

    res.json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error("Error liking review:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Bỏ lượt thích đánh giá
const unlikeReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const reviewRef = db.collection("reviews").doc(id);
    const reviewDoc = await reviewRef.get();

    if (!reviewDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "Đánh giá không tồn tại",
      });
    }

    const review = Review.fromFirestore(reviewDoc);
    review.removeLike();
    await reviewRef.update({
      likes: review.likes,
      updatedAt: review.updatedAt,
    });

    res.json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error("Error unliking review:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  likeReview,
  unlikeReview,
};
