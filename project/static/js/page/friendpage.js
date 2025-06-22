document.addEventListener("DOMContentLoaded", () => {
  // ------------------------
  // 1. 더보기 메뉴 열고 닫기
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
  // 2. 정보 수정 모달
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
      modalName.innerText = name;
      modalDesc.value = desc;
      editModal.classList.remove("hidden");
    });
  });

  document.querySelector(".edit-save-btn").addEventListener("click", () => {
    editModal.classList.add("hidden");
  });

  editModal.addEventListener("click", (e) => {
    if (e.target === editModal) {
      editModal.classList.add("hidden");
    }
  });

  // ------------------------
  // 3. 친구 삭제 모달
  // ------------------------
  const deleteButtons = document.querySelectorAll(".delete-friend-btn");
  const deleteModal = document.getElementById("deleteModal");

  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteModal.classList.remove("hidden");
    });
  });

  document.querySelector(".cancel-btn").addEventListener("click", () => {
    deleteModal.classList.add("hidden");
  });

  deleteModal.addEventListener("click", (e) => {
    if (e.target === deleteModal) {
      deleteModal.classList.add("hidden");
    }
  });

  // ------------------------
  // 4. 친구 추가 모달
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
  // 5. 친구 추가 → 메모 팝업
  // ------------------------

  const addConfirmBtn = document.querySelector(".friend-add-btn");
  const memoModal = document.querySelector(".memo-modal");
  const memoConfirmBtn = document.querySelector(".memo-confirm-btn");

  addConfirmBtn.addEventListener("click", () => {
    addModal.classList.add("hidden");
    memoModal.classList.remove("hidden");

    memoConfirmBtn.addEventListener("click", () => {
      memoModal.classList.add("hidden");
    });

    const targetName = "멋사랑"; // 필요 시 동적으로 설정 가능
    memoModal.querySelector(
      ".edit-name"
    ).innerText = `‘${targetName}’님과 친구 추가되었어요`;
  });

  memoConfirmBtn.addEventListener("click", () => {
    memoModal.classList.add("hidden");
  });
});
