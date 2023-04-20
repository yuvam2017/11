// some constants
const modalCharges = document.getElementById("modalCharges");
const modalChargesChild = document.getElementById("modalChargesChild");
const iprice = document.getElementById("item-price");
const iquantity = document.getElementById("item-quantity");
const ideliveryCharges = document.getElementById("item-delivery-charges");
const itotalCharges = document.getElementById("item-total-charges");
const close_modal = document.getElementById("closeModal");
const proceed_modal = document.getElementById("proceedModal");

db = firebase.firestore();

// checkPriceRadio();

// the main processing function is this
function selectAddress(elem) {
  let id = elem.parentElement.parentElement.parentElement.parentElement.id;
  elem.id = "targettedElement";
  let ele = document.getElementsByName("paymentMethodFlexRadioDefault");
  elem.innerHTML = `<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Loading...`;
  {
    let methodPayment;
    for (i = 0; i < ele.length; i++) {
      if (ele[i].checked) {
        methodPayment = ele[i].value;
      }
    }
    let returnState = checkPincode(id, methodPayment, elem);
  }
}

function checkPincode(addrid, methpay, elem) {
  const user = firebase.auth().currentUser;
  localStorage.setItem("methpay", methpay);
  localStorage.setItem("addrid", addrid);

  // @@@@@@@@@@@@@@@@@@@@@@@ DATABASE @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  db.collection("users")
    .doc(user.phoneNumber)
    .collection("addresses")
    .doc(addrid)
    .get()
    .then((snapshot) => {
      const pincode = snapshot.data().pin_code;
      checkCharges(pincode, elem, methpay, addrid);
    });
}

// the first function called when the delivery button is clicked
function checkCharges(pincode, elem, methpay, addrid) {
  // modal is displayed here
  localStorage.setItem("modalpincode", pincode);
  // Order details
  iprice.innerHTML = `&#8377;${localStorage.getItem("totalPrice")}.00`;
  iquantity.innerHTML = `${getQuantityAll()}`;
  fetch(`/delivery/charges/${pincode}`)
    .then((res) => res.json())
    .then((data) => {
      localStorage.setItem("delivery_charges", data[0]["total_amount"]);
      if (parseInt(localStorage.getItem("totalPrice")) < 599) {
        if (methpay == "cod") {
          ideliveryCharges.innerHTML = `&#8377; ${Math.ceil(
            parseFloat(localStorage.getItem("delivery_charges")) + 40
          )}.00`;
        } else {
          ideliveryCharges.innerHTML = `&#8377; ${Math.ceil(
            parseFloat(localStorage.getItem("delivery_charges"))
          )}.00`;
        }
      } else {
        ideliveryCharges.innerHTML = `Free Delievery`;
      }
      modalCharges.style.display = "flex";
      const realCharges = gethChargesWithoutAdditionalCharges();
      // const realCharges = parseFloat(localStorage.getItem('totalPrice')) * parseFloat(localStorage.getItem('pidquantity'))

      {
        let totalCharges;
        if (localStorage.getItem("totalPrice") < 599) {
          if (methpay == "cod") {
            totalCharges =
              realCharges +
              Math.ceil(
                parseFloat(localStorage.getItem("delivery_charges")) + 40
              );
            itotalCharges.innerHTML = `&#8377; ${totalCharges}.00`;
            itotalCharges.style.color = "red";
            itotalCharges.style.fontSize = "1.2rem";
            localStorage.setItem("totalCharges", totalCharges);
          } else {
            totalCharges =
              realCharges +
              Math.ceil(parseFloat(localStorage.getItem("delivery_charges")));
            itotalCharges.innerHTML = `&#8377; ${totalCharges}.00`;
            itotalCharges.style.color = "red";
            itotalCharges.style.fontSize = "1.2rem";
            localStorage.setItem("totalCharges", totalCharges);
          }
        } else {
          totalCharges = realCharges;
          itotalCharges.innerHTML = `&#8377; ${totalCharges}.00`;
          itotalCharges.style.color = "red";
          itotalCharges.style.fontSize = "1.3rem";
          localStorage.setItem("totalCharges", totalCharges);
        }
      }
    });
}

function checkPriceRadio() {
  console.log("checkPriceRadio");
  let charges = localStorage.getItem("totalPrice");
  let get_amount;
  db.collection("app_maintainance")
    .doc("data")
    .get()
    .then((snaps) => {
      if (charges >= parseInt(snaps.data()["min_cod_amount"])) {
        document.getElementById("codModeRadio").removeAttribute("disabled");
      } else {
        document
          .getElementById("codModeRadio")
          .setAttribute("disabled", "disabled");
      }
    });
}

// getting the real charges (pidPrice * pidquantity for every items in itemsBuy)
function gethChargesWithoutAdditionalCharges() {
  let object_product = JSON.parse(localStorage.getItem("itemsToBuy"));
  let totalPrice = parseInt(localStorage.getItem("totalPrice")),
    realCharges = 0;
  Object.keys(object_product).map((item) => {
    realCharges +=
      object_product[item]["pidPrice"] * object_product[item]["pidQuantity"];
  });
  return realCharges;
}

function getQuantityAll() {
  let object_product = JSON.parse(localStorage.getItem("itemsToBuy"));
  let no_qty = 0;
  Object.keys(object_product).map((item) => {
    no_qty += object_product[item]["pidQuantity"];
  });
  return no_qty;
}

// ###################################### MODAL ###############################
// Aborting the order placing
function closeModal() {
  modalCharges.style.display = "none";
  const elem = document.getElementById("targettedElement");
  elem.innerHTML = `Deliver to this address`;
}

// Proceed the Modal to the order placed
function proceedModal() {
  const pin = localStorage.getItem("modalpincode");
  const methpay = localStorage.getItem("methpay");
  const addrid = localStorage.getItem("addrid");
  const elem = document.getElementById("targettedElement");
  const totalCharges = localStorage.getItem("totalCharges");
  modalCharges.style.display = "none";
  firestore_token(addrid, pin, methpay, elem, totalCharges);
}
// ############################################################################

function firestore_token(addrid, pincode, methpay, elem, totalCharges) {
  // ####################### Firestore #######################
  // getting the pincode service availibility
  fetch(`/delivery/checkPincode/${pincode}`)
    .then((res) => res.json())
    .then((data) => {
      // let data = JSON.parse(dyno)
      if (data["delivery_codes"].length != 0) {
        error_pincode_status.innerText = "";
        let district = data["delivery_codes"][0]["postal_code"]["district"];
        let state_code = data["delivery_codes"][0]["postal_code"]["state_code"];
        let cod = data["delivery_codes"][0]["postal_code"]["cod"];
        if (methpay == "cod") {
          if (cod == "Y") {
            // cash on delivery available place the order directly here
            createOrder(addrid, methpay, elem);
          } else if (cod == "N") {
            document
              .getElementById("flexRadioDefault1")
              .setAttribute("disabled", "disabled");
            document
              .getElementById("flexRadioDefault2")
              .setAttribute("selected", "selected");
            // cash on delivery not available so make the user to pay online and then place the order
            alert_pane.style.display = "flex";
          }
        } else if (methpay == "online") {
          // no need to check cod availability just pay and place the order
          createPayment(addrid, methpay, elem);
        }
      } else {
        error_pincode_status.innerText = "Service not Available in your Area";
        error_pincode_status.style.color = "red";
      }
    });
}

// if cash on delivery is not available in the area
const agreeChangePayment = document.getElementById("agreeChangePayment");
const cancelChangePayment = document.getElementById("cancelChangePayment");
const alert_pane = document.getElementById("alert-pane");

cancelChangePayment.addEventListener("click", (e) => {
  e.preventDefault();
  alert_pane.style.display = "none";
});

agreeChangePayment.addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("flexRadioDefault1").removeAttribute("checked");
  document
    .getElementById("flexRadioDefault2")
    .setAttribute("checked", "checked");
  createPayment();
});

const city = localStorage.getItem("City");
const colony = localStorage.getItem("Colony");
const house = localStorage.getItem("House");
const landmark = localStorage.getItem("Landmark");
const pincode = localStorage.getItem("Pincode");
const state = localStorage.getItem("State");

function pidquantity_local() {
  let item_pro = JSON.parse(localStorage.getItem("itemsToBuy"));
  let productQty = 0;
  Object.keys(item_pro).map((item) => {
    productQty += item_pro[item]["pidQuantity"];
  });
  return productQty;
}

function createOrder(addid, payMeth, elem) {
  const user = firebase.auth().currentUser;
  let payment_mode_delhivery;
  let Cod_Amount;
  if (payMeth == "cod") {
    payment_mode_delhivery = "COD";
    Cod_Amount = localStorage.getItem("totalCharges");
  } else {
    payment_mode_delhivery = "Prepaid";
    Cod_Amount = 0;
  }

  // const api = docs.data()["api"];
  // const fakeapi = docs.data()["fake_api"];
  // const client = docs.data()["client"];
  const name = user.displayName;
  db.collection("users")
    .doc(firebase.auth().currentUser.phoneNumber)
    .collection("addresses")
    .doc(addid)
    .get()
    .then((qsnap) => {
      let date = new Date();
      const totalPrice = localStorage.getItem("totalCharges");
      const convertedDateTime = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      localStorage.setItem("dateTime", convertedDateTime);
      localStorage.setItem(
        "address_user",
        `${qsnap.data().house_number}, ${qsnap.data().colony} ${
          qsnap.data().landmark
        },${qsnap.data().city},${qsnap.data().state}-${qsnap.data().pin_code}`
      );
      add_user_order_history(payMeth, elem);
    });

  // GETTING THE WAYBILL NUMBER
  // fetch(`/delivery/waybill_generate/${name}`)
  //   .then((res) => res.json())
  //   .then((data) => {
  //     let waybillNumber = data["waybillnumber"];
  //     console.log(waybillNumber);

  //     db.collection("users")
  //       .doc(firebase.auth().currentUser.phoneNumber)
  //       .collection("addresses")
  //       .doc(addid)
  //       .get()
  //       .then((qsnap) => {
  //         let date = new Date();
  //         const totalPrice = localStorage.getItem("totalCharges");
  //         const convertedDateTime = `${date.getFullYear()}-${
  //           date.getMonth() + 1
  //         }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  //         localStorage.setItem("dateTime", convertedDateTime);
  //         localStorage.setItem("waybillNUMBER", waybillNumber);
  //         localStorage.setItem(
  //           "address_user",
  //           `${qsnap.data().house_number}, ${qsnap.data().colony} ${
  //             qsnap.data().landmark
  //           },${qsnap.data().city},${qsnap.data().state}-${
  //             qsnap.data().pin_code
  //           }`
  //         );

  //         console.log(payment_mode_delhivery);
  //         console.log("cod_amount", Cod_Amount);
  //         let pidqty_local = pidquantity_local();
  //         console.log(pidqty_local);
  //         const data_new = {
  //           shipments: [
  //             {
  //               phone: `${firebase.auth().currentUser.phoneNumber}`,
  //               products_desc: "11thing sports wear",
  //               cod_amount: `${Cod_Amount}`,
  //               name: `${qsnap.data().full_name}`,
  //               country: "India",
  //               waybill: `${waybillNumber}`,
  //               order_date: `${convertedDateTime}`,
  //               total_amount: `${totalPrice}`,
  //               seller_add:
  //                 "NCC TIRAHA, HARPUR , BALLIA, UTTAR PRADESH ,India 277001",
  //               add: `${qsnap.data().house_number}, ${qsnap.data().colony} ${
  //                 qsnap.data().landmark
  //               },${qsnap.data().city},${qsnap.data().state}-${
  //                 qsnap.data().pin_code
  //               }`,
  //               seller_name: "11thing",
  //               pin: `${qsnap.data().pin_code}`,
  //               quantity: `${pidqty_local}`,
  //               payment_mode: `${payment_mode_delhivery}`,
  //               state: `${qsnap.data().state}`,
  //               city: `${qsnap.data().city}`,
  //               client: "SF MS 0093222",
  //             },
  //           ],
  //         };
  //         console.log(data_new);

  //         fetch(`/delivery/create_order/${waybillNumber}`, {
  //           method: "POST",
  //           headers: {
  //             Accept: "application/json",
  //             "Content-Type": "application/json",
  //           },
  //           // mode: "no-cors",
  //           body: JSON.stringify(data_new),
  //         })
  //           .then((res) => res.json())
  //           .then((data) => {
  //             console.log("inside the  add_user_order_history");
  //             localStorage.setItem("upload_waybill", data["upload_wbn"]);
  //             add_user_order_history(payMeth, elem);
  //           });
  //       });
  //   });
}

function createPayment(addrid, methpay, elem) {
  const user = firebase.auth().currentUser;

  const options = {
    key: "rzp_test_nynGfvAwV9xBcn", // Enter the Key ID generated from the Dashboard
    amount: parseInt(localStorage.getItem("totalCharges")) * 100,
    currency: "INR",
    name: "11Thing.com",
    description: "Buy Sports Fashion",
    // order_id: `${data["id"]}`,
    handler: function (response) {
      localStorage.setItem("razorpay_payment_id", response.razorpay_payment_id);
      localStorage.setItem("razorpay_order_id", response.razorpay_order_id);
      localStorage.setItem("razorpay_signature", response.razorpay_signature);
      createOrder(addrid, methpay, elem);
    },
    prefill: {
      contact: user.phoneNumber,
      name: user.displayName,
      email: user.email,
    },
    notes: {
      address: "Razorpay Corporate Office",
    },
    theme: {
      color: "#3399cc",
    },
  };
  const rzp1 = new Razorpay(options);
  rzp1.on("payment.failed", function (response) {
    console.log(response.error.code);
    console.log(response.error.description);
    console.log(response.error.source);
    console.log(response.error.step);
    console.log(response.error.reason);
    console.log(response.error.metadata.order_id);
    console.log(response.error.metadata.payment_id);
  });
  rzp1.open();
}

function checkPayment(addrid, methpay, elem) {
  fetch("/payment/check-order-complete")
    .then((res) => res.json())
    .then((data) => {
      if (data["success"]) {
        console.log("payment SuccessFull");
      }
    })
    .then(createOrder(addrid, methpay, elem));
}

async function add_firestore_successful_order(paymeth, id_pro, itemPID, elem) {
  console.log("add_firestore_successfull");
  const user = firebase.auth().currentUser;
  console.log("id_pro", id_pro);
  let docID = await db.collection("pending_Orders").doc().id;
  db.collection("pending_orders")
    .doc(docID)
    .collection("items")
    .doc(id_pro)
    .set({
      pid: itemPID,
      mobile_number: user.phoneNumber,
    })
    .then(() => {
      db.collection("pending_orders")
        .doc(docID)
        .set({
          discount: 0,
          ready_for_pickup: false,
        })
        .then(() => {
          window.location.replace(
            `/success_order/${localStorage.getItem("productDetailed")}`
          );
        });
    });
  const data_ = JSON.parse(localStorage.getItem("itemsToBuy"));
  coupon_add_in_database();
  // .then(() => {
  // }
}

function coupon_add_in_database() {
  db.collection("users")
    .doc(firebase.auth().currentUser.phoneNumber)
    .get()
    .then((snaps) => {
      let coupons_field = snaps.data()["coupons_used"];
      if (coupons_field == undefined) {
        let arraY_coupon = [];
        arraY_coupon.push(localStorage.getItem("couponApplied"));
        push_array_coupon(arraY_coupon);
      } else {
        let arraY_coupon = coupons_field;
        coupons_field.push(localStorage.getItem("couponApplied"));
        push_array_coupon(arraY_coupon);
      }
    });
}

function push_array_coupon(arraY_coupon) {
  db.collection("users")
    .doc(firebase.auth().currentUser.phoneNumber)
    .set({
      coupons_used: arraY_coupon,
    })
    .then(() => {
      console.log("added in database coupon");
    });
}

function reduce_stock() {
  let item_pro = JSON.parse(localStorage.getItem("itemsToBuy"));
  fetch("/delivery/reduce_stock", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item_pro),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data["success"]);
    });
}

function getNewUID() {
  fetch("/newuid")
    .then((res) => res.text())
    .then((oid) => {
      console.log(oid);
      console.log(typeof oid);
      return oid;
    });
}

function add_user_order_history(paymeth, data, elem) {
  console.log("add_user_order_history");
  const user = firebase.auth().currentUser;
  // localStorage.setItem("docs_id", oid);
  let paymentID;
  let razorpayOrderID;
  if (paymeth == "online") {
    paymentID = localStorage.getItem("razorpay_payment_id");
    razorpayOrderID = localStorage.getItem("razorpay_order_id");
  }

  const data_pro = JSON.parse(localStorage.getItem("itemsToBuy"));

  Object.keys(data_pro).map((item) => {
    let id_pro = db
      .collection("users")
      .doc(firebase.auth().currentUser.phoneNumber)
      .collection("orders")
      .doc().id;
    console.log(id_pro);
    console.log(typeof id_pro);
    try {
      db.collection("users")
        .doc(user.phoneNumber)
        .collection("orders")
        .doc(id_pro)
        .set({
          buy_price: localStorage.getItem("totalPrice"),
          coupon: `${localStorage.getItem("couponApplied")}`,
          dateTime: localStorage.getItem("dateTime"),
          payment_method: `${paymeth}`,
          pid: `${item}`,
          quantity: `${data_pro[item]["pidQuantity"]}`,
          shipping_charge: `${localStorage.getItem("delivery_charges")}`,
          shipping_to: `${localStorage.getItem("address_user")}`,
          size: `${data_pro[item]["pidSize"]}`,
        })
        .then(() => {
          console.log(id_pro);
          console.log(typeof id_pro);
          add_firestore_successful_order(paymeth, id_pro, item, elem);
        });
    } catch (error) {
      console.log(error);
    }
  });
}
