let db = firebase.firestore();

window.onload = function () {
    render();
}

function render() {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    recaptchaVerifier.render();
}

setInterval(() => {
    preloader.style.display = "none";
}, 1000);

const loginEmail = document.getElementById('loginEmail');
const closeVerify = document.getElementById('closeVerify');
const submitButton = document.getElementById('submit');
const otpInput = document.getElementById("otp-login");
const verificationCode = document.getElementById("verificationCode");
const errorMessageElement = document.getElementById("errorMessage");
const loginContainer = document.getElementById("loginContainer");

function checkPhoneNumber() {
    let number = loginEmail.value;
    if (number.length == 13) {
        if (number.slice(0, 3) == '+91') {
            loginUsingPhoneNumber(number);
        } else {
            errorMessageElement.style.display = "block";
        }

    } else if (number.length == 10) {
        let newNumber = '+91' + number;
        loginUsingPhoneNumber(newNumber);
    }
}

function loginUsingPhoneNumber(number) {
    // let number =  number.toString();
    firebase.auth().signInWithPhoneNumber(number, window.recaptchaVerifier).then(confirmationResult => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        coderslt = confirmationResult;
        verificationCode.style.display = "block";
        closeVerify.style.display = "block";
        // ...
    }).catch((error) => {
        console.log(error);
        errorMessageElement.style.display = "block";
    });

}

otpInput.addEventListener('keypress', e => {
    if (e.key == 'Enter'){
        e.preventDefault();
        checkOTP();
    }
});

function checkOTP() {
    let code = otpInput.value;
    coderslt.confirm(code).then((result) => {
        // User signed in successfully.
        const user = result.user;
        db.collection("users").doc(user.phoneNumber);
        window.location.replace("/");
        return true;
        // ...
    }).catch(error => {
        // User couldn't sign in (bad verification code?)
        // ...
        console.log(error);
    });

}

closeVerify.addEventListener("click", e => {
    e.preventDefault();
    closeVerify.style.display = "none";
    verificationCode.style.display = "none";
})
