localStorage.clear();
const db = firebase.firestore();
// const database = firebase.database();
// const user.phoneNumber = firebase.auth().currentUser.user.phoneNumber;
// const preloader = document.getElementById('preloader');

const itemDiscount = document.getElementById('itemDiscount')
const totalPrice = document.getElementById('totalPrice')

const itemQuantity = document.getElementById('itemQuantity');
const itemWorth = document.getElementById('itemWorth');
const leftMain = document.querySelector('.left-main');
const rightMain = document.querySelector('.right-main');
const cartNoProduct = document.getElementById('no-product');
const targetContainer = document.getElementById('target-container');
const saveLaterButton = document.querySelector('.save-item');
const deleteItemButton = document.querySelector('.delete-item');
const saveNoProduct = document.getElementById('no-product-save-for-later')


function getCartDetails() {

    firebase.auth().onAuthStateChanged(user => {

        if (user) {
            // var user.uid = user.uid;

            db.collection("carts").doc(user.phoneNumber).collection("items").get().then((querySnapshot) => {
                if (querySnapshot.size > 0) {
                    let totalProductPrice = 0;
                    let totalProductQuantity = 0;
                    querySnapshot.forEach((docs) => {
                        // doc.data() is never undefined for query doc snapshots
                        // queryproduct(docs);
                        db.collection("products").doc(docs.id.trimStart().trimEnd()).get().then(snapshot => {
                            let productImage = snapshot.data().imgurl;
                            let productPrice = snapshot.data().price;
                            let productMRP = snapshot.data().mrp;
                            let productHeading = snapshot.data().title;

                            // let productQuantity = docs.data().qty;
                            // let productSize = docs.data().size;


                            // totalProductQuantity += 1;
                            // totalProductPrice += parseInt(productPrice * totalProductQuantity);
                            let numberStock = snapshot.data().stock;
                            localStorage.setItem(`${docs.id.trimStart().trimEnd()}@numberStock`, JSON.stringify(numberStock));

                            showProducts(docs.id.trimEnd().trimStart(), productHeading, productImage, productPrice, productMRP, querySnapshot.size, numberStock);
                        })

                    })
                    leftMain.style.display = "block";
                    rightMain.style.display = "block";
                    cartNoProduct.style.display = "none";

                } else {
                    leftMain.style.display = "none";
                    rightMain.style.display = "none";
                    cartNoProduct.style.display = "block";
                    preloader.style.display = "none";
                }
            })
        }
        else {
            leftMain.style.display = "none";
            rightMain.style.display = "none";
            cartNoProduct.style.display = "block";
            preloader.style.display = "none";
        }
    })
}

getCartDetails();

function add_to_localStorage(id, qty, pPrice, mrp, size = 0) {
    let localStorageProduct = localStorage.getItem("itemsToBuy");
    if (localStorageProduct != null) {
        // append kardo
        let object_product = JSON.parse(localStorageProduct);
        object_product[id] = {
            pidSize: parseInt(size),
            pidQuantity: parseInt(qty),
            pidPrice: parseInt(pPrice),
            pidRealPrice: parseInt(mrp)
        }

        localStorage.setItem("itemsToBuy", JSON.stringify(object_product));

    } else {
        // localstorage mien write kar do
        let object_product = {};
        object_product[id] = {
            pidSize: parseInt(size),
            pidQuantity: parseInt(qty),
            pidPrice: parseInt(pPrice),
            pidRealPrice: parseInt(mrp)
        }

        // Appending to localStorage
        localStorage.setItem("itemsToBuy", JSON.stringify(object_product));
    }
}

function showProducts(id, heading, image, price, mrp, cartItems, numberStock) {

    add_to_localStorage(pid = id, pidqty = 1, pPrice = price, pRealPrice = mrp);


    let discount = (((mrp - price) / mrp) * 100).toFixed(2);


    if (targetContainer.childElementCount < parseInt(cartItems + 2)) {
        let productCatelogs = document.createElement('div');

        productCatelogs.setAttribute("class", "d-flex justify-content-evenly product-catelogs border-1 shadow my-3");

        productCatelogs.innerHTML = `<div id="${id}" onclick="redirectOnProduct('${id}')" class="image-container">
          <img class="w-100" src="${image}" alt="">
          </div>
          <div id="${id}" class="product-details ${id} ">
          <div class="product-heading px-3 py-1 ml-3">
                <h4 class="fs-3">${heading}</h4>
          </div>
          <div class="d-flex justify-content-evenly flex-row px-3 product-quantity-size">
                <div id="cartQuantity" class="d-flex justify-content-start flex-row quantity ml-2">
                      <div class="input-group">
                            <label class="input-group-text "
                                  for="inputGroupSelect01">Quantity : </label>
                            <select onchange="calculate_Total('${id}')" class="form-select productQty" id="${id}productQty">

                            </select>
                      </div>
                </div>
                <div id="cartSize" class="ml-2 d-flex justify-content-start flex-row size">
                      <div class="input-group mr-2">
                            <label class="input-group-text "
                                  for="inputGroupSelect01">Size</label>
                            <select onchange="crz_Size('${id}')" class="form-select" id='${id}productSize'>

                            </select>
                      </div>
                </div>

                <div id="noticeEmptyStock">

                </div>
          </div>
          <div class="d-flex justify-content-start align-items-center flex-row price-product p-3"
                id="price-product">
                <strong class="d-flex justiy-content-center flex-row">
                      <h3 class="px-1 price-product-number fs-4">&#8377;<span
                                  id="priceCurrent">${price}</span>
                      </h3>
                      <p><del id="priceReal">&#8377;${mrp}</del></p>
                      <p class="mx-2 discount" style="color: #1a7554;"><i
                                  class="bi bi-patch-check-fill"></i>${discount}% Discount</p>
                </strong>
                <!-- &#8377; -->
          </div>
          <div class="other-functionality p-3">
                <div class="row">
                      <div class="col-6">
                            <button onclick="deleteItem(this)"
                                  class="btn btn-primary delete-item">
                                  <i class="bi bi-trash-fill"></i>&nbsp;Delete this item
                            </button>
                      </div>
                      <div class="col-6">
                            <button onclick="saveLater(this)" class="btn btn-warning save-item">
                                  <i class="bi bi-bookmark-check-fill"></i>&nbsp;Save for
                                  later
                            </button>
                      </div>
                </div>
                </div>
                </div>`;
        targetContainer.appendChild(productCatelogs);
        const noticeEmptyStock = document.getElementById("noticeEmptyStock");
        const productSize = productCatelogs.children[1].children[1].children[1].children[0].children[1];
        if (numberStock != 0) {

            noticeEmptyStock.style.display = "none";

            // Adding the Size
            let key_size = Object.keys(numberStock);
            let corres_value = Object.values(numberStock);


            for (let index = 0; index < key_size.length; index++) {
                let optionValue = document.createElement('option');
                optionValue.setAttribute("value", key_size[index]);
                if (index == 0) {
                    optionValue.setAttribute("selected", "selected");
                }
                optionValue.innerHTML = key_size[index];
                productSize.appendChild(optionValue);
            }

            crz_Size(id);

        } else {

            cartQuantity.style.display = "none";
            cartSize.style.display = "none";
            noticeEmptyStock.innerHTML = "<p style='color:#ff4800;' class='text-center m-1'>Out of Stock</p>"
            noticeEmptyStock.style.display = "block";
        }
    }

    // calculate_Total();

}


function crz_Size(id) {
    let size = document.getElementById(`${id}productSize`).selectedOptions[0].value;
    let stock = JSON.parse(localStorage.getItem(`${id}@numberStock`));
    let qt = stock[size];
    crz_Qty(id, qt, size);
}

function crz_Qty(id, qt, size) {
    let qty = document.getElementById(`${id}productQty`);
    for (let i = 0; i < qt; i++) {
        let option_qty = document.createElement("option");
        if (i == 0) {
            option_qty.setAttribute("selected", "selected");
        }
        option_qty.innerText = i + 1;
        option_qty.setAttribute("value", i + 1);
        qty.appendChild(option_qty);
    }
    calculate_Total(id);
}

function calculate_Total(id) {
    let qty = document.getElementById(`${id}productQty`).selectedOptions[0].value;
    let size = document.getElementById(`${id}productSize`).selectedOptions[0].value;
    let jsonPro = JSON.parse(localStorage.getItem("itemsToBuy"));
    jsonPro[id]["pidQuantity"] = parseInt(qty);
    jsonPro[id]["pidSize"] = size;
    localStorage.setItem("itemsToBuy", JSON.stringify(jsonPro));
    calculate_Total_cart();
}


function calculate_Total_cart() {
    let jsonProduct = JSON.parse(localStorage.getItem("itemsToBuy"));
    let sumPrice = 0;
    let sumMrp = 0;
    let sumQty = 0;
    Object.keys(jsonProduct).map(item => {
        sumPrice += (jsonProduct[item]["pidQuantity"] * jsonProduct[item]["pidPrice"]);
        sumMrp += (jsonProduct[item]["pidQuantity"] * jsonProduct[item]["pidRealPrice"]);
        sumQty += jsonProduct[item]["pidQuantity"];
    })
    setTheCharges(sumPrice, sumMrp, sumQty);
}

function setTheCharges(price, mrp, qty) {
    itemQuantity.innerText = qty;
    itemWorth.innerText = mrp;
    totalPrice.innerText = price;
    itemDiscount.innerText = `${(((mrp - price) / mrp) * 100).toFixed(2)}% Discount`;
    preloader.style.display = "none";
}



// function checkStock(elid,targetElem){
//     // this function is to dynamically change the number of quantity when user selects the size of the product.
//     // let productQty = document.getElementById('productQty');
//
//     let pid = elid.parentElement.parentElement.parentElement.parentElement.id;
//     let numberStock = JSON.parse(localStorage.getItem(`${pid}/numberStock`));
//
//     // checking the current selected option of the select html attribute
//     let currentSize = elid.value;
//     targetElem.innerHTML = "";
//
//     let num = numberStock[currentSize];
//     for (let i=1;i<=num;i++){
//         let option = document.createElement("option");
//         if (i==1){
//             option.setAttribute("selected","selected");
//         }
//         option.setAttribute("value",i);
//         option.innerText = i;
//         targetElem.appendChild(option);
//     }
//
//     // let tagetNumberStock = numberStock[];
//
//
// }


function saveLater(elem) {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            elem.innerHTML = `<div class="spinner-border spinner-border-sm" role="status">
  <span class="visually-hidden">Loading...</span>
</div> Adding to Favourites`;
            pid = localStorage.getItem("productDetailed");
            db.collection('wishlists').doc(user.phoneNumber).collection('items').doc(pid).set({}).then(() => {
                let pelem = elem.parentElement.parentElement.parentElement.parentElement;
                let pid = pelem.id;
                pelem.parentElement.remove();
                snackbar.style.display = "flex";
                successSnackbar.style.display = "flex";
                errorSnackbar.style.display = "none";
                successSnackbar.innerText = 'Item Added to the Wishlist !! '
                setInterval(() => {
                    snackbar.style.display = "none";
                    successSnackbar.style.display = "none";
                }, 2000);

            }).catch(error => {
                console.log("erro", error);
            });


            db.collection('carts').doc(user.phoneNumber).collection('items').doc(pid).delete().then(() => { console.log("items delted"); }).catch(error => { console.log("Error while deleting the documents", error); });



        } else {
            // user logged out
            window.location.replace("/login");
        }
    })
}

// DeleteItems is a allrounded fucntion for the cart and wishlist
function deleteItem(elem) {
    elem.innerHTML = `<div class="spinner-border spinner-border-sm" role="status">
  <span class="visually-hidden">Loading...</span>
</div> Deleting Item`
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // user logged in
            // let user.phoneNumber = firebase.auth().currentUser.phoneNumber;
            let productIdClasslist = elem.parentElement.parentElement.parentElement.parentElement.classList[0];
            let productID = elem.parentElement.parentElement.parentElement.parentElement.id;

            pid = localStorage.getItem("productDetailed");

            if (productIdClasslist == 'product-details') {
                db.collection('carts').doc(user.phoneNumber).collection("items").doc(productID).delete().then(() => {
                    elem.parentElement.parentElement.parentElement.parentElement.parentElement.remove();
                    let jsonPro = JSON.parse(localStorage.getItem("itemsToBuy"));
                    delete jsonPro[elem.parentElement.parentElement.parentElement.parentElement.parentElement];
                    localStorage.setItem("itemsToBuy", JSON.stringify(jsonPro));
                    snackbar.style.display = "flex";
                    errorSnackbar.style.display = "flex";
                    successSnackbar.style.display = "none";
                    errorSnackbar.innerText = 'Item deleted from the Cart !!'
                    calculate_Total_cart();
                    setInterval(() => {
                        snackbar.style.display = "none";
                        errorSnackbar.style.display = "none";
                    }, 2000);
                }).catch(error => {
                    console.log(error);
                })

                // window.location.reload();
            } else if (productIdClasslist == 'saved-details') {
                db.collection('wishlists').doc(user.phoneNumber).collection("items").doc(productID).delete().then(() => {
                    elem.parentElement.parentElement.parentElement.parentElement.parentElement.remove();
                    snackbar.style.display = "flex";
                    errorSnackbar.style.display = "flex";
                    successSnackbar.style.display = "none";
                    errorSnackbar.innerText = 'Item deleted from the Cart !!'
                    setInterval(() => {
                        snackbar.style.display = "none";
                        errorSnackbar.style.display = "none";
                    }, 2000);
                }).catch(error => {
                    console.log(error);
                })
                // window.location.reload();
            }


        } else {
            // user logged out
            window.location.replace("/login");
        }
    })

}

function paymentProcess() {
    window.location.replace("/payment");
}


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
