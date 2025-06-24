document.addEventListener("DOMContentLoaded", function () {
  // 월별 그리드, 상세 뷰, 뒤로가기 아이콘 요소
  const endingContainer = document.querySelector(".ending-container");
  const monthDetail = document.getElementById("month-detail");
  const nextIconDetail = document.querySelector(".next-icon-detail");
  const nextIcon = document.getElementById("next-icon");
  const ending2Container = document.getElementById("ending2-container");

  // 월별 박스를 모두 가져옴
  const monthBoxes = document.querySelectorAll(".month-box[data-title]");

  // 상세 뷰의 제목, 설명, 이미지, 선 요소를 가져옴
  const detailTitle = document.getElementById("detail-title");
  const detailDesc = document.getElementById("detail-desc");
  const detailImg = document.getElementById("detail-img");
  const detailLine = monthDetail.querySelector(".month-detail-line");

  // Ending2 관련 요소들
  const ending2TextElement = document.getElementById("ending2Text");
  const Ako2Img = document.querySelector(".Ako2-img");

  // Ending2 콘텐츠
  const ending2Contents = [
    "새내기였던 너의\n여정을 잘 돌아봤어?",
    "1년 동안 정말 고생했고\n즐거운 시간으로 기억됐으면 좋겠다",
    "새내기가 그리워지면 언제든지 찾아오고\n졸업할 때까지 대학생활 파이팅 !",
  ];

  let currentSlide = 0;
  const slideDisplayTime = 2000;

  // 각 월별 박스에 클릭 이벤트 추가
  monthBoxes.forEach((box) => {
    box.addEventListener("click", function () {
      // 박스의 data 속성에서 정보 가져옴
      const title = this.dataset.title;
      const desc = this.dataset.desc;
      const imgSrc = this.dataset.img;
      const color = this.dataset.color;
      const monthNum = parseInt(title);

      // 상세 뷰의 내용 동적 변경
      detailTitle.textContent = title;
      detailDesc.textContent = desc;
      detailImg.src = imgSrc;
      detailImg.alt = `${title} 아이콘`;
      detailTitle.style.color = color;
      detailLine.style.borderColor = color;

      // 월별 게시물 리스트 불러오기
      const feedListDiv = document.getElementById("month-feed-list");
      feedListDiv.innerHTML =
        '<p style="color:#aaa; text-align:center;">로딩 중...</p>';
      fetch(`/feed/monthly_feeds/?month=${monthNum}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.feeds && data.feeds.length > 0) {
            feedListDiv.innerHTML = "";
            data.feeds.forEach((feed) => {
              feedListDiv.innerHTML += `
                <div class="post-card">
                  <div class="post-image" style="background-image:url('${
                    feed.image_url
                  }'); background-size:cover;"></div>
                  <div class="post-info">
                    <span class="post-title">${feed.content || ""}</span>
                    <div class="post-icons">
                      <img src="/static/images/heart.svg" alt="좋아요" class="icon" />
                      <span>${feed.likes_count}</span>
                      <img src="/static/images/comment.svg" alt="댓글" class="icon" />
                      <span>${feed.comments_count}</span>
                    </div>
                  </div>
                </div>
              `;
            });
          } else {
            feedListDiv.innerHTML =
              '<p style="color:#aaa; text-align:center;">이 달에 작성한 게시물이 없습니다.</p>';
          }
        });

      // 월별 그리드를 숨기고 상세 뷰와 뒤로가기 아이콘 표시
      endingContainer.style.display = "none";
      monthDetail.classList.remove("hidden");
      nextIconDetail.classList.remove("hidden");
      console.log(
        "monthDetail hidden after remove:",
        monthDetail.classList.contains("hidden")
      );
    });
  });

  // 뒤로가기 아이콘에 클릭 이벤트 추가
  nextIconDetail.addEventListener("click", function () {
    // 월별 그리드를 다시 표시하고 상세 뷰와 아이콘 숨김
    endingContainer.style.display = "flex";
    monthDetail.classList.add("hidden");
    nextIconDetail.classList.add("hidden");
  });

  // 메인 next-icon 클릭 시 ending2로 전환
  nextIcon.addEventListener("click", function () {
    endingContainer.style.display = "none";
    ending2Container.classList.remove("hidden");
    // 배경이미지 명시적으로 다시 설정
    document.body.style.backgroundImage = "url('/static/images/winter.png')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundPosition = "center center";
    document.body.style.fontFamily = "Moneygraphy-Rounded, sans-serif";
    showNextSlide();
  });

  // Ending2 표시 함수
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
});
