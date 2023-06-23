/* Posts Page JavaScript */
// import {logout} from "./auth.js"

"use strict";

const btnLogOut = document.querySelector("#btnLogOut");

btnLogOut.addEventListener("click", function(event) {
    event.preventDefault;
    logout();
})