const db= firebase.firestore();
const paymentContainer = document.getElementById('paymentContainer');

function loadPaymentSecurity(){
  db.collection("policies").doc("payment_security").get().then((doc) => {
    if (doc.exists) {
        console.log("Doc data : ",doc.data().html);
        paymentContainer.innerHTML = doc.data().html;
        preloader.style.display = "none";
    } else {
        console.log("No Such Documents");
    }
}).catch(error => {
    console.log("Error getting document : ",error);
}) 
}

loadPaymentSecurity()