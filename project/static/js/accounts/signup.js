document.addEventListener("DOMContentLoaded", () => {
  /* 중복 함수: 유효성 상태에 따라 메시지와 스타일 설정 */
  function showMessage(conditionElement, message, isValid, inputDiv) {
    conditionElement.textContent = message;
    conditionElement.style.color = isValid ? "#007AFF" : "red";
    if (inputDiv) {
      inputDiv.style.setProperty(
        "border-color",
        isValid ? "#007AFF" : "red",
        "important"
      );
    }
  }

  /* 비밀번호 유효성 검사 정규식 */
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{8,12}$/;

  /* 비밀번호 보기 토글 */
  document.querySelectorAll(".toggle-icon").forEach((icon) => {
    icon.addEventListener("click", () => {
      const targetId =
        icon.id === "toggle-password" ? "password" : "password_check";
      const targetInput = document.getElementById(targetId);
      const isVisible = targetInput.type === "text";

      targetInput.type = isVisible ? "password" : "text";
      icon.src = isVisible ? icon.dataset.off : icon.dataset.on;
    });
  });

  /* 비밀번호 유효성 검사 및 일치 검사 */
  const passwordInput = document.querySelector("#password");
  const passwordCheckInput = document.querySelector("#password_check");
  const passwordCondition = passwordInput
    .closest(".input-group")
    .querySelector(".input-condition");
  const passwordCheckCondition = passwordCheckInput
    .closest(".input-group")
    .querySelector(".input-condition");

  function validatePassword() {
    const isValid = passwordRegex.test(passwordInput.value);
    const wrapper = passwordInput.parentElement;
    if (!isValid) {
      showMessage(
        passwordCondition,
        "영문대소문자, 숫자, 특수문자 포함 8~12자 입력",
        false,
        wrapper
      );
    } else {
      passwordCondition.textContent = "";
      wrapper.style.setProperty("border-color", "#007AFF", "important");
    }
    validatePasswordMatch();
  }

  function validatePasswordMatch() {
    const isMatch =
      passwordInput.value === passwordCheckInput.value &&
      passwordInput.value !== "";
    const wrapper = passwordCheckInput.parentElement;

    if (passwordCheckInput.value === "") {
      passwordCheckCondition.textContent = "";
      wrapper.style.removeProperty("border-color");
      return;
    }

    showMessage(
      passwordCheckCondition,
      isMatch ? "" : "비밀번호가 일치하지 않습니다.",
      isMatch,
      wrapper
    );
  }

  passwordInput.addEventListener("input", validatePassword);
  passwordCheckInput.addEventListener("input", validatePasswordMatch);

  /* 아이디 중복 검사 */
  const usernameInput = document.getElementById("username");
  const usernameCondition = document.getElementById("username-condition");
  const usernameDiv = document.querySelector(".id-input");

  usernameInput.addEventListener("blur", () => {
    const value = usernameInput.value.trim();
    if (value.length < 4) {
      showMessage(
        usernameCondition,
        "아이디는 4자 이상이어야 합니다.",
        false,
        usernameDiv
      );
      return;
    }

    fetch(`/accounts/check-username/?username=${encodeURIComponent(value)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.exists) {
          showMessage(
            usernameCondition,
            "중복되는 아이디입니다.",
            false,
            usernameDiv
          );
        } else {
          showMessage(
            usernameCondition,
            "사용 가능한 아이디입니다.",
            true,
            usernameDiv
          );
        }
      });
  });

  /* 학교명 검사 */
  const univInput = document.getElementById("univ_name");
  const univCondition = document.getElementById("univ-condition");
  const univDiv = document.querySelector(".univ-input");

  univInput.addEventListener("blur", () => {
    const value = univInput.value.trim();
    const isValid = value.endsWith("대학교");
    showMessage(
      univCondition,
      isValid ? "" : "학교명은 '대학교'로 끝나야 합니다.",
      isValid,
      univDiv
    );
  });

  /* 학과명 검사 */
  const majorInput = document.getElementById("major_name");
  const majorCondition = document.getElementById("major-condition");
  const majorDiv = document.querySelector(".major-input");

  majorInput.addEventListener("blur", () => {
    const value = majorInput.value.trim();
    const isValid = value.endsWith("학과") || value.endsWith("전공");
    showMessage(
      majorCondition,
      isValid ? "" : "학과명은 '학과' 또는 '전공'으로 끝나야 합니다.",
      isValid,
      majorDiv
    );
  });

  /* 필수 입력값 모두 입력 + 비밀번호 일치 시 버튼 활성화 */
  const requiredInputs = document.querySelectorAll(".required-input");
  const submitButton = document.querySelector(".signin-button");

  function validateAllInputs() {
    const allFilled = Array.from(requiredInputs).every(
      (input) => input.value.trim() !== ""
    );
    const passwordsMatch = passwordInput.value === passwordCheckInput.value;
    submitButton.disabled = !(allFilled && passwordsMatch);
  }

  requiredInputs.forEach((input) =>
    input.addEventListener("input", validateAllInputs)
  );
  validateAllInputs();

  /* 제출 시 버튼 비활성화 처리 중 표시 */
  document
    .getElementById("signup-form")
    .addEventListener("submit", function (e) {
      if (submitButton.disabled) {
        e.preventDefault();
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = "가입 중...";
    });
});
