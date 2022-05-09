const db = require("../config");
const router = require("express").Router();
const CopuponController = require("../controllers/couponController");

router.get("/events",CopuponController.anyEvent);

router.get("/:coupon/:phone/:amount",CopuponController.getDetails)

module.exports  = router;
