from django.db import models
from django.conf import settings
import secrets
# 친구 코드 생성 함수: 4바이트(8자리)의 16진수 문자열을 반환
def generate_code():
    return secrets.token_hex(4) 

# 친구 모델 클래스 정의
class Friend(models.Model):
    # 친구 모델 필드 정의: 사용자와 친구 간의 관계를 나타냄
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='friends')
    # 친구 모델 필드 정의: 친구 간의 관계를 나타냄
    friend = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='friend_of')
    # 친구 모델 필드 정의: 친구 관계가 생성된 시간을 저장
    created_at = models.DateTimeField(auto_now_add=True)
    # 친구 모델 필드 정의: 친구 관계에 대한 메모를 저장하는 필드
    memo = models.CharField(max_length=255, blank=True, null=True)
    # 친구 모델 옵션 정의: 사용자와 친구 간의 관계가 유일해야 함
    class Meta:
        unique_together = ('user', 'friend')

# 친구 코드 모델 클래스 정의
class FriendCode(models.Model):
    # 친구 코드 모델 필드 정의: 사용자와 친구 간의 관계를 나타냄
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    # 친구 코드 모델 필드 정의: 8자리의 16진수 문자열을 저장
    code = models.CharField(max_length=8, unique=True, default=generate_code, editable=False)
    # 친구 코드 모델 필드 정의: 친구 코드가 생성된 시간을 저장
    created_at = models.DateTimeField(auto_now_add=True)
    # 친구 코드 모델 옵션 정의: 사용자와 친구 코드 간의 관계가 유일해야 함
    class Meta:
        unique_together = ('user', 'code')
    
    # 친구 코드 모델 메서드 정의: 사용자와 친구 코드 간의 관계를 나타냄
    def __str__(self):
        return f"{self.user.username}'s friend code: {self.code}" 
