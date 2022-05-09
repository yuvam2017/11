const router = require("express").Router();
const axios = require("axios");
const path = require("path");
const PaymentController = require("../controllers/paymentController")

router.get("/", (req, res, next) => {
    res.sendFile(path.join(__basedir, 'views', 'payment.html'))
});

router.post("/order",PaymentController.createOrder)

router.post("/check-order-complete",(req,res,next) => {
    console.log(req.body.razorpay_payment_id);
    res.send(JSON.stringify({"success":true}));
    console.log("Done with payment");
})

module.exports = router;
