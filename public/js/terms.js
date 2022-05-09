const db = firebase.firestore();
const termsAndCondition = document.getElementById('termsAndCondition');

function loadTermsAndCondition() {
    db.collection("policies").doc("terms_conditions").get().then((doc) => {
        if (doc.exists) {
            console.log("Doc data : ",doc.data().html);
            termsAndCondition.innerHTML = doc.data().html;
            preloader.style.display = "none";
        } else {
            console.log("No Such Documents");
        }
    }).catch(error => {
        console.log("Error getting document : ",error);
    }) 
}
loadTermsAndCondition();


// setInterval(() => {
//     preloader.style.display = "none";
// }, 1000);