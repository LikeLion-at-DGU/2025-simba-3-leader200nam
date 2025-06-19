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
