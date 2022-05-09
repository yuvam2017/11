const db = firebase.firestore();
const trending_products = document.querySelectorAll('trending-products');
let counterConfetti = 0;
const copyButtonConfetti = document.querySelector('#copyButtonConfetti');


localStorage.clear();

loadIndex().then(() => {
  setTimeout(() => {
    preloader.style.display = "none";
    setTimeout(() => {
      displayConfetti();
    }, 2000);
  }, 4000)
})


function copyCouponCode(element) {
  let text = element.innerText;
  let input_temp = document.createElement("input");

  input_temp.setAttribute("value",text);
  document.body.appendChild(input_temp);

  input_temp.select();
  input_temp.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(input_temp.value);
  
  document.body.removeChild(input_temp);
  
}


function displayConfetti() {

  fetch("/coupons/events")
    .then(res => res.json())
    .then(data => {
      let today_date = new Date();
      let start_date = new Date(data["details"]["start"]);
      let end_date = new Date(data["details"]["end"]);


      if (start_date <= today_date ) {
        if (today_date <= end_date){
          const confettiCanvas = document.querySelector('#my-canvas');
          const confettiPopup = document.querySelector(".confetti-popup");
          const closeConfetti = document.querySelector('#confetti-close');
    
          confettiPopup.classList.add("active");
          confettiCanvas.classList.add("active");
          counterConfetti += 1;
    
    
          closeConfetti.addEventListener("click", e => {
            confettiPopup.classList.remove("active");
            confettiCanvas.classList.remove("active");
          })
  
          const eventName = document.getElementById('eventName');
          const evenTagline = document.getElementById('evenTagline');
          const eventCouponCode = document.getElementById('eventCouponCode');
  
          eventCouponCode.innerText = data["coupons"];
          eventName.innerText = data["details"]["name"];
          evenTagline.innerText = data["details"]["tagline"];
    
          const confettiSettings = { target: 'my-canvas', clock: 50 };
          const confetti = new ConfettiGenerator(confettiSettings);
          confetti.render();
        }
      } else {
        console.log("no Events");
      }




    })
}

try {
  loadTrending();
} catch (error) {
  console.log("this is not the first page of the website");
}

const innerCarousel = document.getElementById("innerCarousel");

if (window.performance && window.performance.navigation.type === window.performance.navigation.TYPE_BACK_FORWARD) {
  alert('Got here using the browser "Back" or "Forward" button.');
}

async function loadIndex() {
  fetch("/home/loadBanner")
    .then(res => res.json())
    .then(data => {
      let counter = 0;
      for (const [keys, values] of Object.entries(data)) {
        if (keys != "images") {
          for (const [key, value] of Object.entries(values)) {
            let imgCaro = document.createElement('div');
            if (counter == 0) {
              imgCaro.setAttribute("class", "carousel-item w-100 active");
              imgCaro.setAttribute("onclick", `window.location.replace("/search/products?tag=${value.query}")`)
              imgCaro.innerHTML = `<img src="${value.imgurl}" class="d-block w-100" alt="${keys}" >`
              counter++;
            } else {
              imgCaro.setAttribute("class", "carousel-item w-100");
              imgCaro.setAttribute("onclick", `window.location.replace("/search/products?tag=${value.query}")`)
              imgCaro.innerHTML = `<img src="${value.imgurl}" class="d-block w-100" alt="${keys}" >`
            }
            innerCarousel.appendChild(imgCaro);
          }
        }
      }

    })


}


function loadTrending() {
  // Changing the cell image url of the trending
  db.collection("homePage").doc('trending').get().then(snapshot => {
    let arrTrending = [];
    arrTrending.push(snapshot.data());
    let counter = 1;
    for (let key in arrTrending[0]) {

      db.collection("products").doc(arrTrending[0][key].trimEnd().trimStart()).get().then(snapshotTrending => {
        let productImage = snapshotTrending.data().imgurl;
        let productPrice = snapshotTrending.data().price;

        const cellIMG = document.getElementById(`cell-img-products-${counter}`);
        cellIMG.parentElement.parentElement.parentElement.id = arrTrending[0][key];
        const cellPrice = document.getElementById(`cell-img-products-price-${counter}`)
        cellIMG.src = productImage;
        cellPrice.innerText = `₹${productPrice}`;
        counter++;
      })
    }
  })

}

// function loadNewProducts() {
//   db.collection('homePage').doc('trending').get().then(snapshot => {
//     let arr_newProducts = [];
//     arr_newProducts.push(snapshot.data());
//     let counter = 1;
//     for (let key in arr_newProducts[0]) {
//       db.collection('products').doc(arr_newProducts[0][key]).get().then(snapshotProducts => {
//         let productImage = snapshotProducts.data().productImage;
//         let productPrice = snapshotProducts.data().productPrice;

//         const productCellImg = document.getElementById(`cell-img-products-${counter}`);
//         productCellImg.parentElement.parentElement.parentElement.id= arr_newProducts[0][key];
//         productCellImg.parentElement.parentElement.parentElement.id=arr_newProducts[0][key];
//         const productCellPrice = document.getElementById(`cell-img-products-price-${counter}`);
//         productCellImg.src = productImage;
//         productCellPrice.innerText = `₹${productPrice}`;
//         counter++;
//       })
//     }
//   })

// }

function trendingReplace(pid) {
  localStorage.setItem("productDetailed", pid);
  window.location.replace(`/pd/${pid}`);
}



// Categories
function catchCategs(element) {
  let keyword = element.children[1].innerText;
  let modKey = String(keyword).replace(" ", "").replace("-", "").toLowerCase();

  localStorage.setItem("toSearchNow", modKey);
  window.location.replace(`/search/products?tag=${modKey}`);
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
