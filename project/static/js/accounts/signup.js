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
 * 비밀번호 유효성 검사
 */
document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.querySelector("#password");
  const passwordCheckInput = document.querySelector("#password_check");

  const passwordCondition = passwordInput
    .closest(".input-group")
    .querySelector(".input-condition");
  const passwordCheckCondition = passwordCheckInput
    .closest(".input-group")
    .querySelector(".input-condition");

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
      passwordCheckInput.add.textContent = "비밀번호가 일치하지 않습니다.";
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

document.addEventListener("DOMContentLoaded", function () {
  // 아이디 중복 검사
  const usernameInput = document.getElementById("username");
  const usernameCondition = document.getElementById("username-condition");
  const usernameDiv = document.querySelector(".id-input");
  usernameInput.addEventListener("blur", function () {
    const username = this.value.trim();
    if (username.length < 4) {
      usernameCondition.textContent = "아이디는 4자 이상이어야 합니다.";
      usernameCondition.style.color = "red";
      usernameDiv.style.borderColor = "red";
      return;
    }
    fetch(`/accounts/check-username/?username=${encodeURIComponent(username)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.exists) {
          usernameCondition.textContent = "중복되는 아이디입니다.";
          usernameCondition.style.color = "red";
          usernameDiv.style.borderColor = "red";
        } else {
          usernameCondition.textContent = "사용 가능한 아이디입니다.";
          usernameCondition.style.color = "#007AFF";
          usernameDiv.style.borderColor = "#007AFF";
        }
      });
  });

  // 학교명 유효성 검사
  const univInput = document.getElementById("univ_name");
  const univCondition = document.getElementById("univ-condition");
  const univDiv = document.querySelector(".univ-input");
  univInput.addEventListener("blur", function () {
    const value = this.value.trim();
    if (!value.endsWith("대학교")) {
      univCondition.textContent = "학교명은 '대학교'로 끝나야 합니다.";
      univCondition.style.color = "red";
      univDiv.style.setProperty("border-color", "red", "important");
    } else {
      univCondition.textContent = "유효한 학교명입니다.";
      univCondition.style.color = "#007AFF";
      univDiv.style.setProperty("border-color", "#007AFF", "important");
    }
  });

  // 학과명 유효성 검사
  const majorInput = document.getElementById("major_name");
  const majorCondition = document.getElementById("major-condition");
  const majorDiv = document.querySelector(".major-input");
  majorInput.addEventListener("blur", function () {
    const value = this.value.trim();
    if (!(value.endsWith("학과") || value.endsWith("전공"))) {
      majorCondition.textContent =
        "학과명은 '학과' 또는 '전공'으로 끝나야 합니다.";
      majorCondition.style.color = "red";
      majorDiv.style.setProperty("border-color", "red", "important");
    } else {
      majorCondition.textContent = "";
      majorDiv.style.setProperty("border-color", "#007AFF", "important");
    }
  });
});

const passwordInput = document.querySelector("#password");
const passwordCheckInput = document.querySelector("#password_check");

// 비밀번호 확인 input의 .input-condition 찾기
const passwordCheckCondition = passwordCheckInput
  .closest(".input-group")
  .querySelector(".input-condition");

passwordCheckInput.addEventListener("input", () => {
  if (passwordCheckInput.value !== passwordInput.value) {
    passwordCheckCondition.textContent = "비밀번호가 일치하지 않습니다.";
    passwordCheckCondition.style.color = "red";
    passwordCheckInput.style.setProperty("border-color", "red", "important");
  } else if (passwordCheckInput.value.length > 0) {
    passwordCheckCondition.textContent = "비밀번호가 일치합니다.";
    passwordCheckCondition.style.color = "#007AFF";
    passwordCheckInput.style.setProperty(
      "border-color",
      "#007AFF",
      "important"
    );
  } else {
    passwordCheckCondition.textContent = "";
    passwordCheckInput.style.removeProperty("border-color");
  }
});
