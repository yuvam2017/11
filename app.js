const express = require('express');
const path = require('path');
const app = express();
const port = 5000;

// router import
const routerHome = require("./routes/routerHome");
const routerDelhivery = require("./routes/routerDelhivery");
const routerCoupon = require("./routes/routerCoupon");
const routerPayment = require("./routes/routerPayment");

// Basic Uses
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
global.__basedir = __dirname;

// Routers
app.use("/",routerHome);
app.use("/delivery",routerDelhivery);
app.use("/coupons",routerCoupon);
app.use("/payment",routerPayment);


// 404 Error
app.use((req,res,next)=> res.status(404).send("<h2>Page Not Found</h2>"))

// Listening on PORT
app.listen(port, () => console.log(`11thing app listening on port ${port}!`))

