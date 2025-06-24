document.addEventListener("DOMContentLoaded", () => {
  const questTitleElement = document.getElementById("questTitle");
  const questDueDateElement = document.getElementById("questDueDate");
  const questContainer = document.getElementById("questContainer");
  const akoImageElement = document.getElementById("akoImage");

  const evolutionModal = document.getElementById("evolutionModal");
  const evolutionAkoImage = document.getElementById("evolutionAkoImage");
  const newLevelSpan = document.getElementById("newLevel");
  const questCompleteModal = document.getElementById("questCompleteModal");
  const trueAkoModal = document.getElementById("trueAkoModal");

  /**
   * 아코의 진화 상태를 확인하고 필요 시 진화 모달 표시
   */
  function checkEvolution() {
    /* 서버에서 전달받은 레벨업 정보 확인 */
    if (window.leveledUp && window.newLevel) {
      showEvolutionModal(window.newLevel);
      return;
    }

    /* 로컬 스토리지 기반 체크 */
    const userLevelElement = document.getElementById("userLevel");
    if (!userLevelElement) return;

    const currentLevel = parseInt(
      userLevelElement.textContent.replace("LV.", "")
    );
    const previousLevel = localStorage.getItem("previousLevel");

    /* 레벨업 및 진화 모달 표시 */
    if (previousLevel && parseInt(previousLevel) < currentLevel) {
      showEvolutionModal(currentLevel);
    }

    localStorage.setItem("previousLevel", currentLevel);
  }
  checkEvolution();

  /* 퀘스트 정보를 업데이트하고 3초마다 반복되도록 설정 */
  if (questTitleElement && questDueDateElement) {
    updateQuestInfo();
    setInterval(updateQuestInfo, 3000);
  }

  /* 퀘스트 목록 */
  if (questContainer) {
    const questElements = questContainer.querySelectorAll(".quest-lists");
    questElements.forEach((questElement) => {
      questElement.addEventListener("click", (event) => {
        if (questElement.classList.contains("completed")) {
          event.preventDefault();
          event.stopPropagation();
          return false;
        }

        const questId = questElement.getAttribute("data-quest-id");
        if (questId) {
          window.location.href = `/registeration/?quest_id=${questId}`;
        }
      });
    });
  }

  /* 모든 퀘스트가 완료되면 퀘스트 완료 모달 표시 */
  if (window.allQuestsCompleted) {
    showQuestCompleteModal();
  }

  /* user.exp가 4320 이상일 경우 진정한 아코 모달 표시 */
  if (window.userExp >= 4320) {
    const today = new Date().toISOString().slice(0, 10);
    const trueAkoShownDate = localStorage.getItem("trueAkoModalShownDate");
    if (trueAkoShownDate !== today) {
      showTrueAkoModal();
      localStorage.setItem("trueAkoModalShownDate", today);
    }
  }

  /**
   * 진화 모달 표시
   */
  function showEvolutionModal(level) {
    evolutionAkoImage.src = akoImageElement.src;
    newLevelSpan.textContent = level;

    evolutionModal.classList.remove("hidden");
  }

  /**
   * 퀘스트 완료 모달 표시
   */
  function showQuestCompleteModal() {
    questCompleteModal.classList.remove("hidden");
  }

  /**
   * 진정한 아코 모달 표시
   */
  function showTrueAkoModal() {
    trueAkoModal.classList.remove("hidden");
  }

  /**
   * 현재 퀘스트 주차와 종료까지 남은 시간 업데이트
   */
  function updateQuestInfo() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    const dayOfWeek = now.getDay();

    /* 이번 주의 월요일 날짜 계산 */
    let daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    let startDateOfWeek = new Date(year, month, day - daysToSubtract);
    startDateOfWeek.setHours(0, 0, 0, 0);

    /* 이번 주의 일요일 날짜를 계산 */
    let endDateOfWeek = new Date(year, month, day + (7 - dayOfWeek));
    endDateOfWeek.setHours(23, 59, 59, 999);

    /* 퀘스트 주차 계산 */
    const firstDayOfMonth = new Date(year, month, 1);
    const firstDayOfMonthDayOfWeek = firstDayOfMonth.getDay();

    /* 이번 달 첫째 주 월요일 날짜 계산 */
    let firstMonday = new Date(
      year,
      month,
      1 +
        ((firstDayOfMonthDayOfWeek === 0 ? 1 : 8 - firstDayOfMonthDayOfWeek) %
          7)
    );

    let weekNumber = 0;
    if (startDateOfWeek >= firstMonday) {
      const diffDays = Math.floor(
        (startDateOfWeek.getTime() - firstMonday.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      weekNumber = Math.floor(diffDays / 7) + 1;
    } else {
      weekNumber = 1;
      const dayOfMonday = startDateOfWeek.getDate();
      weekNumber = Math.ceil(dayOfMonday / 7);
    }

    const monthNames = [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ];
    const currentMonthName = monthNames[month];

    questTitleElement.textContent = `${currentMonthName} ${weekNumber}주차 퀘스트`;

    const timeRemaining = endDateOfWeek.getTime() - now.getTime();

    if (timeRemaining <= 0) {
      questDueDateElement.textContent = "종료됨";
    } else {
      const totalSeconds = Math.floor(timeRemaining / 1000);
      const days = Math.floor(totalSeconds / (60 * 60 * 24));
      const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);

      const formatNumber = (num) => String(num).padStart(2, "0");

      questDueDateElement.textContent = `종료까지 ${formatNumber(
        days
      )}D ${formatNumber(hours)}H ${formatNumber(minutes)}M`;
    }
  }

  window.closeEvolutionModal = function () {
    evolutionModal.classList.add("hidden");
  };

  window.closeQuestCompleteModal = function () {
    questCompleteModal.classList.add("hidden");
  };

  window.closeTrueAkoModal = function () {
    trueAkoModal.classList.add("hidden");
  };
});
