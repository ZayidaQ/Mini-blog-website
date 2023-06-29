/* Profile Page JavaScript */

"use strict";

// global variables
const btnLogOut = document.querySelector("#btnLogOut");
const formCreatePost = document.querySelector("#formCreatePost");
const bearerToken = getLoginData();
const displayPosts = document.querySelector("#displayPosts");
const dropdownSortPosts = document.querySelector("#dropdownSortPosts");
const allBtnDelete = document.getElementsByClassName("btnDelete");
//specific user variables
const loginData = getLoginData()
const currentUser = (loginData).username
 

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

// when button is clicked
formCreatePost.onsubmit = function(event) {
  event.preventDefault();
  createPost();
}

// Function for user to edit bio

function getbio() {
  fetch(`https://microbloglite.herokuapp.com/api/users?username=${currentUser}`, {
    method: "GET", 
    headers: {
      "Authorization": `Bearer ${loginData.token}`,
      "Content-type": "application/json; charset=UTF-8"
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Error retrieving data from the API");
    }
    return response.json();
  })
  .then(data => {
    // Access the 'about' property within the 'user' object
    const about = data.user.about;
    
    // Use the 'about' value as needed
    console.log(about);
  })
  .catch(error => {
    console.error(error);
  });
}

getbio()



// Function to display posts from current user 
function displayPost () {
  fetch(`https://microbloglite.herokuapp.com/api/posts?username=${currentUser}`, {
    method: "GET", 
    headers: {"Authorization": `Bearer ${loginData.token}`,
            "Content-type":
            "application/json; charset=UTF-8"}
})
.then(response => response.json())
.then(data => {
  let currentUserPosts = data.filter(post => post.username === currentUser);
// to display post on screen 
        currentUserPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    console.log(currentUserPosts)
    const displayPost = document.querySelector("#displayPosts")
    let str = '';
     for (const post of currentUserPosts) {

      str += `
      <div class="card" style="width: 18rem;">
    
    <div class="card-body">
      <h5 class="card-title">Username:${post.username}</h5>
      <p class="card-text">Post: ${post.text}</p>
      <p class="card-text">Time: ${post.createdAt}</p>
      <p class="card-text">Likes: ${post.likes.length}</p>

      <a href="#" class="btn btn-primary">More</a>
    </div>
  </div>
      <br>
      `
      }
      displayPost.innerHTML = str;
 
      });
    } 
displayPost()

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
    console.log('data:', data);  //test
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
      let newDate = new Date(post.createdAt); // for date formatting
      // check if own post to display delete button
      let isPostOwner = false;
      if(bearerToken.username == post.username){
        isPostOwner = true;
      }
      displayAllPosts(post.username, newDate.toLocaleString(), post.text, post.likes.length, isPostOwner, post._id);
    })
  }
  catch(error) {
    console.log(error);
  }
}

// side menu to work
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
