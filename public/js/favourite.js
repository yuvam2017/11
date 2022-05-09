const noContainer = document.getElementById("no-favourites-container");
const mainContainer = document.getElementById("main-container");
const userName = document.getElementById("userName");
const user = firebase.auth().currentUser;
const db = firebase.firestore();
// noContainer.style.display = "none";
// mainContainer.style.display = "none";

function getFavourites() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      noContainer.style.display = "none";
      mainContainer.style.display = "block";
      userName.innerHTML = user.displayName;
      db.collection("wishlists")
        .doc(user.phoneNumber)
        .collection("items")
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.size > 0) {
            querySnapshot.forEach((docs) => {
              console.log(docs.id);
              db.collection("products")
                .doc(docs.id.trimEnd().trimStart())
                .get()
                .then((snapshot) => {
                  let productImage = snapshot.data().imgurl;
                  let productHeading = snapshot.data().title;
                  let productPrice = snapshot.data().price;
                  showFavourites(
                    productImage,
                    productHeading,
                    productPrice,
                    docs.id.trimEnd().trimStart()
                  );
                });
            });
          } else {
            noContainer.style.display = "flex";
            mainContainer.style.display = "none";
            preloader.style.display = "none";
          }
        });
    } else {
      noContainer.style.display = "flex";
      mainContainer.style.display = "none";
      preloader.style.display = "none";
    }
  });
}
getFavourites();

function showFavourites(image, heading, price, pid) {
  let mainDiv = document.createElement("div");
  mainDiv.setAttribute(
    "class",
    `my-3 row d-flex product-images-texts-buttons ${pid}`
  );
  mainDiv.id = `${pid}`;
  mainDiv.innerHTML = `
            <div onclick="redirectOnProduct('${pid}')" class="col-md-auto product-image">
                  <img src="${image}" alt="product images">
            </div>

            <div class="col text-center my-3 trigger-width cet-fcol">
                  <div class="row ">
                        <div class="col">

                              <a href="#">
                                    <h5>${heading}</h5>
                              </a>
                        </div>
                  </div>
                  <div class="row rating">
                        <div class="col">

                        </div>
                  </div>
                  <div class="row d-flex  product-price">
                        <div class="col">
                              Price : &#8377; <span id="product-price">${price}</span>
                        </div>
                  </div>
            </div>

            <div class="col w-100 cet-fcol">
                  <div class="row text-center">
                        <div class="col">
                              <button onclick="addToCart(this)" class="button-col-last my-1 btn btn-primary"><i class="bi bi-cart-plus-fill"></i>Add to Cart</button>
                        </div>
                  </div>
                  <div class="row text-center">
                        <div class="col">
                              <button onclick="deleteItem(this)" class="button-col-last my-1 btn btn-secondary">Delete</button>
                        </div>
                  </div>
            </div>`;
  mainContainer.appendChild(mainDiv);
  preloader.style.display = "none";
}

function deleteItem(elem) {
  let pelem = elem.parentElement.parentElement.parentElement.parentElement;
  let col = elem.parentElement;
  col.innerHTML = `<button class="btn btn-secondary" type="button" disabled>
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Deleting ....
                  </button>`;
  const user = firebase.auth().currentUser;
  // let user.phoneNumber = firebase.auth().currentUser.user.phoneNumber;
  let pid = pelem.id;
  db.collection("wishlists")
    .doc(user.phoneNumber)
    .collection("items")
    .doc(pid)
    .delete()
    .then(() => {
      snackbar.style.display = "flex";
      successSnackbar.style.display = "none";
      errorSnackbar.style.display = "flex";
      errorSnackbar.innerText = "Item Deleted from the Cart !";
      pelem.remove();
    })
    .catch((error) => {
    });

  setInterval(() => {
    snackbar.style.display = "none";
    successSnackbar.style.display = "none";
    errorSnackbar.style.display = "none";
  }, 2000);

  // window.location.reload();
}

const snackbar = document.getElementById("snackbar");
const errorSnackbar = document.getElementById("errorSnackbar");
const successSnackbar = document.getElementById("successSnackbar");

function addToCart(elem) {
  let pelem = elem.parentElement.parentElement.parentElement.parentElement;
  let col = elem.parentElement;
  col.innerHTML = `<button class="btn btn-primary button-col-last" type="button" disabled>
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Adding ...
                  </button>`;
  const user = firebase.auth().currentUser;
  // let user.phoneNumber = firebase.auth().currentUser.user.phoneNumber;
  let counter = 0;
  let pid = pelem.id;
  db.collection("carts")
    .doc(user.phoneNumber)
    .collection("items")
    .doc(pid)
    .set({});
  db.collection("wishlists")
    .doc(user.phoneNumber)
    .collection("items")
    .doc(pid)
    .delete()
    .then(() => {
      snackbar.style.display = "flex";
      successSnackbar.style.display = "flex";
      errorSnackbar.style.display = "none";
      successSnackbar.innerText = "Added to the Cart !";
      counter = 520;
      pelem.remove();
    })
    .catch((error) => {
      console.log(error);
    });

  setInterval(() => {
    snackbar.style.display = "none";
    successSnackbar.style.display = "none";
    errorSnackbar.style.display = "none";
  }, 2000);

  if (mainContainer.childElementCount == 2) {
    noContainer.style.display = "block";
    mainContainer.style.display = "none";
  }
}
