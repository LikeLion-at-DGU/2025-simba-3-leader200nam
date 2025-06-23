document.addEventListener("DOMContentLoaded", () => {
  // 필터 버튼들
  const allBtn = document.querySelector(".all-btn");
  const myBtn = document.querySelector(".my-btn");
  const postCards = document.querySelectorAll(".post-card");

  // 초기 상태: ALL 버튼 클릭 상태 유지 & 모든 게시물 표시
  allBtn.classList.add("active");
  myBtn.classList.remove("active");

  postCards.forEach((card) => {
    card.style.display = "block";
  });

  // 페이지 로드 시 숨겨진 게시물 확인 및 숨기기
  const hiddenPosts = JSON.parse(localStorage.getItem("hiddenPosts")) || [];
  postCards.forEach((card) => {
    const postId = card.dataset.postId;
    if (postId && hiddenPosts.includes(postId)) {
      card.style.display = "none";
    }
  });

  // ALL 버튼 클릭 시
  allBtn.addEventListener("click", () => {
    allBtn.classList.add("active");
    myBtn.classList.remove("active");

    postCards.forEach((card) => {
      card.style.display = "block";
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

  // --- 더보기 버튼 및 신고 모달 ---
  document.querySelectorAll(".post-card").forEach((postCard) => {
    const moreIcon = postCard.querySelector(".more-icon");
    const moreMenu = postCard.querySelector(".more-menu");
    const reportButton = postCard.querySelector(".report-button");
    const reportModal = postCard.querySelector(".report-modal");
    const cancelButton = postCard.querySelector(".cancel-button");
    const reasonItems = postCard.querySelectorAll(".reason-item");
    const hideButton = postCard.querySelector(".hide-button");

    // 더보기 메뉴 토글
    if (moreIcon) {
      moreIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        // 모든 다른 메뉴 숨기기
        document.querySelectorAll(".more-menu").forEach((menu) => {
          if (menu !== moreMenu) {
            menu.classList.add("hidden");
          }
        });
        moreMenu.classList.toggle("hidden");
      });
    }

    // 신고하기 버튼 클릭 -> 모달 열기
    if (reportButton) {
      reportButton.addEventListener("click", (e) => {
        e.stopPropagation();
        moreMenu.classList.add("hidden");
        if (reportModal) {
          reportModal.classList.remove("hidden");
          // 모달이 열릴 때마다 폼과 버튼 상태를 초기화
          const form = reportModal.querySelector(".report-reasons");
          if (form) form.reset();

          reportModal
            .querySelectorAll(".check-icon")
            .forEach((icon) => (icon.src = "/static/images/Ellipse.svg"));

          deactivateHideButton(hideButton);
        }
      });
    }

    // 모달 취소 버튼 클릭 -> 모달 닫기
    if (cancelButton) {
      cancelButton.addEventListener("click", () => {
        if (reportModal) reportModal.classList.add("hidden");
      });
    }

    // 숨기기 버튼 클릭
    if (hideButton) {
      hideButton.addEventListener("click", () => {
        const postId = postCard.dataset.postId;
        if (postId) {
          let hiddenPosts =
            JSON.parse(localStorage.getItem("hiddenPosts")) || [];
          if (!hiddenPosts.includes(postId)) {
            hiddenPosts.push(postId);
            localStorage.setItem("hiddenPosts", JSON.stringify(hiddenPosts));
          }
        }
        postCard.style.display = "none";
        if (reportModal) reportModal.classList.add("hidden");
      });
    }

    // 모달 외부 클릭 -> 모달 닫기
    if (reportModal) {
      reportModal.addEventListener("click", (e) => {
        if (e.target === reportModal) {
          reportModal.classList.add("hidden");
        }
      });
    }

    // 신고 사유 선택
    if (reasonItems && hideButton) {
      const radioInputs = reportModal.querySelectorAll('input[type="radio"]');
      const etcInput = reportModal.querySelector(".etc-reason");
      const checkIconSrc = "/static/images/check-icon.svg";
      const ellipseIconSrc = "/static/images/Ellipse.svg";

      const updateButtonState = () => {
        const selectedRadio = reportModal.querySelector(
          'input[name="report-reason"]:checked'
        );
        if (!selectedRadio) {
          deactivateHideButton(hideButton);
          return;
        }

        if (selectedRadio.value === "기타") {
          if (etcInput.value.trim().length > 0) {
            activateHideButton(hideButton);
          } else {
            deactivateHideButton(hideButton);
          }
        } else {
          activateHideButton(hideButton);
        }
      };

      radioInputs.forEach((radio) => {
        radio.addEventListener("change", () => {
          // 아이콘 상태 업데이트
          radioInputs.forEach((r) => {
            const icon = r.closest(".reason-item").querySelector(".check-icon");
            icon.src = r.checked ? checkIconSrc : ellipseIconSrc;
          });

          // 버튼 상태 업데이트
          updateButtonState();

          // '기타'가 선택되면 포커스
          if (radio.value === "기타" && radio.checked) {
            etcInput.focus();
          }
        });
      });

      if (etcInput) {
        etcInput.addEventListener("input", updateButtonState);
      }
    }
  });

  // --- Helper Functions for Hide Button ---
  function activateHideButton(button) {
    if (!button) return;
    button.disabled = false;
    button.style.background = "#0f3cbe";
    button.style.color = "rgba(245, 245, 245, 0.95)";
  }

  function deactivateHideButton(button) {
    if (!button) return;
    button.disabled = true;
    button.style.background = "none"; // 비활성 색상
    button.style.color = "#8A8A8A";
  }

  // 문서 전체 클릭 시 더보기 메뉴 닫기
  document.addEventListener("click", (e) => {
    // 더보기 메뉴 닫기
    document.querySelectorAll(".more-menu").forEach((menu) => {
      if (!menu.classList.contains("hidden")) {
        menu.classList.add("hidden");
      }
    });

    // 댓글 팝업 닫기
    const commentPopup = document.querySelector(".comment-popup");
    if (
      commentPopup &&
      !commentPopup.classList.contains("hidden") &&
      !e.target.closest(".comment-popup") &&
      !e.target.classList.contains("comment-icon")
    ) {
      commentPopup.classList.add("hidden");
    }
  });

  // 댓글 팝업 열기
  const commentIcons = document.querySelectorAll(".comment-icon");
  const commentPopup = document.querySelector(".comment-popup");

  commentIcons.forEach((icon) => {
    icon.addEventListener("click", (e) => {
      e.stopPropagation();
      if (commentPopup) commentPopup.classList.remove("hidden");
    });
  });

  // --- 좋아요 기능 ---
  const heartIcons = document.querySelectorAll(".heart-icon");
  const heartIconSrc = "/static/images/heart.svg";
  const heartFilledIconSrc = "/static/images/heart_filled.svg";

  heartIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const postId = icon.dataset.postId;
      if (!postId) return;

      // CSRF 토큰 가져오기
      const csrfToken = document.querySelector(
        "[name=csrfmiddlewaretoken]"
      ).value;

      fetch(`/feed/${postId}/like/`, {
        method: "POST",
        headers: {
          "X-CSRFToken": csrfToken,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data.is_liked) {
            icon.src = heartFilledIconSrc;
            icon.classList.add("liked");
          } else {
            icon.src = heartIconSrc;
            icon.classList.remove("liked");
          }
          const likeCountSpan = document.querySelector(
            `.like-count[data-post-id="${postId}"]`
          );
          if (likeCountSpan) {
            likeCountSpan.textContent = data.likes_count;
          }
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    });
  });
});
