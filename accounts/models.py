from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from friends.models import FriendCode

# 사용자 생성 및 슈퍼유저 생성을 담당하는 커스텀 매니저
class UserManager(BaseUserManager):
    def create_user(self, username, univ_name, major_name, password=None, **extra_fields):
        if not username:
            raise ValueError('아이디는 필수입니다.')
        user = self.model(username=username, univ_name=univ_name, major_name=major_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, univ_name, major_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, univ_name, major_name, password, **extra_fields)

# 사용자 모델 정의
class User(AbstractUser):
    univ_name = models.CharField(max_length=100, verbose_name='학교명')
    major_name = models.CharField(max_length=100, verbose_name='학과명')
    nickname = models.CharField(max_length=30, null=True, blank=True, verbose_name='닉네임')
    image = models.ImageField(upload_to='profile_images/', null=True, blank=True, verbose_name='프로필 이미지')
    bio = models.TextField(blank=True, verbose_name='자기소개', null=True)
    exp = models.PositiveIntegerField(default=0, verbose_name='경험치')

    USERNAME_FIELD = 'username'  # 로그인 시 사용할 필드
    REQUIRED_FIELDS = ['univ_name', 'major_name']  # createsuperuser 시 추가로 요구되는 필드

    objects = UserManager()  # 커스텀 매니저 연결

    def __str__(self):
        return f"{self.univ_name} - {self.major_name} ({self.username})"

    # 현재 경험치 기준으로 계산된 사용자 레벨 반환
    @property
    def level(self):
        exp = int(getattr(self, 'exp', 0))
        if exp >= 4320:
            return 5
        elif exp >= 4000:
            return 5
        elif exp >= 3000:
            return 4
        elif exp >= 2000:
            return 3
        elif exp >= 1000:
            return 2
        else:
            return 1

    # 현재 레벨 구간에서 얼마나 경험치를 쌓았는지
    @property
    def current_level_exp(self):
        exp = int(getattr(self, 'exp', 0))
        if self.level == 5:
            return min(exp - 4000, 320)
        elif self.level == 4:
            return exp - 3000
        elif self.level == 3:
            return exp - 2000
        elif self.level == 2:
            return exp - 1000
        else:
            return exp

    # 현재 레벨의 최대 경험치 (레벨업 조건)
    @property
    def max_level_exp(self):
        return 320 if self.level == 5 else 1000

    # 레벨별 캐릭터 이미지 이름 반환
    @property
    def ako_image(self):
        if self.level == 1:
            return 'ako1.svg'
        elif self.level == 2:
            return 'ako2.svg'
        elif self.level == 3:
            return 'ako3.svg'
        elif self.level == 4:
            return 'ako4.svg'
        else:
            return 'ako5.svg'

# 회원가입 시 친구코드 자동 생성
@receiver(post_save, sender=User)
def create_friend_code(sender, instance, created, **kwargs):
    if created:
        if not hasattr(instance, 'friendcode'):
            FriendCode.objects.create(user=instance)