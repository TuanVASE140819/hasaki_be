const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json"); // File JSON tải từ Firebase

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
module.exports = db;
