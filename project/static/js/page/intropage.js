const univName = (window.univName || "학교명").trim();
console.log("univName(raw):", univName, univName.length);
const mascotName = univName === "건국대학교" ? "쿠" : "아코";
const mascotImg = document.getElementById("mascotImg");
console.log("mascotImg:", mascotImg);

// 이미지 동적 변경
if (mascotImg) {
  if (univName === "건국대학교") {
    mascotImg.src = "/static/images/koo1.svg";
    console.log("koo1.svg set");
  } else {
    mascotImg.src = "/static/images/ako1.svg";
    console.log("ako1.svg set");
  }
}

const introContents = [
  `안녕 !! \n<span class='highlight-text'>${univName}</span>에 온 것을 정말로 환영해`,
  `나는 ${univName} \n마스코트 <span class='highlight-text'>${mascotName}</span>라고 해`,
  "<span class='highlight-text'>같은 신입생</span>으로서\n멋진 첫학기를 보내보자 !",
  "그럼 혹시\n<span class='highlight-text'>너의 이름</span>은 뭐야?",
];

let currentSlide = 0;
const slideDisplayTime = 2000;
const introTextElement = document.getElementById("introText");
const loadingSpinner = document.getElementById("loadingSpinner");
const ako1Img = document.querySelector(".ako1-img");

function showNextSlide() {
  if (currentSlide < introContents.length) {
    introTextElement.classList.remove("fade-in");
    ako1Img.classList.remove("fade-in");

    setTimeout(() => {
      introTextElement.innerHTML = introContents[currentSlide];
      introTextElement.classList.add("fade-in");
      ako1Img.classList.add("fade-in");

      currentSlide++;
      setTimeout(showNextSlide, slideDisplayTime);
    }, 800);
  } else {
    introTextElement.classList.remove("fade-in");
    ako1Img.classList.remove("fade-in");

    if (loadingSpinner) {
      loadingSpinner.style.display = "block";
    }

    setTimeout(() => {
      window.location.href = "/intro-input/";
    }, 1500);
  }
}

document.addEventListener("DOMContentLoaded", showNextSlide);
