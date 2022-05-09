const profilePic = document.getElementById('profilePic');
const preloader = document.getElementById('preloader');
const rup = '₹';

/*Notice Banner*/
let noticeBanner = document.getElementById("noticeBanner");

// // ################# PAYMENT ######################
// function processPayment(amount) {
//     firebase.auth().onAuthStateChanged(user => {
//         if (user) {
//             let options = {
//                 "key": "rzp_test_iCZFlbGxbBaYLN", // Enter the Key ID generated from the Dashboard
//                 "amount": amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
//                 "currency": "INR",
//                 "name": "11Things",
//                 "description": "Buy the Latest Fashion",
//                 //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
//                 "handler": function (response) {
//                     savetoDb(response);
//                     alert(response.razorpay_payment_id);
//                     alert(response.razorpay_order_id);
//                     alert(response.razorpay_signature)
//                 },
//                 "prefill": {
//                     "name": user.displayName,
//                     "email": user.email,
//                     "contact": user.phoneNumber,
//                 },
//                 "notes": {
//                     "address": "Razorpay Corporate Office"
//                 },
//                 "theme": {
//                     "color": "#5509c"
//                 }
//             }
//             let propay = new Razorpay(options);
//             propay.open();

//         } else {

//         }
//     })

// }

// ################################################

const subscriptionEmail= document.getElementById("subscriptionEmail");

function adUserSubscription() {
    fetch(`/send_email/${subscriptionEmail.value}`)
        .then(res => res.json())
        .then(data => {
        })
}

function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("active");
}

let menuBtn = document.getElementById("menuBtn");
let slider = document.getElementById("sidebar");
menuBtn.addEventListener("click", () => {
    toggleSidebar();
});

document.addEventListener("mouseup", (e) => {
    let container = document.getElementById("sidebar-content");
    let sidebar = document.getElementById('sidebar');
    let classlist = sidebar.classList;
    if (!container.contains(e.target)) {
        if (Array.from(classlist).includes("active")) {
            toggleSidebar();
        }
    }
});





let cuse = {
    userMenu: document.getElementById('menu'),
    userFavourite: document.getElementById('favourite'),
    userCart: document.getElementById('cart'),
    userMyCart: document.getElementById('mycart'),
    userAccount: document.getElementById('account'),
    userLogin: document.getElementById('login'),
    // userMenu: document.getElementById('menus'),
    userProfilePic: document.getElementById('.account')
}
let sidebarThings = {
    sidebarloginHeader: document.querySelector('.unprofiled-login-signup'),
    sidebarProfile: document.querySelector('.profiled'),
    sidebarMyaccount1: document.getElementById('myaccount-type1'),
    sidebarMyaccount2: document.getElementById('myaccount-type2'),
    sidebarloginbtn: document.getElementById('login-li'),
    sidebarlogoutbtn: document.getElementById('logout-li')
}

let username = document.querySelectorAll('#userName');

function respondWithResponsiveNess(userState) {
    if (userState == "affirmative") {
        if (window.innerWidth > 998) {
            // User is in Desktop Mode
            cuse.userMenu.style.display = "none";
            cuse.userFavourite.style.display = "block";
            cuse.userCart.style.display = "block";
            cuse.userAccount.style.display = "block";
            cuse.userLogin.style.display = "none";

        }
        else if (window.innerWidth <= 998 && window.innerWidth > 620) {
            // User is in Tablet Mode
            cuse.userMenu.style.display = "block";
            cuse.userFavourite.style.display = "block";
            cuse.userCart.style.display = "block";
            cuse.userAccount.style.display = "block";
            cuse.userLogin.style.display = "none";

            sidebarThings.sidebarloginHeader.style.display = "none";
            sidebarThings.sidebarloginbtn.style.display = "none";
            sidebarThings.sidebarlogoutbtn.style.display = "block";
            sidebarThings.sidebarMyaccount1.style.display = "block";
            sidebarThings.sidebarMyaccount2.style.display = "block";
            sidebarThings.sidebarProfile.style.display = "block";


        }
        else if (window.innerWidth <= 620) {
            // User is in Mobile Mode
            cuse.userMenu.style.display = "block";
            cuse.userFavourite.style.display = "none";
            cuse.userCart.style.display = "block";
            cuse.userAccount.style.display = "none";
            cuse.userLogin.style.display = "none";

            sidebarThings.sidebarloginHeader.style.display = "none";
            sidebarThings.sidebarMyaccount1.style.display = "block";
            sidebarThings.sidebarMyaccount2.style.display = "block";
            sidebarThings.sidebarProfile.style.display = "block";
            sidebarThings.sidebarlogoutbtn.style.display = "block";
            sidebarThings.sidebarloginbtn.style.display = "none";

        }
    }
    else if (userState == "negative") {
        if (window.innerWidth > 998) {
            // User is in Desktop Mode
            cuse.userMenu.style.display = "none";
            cuse.userFavourite.style.display = "none";
            cuse.userCart.style.display = "block";
            cuse.userAccount.style.display = "none";
            cuse.userLogin.style.display = "block";



        }
        else if (window.innerWidth <= 998 && window.innerWidth > 620) {
            // User is in Tablet Mode
            cuse.userMenu.style.display = "block";
            cuse.userFavourite.style.display = "none";
            cuse.userCart.style.display = "block";
            cuse.userAccount.style.display = "none";
            cuse.userLogin.style.display = "block";

            sidebarThings.sidebarloginHeader.style.display = "block";
            sidebarThings.sidebarloginbtn.style.display = "block";
            sidebarThings.sidebarlogoutbtn.style.display = "none";
            sidebarThings.sidebarMyaccount1.style.display = "none";
            sidebarThings.sidebarMyaccount2.style.display = "none";
            sidebarThings.sidebarProfile.style.display = "none";

        }
        else if (window.innerWidth <= 620) {
            // User is in Mobile Mode
            cuse.userMenu.style.display = "block";
            cuse.userFavourite.style.display = "none";
            cuse.userCart.style.display = "block";
            cuse.userAccount.style.display = "none";
            cuse.userLogin.style.display = "block";

            sidebarThings.sidebarloginHeader.style.display = "block";
            sidebarThings.sidebarloginbtn.style.display = "block";
            sidebarThings.sidebarlogoutbtn.style.display = "none";
            sidebarThings.sidebarMyaccount1.style.display = "none";
            sidebarThings.sidebarMyaccount2.style.display = "none";
            sidebarThings.sidebarProfile.style.display = "none";
        }
    }
}

function returnUserState() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) { console.log("user logged in"); return 'affirmative' } else { return 'negative' }
    })
}

window.addEventListener('resize', respondWithResponsiveNess(returnUserState))


function checkInternetConnection() {
    if (navigator.onLine) {
    } else {
        location.replace("noconnection.html");
    }
}

// First Function to be checked whether user is signed in or not
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        try {
            const prflpic = firebase.auth().currentUser.photoURL;
        } catch (error) {
            console.log("Profile URL is empty setting the deafult one");
        }
        respondWithResponsiveNess('affirmative')
    }
    else {

        respondWithResponsiveNess('negative')

    }
})

//redirect to login page
function toLogin() {
    window.location.replace("/login");
}

// redirect to cart
function redirectToCart() {
    window.location.replace('/mycart');
}

// Shop Now button in the image banner
function shopNow() {
    alert("You just clicked the Shop Now Button");
}


// Function to alert the user



// ############################ MODAL ####################################

let modalLogout = document.querySelector('.modal-container');

document.getElementById("logout").addEventListener("click", showModal);

let logout_button = document.getElementById("logout-button");
logout_button.addEventListener("click", e => {
    firebase.auth().signOut().then(() => {
        window.location.replace("/");
    }).catch(error => {
        console.log("Error in Signing out")
    })
})

// User logout event
document.querySelector(".yesmodal").addEventListener("click", e => {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        modalLogout.style.display = "none";
        window.location.replace("/login")
    }).catch((error) => {
        // An error happened.
        console.log("Eeeeerro e Not signned oyt")
    });
})

// User cancel the logout event 
document.querySelector('.cancelmodal').addEventListener("click", e => {
    modalLogout.style.display = "none";
})

//make Logout modal visible 
function showModal() {
    modalLogout.style.display = "block";

}

function redirectOnProduct(pid) {
    localStorage.setItem("productDetailed", pid);
    window.location.replace(`/pd/${pid}`);
}





