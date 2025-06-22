document.addEventListener("DOMContentLoaded", () => {
  // 필터 버튼들
  const allBtn = document.querySelector(".all-btn");
  const myBtn = document.querySelector(".my-btn");
  const postCards = document.querySelectorAll(".post-card");

  // 초기 상태: ALL 버튼 클릭 상태 유지
  allBtn.classList.add("active");
  myBtn.classList.remove("active");

  postCards.forEach((card) => {
    if (card.classList.contains("my-post")) {
      card.style.display = "none";
    } else {
      card.style.display = "block";
    }
  });

  // ALL 버튼 클릭 시
  allBtn.addEventListener("click", () => {
    allBtn.classList.add("active");
    myBtn.classList.remove("active");

    postCards.forEach((card) => {
      if (card.classList.contains("my-post")) {
        card.style.display = "none";
      } else {
        card.style.display = "block";
      }
    });
  });

  // MY 버튼 클릭 시
  myBtn.addEventListener("click", () => {
    myBtn.classList.add("active");
    allBtn.classList.remove("active");

    postCards.forEach((card) => {
      if (card.classList.contains("my-post")) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });

  // 더보기 버튼
  const moreIcons = document.querySelectorAll(".more-icon");

  moreIcons.forEach((icon) => {
    icon.addEventListener("click", (e) => {
      const wrapper = icon.closest(".more-wrapper");
      const menu = wrapper.querySelector(".more-menu");

      // 다른 메뉴 닫기
      document.querySelectorAll(".more-menu").forEach((m) => {
        if (m !== menu) m.classList.add("hidden");
      });

      menu.classList.toggle("hidden");
      e.stopPropagation();
    });
  });

  // 바깥 클릭 시 더보기 메뉴 닫기
  document.addEventListener("click", () => {
    document.querySelectorAll(".more-menu").forEach((menu) => {
      menu.classList.add("hidden");
    });
  });

  // 게시물 신고 기능
  const reportButtons = document.querySelectorAll(".menu-item");

  reportButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const wrapper = btn.closest(".more-wrapper");
      const modal = wrapper.querySelector(".report-modal");

      modal.classList.remove("hidden");
      wrapper.querySelector(".more-menu").classList.add("hidden");
      e.stopPropagation();
    });
  });

  // 신고 모달 내 취소 버튼
  const cancelButtons = document.querySelectorAll(".cancel-button");

  cancelButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const modal = btn.closest(".report-modal");
      modal.classList.add("hidden");
      e.stopPropagation();
    });
  });

  // 댓글 팝업
  const commentIcons = document.querySelectorAll(".comment-icon");
  const commentPopup = document.querySelector(".comment-popup");

  commentIcons.forEach((icon) => {
    icon.addEventListener("click", (e) => {
      commentPopup.classList.remove("hidden");
      e.stopPropagation();
    });
  });

  document.addEventListener("click", (e) => {
    if (
      !e.target.closest(".comment-popup") &&
      !e.target.classList.contains("comment-icon")
    ) {
      commentPopup.classList.add("hidden");
    }
  });

  // 신고 사유 처리
  const reportModals = document.querySelectorAll(".report-modal");

  reportModals.forEach((modal) => {
    const reasonItems = modal.querySelectorAll(".reason-item");
    const hideButton = modal.querySelector(".hide-button");
    let selectedReason = null;
    let etcInput = null;

    reasonItems.forEach((item) => {
      const img = item.querySelector("img");
      const span = item.querySelector("span");

      // 기타 입력란
      if (span.textContent.includes("기타")) {
        etcInput = document.createElement("input");
        etcInput.type = "text";
        etcInput.classList.add("etc-input");
        etcInput.placeholder = "신고 사유를 입력해주세요.";
        item.appendChild(etcInput);

        etcInput.addEventListener("input", () => {
          if (selectedReason === item && etcInput.value.trim() !== "") {
            activateHideButton(hideButton);
          } else {
            deactivateHideButton(hideButton);
          }
        });
      }

      item.addEventListener("click", () => {
        reasonItems.forEach((el) => {
          el.querySelector("img").src = "/static/images/Ellipse.svg";
          el.classList.remove("selected");
        });

        item.classList.add("selected");
        img.src = "/static/images/Vector.svg";
        selectedReason = item;

        if (span.textContent.includes("기타")) {
          if (etcInput.value.trim() !== "") {
            activateHideButton(hideButton);
          } else {
            deactivateHideButton(hideButton);
          }
        } else {
          activateHideButton(hideButton);
        }
      });
    });

    deactivateHideButton(hideButton);
  });

  function activateHideButton(button) {
    button.style.background = "#0f3cbe";
    button.style.color = "rgba(245, 245, 245, 0.95)";
    button.disabled = false;
  }

  function deactivateHideButton(button) {
    button.style.background = "rgba(245, 245, 245, 0.95)";
    button.style.color = "#888";
    button.disabled = true;
  }
});
