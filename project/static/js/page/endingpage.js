document.addEventListener("DOMContentLoaded", function () {
  const month4Box = document.querySelector(".month-4");
  const endingContainer = document.querySelector(".ending-container");
  const monthDetail = document.getElementById("month-4-detail");

  month4Box.addEventListener("click", function () {
    // 기존 요약 숨기고 상세 보기 노출
    endingContainer.style.display = "none";
    monthDetail.classList.remove("hidden");
  });
});
