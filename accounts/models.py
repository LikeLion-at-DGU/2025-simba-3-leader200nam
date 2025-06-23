from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from friends.models import FriendCode

class UserManager(BaseUserManager):
    def create_user(self, number_name, univ_name, major_name, password=None, **extra_fields):
        if not number_name:
            raise ValueError('학번은 필수입니다.')
        user = self.model(number_name=number_name, univ_name=univ_name, major_name=major_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, number_name, univ_name, major_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(number_name, univ_name, major_name, password, **extra_fields)

class User(AbstractUser):
    univ_name = models.CharField(max_length=100, verbose_name='학교명')
    major_name = models.CharField(max_length=100, verbose_name='학과명')
    number_name = models.CharField(max_length=20, unique=True, verbose_name='학번(아이디)')
    nickname = models.CharField(max_length=30, null=True, blank=True, verbose_name='닉네임')
    image = models.ImageField(upload_to='profile_images/', null=True, blank=True, verbose_name='프로필 이미지')
    bio = models.TextField(blank=True, verbose_name='자기소개', null=True)
    exp = models.PositiveIntegerField(default=0, verbose_name='경험치')

    USERNAME_FIELD = 'number_name'
    REQUIRED_FIELDS = ['univ_name', 'major_name']

    objects = UserManager()

    def __str__(self):
        return f"{self.univ_name} - {self.major_name} - {self.number_name}"

    @property
    def level(self):
        exp = int(self.exp)
        if exp >= 4000:
            return 5
        elif exp >= 3000:
            return 4
        elif exp >= 2000:
            return 3
        elif exp >= 1000:
            return 2
        else:
            return 1

    @property
    def current_level_exp(self):
        exp = int(self.exp)
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

    @property
    def max_level_exp(self):
        return 320 if self.level == 5 else 1000

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

# 회원가입 시 FriendCode 자동 생성
@receiver(post_save, sender=User)
def create_friend_code(sender, instance, created, **kwargs):
    if created:
        if not hasattr(instance, 'friendcode'):
            FriendCode.objects.create(user=instance)
