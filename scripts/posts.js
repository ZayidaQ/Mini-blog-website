/* Posts Page JavaScript */

"use strict";

// global variables
const btnLogOut = document.querySelector("#btnLogOut");
const formCreatePost = document.querySelector("#formCreatePost");
const bearerToken = getLoginData();
const displayPosts = document.querySelector("#displayPosts");
const dropdownSortPosts = document.querySelector("#dropdownSortPosts");

// when page loads
window.onload = () => {
  dropdownSortPosts.value = "new";
  onDropdownSort();
  dropdownSortPosts.onchange = onDropdownSort;
}

// logout button
btnLogOut.onclick = function(event) {
  logout();
}

// when button is clicked, create a post using value from form
formCreatePost.addEventListener("submit", function(event) {
  event.preventDefault();
  createPost();
})

// function for creating a new post
async function createPost() {
  const newPost = document.querySelector("#textBoxPost").value;
  try {
    const response = await fetch(`${apiBaseURL}/api/posts`,
    {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "Authorization": "Bearer " + bearerToken.token},
      body: JSON.stringify({
        "text": newPost
      }),
      redirect: 'follow',
    });
    const data = await response.json();
    console.log(data);  //test
  }
  catch(error) {
    console.log(error);
  }
  location.reload();
}

//function to sort onchange of dropdown select
async function onDropdownSort() {
  displayPosts.innerHTML = "";
  try{
    const response = await fetch(`${apiBaseURL}/api/posts`,
    {
      method: 'GET',
      headers: {
        "Authorization": "Bearer " + bearerToken.token},
    });
    const data = await response.json();
    let newData = Object.values(data);
    // console.log(newData); //test
    if(dropdownSortPosts.value == "new") {
      newData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    else if(dropdownSortPosts.value == "popular") {
      newData.sort((a, b) => b.likes.length - a.likes.length);
    }
    else if(dropdownSortPosts.value == "username") {
      newData.sort((a, b) => b.username.toLowerCase() > a.username.toLowerCase() ? -1 : 1);
    }
    newData.forEach(post => {
      let newDate = new Date(post.createdAt);
      let isPostOwner = false;
      if(bearerToken.username == post.username){
        isPostOwner = true;
      }
      displayAllPosts(post.username, newDate.toLocaleString(), post.text, post.likes.length, isPostOwner);
    })
  }
  catch(error) {
    console.log(error);
  }
}

// function for displaying all posts
function displayAllPosts(_username, _date, _text, _numLikes, _ownPost) {
      let ownPost = "";
      if(_ownPost){
        ownPost = `<button class="btn btn-danger float-end btnDelete"><i class="bi bi-trash-fill"></i></button>`;
      }
      else{
        ownPost = "";
      }
      displayPosts.innerHTML += 
      `
      <div class="card mb-2" style="width: 40rem;">
        <div class="card-body">
          <h5 class="card-title">@${_username}</h5>
          <h6 class="card-subtitle mb-2 text-body-secondary">${_date}</h6>
          <p>${_text}</p>
          <button class="btn btn-primary btnLike">Like</button>
          <span>${_numLikes}</span>
          ${ownPost}
        </div>
      </div>
      `
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
