const pimg = document.getElementById("pimg");
const address_user = document.getElementById("address_user");
const estimation_date = document.getElementById("estimation_date");
const pid = localStorage.getItem("productDetailed");
const buttontoorder = document.getElementById('buttontoorder');
buttontoorder.addEventListener("click",e => {
  e.preventDefault();
  window.location.replace("/myorders");
})


let database_firestore = firebase.firestore();

let date = new Date();
let five_days = new Date(new Date().getTime()+(5*24*60*60*1000));
let seven_days = new Date(new Date().getTime()+(7*24*60*60*1000));
estimation_date.innerText = `${five_days.getDate()} ${five_days.toLocaleDateString('default',{month : 'short'})} - ${seven_days.getDate()} ${seven_days.toLocaleDateString('default',{month : 'short'})}`;



// Setting the user addresss on which order is to be send via courier.
const user_address = localStorage.getItem("address_user");
address_user.innerText = user_address;

// Fetching the image of the product from the database
database_firestore.collection("products")
  .doc(pid)
  .get()
  .then((qsnap) => {
    const imageurl = qsnap.data().imgurl;
    console.log(imageurl);
    pimg.src = imageurl;
  });


// here we are sloving the condition for the user email notification process
// Logic : IF the user has entered the email then , send the email otherwise ask for the emial via a modal

// User has email just send the notification
const current_user = firebase.firestore();
// if (current_user.email = null || current_user.email == " ")



preloader.style.display = "none";