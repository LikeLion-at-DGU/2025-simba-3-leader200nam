document.addEventListener("DOMContentLoaded", function () {
  const currentSuccessCount = 280;
  const totalLevelNeeded = 500;

  const percentage = (currentSuccessCount / totalLevelNeeded) * 100;

  const levelCountElement = document.querySelector(".level-count");
  const barFillElement = document.querySelector(".bar-fill");

  if (levelCountElement) {
    levelCountElement.textContent = `${currentSuccessCount}/${totalLevelNeeded}`;
  }

  if (barFillElement) {
    setTimeout(() => {
      barFillElement.style.width = percentage + "%";
    }, 100);
  }
});
