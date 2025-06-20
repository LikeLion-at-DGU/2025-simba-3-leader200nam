document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("name");
  const submitButton = document.querySelector(".name-button");

  nameInput.addEventListener("input", () => {
    if (nameInput.value.trim() !== "") {
      submitButton.disabled = false;
    } else {
      submitButton.disabled = true;
    }
  });
});
