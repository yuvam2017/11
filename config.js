const admin = require("firebase-admin");
const serviceAccount = require("./.admin/fashion-e-commerce-8a71f-firebase-adminsdk-meyaa-e91d743daa.json")
admin.initializeApp({
    credential : admin.credential.cert(serviceAccount)
});
module.exports = admin;
