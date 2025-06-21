// static/js/common/popup.js

document.addEventListener("DOMContentLoaded", function () {
  const friendIcon = document.getElementById("friendIcon");
  const friendPopup = document.getElementById("friendPopup");
  const closePopupButton = document.getElementById("closePopup");

  // 아이콘 클릭 시 팝업 토글
  if (friendIcon && friendPopup) {
    // 요소가 존재하는지 확인 (안전성)
    friendIcon.addEventListener("click", function (event) {
      event.preventDefault(); // <a> 태그의 기본 동작(페이지 이동) 방지
      friendPopup.classList.toggle("show"); // 'show' 클래스 토글
    });
  }

  // 닫기 버튼 클릭 시 팝업 닫기
  if (closePopupButton && friendPopup) {
    closePopupButton.addEventListener("click", function () {
      friendPopup.classList.remove("show");
    });
  }

  // 팝업 외부 클릭 시 팝업 닫기
  document.addEventListener("click", function (event) {
    // 클릭된 요소가 아이콘도 아니고, 팝업 안의 요소도 아닐 때
    if (
      friendIcon &&
      friendPopup &&
      !friendIcon.contains(event.target) &&
      !friendPopup.contains(event.target)
    ) {
      friendPopup.classList.remove("show");
    }
  });
});
