const admin = require("../config");
const axios = require("axios");
// const dotenv = require("dotenv");
console.log(process.env.RZR_API);
const Razorpay = require("razorpay");
  // key_secret:process.env.RZR_KEY

const razorPayInstance= new Razorpay({
  key_id:"rzp_live_iJdPgCOlowRTfJ",
  key_secret:"gzAd4EqjEOLq6QeRK2ZLuatE"
  // key_id:process.env.RZR_API,
});

const createOrder = async (req,res,next) => {
  let options = {
    amount : req.body.amount,
    currency: "INR",
    receipt: "order_rcptid#11",
  }
  razorPayInstance.orders.create(options, (err, order) => {
    if (!err){
      console.log(order);
      res.json(order);
    } else {
      console.log(err)
      res.send(err)
    }
  });
}

module.exports = {
  createOrder
}
