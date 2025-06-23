from django.db import models
from django.conf import settings
import secrets

def generate_code():
    return secrets.token_hex(4) 

class Friend(models.Model):
    STATUS_CHOICES = (
        ('pending', '대기 중'),
        ('accepted', '수락됨'),
        ('declined', '거절됨'),
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='friends')
    friend = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='friend_of')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='accepted')
    created_at = models.DateTimeField(auto_now_add=True)
    memo = models.CharField(max_length=255, blank=True, null=True)
    
    class Meta:
        unique_together = ('user', 'friend')

class FriendCode(models.Model):

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    code = models.CharField(max_length=8, unique=True, default=generate_code, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username}'s friend code: {self.code}" 
