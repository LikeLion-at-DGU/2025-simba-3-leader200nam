document.addEventListener("DOMContentLoaded", () => {
  // --- 요소 선택 ---
  const allBtn = document.querySelector(".all-btn");
  const myBtn = document.querySelector(".my-btn");
  const postCards = document.querySelectorAll(".post-card");
  const commentPopup = document.querySelector(".comment-popup");

  // --- 신고 모달 관련 요소 ---
  const reportModal = document.getElementById("report-modal");
  const cancelButton = reportModal
    ? reportModal.querySelector(".cancel-button")
    : null;
  const hideButton = reportModal
    ? reportModal.querySelector(".hide-button")
    : null;
  const radioInputs = reportModal
    ? reportModal.querySelectorAll('input[name="report-reason"]')
    : [];
  const etcInput = reportModal
    ? reportModal.querySelector(".etc-reason")
    : null;

  // 페이지 로드 시 숨겨진 게시물 확인 (localStorage)
  const hiddenPosts = JSON.parse(localStorage.getItem("hiddenPosts")) || [];

  // 비공개 게시물 id를 저장할 Set
  const myPrivatePosts = new Set();

  // --- 함수 정의 ---

  /**
   * 'ALL' 또는 'MY' 필터에 따라 게시물을 표시하거나 숨깁니다.
   * localStorage에 저장된 숨겨진 게시물도 함께 처리합니다.
   */
  function filterPosts() {
    const showMyPosts = myBtn && myBtn.classList.contains("active");
    postCards.forEach((card) => {
      const postId = card.dataset.postId;
      const isMyPost = card.classList.contains("my-post");
      const isHidden = hiddenPosts.includes(postId);
      const isPrivate = myPrivatePosts.has(postId);

      if (isHidden) {
        card.style.display = "none";
        return;
      }

      if (showMyPosts) {
        card.style.display = isMyPost ? "block" : "none";
      } else {
        // ALL 탭: 내 비공개 게시물은 숨김
        if (isMyPost && isPrivate) {
          card.style.display = "none";
        } else {
          card.style.display = "block";
        }
      }
    });
  }

  /**
   * '숨기기' 버튼을 활성화합니다.
   * @param {HTMLButtonElement} button - 대상 버튼
   */
  function activateHideButton(button) {
    if (!button) return;
    button.disabled = false;
    button.style.background = "#0f3cbe";
    button.style.color = "rgba(245, 245, 245, 0.95)";
  }

  /**
   * '숨기기' 버튼을 비활성화합니다.
   * @param {HTMLButtonElement} button - 대상 버튼
   */
  function deactivateHideButton(button) {
    if (!button) return;
    button.disabled = true;
    button.style.background = "none";
    button.style.color = "#8A8A8A";
  }

  /**
   * 신고 사유 선택 상태에 따라 '숨기기' 버튼의 활성화 여부를 결정합니다.
   */
  function updateHideButtonState() {
    if (!reportModal || !hideButton) return;
    const selectedRadio = reportModal.querySelector(
      'input[name="report-reason"]:checked'
    );
    if (!selectedRadio) {
      deactivateHideButton(hideButton);
      return;
    }
    if (selectedRadio.value === "기타") {
      if (etcInput && etcInput.value.trim().length > 0) {
        activateHideButton(hideButton);
      } else {
        deactivateHideButton(hideButton);
      }
    } else {
      activateHideButton(hideButton);
    }
  }

  function updatePublicButtonVisibility(tab) {
    document.querySelectorAll(".post-card.my-post").forEach((card) => {
      const publicBtn = card.querySelector(".public-toggle-btn");
      const sirenBtn = card.querySelector(".siren-report-btn");
      if (tab === "MY") {
        if (publicBtn) publicBtn.style.display = "flex";
        if (sirenBtn) sirenBtn.style.display = "none";
      } else {
        if (publicBtn) publicBtn.style.display = "none";
        if (sirenBtn) sirenBtn.style.display = "block";
      }
    });
  }

  // Siren.svg 클릭 시 신고 모달 열기
  function setupSirenReportBtns() {
    document.querySelectorAll(".siren-report-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (reportModal) reportModal.classList.remove("hidden");
      });
    });
  }

  // 게시물 공개/비공개 토글 버튼 동작
  function setupPublicToggleBtns() {
    document.querySelectorAll(".public-toggle-btn").forEach((btn) => {
      const postCard = btn.closest(".post-card");
      const postId = postCard ? postCard.dataset.postId : null;
      // 기존 리스너 제거: cloneNode로 교체
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);

      newBtn.addEventListener("click", function () {
        const icon = newBtn.querySelector("img");
        const text = newBtn.querySelector("span");
        const isOpen = newBtn.dataset.publicState !== "private";
        if (isOpen) {
          // 비공개로 변경
          newBtn.style.background = "#2782FF";
          newBtn.style.borderRadius = "10px";
          newBtn.style.display = "flex";
          newBtn.style.alignItems = "center";
          icon.src = "/static/images/lock2.svg";
          icon.style.width = "16px";
          icon.style.height = "16px";
          icon.style.aspectRatio = "1/1";
          icon.style.marginRight = "6px";
          icon.style.background = "inherit";
          text.textContent = "게시물 비공개";
          text.style.color = "#000";
          text.style.fontFamily = "Moneygraphy-Rounded, sans-serif";
          text.style.fontSize = "10px";
          text.style.fontStyle = "normal";
          text.style.fontWeight = "400";
          text.style.lineHeight = "17px";
          text.style.letterSpacing = "-0.5px";
          text.style.background = "inherit";
          text.style.whiteSpace = "nowrap";
          newBtn.dataset.publicState = "private";
          if (postId) myPrivatePosts.add(postId);
        } else {
          // 공개로 변경
          newBtn.style.background = "#FFF";
          newBtn.style.borderRadius = "10px";
          newBtn.style.display = "flex";
          newBtn.style.alignItems = "center";
          icon.src = "/static/images/lock.svg";
          icon.style.width = "16px";
          icon.style.height = "16px";
          icon.style.aspectRatio = "1/1";
          icon.style.marginRight = "6px";
          icon.style.background = "inherit";
          text.textContent = "게시물 공개";
          text.style.color = "#000";
          text.style.fontFamily = "Moneygraphy-Rounded, sans-serif";
          text.style.fontSize = "10px";
          text.style.fontStyle = "normal";
          text.style.fontWeight = "400";
          text.style.lineHeight = "17px";
          text.style.letterSpacing = "-0.5px";
          text.style.background = "inherit";
          text.style.whiteSpace = "nowrap";
          newBtn.dataset.publicState = "public";
          if (postId) myPrivatePosts.delete(postId);
        }
        filterPosts(); // 상태 변경 후 필터링 적용
      });
    });
  }

  // --- 이벤트 리스너 설정 ---

  // 필터 버튼 (ALL / MY)
  if (allBtn) {
    allBtn.addEventListener("click", () => {
      allBtn.classList.add("active");
      if (myBtn) myBtn.classList.remove("active");
      filterPosts();
      updatePublicButtonVisibility("ALL");
      setupSirenReportBtns();
    });
  }

  if (myBtn) {
    myBtn.addEventListener("click", () => {
      myBtn.classList.add("active");
      if (allBtn) allBtn.classList.remove("active");
      const userId = window.userId;
      postCards.forEach((card) => {
        if (card.dataset.authorId === String(userId)) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
      updatePublicButtonVisibility("MY");
      setTimeout(setupPublicToggleBtns, 0);
    });
  }

  // 각 포스트 카드에 대한 이벤트 설정
  postCards.forEach((postCard) => {
    const moreIcon = postCard.querySelector(".more-icon");
    const moreMenu = postCard.querySelector(".more-menu");

    // '더보기' 아이콘 클릭
    if (moreIcon) {
      moreIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        const isHidden = moreMenu.classList.contains("hidden");
        document
          .querySelectorAll(".more-menu")
          .forEach((menu) => menu.classList.add("hidden"));
        if (isHidden) moreMenu.classList.remove("hidden");
      });
    }

    // '신고하기' 버튼 클릭
    const reportButton = postCard.querySelector(".report-button");
    if (reportButton) {
      reportButton.addEventListener("click", (e) => {
        e.stopPropagation();
        if (hideButton) hideButton.dataset.postId = postCard.dataset.postId;
        if (reportModal) reportModal.classList.remove("hidden");
        if (moreMenu) moreMenu.classList.add("hidden");
      });
    }

    // '게시물 공개/비공개' 토글 버튼 클릭
    const togglePublicButton = postCard.querySelector(".toggle-public-button");
    if (togglePublicButton) {
      togglePublicButton.addEventListener("click", (e) => {
        e.stopPropagation();
        const postId = togglePublicButton.dataset.postId;
        const csrfToken = document.querySelector(
          "[name=csrfmiddlewaretoken]"
        ).value;

        fetch(`/feed/post/${postId}/toggle-public/`, {
          method: "POST",
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status === "ok") {
              const icon = togglePublicButton.querySelector("img");
              const text = togglePublicButton.querySelector("span");
              if (data.is_public) {
                icon.src = "/static/images/toggle-on-icon.svg";
                text.textContent = "게시물 공개";
              } else {
                icon.src = "/static/images/toggle-off-icon.svg";
                text.textContent = "게시물 비공개";
              }
            } else {
              alert(data.message || "상태 변경에 실패했습니다.");
            }
          })
          .catch((error) => console.error("Error:", error));
        if (moreMenu) moreMenu.classList.add("hidden");
      });
    }

    // '게시물 삭제' 버튼 클릭
    const deleteButton = postCard.querySelector(".delete-button");
    if (deleteButton) {
      deleteButton.addEventListener("click", (e) => {
        e.stopPropagation();
        if (confirm("정말로 게시물을 삭제하시겠습니까?")) {
          const postId = deleteButton.dataset.postId;
          const csrfToken = document.querySelector(
            "[name=csrfmiddlewaretoken]"
          ).value;
          fetch(`/feed/post/${postId}/delete/`, {
            method: "POST",
            headers: { "X-CSRFToken": csrfToken },
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.status === "ok") postCard.remove();
              else alert(data.message || "게시물 삭제에 실패했습니다.");
            })
            .catch((error) => console.error("Error:", error));
        }
        if (moreMenu) moreMenu.classList.add("hidden");
      });
    }

    // '좋아요' 아이콘 클릭
    const heartIcon = postCard.querySelector(".heart-icon");
    if (heartIcon) {
      heartIcon.addEventListener("click", function () {
        const postId = this.dataset.postId;
        const csrfToken = document.querySelector(
          "[name=csrfmiddlewaretoken]"
        ).value;
        fetch(`/feed/post/${postId}/like/`, {
          method: "POST",
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status === "ok") {
              this.src = data.is_liked
                ? "/static/images/heart_filled.svg"
                : "/static/images/heart.svg";
              const likeCountSpan =
                this.closest(".icon-group").querySelector(".like-count");
              if (likeCountSpan) likeCountSpan.textContent = data.likes_count;
            } else {
              alert(data.message || "좋아요 처리에 실패했습니다.");
            }
          })
          .catch((error) => console.error("Error:", error));
      });
    }

    // '댓글' 아이콘 클릭
    const commentIcon = postCard.querySelector(".comment-icon");
    if (commentIcon && commentPopup) {
      commentIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        currentPostId = postCard.dataset.postId;

        // 댓글 목록 Ajax로 불러오기
        fetch(`/feed/${currentPostId}/`)
          .then((response) => response.json())
          .then((data) => {
            if (data.feed && data.feed.comments) {
              commentList.innerHTML = ""; // 기존 댓글 비우기
              if (data.feed.comments.length === 0) {
                commentList.innerHTML = `
                  <div class="comment-item">
                    <div class="comment-content">
                      <span class="comment-body">아직 댓글이 없습니다.</span>
                    </div>
                  </div>
                `;
              } else {
                data.feed.comments.forEach((comment) => {
                  // 시간 포맷 함수 재사용
                  function timeSince(dateString) {
                    const now = new Date();
                    const date = new Date(dateString);
                    const seconds = Math.floor((now - date) / 1000);
                    if (seconds < 60) return "방금 전";
                    const minutes = Math.floor(seconds / 60);
                    if (minutes < 60) return `${minutes}분 전`;
                    const hours = Math.floor(minutes / 60);
                    if (hours < 24) return `${hours}시간 전`;
                    const days = Math.floor(hours / 24);
                    return `${days}일 전`;
                  }
                  commentList.innerHTML += `
                    <div class="comment-item">
                      <div class="comment-content">
                        <img src="/static/images/profile-default.svg" class="comment-profile" />
                        <div class="comment-text">
                          <span class="comment-username">${
                            comment.author
                          }</span>
                          <span class="comment-body">${comment.content}</span>
                        </div>
                      </div>
                      <span class="comment-time">${timeSince(
                        comment.created_at
                      )}</span>
                    </div>
                  `;
                });
              }
            }
          });

        commentPopup.classList.remove("hidden");
      });
    }
  });

  // 댓글 입력창, 버튼, 리스트 요소 선택
  const commentInput = document.querySelector(".comment-input input");
  const commentSendBtn = document.querySelector(".comment-input button");
  const commentList = document.querySelector(".comment-list");

  let currentPostId = null;

  // 댓글 보내기 버튼 클릭 이벤트
  if (commentSendBtn && commentInput) {
    commentSendBtn.addEventListener("click", () => {
      const content = commentInput.value.trim();
      if (!content || !currentPostId) return;

      const csrfToken = document.querySelector(
        "[name=csrfmiddlewaretoken]"
      ).value;

      fetch(`/feed/${currentPostId}/comment/`, {
        method: "POST",
        headers: {
          "X-CSRFToken": csrfToken,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `content=${encodeURIComponent(content)}`,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.id) {
            // '아직 댓글이 없습니다' 메시지 삭제
            const emptyMsg = commentList.querySelector(".comment-body");
            if (
              emptyMsg &&
              emptyMsg.textContent.includes("아직 댓글이 없습니다")
            ) {
              commentList.innerHTML = "";
            }
            // 새 댓글 DOM 추가
            const newComment = document.createElement("div");
            newComment.className = "comment-item";
            // 시간 포맷 함수 (간단 버전)
            function timeSince(dateString) {
              const now = new Date();
              const date = new Date(dateString);
              const seconds = Math.floor((now - date) / 1000);
              if (seconds < 60) return "방금 전";
              const minutes = Math.floor(seconds / 60);
              if (minutes < 60) return `${minutes}분 전`;
              const hours = Math.floor(minutes / 60);
              if (hours < 24) return `${hours}시간 전`;
              const days = Math.floor(hours / 24);
              return `${days}일 전`;
            }
            newComment.innerHTML = `
              <div class="comment-content">
                <img src="${
                  data.author_image || "/static/images/profile-default.svg"
                }" class="comment-profile" />
                <div class="comment-text">
                  <span class="comment-username">${data.author}</span>
                  <span class="comment-body">${data.content}</span>
                </div>
              </div>
              <span class="comment-time">${timeSince(data.created_at)}</span>
            `;
            commentList.appendChild(newComment);
            commentInput.value = "";
          } else {
            alert("댓글 등록에 실패했습니다.");
          }
        });
    });
  }

  // --- 신고 모달 공통 이벤트 핸들러 ---
  if (reportModal) {
    // 모달 바깥 영역 클릭 시 닫기
    reportModal.addEventListener("click", (e) => {
      if (e.target === reportModal) reportModal.classList.add("hidden");
    });

    // '취소' 버튼
    if (cancelButton) {
      cancelButton.addEventListener("click", () =>
        reportModal.classList.add("hidden")
      );
    }

    // '숨기기' 버튼
    if (hideButton) {
      hideButton.addEventListener("click", () => {
        const postId = hideButton.dataset.postId;
        if (postId && !hiddenPosts.includes(postId)) {
          hiddenPosts.push(postId);
          localStorage.setItem("hiddenPosts", JSON.stringify(hiddenPosts));
          const cardToHide = document.querySelector(
            `.post-card[data-post-id="${postId}"]`
          );
          if (cardToHide) cardToHide.style.display = "none";
        }
        reportModal.classList.add("hidden");
      });
    }

    // 신고 사유 라디오 버튼
    radioInputs.forEach((radio) => {
      radio.addEventListener("change", () => {
        reportModal
          .querySelectorAll(".check-icon")
          .forEach((icon) => (icon.src = "/static/images/Ellipse.svg"));
        const checkedIcon = radio
          .closest(".reason-item")
          .querySelector(".check-icon");
        if (checkedIcon) checkedIcon.src = "/static/images/check-icon.svg";
        updateHideButtonState();
        if (radio.value === "기타" && radio.checked && etcInput)
          etcInput.focus();
      });
    });

    // '기타' 사유 직접 입력
    if (etcInput) {
      etcInput.addEventListener("input", updateHideButtonState);
    }

    // 모달이 열릴 때 상태를 초기화하는 MutationObserver
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.attributeName === "class" &&
          !reportModal.classList.contains("hidden")
        ) {
          const form = reportModal.querySelector(".report-reasons");
          if (form) form.reset();
          reportModal
            .querySelectorAll(".check-icon")
            .forEach((icon) => (icon.src = "/static/images/Ellipse.svg"));
          if (hideButton) deactivateHideButton(hideButton);
          if (etcInput) etcInput.value = "";
        }
      });
    });
    observer.observe(reportModal, { attributes: true });
  }

  // --- 문서 전체 클릭 이벤트 (열려있는 메뉴/팝업 닫기) ---
  document.addEventListener("click", (e) => {
    const isMoreIcon =
      e.target.classList.contains("more-icon") ||
      e.target.closest(".more-icon");
    if (!isMoreIcon)
      document
        .querySelectorAll(".more-menu")
        .forEach((menu) => menu.classList.add("hidden"));

    const isCommentIcon =
      e.target.classList.contains("comment-icon") ||
      e.target.closest(".comment-icon");
    if (
      commentPopup &&
      !commentPopup.classList.contains("hidden") &&
      !e.target.closest(".comment-popup") &&
      !isCommentIcon
    ) {
      commentPopup.classList.add("hidden");
    }
  });

  // --- 초기 실행 ---
  filterPosts();
  updatePublicButtonVisibility("ALL");
  setupSirenReportBtns();
  setTimeout(setupPublicToggleBtns, 0);
});
