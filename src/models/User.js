class User {
  constructor({
    username,
    password,
    email = "",
    fullName = "",
    role = "user",
    status = "active",
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString(),
  }) {
    this.username = username;
    this.password = password;
    this.email = email;
    this.fullName = fullName;
    this.role = role;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toFirestore() {
    return {
      username: this.username,
      password: this.password,
      email: this.email,
      fullName: this.fullName,
      role: this.role,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new User({
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
  }
}

module.exports = User;
