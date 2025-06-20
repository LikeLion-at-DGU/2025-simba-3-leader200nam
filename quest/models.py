from django.db import models

# Create your models here.

class Quest(models.Model):
    month = models.PositiveSmallIntegerField()
    week = models.PositiveSmallIntegerField()
    title = models.CharField(max_length=100)
    description = models.TextField()
    exp = models.PositiveIntegerField(default=30)

    def __str__(self):
        return f"{self.month}월 {self.week}주차 - {self.title}"
