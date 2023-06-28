/* Posts Page JavaScript */

"use strict";

// global variables
const btnLogOut = document.querySelector("#btnLogOut");
const formCreatePost = document.querySelector("#formCreatePost");
const bearerToken = getLoginData();
const displayPosts = document.querySelector("#displayPosts");
const dropdownSortPosts = document.querySelector("#dropdownSortPosts");
const newPost = document.querySelector("#textBoxPost");
const allBtnDelete = document.getElementsByClassName("btnDelete");
const allBtnLike = document.getElementsByClassName("btnLike");

// when page loads
window.onload = () => {
  dropdownSortPosts.value = "new";
  onDropdownSort(); //change to check post like status onload
  dropdownSortPosts.onchange = onDropdownSort;
}

// logout button
btnLogOut.onclick = () => {
  logout();
}

// when button is clicked, create a post using value from form
formCreatePost.onsubmit = function(event) {
  event.preventDefault();
  createPost(newPost.value);
}


// function for creating a new post
async function createPost(_content) {
  try {
    const response = await fetch(`${apiBaseURL}/api/posts`,
    {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "Authorization": "Bearer " + bearerToken.token},
      body: JSON.stringify({
        "text": _content
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

//function to sort posts onchange of dropdown select
async function onDropdownSort() {
  displayPosts.innerHTML = "";
  let unlikeID = "";
  try{
    const response = await fetch(`${apiBaseURL}/api/posts?limit=1000&offset=0`,
    {
      method: 'GET',
      headers: {
        "Authorization": "Bearer " + bearerToken.token},
    });
    const data = await response.json();
    let newData = Object.values(data);
    console.log(newData); //test
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
      let newDate = new Date(post.createdAt); // for date formatting
      // check if own post to display delete button
      let isPostOwner = false;
      if(bearerToken.username == post.username){
        isPostOwner = true;
      }
      //check if liked or not
      let isLiked = false;
      post.likes.forEach(like => {
        if(like.username == bearerToken.username){
          isLiked = true;
          unlikeID = like._id;
        }
      })
      //
      displayAllPosts(post.username, newDate.toLocaleString(), post.text, post.likes.length, isPostOwner, post._id, isLiked, unlikeID);
    })
  }
  catch(error) {
    console.log(error);
  }
  console.log(allBtnDelete.length); //remove later
  console.log(allBtnLike.length); //remove later

  // like a post when clicked
  for(let i = 0; i < allBtnLike.length; i++){
    allBtnLike[i].onclick = () => {
      if(allBtnLike[i].value == "Unliked"){
        likePost(allBtnLike[i].id);
      }
      else if(allBtnLike[i].value == "Liked"){
        unlikePost(allBtnLike[i].id);
      }
    }
  }

  // delete post when clicked
  for(let i = 0; i < allBtnDelete.length; i++){
    allBtnDelete[i].onclick = () => {
      let text = "Are you sure you want to DELETE your post?"
      if(confirm(text) == true){
        deletePost(allBtnDelete[i].id);
        alert("Post deleted succesfully.");
        location.reload();
      }
    }
  }
}

// function for displaying all posts
function displayAllPosts(_username, _date, _text, _numLikes, _ownPost, _valueID, _isLiked, _unlikeID) {
      let ownPost = ""; //check if post owner so delete button appears
      if(_ownPost){
        ownPost = `<button type="button" class="btn btn-danger float-end btnDelete" id="${_valueID}"><i class="bi bi-trash-fill"></i></button>`;
      }
      else{
        ownPost = "";
      }

      //check if post is liked or not to display appropriate button
      let isLiked = "";
      if(_isLiked){
        isLiked = `<button class="btn btn-primary btnLike" id="${_unlikeID}" value="Liked">Unlike</button>`;
      }
      else{
        isLiked = `<button class="btn btn-primary btnLike" id="${_valueID}" value="Unliked">Like</button>`
      }

      displayPosts.innerHTML += 
      `
      <div class="card mb-2" style="width: 40rem">
        <div class="card-body">
          <h5 class="card-title">@${_username}</h5>
          <h6 class="card-subtitle mb-2 text-body-secondary">${_date}</h6>
          <p>${_text}</p>
          ${isLiked}
          <span>${_numLikes}</span>
          ${ownPost}
        </div>
      </div>
      `
}

// like post function
async function likePost(_postID) {
  try {
    const response = await fetch(`${apiBaseURL}/api/likes`, {
      method: 'POST',
      headers: {
      'accept': 'application/json',
      'Authorization': "Bearer " + bearerToken.token,
      'Content-Type': 'application/json'},
      body: JSON.stringify({
        'postId': _postID
      })
    });
    const data = await response.json();
    console.log(data);
    console.log("Post liked."); //test
    // location.reload();
  }
  catch(error) {
    console.log(error);
  }
}

// unlike post function
async function unlikePost(_postID) {
  try {
    const response = await fetch(`${apiBaseURL}/api/likes/${_postID}`, {
    method: 'DELETE',
    headers: {
      'accept': 'application/json',
      'Authorization': "Bearer " + bearerToken.token}
    });
    const data = await response.json();
    console.log(data); //test
  }
  catch(error) {
    console.log(error);
  }
}

// delete post function
async function deletePost(_postID) {
  try{
    const response = await fetch(`${apiBaseURL}/api/posts/${_postID}`, {
  method: 'DELETE',
  headers: {
    'accept': 'application/json',
    'Authorization': "Bearer " + bearerToken.token},
  });
  const data = await response.json();
  console.log(data); //test
  console.log("Post deleted."); //test
  }
  catch(error){
    console.log(error);
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
