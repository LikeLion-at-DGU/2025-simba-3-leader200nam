
from django.db import migrations
# 초기 퀘스트 데이터를 추가하는 함수 정의
def add_initial_quest_data(apps, schema_editor):
    # 퀘스트 모델 가져오기
    Quest = apps.get_model('quest', 'Quest')
    # 초기 퀘스트 데이터 리스트
    quests_data = [
        # 3월
        (3, 1, '개강총회 참석해보기', '많은 사람들이 한 자리에 모일 기회는 흔치 않아', 30),
        (3, 1, '캠퍼스 투어해보기', '너가 자주 가는 건물을 방문해봐', 30),
        (3, 1, '개강 첫 주 일기 쓰기', '이번 주에 느낀 그 두근거림을 기록해봐', 30),
        (3, 2, '학과 과방 방문해보기', '동기와 선배들을 만나볼 수 있는 만남의 광장', 30),
        (3, 2, '동기 3명과 인스타 맞팔하기', '맞팔은 기본 중 기본이라고', 30),
        (3, 2, '학식 먹어보기', '학식은 학교의 상징이지', 30),
        (3, 3, '동아리 가입해보기', '너의 열정과 자유를 마구 뿜내줘', 30),
        (3, 3, '선배에게 밥약 요쳥하기', '엄청난 용기가 필요해', 30),
        (3, 3, '동기들과 인생 4컷 찍어보기', '사진으로 우리를 추억한다는건 정말 멋진 일이야', 30),
        (3, 4, '동기와 밥 먹기', '밥 먹으면서 얘기를 나눠보자', 30),
        (3, 4, '미팅 나가보기', '대학생의 두근거림을 느껴봐', 30),
        (3, 4, '미래의 나에게 편지 한 문장 작성하기', '연말에 다시 봤을 때 묘할거야', 30),
        # 4월
        (4, 1, '블로그에 3월 일기 작성하기', '시간은 빠르니까 순간순간을 기록해놔', 30),
        (4, 1, '만우절 이벤트 시도하기', '대학생만 느낄 수 있는 묘한 즐거움', 30),
        (4, 1, '학교 앞 맛집 탐방하기', '맛집을 찾는 것 또한 소소한 행복이지 않을까', 30),
        (4, 2, '벚꽃 구경하러 가기', '벚꽃의 꽃말은 시험기간이긴 하지만 즐겨보자', 30),
        (4, 2, '밥약 보은하기', '선배와 인연을 이어가는 방법이야', 30),
        (4, 2, '등교 플레이리스트 공유하기', 'music is my life 아니겠어', 30),
        (4, 3, '중앙도서관에서 공부해보기', '중앙도서관은 대학생의 로망이지', 30),
        (4, 3, '공부 중인 내용 사진 찍어 올리기', '공부의 재미를 느껴보자', 30),
        (4, 3, '교수님께 모르는 부분 질문하기', '모르는건 죄가 아니야', 30),
        (4, 4, '중간고사 보고 후기 남기기', '대학교 첫시험은 어땠어? 고생했어', 30),
        (4, 4, '동기들과 무언가 해보기', '뭐든 해보면서 추억을 남기자', 30),
        (4, 4, '동아리방 방문해보기', '과방과는 또 다른 느낌이야', 30),
        # 5월
        (5, 1, '학교 근처 핫플 방문해보기', '학교 주변도 멋진 곳이 많다고~', 30),
        (5, 1, '밤산책 하기', '5월 초 밤의 그 습도 기억해?', 30),
        (5, 1, '감사일기 작성하기', '사소한 일에 감사해야 행복해져', 30),
        (5, 2, '부모님께 편지 쓰기', '부모님에 대한 감사함은 잊지 말자', 30),
        (5, 2, '동기들과 한강 가보기', '한강에서 배달 시켜 먹으며 오순도순', 30),
        (5, 2, '학교 장학금 제도 알아보기', '미리 미리 알아놔야 챙길 수 있어', 30),
        (5, 3, '고등학교 담임선생님께 연락해보기', '스승의 은혜는 잊지 말자', 30),
        (5, 3, '친구 대학교 방문해보기', '다른 학교도 궁금하지 않아?', 30),
        (5, 3, '릴스 찍어보기', '부끄럼은 잠깐, 추억은 영원', 30),
        (5, 4, '학교 최애 장소 인증하기', '마음이 편안해지는 그런 곳이 다들 있지', 30),
        (5, 4, '문화생활 즐기기', '문화력은 틈틈히 쌓아야 해', 30),
        (5, 4, '고등학교 친구 연락해보기', '과거 인연도 소중히 하자', 30),
        # 6월
        (6, 1, '선크림 바르기', '피부는 20살부터 지켜야지', 30),
        (6, 1, '부모님께 전화하기', '별거 아니지만 부모님은 엄청 좋아하실거야', 30),
        (6, 1, 'AI에게 식당 추천 받아 방문하기', 'AI 활용에 익숙해지자', 30),
        (6, 2, '시험기간 공부 계획 만들기', '기말고사는 과탑 가보자고', 30),
        (6, 2, '수업 내용 집 오자마자 복습하기', '복습은 최고의 공부법이야', 30),
        (6, 2, '나만의 꿀템 인증하기', '좋은건 서로 공유하자', 30),
        (6, 3, '기말고사 간식 이벤트 참여하기', '아무리 바빠도 간식은 챙겨먹자', 30),
        (6, 3, '공부 중인 내용 사진 찍어 올리기', '공부의 재미를 느껴보자', 30),
        (6, 3, '동기들과 시험4컷 찍기', '시험기간 우리의 모습을 기록하자', 30),
        (6, 4, '나만의 종강기념 파티하기', '고생한 자신에게 선물을 주자', 30),
        (6, 4, '종강총회 참석하기', '개강총회와 또 다른 분위기야', 30),
        (6, 4, '기말고사 보고 후기 남기기', '1학기 정말 고생했다', 30),
        # 7월
        (7, 1, '방학 계획 짜기', '첫 여름방학 기깔나게 준비하자', 30),
        (7, 1, '알바 찾아보기', '인생 첫 알바 궁금하지 않아?', 30),
        (7, 1, '1학기 수업 들었던 강의 후기 남기기', '회상할 때 재밌는 추억이 될거야', 30),
        (7, 2, '따고 싶은 자격증 알아 보기', '미리미리 준비해야 할 수 있어', 30),
        (7, 2, '자기계발 도서 1권 읽어보기', '한권이라도 좋으니 시도해보자', 30),
        (7, 2, '하고 싶은 대외활동 찾아보기', '경험을 넓게 쌓을 수 있어', 30),
        (7, 3, '여행 계획 짜기', '가까운 곳도 좋으니 어디든 가보자고', 30),
        (7, 3, '친구들과 화채 만들어 먹기', '더운데 이겨내야지', 30),
        (7, 3, 'OTT 작품 정주행하기', '집중해서 예술의 맛을 느끼자고', 30),
        (7, 4, '요즘 내 감정을 색으로 표현해보기', '너에 대해 아는 것은 중요해', 30),
        (7, 4, '밤 새서 놀아보기', '그 시절 체력으로만 가능한 일이야', 30),
        (7, 4, '이번 주 스크린 타임 인증하기', '자신을 돌아볼 수 있는 기회야', 30),
        # 8월
        (8, 1, '부모님과 사진 찍어보기', '부모님과 사진은 많이 남겨놓자', 30),
        (8, 1, '오늘 하루를 이모지 3개로 표현하기', '본인의 감정을 아는 것은 어려워', 30),
        (8, 1, '친구들과 공포영화 보기', '공포', 30),
        (8, 2, '아무 것도 안 하고 쉬기', '쉰다는 것은 정말 중요해', 30),
        (8, 2, '내 방 소개하기', '유튜버 간접체험이랄까', 30),
        (8, 2, '전시회 다녀오기', '많은 영감들이 모여있는 곳', 30),
        (8, 3, '바다 놀러가보기', '여름 바다는 한 번 봐야하지 않겠어?', 30),
        (8, 3, '하루 날 잡아서 디지털디톡스 실시하기', '가끔은 세상을 다르게 봐야해', 30),
        (8, 3, '평소에 듣지 않는 음악 장르 들어보기', '의외의 취향이 생길지도', 30),
        (8, 4, '블로그에 방학 일기 작성하기', '방학에 뭘 했는지 정리해보자고', 30),
        (8, 4, '2학기 목표 3가지 적기', '2학기엔 어떤 삶이 펼쳐질지 기대돼', 30),
        (8, 4, '혼영 도전해보기', '혼자만 즐길 수 있는 감성이 있어', 30),
        # 9월
        (9, 1, '개강총회 참석하기', '오랜만에 보는 많은 사람들', 30),
        (9, 1, '시간표 캡쳐해 핸드폰 배경화면하기', '많은 사람들의 배경화면이야', 30),
        (9, 1, '개강 첫 주 솔직한 기분 남기기', '오랜만에 다시 오니 조금 낯설지', 30),
        (9, 2, '친해지고 싶은 사람에게 밥약하기', '용기 내는 사람이 임자야', 30),
        (9, 2, '2학기 모집 동아리 찾아보기', '다양한 걸 체험하고 배워보자', 30),
        (9, 2, '자전거 타고 동네 한 바퀴', '날씨도 좋은데 자전거나 타볼까', 30),
        (9, 3, '하교 플레이리스트 공유하기', 'music is my life 아니겠어', 30),
        (9, 3, '학교 근처 핫플 방문해보기', '학교 주변도 멋진 곳이 많다고~', 30),
        (9, 3, '노래방에서 98점 이상 나올 때까지 부르기', '스트레스 푸는데는 노래방이지', 30),
        (9, 4, '공강 인증샷 찍기', '공강도 의미 있는 시간으로 만들자', 30),
        (9, 4, '감성카페 방문하기', '요즘은 어떤 감성이 트렌디한지 찾아보자', 30),
        (9, 4, '중도에서 책 한 권 읽어보기', '틈틈히 읽으면서 달성해보자고', 30),
        # 10월
        (10, 1, '혼밥 도전해보기', '혼자만 즐길 수 있는 감성이 있어', 30),
        (10, 1, '가장 좋아하는 학교 건물 앞에서 사진 찍기', '남는건 사진이지', 30),
        (10, 1, '가을 밤산책하기', '기억해? 우리가 맡았던 가을 밤의 향기', 30),
        (10, 2, '감사일기 작성하기', '사소한 일에 감사해야 행복해져', 30),
        (10, 2, 'AI에게 노래 추천 받아 들어보기', 'AI 활용에 익숙해지자', 30),
        (10, 2, '명상하기', '내면을 돌아보는 것은 최고의 힐링이야', 30),
        (10, 3, '캠퍼스 가을 사진 찍기', '가을의 향을 만끽하자고', 30),
        (10, 3, '중간고사 간식 이벤트 참여하기', '아무리 바빠도 간식은 챙겨먹자', 30),
        (10, 3, '동기듣과 사진 남기기', '다같이 웃으면서 찍어보자', 30),
        (10, 4, '오늘의 OOTD 인증하기', '너의 패션센스를 뽐내봐', 30),
        (10, 4, '친구들과 편의점에서 간맥하기', '바람 솔솔 맞으며 얘기를 나누자', 30),
        (10, 4, '평소와 다른 길로 다녀보괴', '학교가 다르게 보일거야', 30),
        # 11월
        (11, 1, '홀로 4컷 찍어보기', '자신감있게 찍어보자고', 30),
        (11, 1, '동기와 첫인상 서로 말해주기', '재미있는 에피소드가 탄생할지도', 30),
        (11, 1, '학교 안 가본 건물 가보기', '언젠가는 다 가게 될거야', 30),
        (11, 2, '하교길 풍경 공유하기', '가끔은 풍경도 둘러보자', 30),
        (11, 2, '친구들과 릴스 찍어보기', '부끄럼은 잠깐, 추억은 영원', 30),
        (11, 2, '학교 근처 핫플 가보기', '세상은 넓고, 갈 곳은 많다', 30),
        (11, 3, '연말까지 이루고 싶은 소소한 목표 1개 적기', '목표가 있는건 중요해', 30),
        (11, 3, '부모님께 전화하기', '별거 아니지만 부모님은 엄청 좋아하실거야', 30),
        (11, 3, '방청소 후 비포&애프터 인증하기', '청소는 자주 해줘야해', 30),
        (11, 4, '1학기 내 사진과 지금 사진 비교하기', '좀 더 성숙해졌을거야', 30),
        (11, 4, 'OO 꾸미기 도전 (폰꾸, 다꾸 등)', '너의 마음이 가는대로 예술을 만들어봐', 30),
        (11, 4, '아무 음식 만들어보기', '라면도 좋으니 최선을 다해보자고', 30),
        # 12월
        (12, 1, '기말고사 대비계획 세우기', '올해 마지막 시험이야 ! 파이팅', 30),
        (12, 1, '밤샘 공부해보기', '투자한 시간만큼 좋은 결과가 기다리고 있을거야', 30),
        (12, 1, '나만의 겨울 필수템 소개하기', '다같이 따뜻한 겨울을 만들어보자', 30),
        (12, 2, '교수님께 수업 감사 인사드리기', '교수님도 완전 좋아하실거야', 30),
        (12, 2, '이번 학기 내가 가장 자주 간 장소에서 사진 찍기', '이번 학기의 상징 아니겠어', 30),
        (12, 2, '겨울 음악 플레이리스트 공유하기', '겨울 분위기를 만들어보자', 30),
        (12, 3, '겨울 방학 계획 짜보기', '이번 방학은 어떻게 보내고 싶어?', 30),
        (12, 3, '본인에게 종강 선물 주기', '그동안 고생한 자신에게 박수를', 30),
        (12, 3, '겨울 대표 간식 먹어보기', '추억의 그 맛 느끼기 참 힘들어', 30),
        (12, 4, '블로그에 2학기 일기 작성하기', '2학기도 순식간에 끝났네.. 고생했어', 30),
        (12, 4, '새내기로서 배운 가장 큰 교훈 적어 보기', '어떤 점이 가장 기억에 남아?', 30),
        (12, 4, '주변 사람들에게 고맙다는 말하기', '감사함을 표현하는 것은 중요해', 30),
    ]
    # 퀘스트 데이터를 순회하면서 데이터베이스에 생성하는 반복문
    for month, week, title, description, exp in quests_data:
        Quest.objects.create(
            month=month,
            week=week,
            title=title,
            description=description,
            exp=exp
        )

class Migration(migrations.Migration):
    # 실행 순서를 보장하기 위한 quest 앱의 0001_initial 마이그레이션에 의존함을 명시
    dependencies = [
        ('quest', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(add_initial_quest_data),
    ]
