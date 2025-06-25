document.addEventListener("DOMContentLoaded", () => {
  const uploadBox = document.getElementById("imageUploadBox");
  const fileInput = document.getElementById("profile-image-upload");
  const previewImg = document.getElementById("previewProfileImage");
  const changeProfileText = document.getElementById("changeProfileText");
  const nicknameInput = document.getElementById("nickname");
  const majorInput = document.getElementById("major_name");
  const bioInput = document.getElementById("bio");
  const bioDescription = document.getElementById("description");
  const submitButton = document.querySelector(".submit-button");

  /* 초기 로드 시 한줄소개 글자수를 표시하고 유효성 검사 */
  if (bioInput) {
    updateBioCharacterCount();
  }
  checkValidity();

  /* 프로필 이미지 업로드 박스 클릭 시 파일 입력창 열기 */
  if (uploadBox) {
    uploadBox.addEventListener("click", () => {
      fileInput.click();
    });
  }

  /* "프로필 사진 변경" 텍스트 클릭 시 파일 입력창 열기 */
  if (changeProfileText) {
    changeProfileText.addEventListener("click", () => {
      fileInput.click();
    });
  }

  /* 파일 입력 변경 시 이미지 미리보기 */
  if (fileInput) {
    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (file) {
        previewImg.src = URL.createObjectURL(file);
        previewImg.classList.add("uploaded");
      }
    });
  }

  /* 닉네임 유효성 검사 및 글자수 제한 */
  if (nicknameInput) {
    nicknameInput.setAttribute("maxlength", 6);

    nicknameInput.addEventListener("input", () => {
      let value = nicknameInput.value.trim();
      if (value.length > 6) {
        value = value.slice(0, 6);
        nicknameInput.value = value;
      }

      const conditionP = nicknameInput
        .closest(".input-group")
        .querySelector(".input-condition");

      if (value.length === 0) {
        conditionP.textContent = "2~6자 이내로 입력해주세요.";
        conditionP.style.color = "#8a8a8a";
        nicknameInput.style.borderColor = "";
      } else if (value.length < 2 || value.length > 6) {
        conditionP.textContent = "닉네임은 2~6자 이내여야 합니다.";
        conditionP.style.color = "red";
        nicknameInput.style.borderColor = "red";
      } else {
        conditionP.textContent = "";
        conditionP.style.color = "#007AFF";
        nicknameInput.style.borderColor = "#007AFF";
      }
      checkValidity();
    });
  }

  // 학과 유효성 검사
  if (majorInput) {
    majorInput.addEventListener("input", () => {
      const value = majorInput.value.trim();
      const conditionP = majorInput
        .closest(".input-group")
        .querySelector(".input-condition");

      if (value.length === 0) {
        conditionP.textContent = "공식명칭으로 입력해주세요.";
        conditionP.style.color = "#8a8a8a";
        majorInput.style.borderColor = "";
      } else if (!value.endsWith("학과")) {
        conditionP.textContent = "학과명은 '학과'로 끝나야 합니다.";
        conditionP.style.color = "red";
        majorInput.style.borderColor = "red";
      } else {
        conditionP.textContent = "";
        conditionP.style.color = "#007AFF";
        majorInput.style.borderColor = "#007AFF";
      }
      checkValidity();
    });
  }

  // 한줄소개 글자수 카운트 및 제한
  if (bioInput) {
    bioInput.addEventListener("input", () => {
      if (bioInput.value.length > 20) {
        bioInput.value = bioInput.value.slice(0, 20);
      }
      updateBioCharacterCount();
      checkValidity();
    });
  }

  /**
   * 한줄소개 입력 필드의 글자수 업데이트
   */
  function updateBioCharacterCount() {
    if (bioDescription) {
      bioDescription.textContent = `(${bioInput.value.length}/20)`;
    }
  }

  /**
   * 모든 입력 필드의 유효성 검사 및 '수정하기' 버튼의 활성화 상태 업데이트
   */
  function checkValidity() {
    const nickname = nicknameInput ? nicknameInput.value.trim() : "";
    const major = majorInput ? majorInput.value.trim() : "";
    const bio = bioInput ? bioInput.value : "";

    const isNicknameValid = nickname.length >= 2 && nickname.length <= 6;
    const isMajorValid = major.endsWith("학과");
    const isBioValid = bio.length <= 20;

    if (submitButton) {
      submitButton.disabled = !(isNicknameValid && isMajorValid && isBioValid);
    }
  }
});
