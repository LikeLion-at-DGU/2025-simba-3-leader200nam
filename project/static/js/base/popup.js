document.addEventListener("DOMContentLoaded", function () {
  const friendIcon = document.getElementById("friendIcon");
  const friendPopup = document.getElementById("friendPopup");
  const closePopupButton = document.getElementById("closePopup");

  // 사용자 정보 업데이트 함수
  async function updateUserInfo() {
    try {
      const response = await fetch("/api/user-info/");
      const userData = await response.json();

      // 프로필 이미지 업데이트
      const userProfileImg = document.querySelector(".user-profile");
      if (userProfileImg) {
        if (userData.image_url) {
          userProfileImg.src = userData.image_url;
        } else {
          userProfileImg.src = "/static/images/profile-default.svg";
        }
      }

      // 사용자 닉네임 업데이트
      const userName = document.querySelector(".user-name");
      if (userName) {
        userName.textContent = userData.nickname || "서누";
      }

      // 레벨 업데이트
      const levelElement = document.querySelector(".level");
      if (levelElement) {
        levelElement.textContent = `LV.${userData.level || 1}`;
      }
    } catch (error) {
      console.error("사용자 정보 업데이트 중 오류:", error);
    }
  }

  // 페이지 로드 시 사용자 정보 업데이트
  updateUserInfo();

  if (friendIcon && friendPopup) {
    friendIcon.addEventListener("click", function (event) {
      event.preventDefault(); 
      friendPopup.classList.toggle("show"); 
    });
  }

  if (closePopupButton && friendPopup) {
    closePopupButton.addEventListener("click", function () {
      friendPopup.classList.remove("show");
    });
  }

  document.addEventListener("click", function (event) {
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
