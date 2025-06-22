document.addEventListener("DOMContentLoaded", () => {
  const questTitleElement = document.getElementById("questTitle");
  const questDueDateElement = document.getElementById("questDueDate");
  const questContainer = document.getElementById("questContainer");

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
