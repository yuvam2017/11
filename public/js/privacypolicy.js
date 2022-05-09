const db = firebase.firestore();
const privacyPolicy = document.getElementById('privacyPolicy');

function loadPrivacyPolicy() {
    db.collection("policies").doc("privacy").get().then((docs) => {
        if (docs.exists) {
            console.log("Doc data : ", docs.data()['html']);
            privacyPolicy.innerHTML = docs.data()['html'];
            preloader.style.display = "none";
        } else {
            console.log("No Such Documents");
        }
    }).catch(error => {
        console.log("Error getting document : ", error);
    })
}
loadPrivacyPolicy();