document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("name");
  const submitButton = document.querySelector(".name-button");

  // maxlength 속성 강제 적용
  nameInput.setAttribute("maxlength", 6);

  nameInput.addEventListener("input", () => {
    let value = nameInput.value.trim();
    if (value.length > 6) {
      value = value.slice(0, 6);
      nameInput.value = value;
    }
    if (value.length >= 2 && value.length <= 6) {
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
