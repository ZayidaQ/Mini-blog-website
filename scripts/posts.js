/* Posts Page JavaScript */

"use strict";

// global variables
const btnLogOut = document.querySelector("#btnLogOut");
// const baseURL = "https://microbloglite.herokuapp.com/";
const formCreatePost = document.querySelector("#formCreatePost");
const bearerToken = getLoginData();
const displayPosts = document.querySelector("#displayPosts");

// when page loads
window.onload = () => {
  displayAllPosts();
}

// logout button event listener
btnLogOut.onclick = function(event) {
    event.preventDefault;
    logout();
}

// when button is clicked, create a post using value from form
formCreatePost.onsubmit = function(event) {
  event.preventDefault;
  createPost();
}

// function for creating a new post
async function createPost() {
  const newPost = document.querySelector("#textBoxPost");
  try {
    const response = await fetch(`${apiBaseURL}/api/posts`,
    {
      method: "POST",
      body: JSON.stringify({
        "text": newPost.value
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": "Bearer " + bearerToken.token},
    });
    const data = await response.json();
    console.log(data);  //test
  }
  catch(error) {
    console.log(error); //test
  }
}

// function for displaying all posts
async function displayAllPosts() {
  let display = "";
  try{
    const response = await fetch(`${apiBaseURL}/api/posts`,
    {
      method: 'GET',
      headers: {
        "Authorization": "Bearer " + bearerToken.token},
    });
    const data = await response.json();
    let newData = Object.values(data);
    newData.forEach(post => {
      displayPosts.innerHTML += `<p>${post.text}</p>`
    }) 
    console.log(Object.values(data));
  }
  catch(error) {
    console.log(error); //test
    displayPosts.innerHTML = error;
  }
}


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
