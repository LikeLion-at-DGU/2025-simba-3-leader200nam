const uploadBox = document.getElementById("uploadBox");
const realUpload = document.getElementById("real-upload");
const previewImage = document.getElementById("previewImage");
const uploadIcon = document.getElementById("uploadIcon");

uploadBox.addEventListener("click", () => {
  realUpload.click();
});

realUpload.addEventListener("change", () => {
  const file = realUpload.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImage.src = e.target.result;
      previewImage.style.display = "block";
      previewImage.style.width = "100%";
      previewImage.style.height = "100%";
      previewImage.style.objectFit = "cover";
      previewImage.style.position = "absolute";
      previewImage.style.top = "0";
      previewImage.style.left = "0";
      previewImage.style.backgroundColor = "white";

      uploadIcon.style.display = "none";
    };
    reader.readAsDataURL(file);
  }
});

const toggle = document.getElementById("visibilityToggle");

const textarea = document.getElementById("descriptionTextarea");
const charCount = document.getElementById("charCount");

textarea.addEventListener("input", () => {
  const currentLength = textarea.value.length;
  charCount.textContent = `(${currentLength}/150)`;
  charCount.style.color = currentLength >= 150 ? "red" : "";
});

// 등록하기 버튼 활성화 로직 추가
const registerForm = document.getElementById("registeration");
const submitButton = registerForm.querySelector('button[type="submit"]');
const imageNameInput = registerForm.querySelector('input[name="image_name"]');
const locationInput = registerForm.querySelector('input[name="location"]');

function validateForm() {
  const imageFilled = realUpload.files.length > 0;
  const imageNameFilled =
    imageNameInput.value.trim().length >= 2 &&
    imageNameInput.value.trim().length <= 15;
  const locationFilled =
    locationInput.value.trim().length >= 2 &&
    locationInput.value.trim().length <= 15;
  submitButton.disabled = !(imageFilled && imageNameFilled && locationFilled);
}

realUpload.addEventListener("change", validateForm);
imageNameInput.addEventListener("input", validateForm);
locationInput.addEventListener("input", validateForm);

document.addEventListener("DOMContentLoaded", validateForm);
