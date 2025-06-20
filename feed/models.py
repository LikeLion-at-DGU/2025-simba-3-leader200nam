from django.db import models
from django.utils import timezone
from django.conf import settings
from quest.models import Quest

# Create your models here.

class Feed(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='feeds')
    quest = models.ForeignKey(Quest, on_delete=models.CASCADE, related_name='feeds', null=True, blank=True)
    image = models.ImageField(upload_to='quest_images/', null=True, blank=True)
    image_name = models.CharField(max_length=15, null=True, blank=True)
    location = models.CharField(max_length=15, null=True, blank=True)
    memo = models.CharField(max_length=150, blank=True)
    is_private = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    is_completed = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.author.username} - {self.quest.title}"

class Comment(models.Model):
    feed = models.ForeignKey(Feed, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.author.username} on {self.feed}"

class Like(models.Model):
    feed = models.ForeignKey(Feed, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('feed', 'user')

    def __str__(self):
        return f"{self.user.username} likes {self.feed}"

class Report(models.Model):
    feed = models.ForeignKey(Feed, on_delete=models.CASCADE, related_name='reports')
    reporter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    reason = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Report on {self.feed} by {self.reporter.username}"

class FeedComment(models.Model):
    feed = models.ForeignKey(Feed, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class FeedCommentReply(models.Model):
    feed_comment = models.ForeignKey(FeedComment, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class FeedCommentLike(models.Model):
    feed_comment = models.ForeignKey(FeedComment, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class FeedCommentReplyLike(models.Model):
    feed_comment_reply = models.ForeignKey(FeedCommentReply, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

