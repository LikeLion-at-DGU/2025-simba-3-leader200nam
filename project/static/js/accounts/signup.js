const togglePasswordIcons = document.querySelectorAll(".toggle-icon");

togglePasswordIcons.forEach((icon) => {
  icon.addEventListener("click", () => {
    const targetInputId =
      icon.id === "toggle-password" ? "password" : "password-check";
    const targetInput = document.getElementById(targetInputId);

    const toggleOnIcon = icon.dataset.on;
    const toggleOffIcon = icon.dataset.off;

    let isPasswordVisible = targetInput.type === "text";

    if (isPasswordVisible) {
      targetInput.type = "password";
      icon.src = toggleOffIcon;
    } else {
      targetInput.type = "text";
      icon.src = toggleOnIcon;
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const numberInput = document.querySelector("#number-name");
  const passwordInput = document.querySelector("#password");
  const passwordCheckInput = document.querySelector("#password-check");

  const numberCondition = numberInput
    .closest(".input-group")
    .querySelector(".input-condition");
  const passwordCondition = passwordInput
    .closest(".input-group")
    .querySelector(".input-condition");
  const passwordCheckCondition = passwordCheckInput
    .closest(".input-group")
    .querySelector(".input-condition");

  // 학번
  numberInput.addEventListener("input", () => {
    const value = numberInput.value;
    const isValid = /^\d{10}$/.test(value); 
    updateValidationState(numberInput, numberCondition, isValid);
  });

  // 비밀번호
  passwordInput.addEventListener("input", () => {
    const value = passwordInput.value;
    const isValid =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{8,12}$/.test(
        value
      );
    updateValidationState(passwordInput, passwordCondition, isValid);

    validatePasswordMatch();
  });

  // 비밀번호 확인
  passwordCheckInput.addEventListener("input", validatePasswordMatch);

  function validatePasswordMatch() {
    const isMatch =
      passwordCheckInput.value === passwordInput.value &&
      passwordInput.value !== "";
    updateValidationState(passwordCheckInput, passwordCheckCondition, isMatch);
  }

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
