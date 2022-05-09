const admin = require("../config");
const axios = require("axios");
const dotenv = require("dotenv");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
dotenv.config();

const db = admin.firestore();

const checkPincode = async (req, res, next) => {
    console.log(req.params.pincode);

    const options = {
        method: "GET",
        url: `https://track.delhivery.com/c/api/pin-codes/json/?filter_codes=${req.params.pincode}`,
        headers: {
            Accept: "application/json",
            Authorization: `Token ${process.env.DL_API}`,
            "Content-Type": "application/json",
        },
    };

    axios
        .request(options)
        .then(function (response) {
            console.log(response.data);
            res.send(response.data);
        })
        .catch(function (error) {
            console.error(error);
        });
};

const findCharges = async (req, res, next) => {
    try {
        
        const options = {
            method: "GET",
            url: `https://track.delhivery.com/api/kinko/v1/invoice/charges/.json?md=S&cgm=400&o_pin=277001&d_pin=${req.params.pincode}&ss=DTO`,
            headers: {
                Accept: "application/json",
                Authorization: `Token ${process.env.DL_API}`,
                "Content-Type": "application/json",
            },
        };
    
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
                res.send(response.data);
            })
            .catch(function (error) {
                console.error(error);
                // res.send(error);
            });
    } catch (error) {
        console.log(error)
        res.send(error)
    }
};

const wayBillGenerate = async (req, res, next) => {
    const options = {
        method: "GET",
        url: `https://track.delhivery.com/waybill/api/bulk/json/?token=${process.env.DL_API}&client_name=${req.params.name}&count=1`,
        headers: { Accept: "application/json" },
    };

    axios
        .request(options)
        .then(function (response) {
            body_send = {
                waybillnumber: response.data,
                api: process.env.DL_API,
            };
            console.log(body_send)
            res.send(body_send);
        })
        .catch(function (error) {
            console.error(error);
        });
};

const createOrder = async (req, res, next) => {
    const data_new = JSON.stringify(req.body);

    var xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        "https://track.delhivery.com/api/cmu/create.json",
        true
    );
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("Authorization", `Token ${process.env.DL_API}`);
    xhr.onload = function () {
        // do something to response
        console.log(
            "after all jobs done",
            this.responseText,
            typeof this.responseText
        );
        res.send(this.responseText);
    };
    xhr.send("format=json&data=" + data_new);
};

const reduceStock = async (req,res,next) => {
    let item_pro = JSON.parse(req.body);
    // Object.keys(item_pro).map(pid => {
    //     let pidsize = item_pro[pid]["pidSize"];
    //     let pidquantity = item_pro[pid]["pidQuantity"];
    //     const data = await db.collection("products").doc(pid).get();
    //     let PreviousStock = data["stock"];
    //     PreviousStock[pidSize] = (parseInt(PreviousStock[pidsize])-1);
    //     // const new_data = await db.collection("products").doc(pid).set({})
    // })
    res.send("sample")
}


module.exports = {checkPincode,findCharges,wayBillGenerate,createOrder,reduceStock}
