document.addEventListener("DOMContentLoaded", () => {
  // ========================================
  // 친구 페이지 기능
  // ========================================

  // ------------------------
  // 1. 친구 검색 기능
  // ------------------------
  const searchInput = document.querySelector(".search-input");
  const friendList = document.querySelector(".friend-list");
  const friends = document.querySelectorAll(".friend");

  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    let visibleCount = 0;

    friends.forEach((friend) => {
      const nameElement = friend.querySelector(".name");
      const descElement = friend.querySelector(".desc");

      if (nameElement && descElement) {
        const name = nameElement.textContent.toLowerCase();
        const desc = descElement.textContent.toLowerCase();

        // 이름이나 메모에 검색어가 포함되어 있으면 표시
        if (name.includes(searchTerm) || desc.includes(searchTerm)) {
          friend.style.display = "flex";
          visibleCount++;
        } else {
          friend.style.display = "none";
        }
      }
    });

    // 검색 결과가 없을 때 friend-list 전체 숨기기
    if (searchTerm && visibleCount === 0) {
      friendList.style.display = "none";
    } else {
      friendList.style.display = "flex";
    }
  });

  // ------------------------
  // 2. 친구 메뉴 드롭다운
  // ------------------------
  const menus = document.querySelectorAll(".menu");
  menus.forEach((menu) => {
    menu.addEventListener("click", (e) => {
      e.stopPropagation();
      const wrapper = menu.parentElement;
      const moreMenu = wrapper.querySelector(".more-menu");
      document.querySelectorAll(".more-menu").forEach((m) => {
        if (m !== moreMenu) m.classList.add("hidden");
      });
      moreMenu.classList.toggle("hidden");
    });
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".more-menu").forEach((menu) => {
      menu.classList.add("hidden");
    });
  });

  // ------------------------
  // 3. 친구 정보 수정 모달
  // ------------------------
  const editButtons = document.querySelectorAll(".edit-btn");
  const editModal = document.querySelector(".edit-modal");
  const modalName = document.querySelector(".edit-name");
  const modalDesc = document.querySelector(".edit-desc");

  editButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const friendCard = btn.closest(".friend");
      const name = friendCard.querySelector(".name").innerText;
      const desc = friendCard.querySelector(".desc").innerText;
      const friendId = friendCard
        .querySelector(".delete-friend-btn")
        .getAttribute("data-id");
      const avatar = friendCard.querySelector(".avatar");
      const avatarStyle = avatar.style.backgroundImage;

      modalName.innerText = `'${name}'`;
      modalDesc.value = desc;

      // 친구 ID를 저장
      modalDesc.setAttribute("data-friend-id", friendId);

      // 친구의 프로필 사진 설정
      const editAvatar = editModal.querySelector(".edit-avatar");
      if (avatarStyle && avatarStyle !== "none" && avatarStyle !== "") {
        const urlMatch = avatarStyle.match(/url\(['"]?([^'"]+)['"]?\)/);
        if (urlMatch) {
          editAvatar.style.backgroundImage = `url(${urlMatch[1]})`;
        } else {
          editAvatar.style.backgroundImage = avatarStyle;
        }
      } else {
        editAvatar.style.backgroundImage =
          "url('/static/images/profile-default.svg')";
      }

      editModal.classList.remove("hidden");
    });
  });

  // textarea에서 엔터키 입력 방지
  if (modalDesc) {
    modalDesc.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        return false;
      }
    });
  }

  // 메모 수정 저장
  document
    .querySelector(".edit-save-btn")
    .addEventListener("click", async () => {
      const friendId = modalDesc.getAttribute("data-friend-id");
      const newMemo = modalDesc.value.trim();

      const response = await fetch(`/friends/update-memo/${friendId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]")
            .value,
        },
        body: JSON.stringify({
          memo: newMemo,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        const friendCard = document
          .querySelector(`[data-id="${friendId}"]`)
          .closest(".friend");
        const descElement = friendCard.querySelector(".desc");
        descElement.innerText = newMemo;

        editModal.classList.add("hidden");
      }
    });

  editModal.addEventListener("click", (e) => {
    if (e.target === editModal) {
      editModal.classList.add("hidden");
    }
  });

  // ------------------------
  // 4. 친구 삭제 모달
  // ------------------------
  const deleteButtons = document.querySelectorAll(".delete-friend-btn");
  const deleteModal = document.getElementById("deleteModal");
  let targetDeleteBtn = null;

  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const friendCard = btn.closest(".friend");
      const friendName = friendCard.querySelector(".name").innerText;
      deleteModal.querySelector(
        ".delete-title"
      ).innerText = `'${friendName}' 님을 친구 삭제하시겠습니까?`;
      deleteModal.classList.remove("hidden");
      targetDeleteBtn = btn;
    });
  });

  document.querySelector(".cancel-btn").addEventListener("click", () => {
    deleteModal.classList.add("hidden");
    targetDeleteBtn = null;
  });

  document.querySelector(".delete-btn").addEventListener("click", async () => {
    if (!targetDeleteBtn) return;
    const friendId = targetDeleteBtn.getAttribute("data-id");
    const response = await fetch(`/friends/delete/${friendId}/`, {
      method: "POST",
      headers: {
        "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]")
          .value,
      },
    });
    const data = await response.json();
    if (data.status === "success") {
      const friendCard = targetDeleteBtn.closest(".friend");
      friendCard.remove();
    }
    deleteModal.classList.add("hidden");
    targetDeleteBtn = null;
  });

  // ------------------------
  // 5. 친구 추가 모달
  // ------------------------
  const addFriendBtn = document.querySelector(".add-btn");
  const seonuModal = document.querySelector(".seonu-modal");
  const addModal = document.querySelector(".add-modal:not(.seonu-modal)");
  const codeInputBtn = document.querySelector(".code-input-btn");

  addFriendBtn.addEventListener("click", () => {
    seonuModal.classList.remove("hidden");
  });

  codeInputBtn.addEventListener("click", () => {
    seonuModal.classList.add("hidden");
    addModal.classList.remove("hidden");
  });

  seonuModal.addEventListener("click", (e) => {
    if (e.target === seonuModal) {
      seonuModal.classList.add("hidden");
    }
  });

  addModal.addEventListener("click", (e) => {
    if (e.target === addModal) {
      addModal.classList.add("hidden");
    }
  });

  // ------------------------
  // 6. 친구 추가 → 메모 작성
  // ------------------------
  const addConfirmBtn = document.querySelector(".friend-add-btn");
  const memoModal = document.querySelector(".memo-modal");
  const memoConfirmBtn = document.querySelector(".memo-confirm-btn");
  const memoTextarea = document.querySelector(
    ".memo-modal textarea[name='memo']"
  );
  const codeErrorMsg = addModal
    ? addModal.querySelector(".code-error-msg")
    : null;

  addConfirmBtn.addEventListener("click", async () => {
    const code = document.querySelector(".code-input").value;

    // 에러 메시지 초기화
    if (codeErrorMsg) codeErrorMsg.textContent = "";

    if (!code) {
      if (codeErrorMsg) codeErrorMsg.textContent = "친구 코드를 입력해주세요.";
      return;
    }

    // 친구 코드로 사용자 정보 조회
    try {
      const response = await fetch(`/friends/search-by-code/?code=${code}`);
      const data = await response.json();

      if (data.status === "success") {
        if (data.already_added) {
          if (codeErrorMsg)
            codeErrorMsg.textContent = "이미 추가한 친구입니다!";
          return;
        }

        addModal.classList.add("hidden");
        memoModal.classList.remove("hidden");
        document.getElementById("hiddenFriendCode").value = code;
        const friendName =
          data.user.nickname || data.user.username || "알 수 없음";
        memoModal.querySelector(
          ".edit-name"
        ).innerText = `'${friendName}'님과\n친구 추가되었어요`;
        const memoAvatar = memoModal.querySelector(
          "div.edit-content .edit-avatar"
        );

        if (data.user.profile_image) {
          // 이미 URL인지 확인하고 적절히 처리
          const imageUrl =
            data.user.profile_image.startsWith("http") ||
            data.user.profile_image.startsWith("/")
              ? data.user.profile_image
              : `/${data.user.profile_image}`;

          // 이미지 로딩 테스트
          const testImg = new Image();
          testImg.onload = function () {
            // 실제 이미지가 로드되면 원래 이미지로 변경
            memoAvatar.style.backgroundImage = `url(${imageUrl})`;
          };
          testImg.onerror = function () {
            // 실패하면 기본 이미지 유지
            memoAvatar.style.backgroundImage =
              "url('/static/images/profile-default.svg')";
          };
          testImg.src = imageUrl;
        } else {
          memoAvatar.style.backgroundImage =
            "url('/static/images/profile-default.svg')";
        }
      } else {
        if (codeErrorMsg)
          codeErrorMsg.textContent = "존재하지 않는 코드입니다!";
      }
    } catch (error) {
      if (codeErrorMsg) codeErrorMsg.textContent = "존재하지 않는 코드입니다!";
    }
  });

  if (memoTextarea) {
    memoTextarea.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        return false;
      }
    });
  }

  memoConfirmBtn.addEventListener("click", async () => {
    // 폼의 기본 제출 동작 방지
    const form = memoModal.querySelector("form");

    // 폼 제출 이벤트를 막기 위해 preventDefault 추가
    form.addEventListener("submit", (e) => {
      e.preventDefault();
    });

    const formData = new FormData(form);

    try {
      const response = await fetch("/friends/add/", {
        method: "POST",
        headers: {
          "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]")
            .value,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.status === "success") {
        // 성공 시 모달 닫기
        memoModal.classList.add("hidden");
        addModal.classList.add("hidden");
        seonuModal.classList.add("hidden");

        // 페이지 새로고침하여 친구 목록 업데이트
        window.location.reload();
      } else {
        // 오류 메시지 표시
        alert(data.message || "친구 추가 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("친구 추가 오류:", error);
      alert("친구 추가 중 오류가 발생했습니다.");
    }
  });

  // ------------------------
  // 7. 친구코드 클릭 시 복사
  // ------------------------
  const myCodeBox = document.querySelector(".code-input-box.myinput");
  if (myCodeBox) {
    myCodeBox.style.cursor = "pointer";
    myCodeBox.title = "클릭 시 복사";
    myCodeBox.addEventListener("click", () => {
      // 코드 추출
      const codeText = myCodeBox.textContent.split(":").pop().trim();
      navigator.clipboard.writeText(codeText).then(() => {
        // 복사 성공 시 피드백
        const original = myCodeBox.textContent;
        myCodeBox.textContent = "복사되었습니다!";
        setTimeout(() => {
          myCodeBox.textContent = original;
        }, 1000);
      });
    });
  }
});
