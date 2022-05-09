const admin = require("../config");
const dotenv = require("dotenv");
const db = admin.firestore();

const anyEvent = async (req, res, next) => {
    const dataEvent = {};
    const event = await db.collection("event");
    const eventDoc = await event.get();
    eventDoc.forEach(doc => {
        dataEvent["coupons"] = doc.id;
        dataEvent["details"] = doc.data();
        console.log(doc.id);
    });
    console.log(dataEvent)
    res.send(dataEvent);
}


const getDetails = async (req, res, next) => {
    try {
        const coupon_details = {}
        const data_coupon = await db.collection("coupons").doc(req.params.coupon).get()
        const user_data_coupon = await db.collection("users").doc(req.params.phone).get();
        const coupon_used = user_data_coupon.data()["coupons_used"];
        console.log(coupon_used);
        console.log(data_coupon);
        if (coupon_used.exists) {
            if (coupon_used.includes(req.params.coupon)) {
                res.send(JSON.stringify({ "success": false, "error": "Coupon Already Used" }))
            } else {
                const date = new Date(data_coupon.data()["valid_till"]);
                const today_date = new Date();
                if (today_date <= date) {
                    if (req.params.amount >= data_coupon.data()["min_amount"]) {

                        const user_orders = await db.collection("users").doc(req.params.phone).collection("orders").get();
                        let counter_order = 0;
                        user_orders.forEach(doc => {
                            counter_order += 1;
                        })

                        if (counter_order > data_coupon.data()["min_orders"]) {
                            if (req.params.coupon == "FIRST11") {
                                if (counter_order == 1) {
                                    if (data_coupon.exists) {
                                        coupon_details["success"] = true;
                                        coupon_details["discount"] = data_coupon.data()["discount"];
                                        coupon_details["discount_type"] = data_coupon.data()["discount_type"];
                                        coupon_details["free_delivery"] = false;
                                        // data_coupon.data()["free_delivery"];
                                        coupon_details["offers"] = data_coupon.data()["offers"];
                                        res.send(coupon_details);
                                    } else {
                                        res.send(JSON.stringify({ "success": false, "error": "Coupon Not Found" }))
                                    }
                                } else {
                                    res.send(JSON.stringify({ "success": false, "error": "Only for new users" }))
                                }
                            } else {
                                if (data_coupon.exists) {
                                    coupon_details["success"] = true;
                                    coupon_details["discount"] = data_coupon.data()["discount"];
                                    coupon_details["discount_type"] = data_coupon.data()["discount_type"];
                                    coupon_details["free_delivery"] = false;
                                    // data_coupon.data()["free_delivery"];
                                    coupon_details["offers"] = data_coupon.data()["offers"];
                                    res.send(coupon_details);
                                } else {
                                    res.send(JSON.stringify({ "success": false, "error": "Coupon Not Found" }))
                                }
                            }
                        } else {
                            res.send(JSON.stringify({ "success": false, "error": `Coupon requires ${data_coupon.data()["min_orders"]} orders to be applied` }))
                        }
                    } else {
                        res.send(JSON.stringify({ "success": false, "error": `Coupon applies on orders above ${parseInt(data_coupon.data()["min_amount"]) - 1} ` }))
                    }
                } else {
                    res.send(JSON.stringify({ "success": false, "error": "Coupon Expired" }))
                }
            }
        }

        else {
            const date = new Date(data_coupon.data()["valid_till"]);
            const today_date = new Date();
            if (today_date <= date) {
                if (req.params.amount >= data_coupon.data()["min_amount"]) {

                    const user_orders = await db.collection("users").doc(req.params.phone).collection("orders").get();
                    let counter_order = 0;
                    user_orders.forEach(doc => {
                        counter_order += 1;
                    })

                    if (counter_order > data_coupon.data()["min_orders"]) {
                        if (req.params.coupon == "FIRST11") {
                            if (counter_order == 1) {
                                if (data_coupon.exists) {
                                    coupon_details["success"] = true;
                                    coupon_details["discount"] = data_coupon.data()["discount"];
                                    coupon_details["discount_type"] = data_coupon.data()["discount_type"];
                                    coupon_details["free_delivery"] = false;
                                    // data_coupon.data()["free_delivery"];
                                    coupon_details["offers"] = data_coupon.data()["offers"];
                                    res.send(coupon_details);
                                } else {
                                    res.send(JSON.stringify({ "success": false, "error": "Coupon Not Found" }))
                                }
                            } else {
                                res.send(JSON.stringify({ "success": false, "error": "Only for new users" }))
                            }
                        } else {
                            if (data_coupon.exists) {
                                coupon_details["success"] = true;
                                coupon_details["discount"] = data_coupon.data()["discount"];
                                coupon_details["discount_type"] = data_coupon.data()["discount_type"];
                                coupon_details["free_delivery"] = false;
                                // data_coupon.data()["free_delivery"];
                                coupon_details["offers"] = data_coupon.data()["offers"];
                                res.send(coupon_details);
                            } else {
                                res.send(JSON.stringify({ "success": false, "error": "Coupon Not Found" }))
                            }
                        }
                    } else {
                        res.send(JSON.stringify({ "success": false, "error": `Coupon requires ${data_coupon.data()["min_orders"]} orders to be applied` }))
                    }
                } else {
                    res.send(JSON.stringify({ "success": false, "error": `Coupon applies on orders above ${parseInt(data_coupon.data()["min_amount"]) - 1} ` }))
                }
            } else {
                res.send(JSON.stringify({ "success": false, "error": "Coupon Expired" }))
            }
        }



    } catch (error) {
        console.log(error);
        res.send(JSON.stringify({ "success": false, "error": "Coupon Not Found" }))
    }
}

module.exports = { anyEvent, getDetails }