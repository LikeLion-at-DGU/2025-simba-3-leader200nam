document.addEventListener("DOMContentLoaded", () => {
  // ========================================
  // 피드 페이지 기능
  // ========================================

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

  // 페이지 로드 시 숨겨진 게시물 확인
  const hiddenPosts = JSON.parse(localStorage.getItem("hiddenPosts")) || [];

  // --- 함수 정의 ---

  // 시간 포맷 함수 (방금 전, N분 전, N시간 전, N일 전)
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

  // 'ALL' 또는 'MY' 필터에 따라 게시물을 표시하거나 숨김
  // localStorage에 저장된 숨겨진 게시물도 함께 처리
  function filterPosts() {
    const showMyPosts = myBtn && myBtn.classList.contains("active");
    postCards.forEach((card) => {
      const postId = card.dataset.postId;
      const isMyPost = card.classList.contains("my-post");
      const isHidden = hiddenPosts.includes(postId);
      // 버튼의 현재 상태를 기준으로 판단
      const publicBtn = card.querySelector(".public-toggle-btn");
      const isPrivate =
        publicBtn && publicBtn.dataset.publicState === "private";

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
   * '숨기기' 버튼을 활성화
   * @param {HTMLButtonElement} button
   */
  function activateHideButton(button) {
    if (!button) return;
    button.disabled = false;
    button.style.background = "#0f3cbe";
    button.style.color = "rgba(245, 245, 245, 0.95)";
  }

  /**
   * '숨기기' 버튼을 비활성화
   * @param {HTMLButtonElement} button
   */
  function deactivateHideButton(button) {
    if (!button) return;
    button.disabled = true;
    button.style.background = "none";
    button.style.color = "#8A8A8A";
  }

  /**
   * 신고 사유 선택 상태에 따라 '숨기기' 버튼의 활성화 여부 결정
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

  // 공개/비공개 버튼과 신고 버튼의 표시 여부 업데이트
  function updatePublicButtonVisibility(tab) {
    document.querySelectorAll(".post-card.my-post").forEach((card) => {
      const publicBtn = card.querySelector(".public-toggle-btn");
      const sirenBtn = card.querySelector(".siren-report-btn");

      if (publicBtn) {
        publicBtn.style.display = tab === "MY" ? "flex" : "none";
      }
      if (sirenBtn) {
        sirenBtn.style.display = "none";
      }
    });
  }

  // Siren.svg 클릭 시 신고 모달 열기
  function setupSirenReportBtns() {
    document.querySelectorAll(".siren-report-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const postCard = btn.closest(".post-card");
        const postId = postCard ? postCard.dataset.postId : null;

        // 내 게시물인지 확인 (my-post 클래스가 있으면 내 게시물)
        const isMyPost = postCard && postCard.classList.contains("my-post");

        if (isMyPost) {
          alert("자신의 게시물은 신고할 수 없습니다.");
          return;
        }

        console.log("siren-report-btn 클릭 - postId:", postId); // 디버깅 로그 추가

        if (hideButton && postId) {
          hideButton.dataset.postId = postId;
          console.log(
            "hideButton에 postId 설정 (siren):",
            hideButton.dataset.postId
          ); // 디버깅 로그 추가
        }

        if (reportModal) reportModal.classList.remove("hidden");
      });
    });
  }

  // 공개/비공개 토글 버튼 스타일 적용
  function applyPublicButtonStyle(btn) {
    const isPrivate = btn.dataset.publicState === "private";

    // 공통 스타일 설정 (display 제외)
    const commonStyles = {
      width: "93px",
      height: "29px",
      padding: "6px 12px 6px 13px",
      justifyContent: "center",
      alignItems: "center",
      flexShrink: "0",
      borderRadius: "10px",
      background: isPrivate ? "#2782FF" : "#fff",
      border: "none",
      cursor: "pointer",
    };

    Object.assign(btn.style, commonStyles);

    const icon = btn.querySelector("img");
    const text = btn.querySelector("span");

    // 아이콘 공통 스타일
    const iconStyles = {
      width: "16px",
      height: "16px",
      flexShrink: "0",
      aspectRatio: "1/1",
      marginRight: "6px",
      background: "inherit",
    };

    // 텍스트 공통 스타일
    const textStyles = {
      color: "#000",
      fontFamily: "'머니그라피TTF', sans-serif",
      fontSize: "10px",
      fontStyle: "normal",
      fontWeight: "400",
      lineHeight: "17px",
      letterSpacing: "-0.5px",
      background: "inherit",
      whiteSpace: "nowrap",
    };

    if (isPrivate) {
      icon.src = "/static/images/lock2.svg";
      text.textContent = "게시물 비공개";
    } else {
      icon.src = "/static/images/lock.svg";
      text.textContent = "게시물 공개";
    }

    Object.assign(icon.style, iconStyles);
    Object.assign(text.style, textStyles);
  }

  // --- 이벤트 리스너 설정 ---

  // 필터 버튼 (ALL/MY)
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
      filterPosts();
      updatePublicButtonVisibility("MY");
      setTimeout(setupPublicToggleBtns, 0);
    });
  }

  // 페이지 로드 시 모든 public-toggle-btn 스타일 적용
  document
    .querySelectorAll(".public-toggle-btn")
    .forEach(applyPublicButtonStyle);

  // 게시물 공개/비공개 토글 버튼 동작
  function setupPublicToggleBtns() {
    document.querySelectorAll(".public-toggle-btn").forEach((btn) => {
      const postCard = btn.closest(".post-card");
      const postId = postCard ? postCard.dataset.postId : null;
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);

      // 초기 스타일 적용
      applyPublicButtonStyle(newBtn);

      newBtn.addEventListener("click", function () {
        const postId = this.closest(".post-card").dataset.postId;
        if (!postId) return;

        // 서버에 토글 요청 보내기
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
              // 서버 응답에 따라 상태 업데이트
              this.dataset.publicState = data.is_public ? "public" : "private";
              applyPublicButtonStyle(this);
              filterPosts(); // 상태 변경 후 필터링 적용
            } else {
              alert("공개/비공개 설정 변경 중 오류가 발생했습니다.");
            }
          })
          .catch((error) => {
            console.error("토글 요청 실패:", error);
            alert("공개/비공개 설정 변경 중 오류가 발생했습니다.");
          });
      });
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
        const postId = postCard.dataset.postId;
        console.log("신고 버튼 클릭 - postId:", postId);
        if (hideButton) {
          hideButton.dataset.postId = postId;
          console.log("hideButton에 postId 설정:", hideButton.dataset.postId);
        }
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
            }
          });
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
            }
          });
      });
    }

    // '댓글' 아이콘 클릭
    const commentIcon = postCard.querySelector(".comment-icon");
    if (commentIcon && commentPopup) {
      commentIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        currentPostId = postCard.dataset.postId;

        // 댓글 목록 Ajax(새로고침하지 않고 통신)로 불러오기
        fetch(`/feed/${currentPostId}/`)
          .then((response) => response.json())
          .then((data) => {
            if (data.feed && data.feed.comments) {
              commentList.innerHTML = "";
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
                  commentList.innerHTML += `
                    <div class="comment-item">
                      <div class="comment-content">
                        <img src="${
                          comment.author_image ||
                          "/static/images/profile-default.svg"
                        }" class="comment-profile" />
                        <div class="comment-text">
                          <span class="comment-username">${
                            (comment.nickname && comment.nickname.trim()) ||
                            comment.username ||
                            "익명"
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
            // 새 댓글
            const newComment = document.createElement("div");
            newComment.className = "comment-item";
            newComment.innerHTML = `
              <div class="comment-content">
                <img src="${
                  data.author_image || "/static/images/profile-default.svg"
                }" class="comment-profile" />
                <div class="comment-text">
                  <span class="comment-username">${
                    (data.nickname && data.nickname.trim()) ||
                    data.username ||
                    "익명"
                  }</span>
                  <span class="comment-body">${data.content}</span>
                </div>
              </div>
              <span class="comment-time">${timeSince(data.created_at)}</span>
            `;
            commentList.appendChild(newComment);
            commentInput.value = "";
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
        let postId = hideButton.dataset.postId;
        console.log("숨기기 버튼 클릭 - postId:", postId);

        // postId가 없으면 오류 메시지 표시
        if (!postId) {
          alert("신고할 게시물을 찾을 수 없습니다. 다시 시도해주세요.");
          reportModal.classList.add("hidden");
          return;
        }

        // 신고 사유 가져오기
        const selectedRadio = reportModal.querySelector(
          'input[name="report-reason"]:checked'
        );
        let reason = selectedRadio ? selectedRadio.value : "";

        // 기타 사유인 경우 직접 입력된 값 사용
        if (reason === "기타" && etcInput) {
          reason = etcInput.value.trim();
        }

        if (reason) {
          // 서버에 신고 요청 보내기
          const csrfToken = document.querySelector(
            "[name=csrfmiddlewaretoken]"
          ).value;

          fetch(`/feed/post/${postId}/report/`, {
            method: "POST",
            headers: {
              "X-CSRFToken": csrfToken,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `reason=${encodeURIComponent(reason)}`,
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.status === "success") {
                // 신고 성공 시 해당 게시물 숨기기
                const cardToHide = document.querySelector(
                  `.post-card[data-post-id="${postId}"]`
                );
                if (cardToHide) {
                  cardToHide.style.display = "none";
                }
                // localStorage에도 추가
                if (!hiddenPosts.includes(postId)) {
                  hiddenPosts.push(postId);
                  localStorage.setItem(
                    "hiddenPosts",
                    JSON.stringify(hiddenPosts)
                  );
                }
              } else {
                alert("신고 처리 중 오류가 발생했습니다.");
              }
            })
            .catch((error) => {
              console.error("신고 요청 실패:", error);
              alert("신고 처리 중 오류가 발생했습니다.");
            });
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

    // MutationObserver: 모달이 열릴 때 상태를 초기화
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
