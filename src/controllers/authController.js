const {
  db,
  collection,
  getDocs,
  addDoc,
  query,
  where,
} = require("../config/firebaseConfig");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Cấu hình email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Tạo token xác thực email
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Gửi email xác thực
const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Xác thực tài khoản",
    html: `
      <h1>Xác thực tài khoản</h1>
      <p>Vui lòng click vào link bên dưới để xác thực tài khoản của bạn:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>Link này sẽ hết hạn sau 24 giờ.</p>
      <p>Nếu bạn không yêu cầu tạo tài khoản, vui lòng bỏ qua email này.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Đăng ký tài khoản mới
const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "Vui lòng nhập đầy đủ username và password",
      });
    }

    // Kiểm tra username đã tồn tại
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return res.status(400).json({
        success: false,
        error: "Username đã được sử dụng",
      });
    }

    // Hash mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo user mới
    const user = new User({
      username,
      password: hashedPassword,
      role: "user",
      status: "active",
    });

    // Lưu vào database
    const docRef = await addDoc(collection(db, "users"), user.toFirestore());

    // Tạo JWT token
    const token = jwt.sign(
      {
        id: docRef.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      data: {
        token,
        user: {
          id: docRef.id,
          username: user.username,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    res.status(500).json({
      success: false,
      error: "Đã có lỗi xảy ra khi đăng ký tài khoản",
    });
  }
};

// Đăng nhập
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "Vui lòng nhập đầy đủ username và password",
      });
    }

    // Tìm user theo username
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(401).json({
        success: false,
        error: "Username hoặc mật khẩu không đúng",
      });
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Username hoặc mật khẩu không đúng",
      });
    }

    // Tạo JWT token
    const token = jwt.sign(
      {
        id: userDoc.id,
        username: userData.username,
        role: userData.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      message: "Đăng nhập thành công",
      data: {
        token,
        user: {
          id: userDoc.id,
          username: userData.username,
          role: userData.role,
        },
      },
    });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    res.status(500).json({
      success: false,
      error: "Đã có lỗi xảy ra khi đăng nhập",
    });
  }
};

// Quên mật khẩu
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Tìm user
    const usersSnapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (usersSnapshot.empty) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy tài khoản",
      });
    }

    const userDoc = usersSnapshot.docs[0];
    const user = User.fromFirestore(userDoc);

    // Tạo token reset password
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1);

    // Cập nhật token
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;

    await userDoc.ref.update(user.toFirestore());

    // Gửi email reset password
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Đặt lại mật khẩu",
      html: `
        <h1>Đặt lại mật khẩu</h1>
        <p>Vui lòng click vào link bên dưới để đặt lại mật khẩu:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Link này sẽ hết hạn sau 1 giờ.</p>
        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Đã gửi email hướng dẫn đặt lại mật khẩu",
    });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Đặt lại mật khẩu
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Tìm user với token reset password
    const usersSnapshot = await db
      .collection("users")
      .where("resetPasswordToken", "==", token)
      .where("resetPasswordExpires", ">", new Date())
      .get();

    if (usersSnapshot.empty) {
      return res.status(400).json({
        success: false,
        error: "Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn",
      });
    }

    const userDoc = usersSnapshot.docs[0];
    const user = User.fromFirestore(userDoc);

    // Mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Cập nhật mật khẩu
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await userDoc.ref.update(user.toFirestore());

    res.json({
      success: true,
      message: "Đặt lại mật khẩu thành công",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};
