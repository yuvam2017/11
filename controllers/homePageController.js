const admin = require("../config");
// loadBanner
const db = admin.firestore()
// const getAuth = admin.auth();
const loadBanner = async (req, res, next) => {
  try {
    const ui = await db.collection("ui");
    const homepage = await ui.doc("home_page_images");
    const data = await homepage.get();
    console.log(data.data());
    res.send(data.data());
  } catch (error) {
    console.log(error);
    res.send(error);
  }
}

const getClient = async (req,res,next) => {
  res.send(process.env.CLIENT_KEY);
}
 


module.exports = { loadBanner ,getClient}
