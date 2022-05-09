const db = firebase.firestore();
const returnContainer = document.getElementById('returnContainer');

function loadReturnPolicy(){
    db.collection("policies").doc("return").get().then((doc) => {
        if (doc.exists) {
            console.log("Doc data : ",doc.data().html);
            returnContainer.innerHTML = doc.data().html;
            preloader.style.display = "none";
        } else {
            console.log("No Such Documents");
        }
    }).catch(error => {
        console.log("Error getting document : ",error);
    }) 
}
loadReturnPolicy();

// setInterval(() => {
//     preloader.style.display = "none";
// }, 1000);