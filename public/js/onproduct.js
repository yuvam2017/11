const db = firebase.firestore();
const database = firebase.database();

const productRealPrice = document.getElementById("productRealPrice");

let size_array = [];
let value_array = [];
let stock_size_product_key = [];
let stock_size_product_value = [];


const btnAddToFavourite = document.getElementById("btnAddToFavourite");

// const pid = localStorage.getItem("productDetailed");
// const keyword = localStorage.getItem("toSearchNow");

const searchQueryDesktop = document.getElementById('searchQueryDesktop');
const searchQueryMobile = document.getElementById('searchQueryMobile');

const search_btn_desktop = document.getElementById('search-btn-desktop');
const search_btn_mobile = document.getElementById('search-btn-mobile');


search_btn_desktop.addEventListener('click', e => {
    e.preventDefault();
    const queryKeyword = String(searchQueryDesktop.value).toLowerCase();
    localStorage.setItem("toSearchNow", queryKeyword)
    window.location.replace(`/search/products?tag=${queryKeyword}`);
});

search_btn_mobile.addEventListener("click", e => {
    e.preventDefault();
    const queryKeyword = String(searchQueryMobile.value).toLowerCase();
    localStorage.setItem("toSearchNow", queryKeyword);
    window.location.replace(`/search/products?tag=${queryKeyword}`);
});


function getPID() {
    fetch("/getpid")
        .then((res) => res.text())
        .then((data) => {
            localStorage.setItem("productDetailed", data);
            getKey(localStorage.getItem("productDetailed"));
            getData();
        });
}

function getKey(pid) {
    // db.collection('products').collection(pid).get().then((snapshot) => {

    // })

    fetch("/getkey")
        .then((res) => res.text())
        .then((data) => {
            localStorage.setItem("toSearchNow", data);
        });
}

function getData() {
    const pid = localStorage.getItem("productDetailed");

    // const keyword = localStorage.getItem("toSearchNow");
    db.collection("products")
        .doc(pid)
        .get()
        .then((snapshot) => {
            let productHeading = snapshot.data().title;
            let productDescription = snapshot.data().description;
            let productImage = snapshot.data().imgurl;
            let productPrice = snapshot.data().price;
            let variations = snapshot.data().variations;
            let additionalImages;
            try {
                additionalImages = snapshot.data().additionalImages;
                addAdditionalImages(additionalImages);
            } catch (error) {
                additionalImages = [01, 2, 5, 3, 6, 9];
            }
            // let cod = snapshot.data().cod;
            // let comment = snapshot.data().review;
            // let moneyBack = snapshot.data().moneyBack;
            let productPriceReal = snapshot.data().mrp;
            let rating = snapshot.data().ratings_individual;
            // let replacement = snapshot.data().replacement;
            // let inStock = snapshot.data().stockQuantity;
            let numberStock = snapshot.data().stock;
            let sizeAvailable = snapshot.data().available_sizes;
            let inStock = snapshot.data().inStock;

            localStorage.setItem("pPrice",productPrice);
            localStorage.setItem("pRealPrice",productPriceReal)

            showData(
                productImage,
                productHeading,
                rating,
                productPrice,
                productPriceReal,
                sizeAvailable,
                variations,
                productDescription,
                inStock,
                numberStock,
                pid
            );
        });
}

window.onload = getPID();

function addAdditionalImages(addimg) {
    // const makeImg = addAdditionalImages(addimg);
    addimg.forEach((element) => {
        let imageClips = document.createElement("img");
        imageClips.setAttribute("class", "product-clips rounded border");
        imageClips.setAttribute("onclick", "changeMainImage(this)");
        imageClips.src = element;
        productImageClips.appendChild(imageClips);
    });
}


async function showData(
    pimg,
    pheading,
    prating,
    pprice,
    prealprice,
    psizeAvailable,
    variations,
    pdescription,
    pstock,
    numberStockProduct,
    pid
) {
    //  Array are :  prating,addimg,psizeAvailable,pcomment;
    // prating,pcomment;
    let rating_array = [];

    for (let key in prating) {
        rating_array.push(prating[key]);
    }


    mainImage.src = pimg;
    mainImage.parentElement.classList.add("normal");
    productHeading.innerText = pheading;

    if (
        productImageClips.childElementCount == 0 ||
        productImageClips.children[0].src != pimg
    ) {
        let main_image_productClips = document.createElement("img");
        main_image_productClips.src = pimg;
        main_image_productClips.setAttribute("onclick", "changeMainImage(this)");
        main_image_productClips.setAttribute(
            "class",
            "product-clips rounded border"
        );
        productImageClips.appendChild(main_image_productClips);
    }

    for (let key in psizeAvailable) {
        let value = psizeAvailable[key];
        size_array.push(key);
        value_array.push(value);
    }
    for (let key in numberStockProduct) {
        stock_size_product_key.push(key);
        stock_size_product_value.push(numberStockProduct[key]);
    }
    const configureSize = configureSizeOptions(size_array);
    let sizeSelected = size_array[0];
    let numberStock = numberStockProduct[sizeSelected];

    if (numberStock > 0) {
        // If the Product is present in stock
        if (numberStock <= 10) {
            // if the stock is less than 10
            inStockElement.innerText = `Hurry !! Only ${numberStock} left`;
            inStockElement.style.color = "#ff4800";
            productPrice.style.display = "block";
            realPrice.style.display = "block";
            btnBuyNow.disabled = false;
            btnAddToCart.disabled = false;
            quantityProduct.removeAttribute("disabled");

            const configureqty = configureQuantity(numberStock);
        } else {
            // if the stock is more than 10
            inStockElement.innerText = `In Stock`;
            inStockElement.style.color = "#56c099";
            productPrice.style.display = "block";
            realPrice.style.display = "block";
            btnBuyNow.disabled = false;
            btnAddToCart.disabled = false;
            quantityProduct.removeAttribute("disabled");

            const configureqty = configureQuantity(10);
        }
    } else {
        // product is out of stock
        productPrice.style.display = "none";
        realPrice.style.display = "none";
        inStockElement.innerText = "Out of Stock";
        inStockElement.style.color = "red";
        document.getElementById("delieveryCharges").style.display = "none";
        btnBuyNow.disabled = true;
        btnAddToCart.disabled = true;
        quantityProduct.setAttribute("disabled", "disabled");
    }

    productDescription.innerText = pdescription;
    doAdditionalDetailWork();
    const comments = showComments(pid);
    const calculateRating = calcRating(rating_array);

    const showRelated = showRelatedProducts();


    const checkFreeOrChargable = checkFree(
        pprice,
        delieveryChargesRow,
        freeDelieveryRow
    );

    productPrice.innerHTML = `${rup}${pprice}`;
    productRealPrice.innerText = `${rup}${prealprice}`;

    makeColorCircle(variations);
}

function changed_size(key) {
    for (let index = 0; index < stock_size_product_key.length; index++) {
        if (key == stock_size_product_key[index]) {
            let numberQuantity = stock_size_product_value[index];
            configureQuantity(numberQuantity);
        }
    }
}

async function configureQuantity(numberStock) {
    while (quantityProduct.firstChild) {
        quantityProduct.removeChild(quantityProduct.firstChild);
    }

    if (numberStock > 0) {
        // If the Product is present in stock
        if (numberStock <= 10) {
            // if the stock is less than 10
            inStockElement.innerText = `Hurry !! Only ${numberStock} left`;
            inStockElement.style.color = "#ff4800";
            productPrice.style.display = "block";
            realPrice.style.display = "block";
            document.getElementById("delieveryCharges").style.display = "block";
            // const configureqty = configureQuantity(numberStock);
            for (let i = 1; i <= numberStock; i++) {
                let divElemQ = document.createElement("option");
                divElemQ.setAttribute("value", i);
                divElemQ.innerText = `${i}`;
                quantityProduct.appendChild(divElemQ);
            }
            quantityProduct.removeAttribute("disabled");
            btnBuyNow.disabled = false;
            btnAddToCart.disabled = false;
        } else {
            // if the stock is more than 10
            inStockElement.innerText = `In Stock`;
            inStockElement.style.color = "#56c099";
            productPrice.style.display = "block";
            realPrice.style.display = "block";
            document.getElementById("delieveryCharges").style.display = "block";
            for (let i = 1; i <= 10; i++) {
                let divElemQ = document.createElement("option");
                divElemQ.setAttribute("value", i);
                divElemQ.innerText = `${i}`;
                quantityProduct.appendChild(divElemQ);
            }
            btnBuyNow.disabled = false;
            btnAddToCart.disabled = false;
            quantityProduct.removeAttribute("disabled");
            // const configureqty = configureQuantity(10);
        }
    } else {
        // product is out of stock
        productPrice.style.display = "none";
        document.getElementById("delieveryCharges").style.display = "none";
        realPrice.style.display = "none";
        inStockElement.innerText = "Out of Stock";
        inStockElement.style.color = "red";
        btnBuyNow.disabled = true;
        btnAddToCart.disabled = true;
        quantityProduct.setAttribute("disabled", "disabled");
    }
}

function configureSizeOptions(size) {
    for (let index = 0; index < size.length; index++) {
        let option = document.createElement("option");
        option.innerText = size[index];
        if (index == 0) {
            option.setAttribute("selected", "selected");
        }
        productSize.appendChild(option);
    }

}

const productClips = document.querySelectorAll(".product-clips");
const productImageClips = document.getElementById("productImageClips");
const mainImage = document.getElementById("mainImage");
const productHeading = document.getElementById("productHeading");
const productRatingOverall = document.getElementById("productRatingOverall");
const productPrice = document.getElementById("productPrice");
const delieveryChargesRow = document.getElementById("delieveryChargesRow");
const freeDelieveryRow = document.getElementById("freeDelieveryRow");
const inStockElement = document.getElementById("inStock");
const realPrice = document.getElementById("productRealPrice");
const productSize = document.getElementById("productSize");
const productDescription = document.getElementById("description");

const additionalDetails = document.getElementById("additionalDetails");

const btnAddToCart = document.getElementById("btnAddToCart");
const btnBuyNow = document.getElementById("btnBuyNow");

const starBox = document.getElementById("starBox");

const userRatings = document.getElementById("userRatings");

const containerSliderRelatedProducts = document.getElementById(
    "containerSliderRelatedProducts"
);

const quantityProduct = document.getElementById("quantityProduct");

btnBuyNow.addEventListener("click", (e) => {
    e.preventDefault();
    if (quantityProduct.childElementCount != 0) {
        let price = localStorage.getItem("pPrice");
        let realPrice = localStorage.getItem("pRealPrice");
        let pidsize = getSelectedOption(productSize);
        let pidquantity = getSelectedOption(quantityProduct);
        let productId = localStorage.getItem("productDetailed");

        appendToLocalStorage(productId,pidsize,pidquantity,price,realPrice);


        localStorage.removeItem("productDetailedCart");
        // proceedToPayment();
        window.location.replace("/payment");
    }
});

// function to append To localStorage in
function appendToLocalStorage(pid,size,qty,price,realPrice){
  let object_product = {}
  object_product[pid] = {pidSize:size, pidQuantity: parseInt(qty), pidPrice: parseInt(price), pidRealPrice : parseInt(realPrice)};
  localStorage.setItem("itemsToBuy",JSON.stringify(object_product));
  localStorage.removeItem("pPrice");
  localStorage.removeItem("pRealPrice");

}

//done
btnAddToCart.addEventListener("click", (e) => {
    e.preventDefault();
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
                // User signed in
            if (quantityProduct.childElementCount != 0) {
                db.collection("carts")
                    .doc(user.phoneNumber)
                    .collection("items")
                    .doc(localStorage.getItem("productDetailed"))
                    .set({});
                btnAddToCart.classList.remove("btn-outline-danger");
                btnAddToCart.classList.add("btn-success");
                btnAddToCart.innerHTML =
                    '<i class="bi bi-check-circle-fill"></i>&nbsp; Go to Cart';
                btnAddToCart.setAttribute("onclick", "replaceToCart()");
            }
        } else {
            // User logged out
            window.location.replace("/login");
        }
    })

});

// done
btnAddToFavourite.addEventListener("click", (e) => {
    e.preventDefault();
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // user signed in
             btnAddToFavourite.innerHTML = `<div class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Loading...</span>
            </div> Adding to Favourites`;
            if (quantityProduct.childElementCount != 0) {
                db.collection("wishlists")
                    .doc(user.phoneNumber)
                    .collection("items")
                    .doc(localStorage.getItem('productDetailed'))
                    .set({});
                btnAddToFavourite.classList.remove("btn-link");
                btnAddToFavourite.classList.remove("btn-light");
                btnAddToFavourite.classList.add("btn-success");
                btnAddToFavourite.style.width = "13rem"
                btnAddToFavourite.innerHTML =
                    '<i class="bi bi-check-circle-fill"></i>&nbsp; Added to Wishlists';
            }
        } else {
            // user logged out
            window.location.replace("/login");
        }
    })

});

//done
function getSelectedOption(element) {
    let strState = element.options[element.selectedIndex].text;
    return strState;
}

//done
function proceedToPayment() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            location.replace("/payment");
        } else {
            location.replace("./login");
        }
    });
}

//done
function replaceToCart() {
    localStorage.removeItem("productDetailedCart");
    window.location.replace("/mycart");
}

let doneSlider = false;

//done

function showRelatedProducts() {
    db.collection("products")
        .doc(localStorage.getItem("productDetailed"))
        .get()
        .then((snapshot) => {
            let variations = snapshot.data().variations;

            for (let index = 0; index < 5; index++) {
                db.collection("products")
                    .doc(variations[index])
                    .get()
                    .then((querysnapshot) => {
                        let pimg = querysnapshot.data().imgurl;
                        let pmrp = querysnapshot.data().price;
                        createTheCellImg(variations[index], pimg, pmrp, index + 1);
                    });
            }
        });
}

//done
function createTheCellImg(id, img, price, counter) {
    let imagerelated = document.getElementById(
        `realted-slider-product-${counter}`
    );
    imagerelated.src = img;
    let priceimagerealtedslider = document.getElementById(
        `related-slider-products-price-${counter}`
    );
    // priceimagerealtedslider.innerHTML = `&#8377;${price}`;
    let cellImg = imagerelated.parentElement;
    cellImg.href = `/pd/${id}`;
    // cellImg.setAttribute("onclick", `productDetailedPage('${id}')`);
}
//done
function productDetailedPage(pid) {
    // let pid = element.pid;
    // console.log(element);
    // console.log(pid);
    localStorage.setItem("productDetailed", pid);
    // localStorage.removeItem("toSearchNow");
    window.location.replace("onproduct.html");
}

function showComments(pid) {
    db.collection("products")
        .doc(pid)
        .collection("reviews")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((docs) => {
                makeUserComment(docs.data());
            });
        });
}

function makeUserComment(data) {
    if (data != null || data != undefined) {
        const userRatingPersonDiv = document.createElement("div");
        userRatingPersonDiv.setAttribute("class", "user-rating-persons");
        userRatingPersonDiv.innerHTML = `
  <div class="upper-details">
    <div class="star-given">
      ${parseFloat(data["rating"]).toFixed(
        1
      )} <i class="bi bi-star-fill" style="color:#ff7b00;"></i>
    </div>
    <div class="date-of-rating">
      ${data["date_time"].split(" ")[0].split("-")[2]} ${
      monthArray[parseInt(data["date_time"].split(" ")[0].split("-")[1]) - 1]
    } ${data["date_time"].split(" ")[0].split("-")[0]}
    </div>
  </div>

  <div class="lower-details">
        <div class="heading-user-name">${data["name"]}</div>
    <div class="user-review">
      ${data["comment"]};
    </div>
  </div>
  `;
        userRatings.appendChild(userRatingPersonDiv);
        let hr = document.createElement("hr");
        userRatings.appendChild(hr);
    } else {}
}

function calcRating(rating) {
    let totalSize = rating.length;
    let oneRating = 0;
    let twoRating = 0;
    let threeRating = 0;
    let fourRating = 0;
    let fiveRating = 0;
    let totalRating = 0;
    rating.forEach((element) => {
        totalRating += element;
        switch (element) {
            case 1:
                oneRating++;
                break;

            case 2:
                twoRating++;
                break;

            case 3:
                threeRating++;
                break;

            case 4:
                fourRating++;
                break;

            case 5:
                fiveRating++;
                break;

            default:
                break;
        }
    });

    let averageRating = Math.round(totalRating / totalSize);
    let fiveRatingPercentage = (fiveRating / totalSize) * 100;
    let fourRatingPercentage = (fourRating / totalSize) * 100;
    let threeRatingPercentage = (threeRating / totalSize) * 100;
    let twoRatingPercentage = (twoRating / totalSize) * 100;
    let oneRatingPercentage = (oneRating / totalSize) * 100;
    console.log(
        fiveRatingPercentage,
        fourRatingPercentage,
        threeRatingPercentage,
        twoRatingPercentage,
        oneRatingPercentage
    );

    // averageRating = 1;

    maketheStar(productRatingOverall, averageRating);

    starBox.innerHTML = `<div class="star-box-rating left big-rating">
    <div class="heading-start">${parseFloat(averageRating).toFixed(1)}</div>
    <div id="userRatingOverall">
    </div>
    <div class="counter-rating-container">
      <i class="bi bi-person-fill"></i>
      <div id="counterRating" class="counter-rating"> ${totalSize} </div>
      &nbsp;total
    </div>
  </div>

  <div class="star-box-rating right-progress-bar">

    <div class="star-box 5-star">
      <div class="star-box-name">
        5<i class="bi bi-star-fill" style="color:#ff7b00"></i>
      </div>
      <div class="progress my-2" style="height: 1.4rem;">
        <div class="progress-bar bg-success" role="progressbar" style="width: ${fiveRatingPercentage}%" aria-valuenow="80"
          aria-valuemin="0" aria-valuemax="100">${fiveRatingPercentage.toFixed(
            2
          )}%</div>
      </div>
    </div>

    <div class="star-box 4-star">
      <div class="star-box-name">
        4<i class="bi bi-star-fill" style="color:#ff7b00"></i>
      </div>
      <div class="progress my-2" style="height: 1.4rem;">
        <div class="progress-bar bg-primary" role="progressbar" style="width: ${fourRatingPercentage}%" aria-valuenow="60"
          aria-valuemin="0" aria-valuemax="100">${fourRatingPercentage.toFixed(
            2
          )}%</div>
      </div>
    </div>

    <div class="star-box 3-star">
      <div class="star-box-name">
        3<i class="bi bi-star-fill" style="color:#ff7b00"></i>
      </div>
      <div class="progress my-2" style="height: 1.4rem;">
        <div class="progress-bar bg-warning" role="progressbar" style="width: ${threeRatingPercentage}%" aria-valuenow="40"
          aria-valuemin="0" aria-valuemax="100">${threeRatingPercentage.toFixed(
            2
          )}%</div>
      </div>
    </div>

    <div class="star-box 2-star">
      <div class="star-box-name">
        2<i class="bi bi-star-fill" style="color:#ff7b00"></i>
      </div>
      <div class="progress my-2" style="height: 1.4rem;">
        <div class="progress-bar bg-danger" role="progressbar" style="width: ${twoRatingPercentage}%" aria-valuenow="20" aria-valuemin="0"
          aria-valuemax="100">${twoRatingPercentage.toFixed(2)}%</div>
      </div>
    </div>

    <div class="star-box 1-star">
      <div class="star-box-name">
        1<i class="bi bi-star-fill" style="color:#ff7b00"></i>
      </div>
      <div class="progress my-2" style="height: 1.4rem;">
        <div class="progress-bar bg-danger" role="progressbar" style="width: ${oneRatingPercentage}%" aria-valuenow="10" aria-valuemin="0"
          aria-valuemax="100">${oneRatingPercentage.toFixed(2)}%</div>
      </div>
    </div>`;
    const userRatingOverall = document.getElementById("userRatingOverall");
    maketheStar(userRatingOverall, averageRating);
}

function checkFree(price, delieveryElement, freeDelieveryElement) {
    if (price > 599) {
        delieveryElement.style.display = "none";
        freeDelieveryElement.style.display = "block";
    } else if (price < 599) {
        delieveryElement.style.display = "block";
        freeDelieveryElement.style.display = "none";
    }
}

const colorVariantParent = document.getElementById("colorVariantParent");

const inputPincode = document.getElementById("inputPincode");
const btnPincode = document.getElementById("btnPincode");
const affirmativeDelhi = document.getElementById("affirmativeDelhi");
const negativeDelhi = document.getElementById("negativeDelhi");
const pincodeDistrict = document.getElementById("pincodeDistrict");

function checkCharges() {
    btnPincode.innerHTML = ` <div class="spinner-grow spinner-grow-sm" role="status">
  <span class="visually-hidden">Loading...</span>
</div> CHECKING`


                let pincode = inputPincode.value;
                // /calcCharges/https://track.delhivery.com/api/kinko/v1/invoice/charges/.json?md=S&cgm=500&o_pin=277001&d_pin=${pincode}&ss=DTO/${api}

                fetch(`/delivery/charges/${pincode}`)
                    .then((res) => res.json())
                    .then((data) =>
                        chargeVary(data[0]['total_amount'])
                    );


}

function chargeVary(total_amount){
    btnPincode.innerHTML = `CHECK`;
    if (total_amount > 0){
        affirmativeDelhi.style.display = "block";
        negativeDelhi.style.display = "none";
        pincodeDistrict.innerText = inputPincode.value;
    } else {
        affirmativeDelhi.style.display = "none";
        negativeDelhi.style.display = "block";
        // pincodeDistrict.innerText = inputPincode.value;
    }
}


inputPincode.addEventListener("keyup", (e) => {
    if (e.key == "Enter") {

        checkCharges();
    }
});

btnPincode.addEventListener("click", () => {

    checkCharges();
});

// When the color variant is clicked
function changetheColor(element) {
    // let colorCode = element;
    let newpid = element.classList[2];
    localStorage.setItem("productDetailed", newpid);
    window.location.replace(`/pd/${newpid}`);
}

// When the color vairant is created
async function makeColorCircle(variations) {
    // let counter = 0;
    variations.forEach((element) => {
        db.collection("products")
            .doc(element)
            .get()
            .then((snapshot) => {
                let variants = snapshot.data().imgurl;
                let divElem = document.createElement("div");
                divElem.setAttribute(
                    "class", `m-3 color-variant ${element}`
                );
                divElem.setAttribute("onclick", "changetheColor(this)");
                divElem.innerHTML = ` <img width="80px" height="96px" name="variant" src="${variants}" alt = "alt">`;
                colorVariantParent.appendChild(divElem);
            });
        return true;
    });
    preloader.style.display = "none";
}

function mouseOverCircle(element) {
    let imageURL = element.classList[1];
    localStorage.setItem("StoredByteMainImage", mainImage.src);
    mainImage.src = imageURL;
}

function mouseOutCircle(element) {
    mainImage.src = localStorage.getItem("StoredByteMainImage");
    localStorage.removeItem("StoredByteMainImage");
}

function doAdditionalDetailWork(money, cod, replace) {
    let moneyElem = document.createElement("li");
    let codElem = document.createElement("li");
    let replaceElem = document.createElement("li");

    moneyElem.innerText = "7 days Money Back Guarantee";
    // }
    // if (cod == true) {
    codElem.innerText = "Cash On Delievery";
    // }
    // if (replace == true) {
    replaceElem.innerText = "7 days Replacement Policy";
    // }
}

function changeMainImage(element) {
    mainImage.src = element.src;
}

function maketheStar(eleid, average) {
    let nonfill = 5 - average;
    for (let index = 0; index < average; index++) {
        let star_fill = document.createElement("i");
        star_fill.setAttribute("class", "bi bi-star-fill star-yellow");
        eleid.appendChild(star_fill);
    }
    for (let index2 = 0; index2 < nonfill; index2++) {
        let star_empty = document.createElement("i");
        star_empty.setAttribute("class", "bi bi-star star-yellow");
        eleid.appendChild(star_empty);
    }
}
