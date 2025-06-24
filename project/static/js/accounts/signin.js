document.addEventListener("DOMContentLoaded", () => {
  const togglePassword = document.getElementById("toggle-password");
  const passwordInput = document.getElementById("password");

  const usernameInput = document.getElementById("username");
  const loginButton = document.querySelector(".signin-button");

  const toggleOnIcon = togglePassword.dataset.on;
  const toggleOffIcon = togglePassword.dataset.off;

  let isPasswordVisible = false;

  /* 비밀번호 토글 */
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

  /* 로그인 버튼 활성화, 비활성화 */
  function toggleLoginButton() {
    const isUsernameFilled = usernameInput.value.trim() !== "";
    const isPasswordFilled = passwordInput.value.trim() !== "";

    loginButton.disabled = !(isUsernameFilled && isPasswordFilled);
  }

  usernameInput.addEventListener("input", toggleLoginButton);
  passwordInput.addEventListener("input", toggleLoginButton);

  toggleLoginButton();
});
