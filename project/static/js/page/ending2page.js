const ending2Contents = [
  "새내기였던 너의\n여정을 잘 돌아봤어?",
  "1년 동안 정말 고생했고\n즐거운 시간으로 기억됐으면 좋겠다",
  "새내기가 그리워지면 언제든지 찾아오고\n졸업할 때까지 대학생활 파이팅 !",
];

let currentSlide = 0;
const slideDisplayTime = 2000;
const ending2TextElement = document.getElementById("ending2Text");
const loadingSpinner = document.getElementById("loadingSpinner");
const Ako2Img = document.querySelector(".Ako2-img");

function showNextSlide() {
  if (currentSlide < ending2Contents.length) {
    ending2TextElement.classList.remove("fade-in");
    Ako2Img.classList.remove("fade-in");

    setTimeout(() => {
      ending2TextElement.innerHTML = ending2Contents[currentSlide];
      ending2TextElement.classList.add("fade-in");
      Ako2Img.classList.add("fade-in");

      currentSlide++;
      setTimeout(showNextSlide, slideDisplayTime);
    }, 800);
  } else {
    ending2TextElement.classList.remove("fade-in");
    Ako2Img.classList.remove("fade-in");
  }
}

document.addEventListener("DOMContentLoaded", showNextSlide);
