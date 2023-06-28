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

// when page loads
window.onload = () => {
  dropdownSortPosts.value = "new";
  onDropdownSort();
  dropdownSortPosts.onchange = onDropdownSort;
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
      //
      displayAllPosts(post.username, newDate.toLocaleString(), post.text, post.likes.length, isPostOwner, post._id);
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
      likePost(allBtnLike[i].id);
      console.log(allBtnLike[i].id);//test remove later
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
function displayAllPosts(_username, _date, _text, _numLikes, _ownPost, _valueID ) {
      let ownPost = ""; //check if post owner so delete button appears
      if(_ownPost){
        ownPost = `<button type="button" class="btn btn-danger float-end btnDelete" id="${_valueID}"><i class="bi bi-trash-fill"></i></button>`;
      }
      else{
        ownPost = "";
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
                        <i class="fas fa-heart" style="color: #ef4f4f;"></i>
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
                    <div class="post-activity-link">
                        <i class="far fa-heart" id="${_valueID}"></i></i>
                        <span>Like</span>
                    </div>
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

//check if post is liked or not
// async function isPostLiked(_post, _username) {
//   try {
//     const response = await fetch(`${apiBaseURL}/api/posts`,
//     {
//       method: 'GET',
//       headers: {
//         "Authorization": "Bearer " + bearerToken.token},
//     });
//     const data = response.json();
//     let newData = Object.values(data);
//     newData.forEach(post => {

//     })
//   }
//   catch(error) {
//     console.log(error);
//   }
// }


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
async function unlikePost(_post) {
  try {
    const response = await fetch(`${apiBaseURL}/api/likes/${_likeID}`, {
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