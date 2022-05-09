let Keyword;
function setKey(){
  let keyword;
  fetch('/getkey')
    .then(res =>res.text())
    .then(data => {
      localStorage.setItem("toSearchNow",data);
      keyword = localStorage.getItem("toSearchNow");
      Keyword = keyword;
      document.getElementById('title').innerHTML = `${Keyword} | Showing result for the ${Keyword}`;
      loadSearchedProduct();
    })
};

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

const gridView = document.getElementById("gridView");
localStorage.removeItem("productDetailed");
localStorage.removeItem("productDetailedCart");
const decideShipingOrFree = document.getElementById("decideShipingOrFree");
const error404 = document.getElementById('error404');
const db = firebase.firestore();
const containerGallery = document.getElementById('containerGallery');


function loadSearchedProduct() {
  db.collection("products").where("tags", "array-contains", Keyword)
    .get()
    .then(querySnapshot => {
      sizepro = querySnapshot.size;
      if (sizepro == 0) {
        gridView.style.display="none";
        error404.style.display = "flex";
        preloader.style.display = "none";
      }
      querySnapshot.forEach(doc => {
        // doc.data() is never undefined for query doc snapshots
        createCatelogsForSearchedProducts(doc.id, doc.data());
        
      });
      // localStorage.removeItem("toSearchNow");
    })
    .catch(error => {
      console.log("Error getting documents: ", error);
    });
}

setKey();


function createCatelogsForSearchedProducts(pid, data) {

  let arr_products_searched = [];
  arr_products_searched.push(data);


  let create_gallery_p_1 = document.createElement("div");
  create_gallery_p_1.id = pid;
  create_gallery_p_1.setAttribute("class", "gallery-product p-1");
  // create_gallery_p_1.setAttribute("onclick", `productDetailedPage('${pid}')`)


  let productImage = arr_products_searched[0]["imgurl"];
  let productPrice = arr_products_searched[0]["price"];
  let productPriceReal = arr_products_searched[0]["mrp"];
  let productHeading = arr_products_searched[0]["title"];

  create_gallery_p_1.setAttribute("onclick", `window.location.replace('/pd/${pid}')`);


  create_gallery_p_1.innerHTML = ` <a href="/pd/${pid}">
  <img id="galleryImage" src="${productImage}" alt="">
</a>
<div class="heading-product-gallery text-center">${productHeading}</div>
<div class="price-product-gallery text-center"><span id="realPrice">&#8377;${parseFloat(productPrice)}</span><span
    id="decideShipingOrFree${pid}"></span></div>
<div class="striked-product-price-gallery text-center">&#8377;${parseFloat(productPriceReal)}</div>
<div class="certified text-center"><i class="bi bi-check-circle-fill"></i> Pavo Certified </div>`;

  containerGallery.appendChild(create_gallery_p_1);
  checkShippingOrFree(pid, productPrice);
}

function checkShippingOrFree(pid, productPrice) {
  let decideShipingOrFree = document.getElementById(`decideShipingOrFree${pid}`);
  decideShipingOrFree.classList.add("decideShipingOrFree");
  if (parseInt(productPrice) < 599) {
    
  } else if (parseInt(productPrice) > 599) {
    decideShipingOrFree.innerHTML = '<div class="green-dot"></div>&nbsp;Free Delievery';
  }
  preloader.style.display="none";
}

function productDetailedPage(pid) {
  // localStorage.setItem("productDetailed", pid);

  // localStorage.removeItem("toSearchNow");
  window.location.replace(`/pd/${pid}`);
}


