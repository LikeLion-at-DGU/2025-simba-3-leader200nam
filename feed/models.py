from django.db import models
from django.utils import timezone
from django.conf import settings    # 프로젝트 설정에 정의한 AUTH_USER_MODEL
from quest.models import Quest

# 피드(게시글) 모델 클래스 정의
class Feed(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='feeds')
    quest = models.ForeignKey(Quest, on_delete=models.CASCADE, related_name='feeds', null=True, blank=True)
    image = models.ImageField(upload_to='quest_images/', null=True, blank=True)
    image_name = models.CharField(max_length=15, null=True, blank=True)
    location = models.CharField(max_length=15, null=True, blank=True)
    memo = models.CharField(max_length=150, blank=True)
    content = models.TextField(blank=True)
    is_private = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    is_completed = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.author.username} - {self.quest.title}"
 # 댓글 모델 클래스 정의
class Comment(models.Model):
    feed = models.ForeignKey(Feed, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.author.username} on {self.feed}"
 # 좋아요 모델 클래스 정의
class Like(models.Model):
    feed = models.ForeignKey(Feed, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('feed', 'user')

    def __str__(self):
        return f"{self.user.username} likes {self.feed}"
 # 신고 모델 클래스 정의
class Report(models.Model):
    feed = models.ForeignKey(Feed, on_delete=models.CASCADE, related_name='reports')
    reporter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    reason = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Report on {self.feed} by {self.reporter.username}"

# 피드 댓글 모델 클래스 정의
class FeedComment(models.Model):
    feed = models.ForeignKey(Feed, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

