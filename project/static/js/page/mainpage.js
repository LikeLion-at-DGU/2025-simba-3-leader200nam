document.addEventListener("DOMContentLoaded", () => {
  const questTitleElement = document.getElementById("questTitle");
  const questDueDateElement = document.getElementById("questDueDate");
  const questContainer = document.getElementById("questContainer");

  // 진화 모달 관련 요소들
  const evolutionModal = document.getElementById("evolutionModal");
  const evolutionAkoImage = document.getElementById("evolutionAkoImage");
  const newLevelSpan = document.getElementById("newLevel");

  // 페이지 로드 시 진화 체크
  checkEvolution();

  if (questTitleElement && questDueDateElement) {
    updateQuestInfo();
    setInterval(updateQuestInfo, 3000);
  }

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

  if (window.allQuestsCompleted) {
    showQuestCompleteModal();
  }

  // 진화 체크 함수
  function checkEvolution() {
    // 서버에서 전달받은 레벨업 정보 확인
    if (window.leveledUp && window.newLevel) {
      showEvolutionModal(window.newLevel);
      return;
    }

    // 로컬스토리지 기반 체크 (백업)
    const currentLevel = parseInt(
      document.getElementById("userLevel").textContent.replace("LV.", "")
    );
    const previousLevel = localStorage.getItem("previousLevel");

    if (previousLevel && parseInt(previousLevel) < currentLevel) {
      // 레벨업이 발생했을 때 진화 모달 표시
      showEvolutionModal(currentLevel);
    }

    // 현재 레벨을 저장
    localStorage.setItem("previousLevel", currentLevel);
  }

  // 진화 모달 표시 함수
  function showEvolutionModal(level) {
    const akoImage = document.getElementById("akoImage");
    const currentAkoSrc = akoImage.src;

    // 진화된 아코 이미지 설정
    evolutionAkoImage.src = currentAkoSrc;
    newLevelSpan.textContent = level;

    // 모달 표시
    evolutionModal.classList.remove("hidden");
  }

  // 진화 모달 닫기 함수 (전역 함수로 등록)
  window.closeEvolutionModal = function () {
    evolutionModal.classList.add("hidden");
  };

  function updateQuestInfo() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    const dayOfWeek = now.getDay();

    let daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    let startDateOfWeek = new Date(year, month, day - daysToSubtract);

    startDateOfWeek.setHours(0, 0, 0, 0);

    let endDateOfWeek = new Date(year, month, day + (7 - dayOfWeek));
    endDateOfWeek.setHours(23, 59, 59, 999);

    const firstDayOfMonth = new Date(year, month, 1);
    const firstDayOfMonthDayOfWeek = firstDayOfMonth.getDay();
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
});

document.addEventListener("DOMContentLoaded", () => {
  const questTitleElement = document.getElementById("questTitle");
  const questDueDateElement = document.getElementById("questDueDate");

  if (questTitleElement && questDueDateElement) {
    updateQuestInfo();
    setInterval(updateQuestInfo, 3000);
  }

  function updateQuestInfo() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    const dayOfWeek = now.getDay();

    let daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    let startDateOfWeek = new Date(year, month, day - daysToSubtract);

    startDateOfWeek.setHours(0, 0, 0, 0);

    let endDateOfWeek = new Date(year, month, day + (7 - dayOfWeek));
    endDateOfWeek.setHours(23, 59, 59, 999);

    // 퀘스트 주차 계산
    const firstDayOfMonth = new Date(year, month, 1);
    const firstDayOfMonthDayOfWeek = firstDayOfMonth.getDay();
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

    // 종료까지 남은 시간 계산
    const timeRemaining = endDateOfWeek.getTime() - now.getTime();

    if (timeRemaining <= 0) {
      questDueDateElement.textContent = "종료됨";
    } else {
      const totalSeconds = Math.floor(timeRemaining / 1000);
      const days = Math.floor(totalSeconds / (60 * 60 * 24));
      const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      const seconds = totalSeconds % 60;

      const formatNumber = (num) => String(num).padStart(2, "0");

      questDueDateElement.textContent = `종료까지 ${formatNumber(
        days
      )}D ${formatNumber(hours)}H ${formatNumber(minutes)}M`;
    }
  }
});

function showQuestCompleteModal() {
  document.getElementById("questCompleteModal").classList.remove("hidden");
}
window.closeQuestCompleteModal = function () {
  document.getElementById("questCompleteModal").classList.add("hidden");
};
