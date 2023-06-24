/* Posts Page JavaScript */

"use strict";

// global variables
const btnLogOut = document.querySelector("#btnLogOut");
const formCreatePost = document.querySelector("#formCreatePost");
const bearerToken = getLoginData();
const displayPosts = document.querySelector("#displayPosts");

// when page loads
window.onload = () => {
  displayAllPosts();
}

// logout button
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
  const newPost = document.querySelector("#textBoxPost").value;
  try {
    const response = await fetch(`${apiBaseURL}/api/posts`,
    {
      method: "POST",
      body: JSON.stringify({
        "text": newPost
      }),
      headers: {
        "Content-type": "application/json",
        "Authorization": "Bearer " + bearerToken.token},
    });
    const data = await response.json();
    console.log(data);  //test
  }
  catch(error) {
    console.log(error); //test
  }
  displayAllPosts();
}

// function for displaying all posts
async function displayAllPosts() {
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
      let newDate = new Date(post.createdAt);
      displayPosts.innerHTML += 
      `
      <div class="card mb-2" style="width: 40rem;">
        <div class="card-body">
          <h5 class="card-title">@${post.username}</h5>
          <h6 class="card-subtitle mb-2 text-body-secondary">${newDate.toDateString()}</h6>
          <p>${post.text}</p>
          <p>Likes: ${post.likes.length}</p>
        </div>
      </div>
      `
    }) 
    console.log(Object.values(data));
  }
  catch(error) {
    console.log(error); //test
    displayPosts.innerHTML = error;
  }
}


// this code is for the side menu to work properly
// const profileMenu = document.getElementById("profileMenu");
// const sideActivity = document.getElementById("sidebarActivity");
// const moreLink = document.getElementById("showMoreLink");

// function toggleMenu() {
//   profileMenu.classList.toggle("open-menu");
// }

// function toggleActivity() {
//   sideActivity.classList.toggle("open-activity");

//   moreLink.innerHTML = sideActivity.classList.contains("open-activity") ? "Show less <b>-</b>" : "Show more <b>+</b>";
// }

// profileMenu.addEventListener("click", toggleMenu);
// moreLink.addEventListener("click", toggleActivity);
