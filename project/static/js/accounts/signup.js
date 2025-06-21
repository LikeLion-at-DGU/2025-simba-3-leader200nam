/**
 * 비밀번호 + 비밀번호 확인 토글 기능
 */
const togglePasswordIcons = document.querySelectorAll(".toggle-icon");

togglePasswordIcons.forEach((icon) => {
  icon.addEventListener("click", () => {
    const targetInputId =
      icon.id === "toggle-password" ? "password" : "password_check";
    const targetInput = document.getElementById(targetInputId);

    const toggleOnIcon = icon.dataset.on;
    const toggleOffIcon = icon.dataset.off;

    const isPasswordVisible = targetInput.type === "text";

    if (isPasswordVisible) {
      targetInput.type = "password";
      icon.src = toggleOffIcon;
    } else {
      targetInput.type = "text";
      icon.src = toggleOnIcon;
    }
  });
});

/**
 * 학번, 비밀번호 유효성 검사 및 상태 업데이트
 */
document.addEventListener("DOMContentLoaded", () => {
  const numberInput = document.querySelector("#number_name");
  const passwordInput = document.querySelector("#password");
  const passwordCheckInput = document.querySelector("#password_check");

  const numberCondition = numberInput
    .closest(".input-group")
    .querySelector(".input-condition");
  const passwordCondition = passwordInput
    .closest(".input-group")
    .querySelector(".input-condition");
  const passwordCheckCondition = passwordCheckInput
    .closest(".input-group")
    .querySelector(".input-condition");

  // 학번 유효성 검사
  numberInput.addEventListener("input", () => {
    const isValid = /^\d{10}$/.test(numberInput.value);
    updateValidationState(numberInput, numberCondition, isValid);
  });

  // 비밀번호 유효성 검사
  passwordInput.addEventListener("input", () => {
    const regex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{8,12}$/;
    const isValid = regex.test(passwordInput.value);
    updateValidationState(passwordInput, passwordCondition, isValid);

    validatePasswordMatch();
  });

  // 비밀번호 확인 입력 시 비밀번호 일치 검사
  passwordCheckInput.addEventListener("input", validatePasswordMatch);

  // 비밀번호와 비밀번호 확인이 일치하는지 검사
  function validatePasswordMatch() {
    const isMatch =
      passwordCheckInput.value === passwordInput.value &&
      passwordInput.value !== "";
    updateValidationState(passwordCheckInput, passwordCheckCondition, isMatch);
  }

  // 입력란에 따라 유효성 상태에 맞춰 스타일과 문구 표시 업데이트 함수
  function updateValidationState(input, conditionText, isValid) {
    const wrapper = input.parentElement;

    wrapper.classList.remove("input-valid", "input-invalid");
    conditionText.classList.remove("input-valid-text", "input-invalid-text");

    if (isValid) {
      wrapper.classList.add("input-valid");
      conditionText.style.display = "none";
    } else {
      wrapper.classList.add("input-invalid");
      conditionText.style.display = "block";
      conditionText.classList.add("input-invalid-text");
    }
  }
});

document
  .getElementById("signup-form")
  .addEventListener("submit", function (event) {
    const submitButton = document.querySelector(".signin-button");

    // 버튼이 이미 비활성화 상태이면, 다시 제출하지 않음
    if (submitButton.disabled) {
      event.preventDefault();
      return;
    }

    // 제출 버튼을 비활성화하고 텍스트 변경
    submitButton.disabled = true;
    submitButton.textContent = "처리 중...";
  });

/**
 *  회원가입 버튼 활성화 기능
 */
document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll(".required-input");
  const button = document.querySelector(".signin-button");

  function validateInputs() {
    const allFilled = Array.from(inputs).every(
      (input) => input.value.trim() !== ""
    );
    const password = document.getElementById("password").value;
    const passwordCheck = document.getElementById("password_check").value;
    const passwordMatch = password === passwordCheck;

    button.disabled = !(allFilled && passwordMatch);
  }

  inputs.forEach((input) => input.addEventListener("input", validateInputs));

  validateInputs();
});
