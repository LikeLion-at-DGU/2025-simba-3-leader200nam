from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from friends.models import FriendCode

class User(AbstractUser):
    univ_name = models.CharField(max_length=100, verbose_name='학교명')
    major_name = models.CharField(max_length=100, verbose_name='학과명')
    number_name = models.CharField(max_length=20, unique=True, verbose_name='학번(아이디)')
    nickname = models.CharField(max_length=30, null=True, blank=True, verbose_name='닉네임')
    image = models.ImageField(upload_to='profile_images/', null=True, blank=True, verbose_name='프로필 이미지')
    bio = models.TextField(blank=True, verbose_name='자기소개', null=True)

    USERNAME_FIELD = 'number_name'
    REQUIRED_FIELDS = ['univ_name', 'major_name']

    def __str__(self):
        return f"{self.univ_name} - {self.major_name} - {self.number_name}"

# 회원가입 시 FriendCode 자동 생성
@receiver(post_save, sender=User)
def create_friend_code(sender, instance, created, **kwargs):
    if created:
        if not hasattr(instance, 'friendcode'):
            FriendCode.objects.create(user=instance)
