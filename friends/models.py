from django.db import models
from django.contrib.auth.models import User
import secrets

def generate_code():
        return secrets.token_hex(4) 

class Friend(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friends')
    friend = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friend_of')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'friend')

class FriendCode(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=8, unique=True, default=generate_code, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username}'s friend code: {self.code}" 

