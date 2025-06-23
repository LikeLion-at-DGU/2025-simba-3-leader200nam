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

  const univName = (window.univName || "학교명").trim();
  const mascotImg = document.getElementById("mascotImg");

  if (mascotImg) {
    if (univName === "건국대학교") {
      mascotImg.src = "/static/images/koo1.svg";
    } else {
      mascotImg.src = "/static/images/ako1.svg";
    }
  }
});
