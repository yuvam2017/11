const buttonAddNewAddress = document.getElementById("addNewAddress");
const modalNewAddress = document.getElementById("modalNewAddress");
const headingModal = document.getElementById("headingModal");
const floatingFullName = document.getElementById("floatingFullName");
let floatingMobileNumber = document.getElementById("floatingMobileNumber");
let floatingPinCode = document.getElementById("floatingPinCode");
const floatingLandmark = document.getElementById("floatingLandmark");
const floatingHouse = document.getElementById("floatingHouse");
const floatingColony = document.getElementById("floatingColony");
const floatingTown = document.getElementById("floatingTown");
const floatingState = document.getElementById("floatingState");
const newAddressBTN = document.getElementById("floatingSubmit");
const addressContainer = document.getElementById("addressContainer");
const error_pincode_status = document.getElementById("error_pincode_status");

// Firestore
const db = firebase.firestore();

// Check if the user is logged in or not
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    let uid = user.uid;
    // ...
  } else {
    // User is signed out
    // ...
    window.location.replace("/login");
  }
});


function loadElements() {
  let object_product = JSON.parse(localStorage.getItem("itemsToBuy"));
  let totalCharges = 0, totalRealPrice = 0;
  Object.keys(object_product).map(items => {
    totalCharges += (object_product[items]["pidPrice"] * object_product[items]["pidQuantity"]);
    totalRealPrice += (object_product[items]["pidRealPrice"] * object_product[items]["pidQuantity"]);
  })

  localStorage.setItem("totalPrice", totalCharges);
  localStorage.setItem("totalRealPrice", totalRealPrice);

  displayAddress();

}

loadElements();


function displayAddress() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {

      db.collection("users")
        .doc(user.phoneNumber)
        .collection("addresses")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((docs) => {

            let city = docs.data().city;
            let colony = docs.data().colony;
            let house = docs.data().house_number;
            let landmark = docs.data().landmark;
            let pincode = docs.data().pin_code;
            let state = docs.data().state;

            let addressIndex = document.createElement("div");
            addressIndex.setAttribute("id", `${docs.id}`);
            addressIndex.setAttribute("class", "address container");
            addressIndex.innerHTML = `
          <div class="container address-catelogs">
          <p id="userName${docs.id}" class="h4 userName">${docs.data().full_name
              }</p>
          <hr>
          <p id="house${docs.id}" class="house">${docs.data().house_number
              }</p>
            <p class="colony" id="colony${docs.id}">${docs.data().colony
              }</p>
            <p class="landmark" id="landmark${docs.id}">${docs.data().landmark
              }</p>
          <p class="town" id="town${docs.id}">${docs.data().city}</p>
          <p class="state" id="state${docs.id}">${docs.data().state}</p>
          <p class="pincode" id="pincode${docs.id}">${docs.data().pin_code}</p>
          <p class="phonenumber" id="phonenumber${docs.id}">${docs.data().mobile_number
              }</p>
          <hr>
        </div>
        <div class="buttons-group">
          <div class="row">
            <div class="col">
              <button onclick="selectAddress(this)"
                class="w-100 btn btn-delivery-selection btn-warning">Deliver to this address
              </button>
            </div>
          </div>
          <hr>
          <div class="row">
            <div class="col">
              <button onclick="editAddress(this.parentElement.parentElement.parentElement.parentElement.id)" class="btn btn-grey w-100">Edit</button>
            </div>
            <div class="col"><button
                onclick="deletetheAddress(this.parentElement.parentElement.parentElement.parentElement.id)"
                class="btn btn-grey w-100">Delete</button></div>
          </div>
        </div>
        `;
            addressContainer.appendChild(addressIndex);
            preloader.style.display = "none";
          });
        });

    } else {
      window.location.replace("/login");
    }
  });
}

// Down to this only edit, add,save ,delete,update,and thee search function

//done
function editAddress(addressID) {
  let fullname = document.getElementById(`userName${addressID}`);
  let house = document.getElementById(`house${addressID}`);
  let colony = document.getElementById(`colony${addressID}`);
  let landmark = document.getElementById(`landmark${addressID}`);
  let town = document.getElementById(`town${addressID}`);
  let state = document.getElementById(`state${addressID}`);
  let pincode = document.getElementById(`pincode${addressID}`);
  let phone = document.getElementById(`phonenumber${addressID}`);

  modalNewAddress.style.display = "flex";

  floatingFullName.value = fullname.innerText;
  floatingColony.value = colony.innerText;
  floatingHouse.value = house.innerText;
  floatingLandmark.value = landmark.innerText;
  floatingTown.value = town.innerText;
  floatingState.value = state.innerText;
  floatingPinCode.value = pincode.innerText;
  floatingMobileNumber.value = phone.innerText;

  newAddressBTN.removeAttribute("onclick");
  newAddressBTN.setAttribute("onclick", `updateAddress('${addressID}')`);

  newAddressBTN.innerText = "Update the Address";
}

function getSelectedState() {
  let strState = floatingState.options[floatingState.selectedIndex].text;
  return strState;
}

//done
function updateAddress(addrid) {
  let selectedState = getSelectedState();
  const user = firebase.auth().currentUser;
  db.collection("users").doc(user.uid).collection(addresses).doc(addrid).set({
    colony: floatingColony.value,
    house: floatingHouse.value,
    landmark: floatingLandmark.value,
    full_name: floatingFullName.value,
    mobile_number: floatingMobileNumber.value,
    pin_code: floatingPinCode.value,
    state: selectedState,
    city: floatingTown.value,
  });
  window.location.reload();
}

//done
function deletetheAddress(addressID) {
  const user = firebase.auth().currentUser;
  db.collection("users")
    .doc(user.phoneNumber)
    .collection("addresses")
    .doc(addressID)
    .delete();
  document.getElementById(addressID).style.display = "none";
  // window.location.reload();
}

function amount_current() {
  let items_pro = JSON.parse(localStorage.getItem("itemsToBuy"));
  let totalPrice = 0;
  Object.keys(items_pro).map(item => {
    totalPrice += items_pro[item]["pidPrice"] * items_pro[item]["pidQuantity"]
  })
  console.log(totalPrice);
  return totalPrice;
}

const couponInput = document.getElementById('coupon-Code');
const couponBtn = document.getElementById('apply-coupon');

couponInput.addEventListener("keyup",() => {
  if (event.keyCode==13) {
    applyCoupon();
  }
})

function applyCoupon() {
  let couponCode = couponInput.value;
  let amount = amount_current();   
  console.log(amount);

        fetch(`/coupons/${couponCode}/${firebase.auth().currentUser.phoneNumber}/${amount}`)
        .then(res => res.json())
        .then(data => {
          if (data.success == true) {
            console.log("Valid Coupon")

            couponBtn.setAttribute("disabled", "disabled");
            if (data.discount_type == "cash") {
              const discount = data.discount;
              let priceAfterCoupon = parseInt(localStorage.getItem("totalCharges")) - discount;
              localStorage.setItem("totalCharges", priceAfterCoupon);
              localStorage.setItem("couponApplied", couponCode);
              showCouponPrice(couponCode, priceAfterCoupon);
            } else if (data.discount_type == "percent") {
              const discount = data.discount;
              let priceAfterCoupon = parseInt(localStorage.getItem("totalCharges")) - Math.ceil((parseInt(localStorage.getItem("totalCharges")) * discount) / 100);
              localStorage.setItem("totalCharges", priceAfterCoupon);
              localStorage.setItem("couponApplied", couponCode);
              showCouponPrice(couponCode, priceAfterCoupon);
            } else {
              console.log("Nothing found");
            }
          } else {
            console.log("Invalid Coupon")
            couponBtn.removeAttribute("disabled", "disabled");
            document.getElementById("toast-body").innerText = data.error;
            document.getElementById('modalToast').style.opacity = 1;
            document.getElementById('modalToast').style.zIndex = 100;
            setTimeout(() => {
              document.getElementById('modalToast').style.opacity = 0;
              document.getElementById('modalToast').style.zIndex = 0;
            }, 3000);
          }
        })  
}

function showCouponPrice(coupon, priceAfterCoupon) {
  const modalBody = document.getElementById('chargesModalBody');
  const leftModalBody = modalBody.children[0].children[0];
  const rightModalBody = modalBody.children[1].children[0];

  // Create an Element 
  let li_left_coupon = document.createElement("li");
  let li_left_price_after_coupon = document.createElement("li");

  li_left_coupon.setAttribute("id","li_left_coupon");
  li_left_price_after_coupon.setAttribute("id","li_left_price_after_coupon")

  let li_right_coupon = document.createElement("li");
  let li_right_price_after_coupon = document.createElement("li");

  li_right_price_after_coupon.setAttribute("id","li_right_price_after_coupon");
  li_right_coupon.setAttribute("id","li_right_coupon")

  li_right_price_after_coupon.style.display = "flex";
  li_right_price_after_coupon.style.flexDirection = "row";

  document.getElementById('item-total-charges').style.fontSize = '1rem';
  document.getElementById('item-total-charges').removeAttribute("style");

  li_left_coupon.innerText = "Coupon Code : ";
  li_left_price_after_coupon.innerText = "Total Price : ";
  li_right_coupon.innerHTML = `<span>${coupon}</span> <button onclick="removeCoupon()" class="btn"><i class="bi bi-x"></i></button>`;
  li_right_price_after_coupon.innerHTML = `<span style="color:red;font-size:1.2rem">₹ ${priceAfterCoupon}.00</span>`;
  // li_right_price_after_coupon.style.color = "red";
  // li_right_price_after_coupon.style.fontSize = "1.2rem";


  leftModalBody.appendChild(li_left_coupon);
  leftModalBody.appendChild(li_left_price_after_coupon);
  rightModalBody.appendChild(li_right_coupon)
  rightModalBody.appendChild(li_right_price_after_coupon);

}

function removeCoupon() {
  const li_right_coupon = document.getElementById('li_right_coupon');
  const li_right_price_after_coupon = document.getElementById("li_right_price_after_coupon");

  const li_left_coupon = document.getElementById('li_left_coupon');
  const li_left_price_after_coupon = document.getElementById('li_left_price_after_coupon');

  couponBtn.removeAttribute("disabled","disabled");
  
  li_left_coupon.remove();
  li_left_price_after_coupon.remove();
  li_right_coupon.remove();
  li_right_price_after_coupon.remove();
  document.getElementById('item-total-charges').style.color = "red";
  document.getElementById('item-total-charges').style.fontSize = "1.3rem";
  localStorage.removeItem("couponApplied");
  couponInput.value = "";

}
  




// ################ Add New Address ########################
buttonAddNewAddress.addEventListener("click", (e) => {
  // Adding New Addresss
  e.preventDefault();
  modalNewAddress.style.display = "flex";
  floatingFullName.value = "";
  floatingLandmark.value = "";
  floatingHouse.value = "";
  floatingColony.value = "";
  floatingTown.value = "";
  floatingState.value = "";
  floatingPinCode.value = "";
  floatingMobileNumber.value = "";
  headingModal.innerText = "Add New Address";
  newAddressBTN.innerText = "Save this Address";
  newAddressBTN.removeAttribute("onclick");
  newAddressBTN.setAttribute("onclick", "saveNewAddress()");
  // const user = firebase.auth().currentUser;
});

//done
function saveNewAddress() {
  let State = getSelectedState();
  const user = firebase.auth().currentUser;
  db.collection("users").doc(user.phoneNumber).collection("addresses").doc().set({
    house_number: floatingHouse.value,
    landmark: floatingLandmark.value,
    colony: floatingColony.value,
    full_name: floatingFullName.value,
    mobile_number: floatingMobileNumber.value,
    pin_code: floatingPinCode.value,
    city: floatingTown.value,
    state: State,
  }).then(() => {
    window.location.reload();
  })
}

// ###################################################


const searchQueryDesktop = document.getElementById('searchQueryDesktop');
const searchQueryMobile = document.getElementById('searchQueryMobile');

const search_btn_desktop = document.getElementById('search-btn-desktop');
const search_btn_mobile = document.getElementById('search-btn-mobile');


search_btn_desktop.addEventListener('click', e => {
  e.preventDefault();
  const queryKeyword = String(searchQueryDesktop.value).toLowerCase();
  localStorage.setItem("toSearchNow", queryKeyword)
  window.location.replace(`/search/products?tag=${queryKeyword}`);
})

search_btn_mobile.addEventListener("click", e => {
  e.preventDefault();
  const queryKeyword = String(searchQueryMobile.value).toLowerCase();
  localStorage.setItem("toSearchNow", queryKeyword);
  window.location.replace(`/search/products?tag=${queryKeyword}`);
})

// MODAL
function hideModalNewAddress() {
  modalNewAddress.style.display = "none";
}

function displayRadioValue() {
  let ele = document.getElementsByName("flexRadioDefault");
  for (i = 0; i < ele.length; i++) {
    if (ele[i].checked) {
      return ele[i].value;
    }
  }
}
