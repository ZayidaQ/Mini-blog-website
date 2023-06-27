/* Landing Page JavaScript */

"use strict";

const loginForm = document.querySelector("#loginForm");
const signInBtn = document.querySelector("#sign-in-btn");
const signUpBtn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

const signupUsername = document.querySelector("#signupUsername");
const signupFullName = document.querySelector("#signupFullName");
const signupPassword = document.querySelector("#signupPassword");
const signupForm = document.querySelector("#signupForm");


signUpBtn.addEventListener('click', () => {
    container.classList.add("sign-up-mode");
});

signInBtn.addEventListener('click', () => {
    container.classList.remove("sign-up-mode");
});

loginForm.onsubmit = function (event) {
    // Prevent the form from refreshing the page,
    // as it will do by default when the Submit event is triggered:
    event.preventDefault();

    // We can use loginForm.username (for example) to access
    // the input element in the form which has the ID of "username".
    const loginData = {
        username: loginForm.loginUsername.value,
        password: loginForm.loginPassword.value,
    }

    // Disables the button after the form has been submitted already:
    loginForm.loginButton.disabled = true;

    // Time to actually process the login using the function from auth.js!
    login(loginData);
};

signupForm.onsubmit = function(event) {
    event.preventDefault();

    // call signup function and input appropriate field values
    signup(signupUsername.value, signupFullName.value, signupPassword.value);
    alert("Sign up successful!");
    location.reload();    
}

async function signup(_username, _fullName, _password) {
    try {
        fetch(`${apiBaseURL}/api/users`, {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'username': _username,
            'fullName': _fullName,
            'password': _password
        })
        })
    }
    catch(error) {
        console.log(error);
    }
}

