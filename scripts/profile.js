"use strict";
const postForm = document.getElementById('post-form');
const postInput = document.getElementById('post-input');
const postDisplay = document.getElementById('post-display');

postForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const postContent = postInput.value;

  if (postContent.trim() !== '') {
    displayPost(postContent);
    postInput.value = '';
  }
});

function displayPost(content) {
  const postElement = document.createElement('div');
  postElement.classList.add('post');
  postElement.textContent = content;

  postDisplay.appendChild(postElement);
}



