document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("name");
  const submitButton = document.querySelector(".name-button");

  nameInput.setAttribute("maxlength", 6);

  /**
   * 이름 유효성 검사
   */
  nameInput.addEventListener("input", () => {
    let value = nameInput.value.trim();

    if (value.length > 6) {
      nameInput.value = value.slice(0, 6);
    }

    submitButton.disabled = !(value.length >= 2 && value.length <= 6);
  });

  const univName = (window.univName || "학교명").trim();
  const mascotImg = document.getElementById("mascotImg");

  /**
   * 학교명이 '건국대학교'일 경우 '쿠', 아니면 '아코' 이미지 설정
   */
  if (mascotImg) {
    mascotImg.src =
      univName === "건국대학교"
        ? "/static/images/koo1.svg"
        : "/static/images/ako1.svg";
  }
});
