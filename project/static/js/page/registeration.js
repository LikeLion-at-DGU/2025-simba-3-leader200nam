// js/page/registeration.js

document.addEventListener("DOMContentLoaded", function () {
  // --- 1. DOM 요소 가져오기 (모든 스크립트에서 단 한 번만 선언) ---
  const uploadBox = document.getElementById("uploadBox");
  const realUploadInput = document.getElementById("real-upload"); // 파일 입력 필드
  const previewImage = document.getElementById("previewImage");
  const uploadIcon = document.getElementById("uploadIcon");

  const imgNameInput = document.querySelector('input[name="image_name"]'); // 사진명 입력 필드
  const placeInput = document.querySelector('input[name="location"]'); // 촬영 장소 입력 필드
  const descriptionTextarea = document.getElementById("descriptionTextarea"); // 메모 텍스트 영역
  const charCountElement = document.getElementById("charCount"); // 글자 수 표시 요소

  const submitButton = document.querySelector('button[type="submit"]'); // 제출 버튼
  const visibilityToggle = document.getElementById("visibilityToggle"); // 공개 여부 토글 (필요시 사용)

  const maxLength = 50; // 메모 필드의 최대 길이 (HTML maxlength와 일치)

  // --- 2. 폼 유효성 검사 및 버튼 상태 토글 함수 ---
  // 이 함수는 모든 필수 입력 필드의 상태를 확인하고 '등록하기' 버튼의 disabled 속성을 제어합니다.
  function checkFormValidity() {
    const isImageUploaded = realUploadInput.files.length > 0; // 이미지가 선택되었는지
    // 사진명과 촬영 장소는 trim()으로 앞뒤 공백 제거 후 2~15자 길이 조건을 확인합니다.
    const isImgNameValid =
      imgNameInput.value.trim().length >= 2 &&
      imgNameInput.value.trim().length <= 15;
    const isPlaceValid =
      placeInput.value.trim().length >= 2 &&
      placeInput.value.trim().length <= 15;

    // 모든 필수 조건(이미지 업로드, 사진명 유효, 장소 유효)이 충족될 때만 버튼 활성화
    const allRequiredFieldsFilled =
      isImageUploaded && isImgNameValid && isPlaceValid;

    submitButton.disabled = !allRequiredFieldsFilled; // true면 비활성화, false면 활성화
  }

  // --- 3. 이벤트 리스너 통합 ---

  // 3.1. 이미지 업로드 박스 클릭 이벤트
  if (uploadBox) {
    uploadBox.addEventListener("click", function () {
      realUploadInput.click(); // 숨겨진 파일 입력 필드 클릭 유도
    });
  }

  // 3.2. 실제 파일 입력 필드(realUploadInput) 변경 이벤트
  if (realUploadInput) {
    realUploadInput.addEventListener("change", function () {
      const file = realUploadInput.files[0]; // 선택된 파일 가져오기
      if (file) {
        // 파일이 선택되었다면 미리보기 표시
        const reader = new FileReader();
        reader.onload = function (e) {
          previewImage.src = e.target.result;
          previewImage.style.display = "block"; // 미리보기 이미지 보이기
          previewImage.style.width = "100%";
          previewImage.style.height = "100%";
          previewImage.style.objectFit = "cover";
          previewImage.style.position = "absolute";
          previewImage.style.top = "0";
          previewImage.style.left = "0";
          previewImage.style.backgroundColor = "white"; // 로딩 중 배경색 (선택 사항)

          uploadIcon.style.display = "none"; // 업로드 아이콘 숨기기
        };
        reader.readAsDataURL(file); // 파일을 Data URL로 읽기
      } else {
        // 파일 선택이 취소되었거나 파일이 없을 경우
        previewImage.style.display = "none";
        previewImage.src = ""; // 이미지 src 초기화
        uploadIcon.style.display = "block"; // 업로드 아이콘 다시 보이기
      }
      checkFormValidity(); // 파일 변경 후 유효성 다시 검사하여 버튼 상태 업데이트
    });
  }

  // 3.3. '사진명' 입력 필드 변경 이벤트
  if (imgNameInput) {
    imgNameInput.addEventListener("input", function () {
      // 15자 초과 입력 방지
      if (this.value.length > 15) {
        this.value = this.value.slice(0, 15);
      }
      // 텍스트 길이 조건 메시지 업데이트 (선택 사항)
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

  // 3.4. '촬영장소' 입력 필드 변경 이벤트
  if (placeInput) {
    placeInput.addEventListener("input", function () {
      // 15자 초과 입력 방지
      if (this.value.length > 15) {
        this.value = this.value.slice(0, 15);
      }
      // 텍스트 길이 조건 메시지 업데이트 (선택 사항)
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

  // 3.5. '메모' 텍스트 영역 글자 수 카운트 이벤트
  if (descriptionTextarea && charCountElement) {
    descriptionTextarea.addEventListener("input", function () {
      if (this.value.length > 50) {
        this.value = this.value.slice(0, 50);
      }
      const currentLength = this.value.length;
      charCountElement.textContent = `(${currentLength}/50)`;
      charCountElement.style.color = currentLength >= 50 ? "red" : "";
    });
  }

  // 3.6. '뒤로가기' 아이콘 클릭 이벤트
  // HTML에서 onclick="history.back()"으로 이미 처리되고 있으니 JS에서는 필요 없습니다.

  // --- 4. 페이지 로드 시 초기 상태 설정 ---
  // DOMContentLoaded 이벤트 발생 시, 폼의 초기 유효성 상태를 확인하여 버튼을 업데이트합니다.
  checkFormValidity();

  // '메모' 필드의 초기 글자 수 카운트 설정
  if (descriptionTextarea && charCountElement) {
    charCountElement.textContent = `(${descriptionTextarea.value.length}/${maxLength})`;
  }
});

const toggle = document.getElementById("visibilityToggle");

const textarea = document.getElementById("descriptionTextarea");
const charCount = document.getElementById("charCount");

textarea.addEventListener("input", () => {
  const currentLength = textarea.value.length;
  charCount.textContent = `(${currentLength}/50)`;
  charCount.style.color = currentLength >= 50 ? "red" : "";
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
