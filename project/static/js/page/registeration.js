document.addEventListener("DOMContentLoaded", function () {
  const uploadBox = document.getElementById("uploadBox");
  const realUploadInput = document.getElementById("real-upload");
  const previewImage = document.getElementById("previewImage");
  const uploadIcon = document.getElementById("uploadIcon");

  const imgNameInput = document.querySelector('input[name="image_name"]');
  const placeInput = document.querySelector('input[name="location"]');
  const descriptionTextarea = document.getElementById("descriptionTextarea");
  const charCountElement = document.getElementById("charCount");

  const submitButton = document.querySelector('button[type="submit"]');

  /**
   * 필수 입력 필드가 유효한지 확인 및 '등록하기' 버튼의 상태 업데이트
   */
  function checkFormValidity() {
    const isImageUploaded = realUploadInput.files.length > 0;

    const isImgNameValid =
      imgNameInput &&
      imgNameInput.value.trim().length >= 2 &&
      imgNameInput.value.trim().length <= 15;

    const isPlaceValid =
      placeInput &&
      placeInput.value.trim().length >= 2 &&
      placeInput.value.trim().length <= 15;

    if (submitButton) {
      submitButton.disabled = !(
        isImageUploaded &&
        isImgNameValid &&
        isPlaceValid
      );
    }
  }

  /* 이미지 파일 업로드 */
  if (uploadBox) {
    uploadBox.addEventListener("click", () => {
      realUploadInput.click();
    });
  }

  /* 이미지 미리보기 업데이트 및 유효성 검사 */
  if (realUploadInput) {
    realUploadInput.addEventListener("change", function () {
      const file = this.files[0];
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

          uploadIcon.style.display = "none";
        };
        reader.readAsDataURL(file);
      } else {
        previewImage.style.display = "none";
        previewImage.src = "";
        uploadIcon.style.display = "block";
      }
      checkFormValidity();
    });
  }

  /* 사진명, 촬영 장소 유효성 검사 */
  [imgNameInput, placeInput].forEach((inputElement) => {
    if (inputElement) {
      inputElement.addEventListener("input", function () {
        const currentLength = this.value.trim().length;
        const conditionP = this.parentElement.nextElementSibling;

        if (conditionP) {
          if (currentLength < 2 || currentLength > 15) {
            conditionP.style.color = "red";
          } else {
            conditionP.style.color = "";
          }
        }
        checkFormValidity();
      });
    }
  });

  /* 사진 설명 필드 글자 수 카운트 및 제한 */
  if (descriptionTextarea && charCountElement) {
    const MAX_MEMO_LENGTH = 20;
    descriptionTextarea.addEventListener("input", function () {
      if (this.value.length > MAX_MEMO_LENGTH) {
        this.value = this.value.slice(0, MAX_MEMO_LENGTH);
      }
      const currentLength = this.value.length;
      charCountElement.textContent = `(${currentLength}/${MAX_MEMO_LENGTH})`;
      charCountElement.style.color =
        currentLength > MAX_MEMO_LENGTH ? "red" : "";
    });

    charCountElement.textContent = `(${descriptionTextarea.value.length}/${MAX_MEMO_LENGTH})`;
  }

  checkFormValidity();
});
