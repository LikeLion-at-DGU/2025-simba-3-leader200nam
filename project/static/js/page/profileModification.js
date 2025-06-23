const uploadBox = document.getElementById("imageUploadBox");
const fileInput = document.getElementById("profile-image-upload");
const previewImg = document.getElementById("previewProfileImage");

uploadBox.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (file) {
    previewImg.src = URL.createObjectURL(file);
    previewImg.classList.add("uploaded"); 
  }
});
const changeText = document.getElementById("changeProfileText");

changeText.addEventListener("click", () => {
  fileInput.click(); 
});
