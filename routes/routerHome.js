const express = require("express");
const router = express.Router();
const path = require("path");
const axios = require("axios").default;
const uid = require("uid");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequestconst;
let pid,keyword;


// Controller for Home page
const HomePageUi = require("../controllers/homePageController")


router.get('/', (req, res, next) => {
    res.sendFile(path.join(__basedir, 'views', 'index.html'))
});

router.get("/getClient",HomePageUi.getClient)

router.get('/home/loadBanner', HomePageUi.loadBanner);

router.get("/getpid", (req, res, next) => {
    res.send(pid);
});

router.get("/getkey", (req, res, next) => {
    res.send(keyword);
});

router.get("/search/products", (req, res, next) => {
    console.log(req.query.tag)
    if (req.query.tag == "tshirts") {
        keyword = "shirt";
        res.sendFile(path.join(__basedir, "views", "product.html"));
    } else if (req.query.tag == "tshirt") {
        keyword = "shirt";
        res.sendFile(path.join(__basedir, "views", "product.html"));
    } else if (req.query.tag == "shirts") {
        keyword = "shirt";
        res.sendFile(path.join(__basedir, "views", "product.html"));
    } else {
        keyword = req.query.tag;
        res.sendFile(path.join(__basedir, "views", "product.html"))
    }
});

router.get("/linktree", (req, res, next) => {
    res.sendFile(path.join(__basedir, "views", "linktree.html"))
})

router.get("/myaccount", (req, res, next) => {
    res.sendFile(path.join(__basedir, "views", "myaccount.html"));
});

router.get("/myorders", (req, res, next) => {
    res.sendFile(path.join(__basedir, "views", "orders.html"));
});

router.get("/myfavourites", (req, res, next) => {
    res.sendFile(path.join(__basedir, "views", "favourite.html"));
});

router.get("/mysettings", (req, res, next) => {
    res.sendFile(path.join(__basedir, "views", "settings.html"));
});

router.get("/mycart", (req, res, next) => {
    res.sendFile(path.join(__basedir, "views", "cart.html"));
});



router.get("/pd/:id", (req, res, next) => {
    pid = req.params.id;
    console.log(pid);
    res.sendFile(path.join(__basedir, "views", "onproduct.html"));
});

router.get("/newuid", (req, res, next) => {
    let uid_ = uid.uid(20)
    console.log(uid_);
    console.log(typeof uid_);

    res.send(uid_);
    
});

router.get("/success_order/:pid", (req, res, next) => {
    res.sendFile(path.join(__basedir, "views", "success_order.html"));
});


router.get("/privacypolicy",(req,res,next) => {
    res.sendFile(path.join(__basedir,"views","privacypolicy.html"));
})

router.get("/termsAndCondition",(req,res,next) => {
    res.sendFile(path.join(__basedir,"views","termsAndCondition.html"))
})

router.get("/returnpolicy",(req,res,next) => {
    res.sendFile(path.join(__basedir,"views","returnpolicy.html"))
})


// Use of Controller



router.get("/cancel/:waybill", (req, res, next) => {
    const options = {
        method: "POST",
        url: "https://staging-express.delhivery.com/api/p/edit",
        headers: {
            Accept: "application/json",
            Authorization: `Token ${process.env.DL_FAKE_API}`,
            "Content-Type": "application/json",
        },
        data: { cancellation: "true", waybill: req.params.waybill },
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
});

router.get("/send_email/:email", (req, res, next) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'shop.11thing@gmail.com',
            pass: `${process.env.PASSWORD}`
        }
    });

    const mailOptions = {
        from: 'shop.11thing@gmail.com',
        to: `${req.params.email}`,
        subject: 'Welcome to the 11Thing',
        text: 'Welcome to the 11thing.com<br/><button style="width:5rem;height:3rem;background-color:#ff6060;color:white"><a href="https://www.11thing.com/">11Thing</a></button>'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

});

router.get("/login", (req, res, next) => {
    res.sendFile(path.join(__basedir, "views", "login.html"));
});





module.exports = router;
