/**
 * 비밀번호 + 비밀번호 확인 토글 기능
 */
const togglePassword = document.getElementById("toggle-password");
const passwordInput = document.getElementById("password");

const toggleOnIcon = togglePassword.dataset.on;
const toggleOffIcon = togglePassword.dataset.off;

let isPasswordVisible = false;

togglePassword.addEventListener("click", () => {
  isPasswordVisible = !isPasswordVisible;

  if (isPasswordVisible) {
    passwordInput.type = "text";
    togglePassword.src = toggleOnIcon;
  } else {
    passwordInput.type = "password";
    togglePassword.src = toggleOffIcon;
  }
});

/**
 * 로그인 버튼 활성화 기능
 */
document.addEventListener("DOMContentLoaded", () => {
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const loginButton = document.querySelector(".signin-button");

  function toggleLoginButton() {
    const isUsernameFilled = usernameInput.value.trim() !== "";
    const isPasswordFilled = passwordInput.value.trim() !== "";

    if (isUsernameFilled && isPasswordFilled) {
      loginButton.disabled = false;
    } else {
      loginButton.disabled = true;
    }
  }

  usernameInput.addEventListener("input", toggleLoginButton);
  passwordInput.addEventListener("input", toggleLoginButton);

  toggleLoginButton();
});
