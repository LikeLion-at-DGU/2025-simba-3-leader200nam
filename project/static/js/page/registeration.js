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
  const questIdInput = document.getElementById("questId");

  const maxLength = 150;

  function getQuestIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("quest_id");
  }

  const questId = getQuestIdFromUrl();
  if (questId && questIdInput) {
    questIdInput.value = questId;
  }

  /**
   * 폼 유효성 검사 및 버튼 상태 토글 함수
   */
  function checkFormValidity() {
    const isImageUploaded = realUploadInput.files.length > 0;
    const isImgNameValid =
      imgNameInput.value.trim().length >= 2 &&
      imgNameInput.value.trim().length <= 15;
    const isPlaceValid =
      placeInput.value.trim().length >= 2 &&
      placeInput.value.trim().length <= 15;

    const allRequiredFieldsFilled =
      isImageUploaded && isImgNameValid && isPlaceValid;

    submitButton.disabled = !allRequiredFieldsFilled;
  }

  // 이미지 업로드 박스 클릭
  if (uploadBox) {
    uploadBox.addEventListener("click", function () {
      realUploadInput.click();
    });
  }

  // 실제 파일 입력 필드 변경
  if (realUploadInput) {
    realUploadInput.addEventListener("change", function () {
      const file = realUploadInput.files[0];
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
      } else {
        previewImage.style.display = "none";
        previewImage.src = "";
        uploadIcon.style.display = "block";
      }
      checkFormValidity();
    });
  }

  // '사진명' 입력 필드 변경
  if (imgNameInput) {
    imgNameInput.addEventListener("input", function () {
      const conditionP = imgNameInput.parentElement.nextElementSibling;
      if (conditionP) {
        const currentLength = imgNameInput.value.trim().length;
        if (currentLength < 2 || currentLength > 15) {
          conditionP.style.color = "red";
          conditionP.textContent = "2~15자 이내로 작성해주세요.";
        } else {
          conditionP.style.color = "";
          conditionP.textContent = "2~15자 이내로 작성해주세요.";
        }
      }
      checkFormValidity();
    });
  }

  // '촬영장소' 입력 필드 변경
  if (placeInput) {
    placeInput.addEventListener("input", function () {
      const conditionP = placeInput.parentElement.nextElementSibling;
      if (conditionP) {
        const currentLength = placeInput.value.trim().length;
        if (currentLength < 2 || currentLength > 15) {
          conditionP.style.color = "red";
          conditionP.textContent = "2~15자 이내로 작성해주세요.";
        } else {
          conditionP.style.color = "";
          conditionP.textContent = "2~15자 이내로 작성해주세요.";
        }
      }
      checkFormValidity();
    });
  }

  // '메모' 텍스트 영역 글자 수 카운트
  if (descriptionTextarea && charCountElement) {
    descriptionTextarea.addEventListener("input", function () {
      const currentLength = descriptionTextarea.value.length;
      charCountElement.textContent = `(${currentLength}/${maxLength})`;
      charCountElement.style.color = currentLength >= maxLength ? "red" : "";
    });
  }

  // 페이지 로드 시 초기
  checkFormValidity();

  // '메모' 필드의 초기 글자 수 카운트 설정
  if (descriptionTextarea && charCountElement) {
    charCountElement.textContent = `(${descriptionTextarea.value.length}/${maxLength})`;
  }
});
