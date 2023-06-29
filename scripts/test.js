// Retrieve the necessary elements
const fileInput = document.getElementById('file-input');
const imagePreview = document.getElementById('image-preview');
const captionInput = document.getElementById('caption-input');
const uploadForm = document.getElementById('upload-form');

// Handle file selection
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.addEventListener('load', (event) => {
    const imageUrl = event.target.result;
    imagePreview.innerHTML = `<img src="${imageUrl}" alt="Preview">`;
  });

  reader.readAsDataURL(file);
});

// Handle form submission
uploadForm.addEventListener('submit', (event) => {
  event.preventDefault();
  
  const imageCaption = captionInput.value;
  const imageDataUrl = imagePreview.querySelector('img').src;

  // Perform your upload logic here
  // You can send the image data (data URL) and the caption to your server

  // Clear the form
  fileInput.value = '';
  imagePreview.innerHTML = '';
  captionInput.value = '';
});
