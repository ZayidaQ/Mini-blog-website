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
const btnSubmit = document.querySelector("#btnSubmit");
const btnScrollToTop = document.querySelector(".btnScrollToTop");

// when page loads
window.onload = () => {
  dropdownSortPosts.value = "new";
  onDropdownSort();
  dropdownSortPosts.onchange = onDropdownSort;
}

const wait = (delay = 0) =>
new Promise(resolve => setTimeout(resolve, delay));

const setVisible = (elementOrSelector, visible) => 
(typeof elementOrSelector === 'string'
    ? document.querySelector(elementOrSelector)
    : elementOrSelector
).style.display = visible ? 'block' : 'none';

setVisible('.page', false);
setVisible('#loading', true);

document.addEventListener('DOMContentLoaded', () =>
wait(1000).then(() => {
    setVisible('.page', true);
    setVisible('#loading', false);
}));

// Show or hide button that scrolls to the top of page
window.onscroll = () => {
  scrollFunction();
}

const scrollFunction = () => {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      btnScrollToTop.style.display = "block";
  } 
  else {
      btnScrollToTop.style.display = "none";
  }
}

// logout button
btnLogOut.onclick = () => {
  logout();
}

// when button is clicked, create a post using value from form
btnSubmit.onclick = function(event) {
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
      //call function to display each post
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
      if(allBtnLike[i].dataset.value == "Unliked"){
        allBtnLike[i].className += " clicked";
        likePost(allBtnLike[i].id);
      }
      else if(allBtnLike[i].dataset.value == "Liked"){
        allBtnLike[i].classList.remove("clicked");
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

// This is for generatig random number
function getRandomInteger(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
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
        isLiked = `<div class="post-activity-link btnLike clicked" id="${_unlikeID}" data-value="Liked">
                    <i class="fas fa-heart"></i><span>Unlike</span>
                  </div>`;
      }
      else{
        isLiked = `<div class="post-activity-link btnLike" id="${_valueID}" data-value="Unliked">
                    <i class="fas fa-heart"></i><span>Like</span>
                  </div>`;
      }

      const randomNumber = Math.floor(Math.random() * 150);
      const randomRepost = Math.floor(Math.random() * 40);

      displayPosts.innerHTML += 
      `
      <div class="post">
                <div class="post-author">
                    <img src="../img/OrangeUser.jpeg" alt="Default user">
                    <div>
                        <h1>${_username}</h1>
                        <small>${_date} </small>
                    </div>
                </div>
                <p>
                ${_text}
                </p>

                <div class="post-stats">
                    <div>
                        <span class="liked-users"> ${_numLikes} likes </span>
                    </div>
                    <div>
                        <span> ${randomNumber} comments || ${randomRepost} Repost </span>
                    </div>
                </div>

                <div class="post-activity">
                    <div>
                        <img src="../img/user-1.JPG" alt="" class="post-activity-user-icon">
                    </div>
                    ${isLiked}    
                    <div class="post-activity-link">
                        <i class="fas fa-comment"></i>
                        <span>Comment</span>
                    </div>
                    <div class="post-activity-link">
                        <i class="fas fa-share" ${ownPost}></i>
                        <span>Share</span>
                    </div>
                    <div class="post-activity-link">
                        <i class="fas fa-paper-plane"></i>
                        <span>Send</span>
                    </div>

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
    location.reload();
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
    location.reload();
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
const settingsMenu = document.querySelector(".settings-menu");
const darkBtn = document.getElementById("dark-btn")

function settingsMenuToggle() {
  settingsMenu.classList.toggle("settings-menu-height");
}

darkBtn.onclick = function () {
  darkBtn.classList.toggle("dark-btn-on");
  document.body.classList.toggle("dark-theme");

  if (localStorage.getItem("theme") == "light"){
    localStorage.setItem("theme", "dark");
  }
  else {
    localStorage.setItem("theme", "light");
  }
}

// local storage
if (localStorage.getItem("theme") == "light") {
  darkBtn.classList.remove("dark-btn-on");
  document.body.classList.remove("dark-theme");
}
else if (localStorage.getItem("theme") == "dark") {
  darkBtn.classList.add("dark-btn-on");
  document.body.classList.add("dark-theme");
}
else {
  localStorage.setItem("theme", "light");
}