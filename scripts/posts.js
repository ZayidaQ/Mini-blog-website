/* Posts Page JavaScript */
// import {logout} from "./auth.js"

"use strict";

const btnLogOut = document.querySelector("#btnLogOut");

btnLogOut.addEventListener("click", function(event) {
    event.preventDefault;
    logout();
})


// this code is for the side menu to work properly
const profileMenu = document.getElementById("profileMenu");
const sideActivity = document.getElementById("sidebarActivity");
const moreLink = document.getElementById("showMoreLink");

function toggleMenu() {
  profileMenu.classList.toggle("open-menu");
}

function toggleActivity() {
  sideActivity.classList.toggle("open-activity");

  moreLink.innerHTML = sideActivity.classList.contains("open-activity") ? "Show less <b>-</b>" : "Show more <b>+</b>";
}

profileMenu.addEventListener("click", toggleMenu);
moreLink.addEventListener("click", toggleActivity);
