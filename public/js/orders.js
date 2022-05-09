const database = firebase.database();
const db = firebase.firestore();
const tyear_1Label = document.getElementById("tyear-1Label");
const tyear_2Label = document.getElementById("tyear-2Label");
const order_history = document.getElementById("order-history");

let said = false;

// const date = new Date();
// tyear_1Label.innerHTML = parseInt(date.getFullYear()) - 1;
// tyear_2Label.innerHTML = parseInt(date.getFullYear()) - 2;

const orderContainer = document.getElementById("order-history");

const onGoingOrder = document.getElementById("ongoingOrders");
const delieveredOrders = document.getElementById("delieveredOrders");
const returnedOrders = document.getElementById("returnedOrders");
const cancelledOrders = document.getElementById("cancelledOrders");
const last30Days = document.getElementById("last30Days");
const T_1 = document.getElementById("tyear-1");
const T_2 = document.getElementById("tyear-2");
const others = document.getElementById("others");
let a_orders = document.createElement("a");

const modalOrderDetail = document.getElementById("modalViewDetails");

const orderID = document.getElementById("orderID");
const orderTotal = document.getElementById("orderTotal");
const deliveredDate = document.getElementById("deliveredDate");
const paymentMethod = document.getElementById("paymentMethod");
const billingAddress = document.getElementById("billingAddress");
const itemCharge = document.getElementById("itemCharge");
const deliveryCharges = document.getElementById("deliveryCharges");
const totalBeforeDiscount = document.getElementById("totalBeforeDiscount");
const discount = document.getElementById("discount");
const totalAfterDiscount = document.getElementById("totalAfterDiscount");

// document.getElementById("closeModal").addEventListener("click", (e) => {
//   modalOrderDetail.style.display = "none";
// });

function loadOrders() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const uid = user.uid;

      db.collection("users")
        .doc(user.phoneNumber)
        .collection("orders")
        .get()
        .then((snapshot) => {
          snapshot.forEach((element) => {
            db.collection("products")
              .doc(element.data().pid)
              .get()
              .then((qsnap) => {
                let productOrderID = element.id;
                let productImage = qsnap.data().imgurl;
                let productPrice = element.data().buy_price;
                let productOrderDate = element.data().dateTime;
                let productQuantity = element.data().quantity;
                let productShipping = element.data().shipping_to;
                let productSize = element.data().size;
                let productWaybill = element.data().waybill;
                let productHeading = qsnap.data().title;
                let productStatus = element.data().status;
                let productDescription = qsnap.data().description;
                let productOrderMethod = element.data().payment_method;
                let productDeliveryCharges = element.data().delivery_charges;

                addOrders(
                  element.data().pid,
                  productHeading,
                  productDescription,
                  productImage,
                  productPrice,
                  productStatus,
                  productOrderDate,
                  productQuantity,
                  productShipping,
                  productSize,
                  productWaybill,
                  productOrderMethod,
                  productOrderID,
                  productDeliveryCharges
                );
              });
          });
        });
    } else {
    }
  });
}

function addOrders(
  pid,
  heading,
  description,
  image,
  price,
  status,
  orderdate,
  quantity,
  shipping_addr,
  size,
  waybill,
  paymeth,
  orderid,
  delivery_charges
) {
  if (localStorage.getItem("order_history") == null) {
    let prev = {};
    prev[pid] = {
      title: heading,
      desc: description,
      img: image,
      price: price,
      status: status,
      order_date: orderdate,
      quantity: quantity,
      shipping_address: shipping_addr,
      size: size,
      waybill: waybill,
      paymeth: paymeth,
      orderid: orderid,
      delivery_charges: delivery_charges,
    };
    localStorage.setItem("order_history", JSON.stringify(prev));
  } else {
    let prev = JSON.parse(localStorage.getItem("order_history"));
    prev[pid] = {
      title: heading,
      desc: description,
      img: image,
      price: price,
      status: status,
      order_date: orderdate,
      quantity: quantity,
      shipping_address: shipping_addr,
      size: size,
      waybill: waybill,
      paymeth: paymeth,
      orderid: orderid,
      delivery_charges: delivery_charges,
    };
    localStorage.setItem("order_history", JSON.stringify(prev));
  }
  let a_orders = document.createElement("a");
  a_orders.innerHTML = `<div id="${pid}" class="border w-100 my-2 container-fluid products ${pid}">
    <div class="first" onclick="window.location.replace('/pd/${pid}')">
      <div class="image">
        <img src="${image}" alt="">
      </div>
      <div class="details" id="details">
        <div class="title">
          <p>${heading}
          </p>
        </div>
        <div class="description">
          <p>${description}</p>
        </div>
      </div>
    </div>

    <div class="priceLabel">
      &#8377;${price}
    </div>
    <div id="crdlabel${pid}" class="crdlabel">
      
    </div>
    <div id="btn_container" class="button-container">
      <button type="button" id="viewDetail" onclick="showDetailsSpecific(this.parentElement.parentElement.id)" class="btn btn-dark view-detail" data-bs-toggle="modal" data-bs-target="#exampleModal">
      <i class="bi bi-receipt-cutoff"></i> View Details
      </button>
      <button id="downloadInvoice" class="my-1 btn btn-dark invoice" onclick="downloadInvoice(this.parentElement.parentElement.id)"><i class="bi bi-file-earmark-arrow-down"></i> Download Invoice</button>
      <button id="cancelOrder" class="my-1 mb-2 btn btn-dark cancel-order" onclick="cancelOrder(this.parentElement.parentElement.id)"> Cancel Order </button>
    </div>                     
  </div>`;
  orderContainer.appendChild(a_orders);

  crdlabel(status, pid);
}

const toast = document.getElementById("toast");
const toastBody = document.getElementById("toastBody");

// This is the fucntion to download invoice of the delivered packages
function downloadInvoice(id) {
  let pathinput = document.createElement("input");
  pathinput.setAttribute("type", "file");
  pathinput.setAttribute("id", "invoicePath");
  pathinput.addEventListener("click", () => {
    document.getElementById("invoicePath");
  });
  let waybill = JSON.parse(localStorage.getItem("order_history"))[id][
    "waybill"
  ];
  fetch(
    `/${waybill}/invoice/${
      JSON.parse(localStorage.getItem("order_history"))[id]["title"]
    }/${id}`
  )
    .then((res) => res.json())
    .then((data) => {
      toastBody.innerText = "Invoice Downloaded Check Your Downloads !! ";
      toast.style.opacity = 1;
      setTimeout(() => {
        toastBody.innerText = "";
        toast.style.opacity = 0;
      }, 3500);
    });
}

// This is the fucntion to cancel the ongoing orders
function cancelOrder(id) {
  let waybill = JSON.parse(localStorage.getItem("order_history"))[id][
    "waybill"
  ];
  fetch(`/cancel/${waybill}`)
    .then((res) => res.json())
    .then((data) => {
      toastBody.innerText = "Your Cancellation Request is pending";
      toast.style.opacity = 1;
      setTimeout(() => {
        toastBody.innerText = "";
        toast.style.opacity = 0;
      }, 3500);
    });
}

function showDetailsSpecific(pid) {
  let data = JSON.parse(localStorage.getItem("order_history"));
  let pd = data[pid];
  orderID.innerHTML = `Order date : ${pd["orderid"]}`;
  orderTotal.innerHTML = `Order Total : ${parseInt(pd["price"])}`;
  deliveredDate.innerHTML = `Ordered on :  ${pd["order_date"]}`;

  paymentMethod.innerHTML = `${pd["paymeth"]}`;
  billingAddress.innerHTML = `${pd["shipping_address"]}`;
  totalAfterDiscount.innerHTML = `${parseInt(pd["price"])}.00`;
  totalAfterDiscount.style.fontSize = "1.5rem";
  // discount.innerHTML = `${pd["discount"]}`;
  // totalBeforeDiscount.innerHTML = `${
  //   pd["delivery_charges"] + parseInt(pd["price"]) * parseInt(pd["quantity"])
  // }`;
  deliveryCharges.innerHTML = `${pd["delivery_charges"]}`;
  itemCharge.innerHTML = `${
    parseInt(pd["price"]) - parseInt(pd["delivery_charges"])
  }.00`;
  // modalOrderDetail.style.display = "block";
}

function crdlabel(status, pid) {
  const crdlabel = document.getElementById(`crdlabel${pid}`);
  let crdlabel_inside = document.createElement("div");
  crdlabel_inside.setAttribute("class", "label-crdlabel");

  const downloadInvoice = document.getElementById("downloadInvoice");
  const cancelOrder = document.getElementById("cancelOrder");

  if (status == "awaiting confirmation") {
    crdlabel.innerHTML = `<div id="dotYellow" class="dot-yellow"></div>`;
    crdlabel_inside.innerHTML = `Waiting`;
    crdlabel.appendChild(crdlabel_inside);

    cancelOrder.style.display = "block";
    downloadInvoice.style.display = "none";
  } else if (status == "awaiting cancellation") {
    crdlabel.innerHTML = `<div id="dotBlack" class="dot-black"></div>`;
    crdlabel_inside.innerHTML = `<div class="label-crdlabel">Awaiting Cancellation</div>`;
    crdlabel.appendChild(crdlabel_inside);

    cancelOrder.style.display = "none";
    downloadInvoice.style.display = "none";
  } else if (status == "delivered") {
    crdlabel.innerHTML = `<div id="dotGreen" class="dot-green"></div>`;
    crdlabel_inside.innerHTML = `<div class="label-crdlabel">Delievered</div>`;
    crdlabel.appendChild(crdlabel_inside);

    cancelOrder.style.display = "none";
    downloadInvoice.style.display = "none";
  } else if (status == "dispatched") {
    crdlabel.innerHTML = `<div id="dotBlue" class="dot-blue"></div>`;
    crdlabel_inside.innerHTML = `<div class="label-crdlabel">Dispatched</div>`;
    crdlabel.appendChild(crdlabel_inside);

    cancelOrder.style.display = "none";
    downloadInvoice.style.display = "none";
  } else {
    console.log("Goto hell");
  }

  said = true;
  preloader.style.display = "none";
}
