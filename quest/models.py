from django.db import models
# Quest 모델 클래스 정의
class Quest(models.Model):
    # 월 필드
    month = models.PositiveSmallIntegerField()
    # 주차 필드
    week = models.PositiveSmallIntegerField()
    # 퀘스트 제목 필드
    title = models.CharField(max_length=100)
    # 퀘스트 설명 필드
    description = models.TextField()
    # 퀘스트 경험치 필드
    exp = models.PositiveIntegerField(default=30)
    # 관리자 페이지 등에서 객체를 사람이 읽기 좋게 표현
    def __str__(self):
        return f"{self.month}월 {self.week}주차 - {self.title}"
