const router = require("express").Router();
const axios = require("axios");
const path = require("path");
const DeliveryController = require("../controllers/deliveryController");


router.get("/checkPincode/:pincode/", DeliveryController.checkPincode);

router.get("/charges/:pincode", DeliveryController.findCharges);

router.get("/waybill_generate/:name", DeliveryController.wayBillGenerate);

router.post("/create_order/:waybill", DeliveryController.createOrder);

router.post("/reduce_stock",DeliveryController.reduceStock)

module.exports = router;
