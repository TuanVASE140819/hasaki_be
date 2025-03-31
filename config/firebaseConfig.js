const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// Khởi tạo Firebase Admin SDK với service account
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "hasaki-ebfd2",
  storageBucket: "hasaki-ebfd2.firebasestorage.app",
});

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

module.exports = { admin, db, auth, storage };
