from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    school_name = models.CharField(max_length=100, verbose_name='학교명')
    department = models.CharField(max_length=100, verbose_name='학과명')
    student_id = models.CharField(max_length=20, unique=True, verbose_name='학번(아이디)')

    USERNAME_FIELD = 'student_id'
    REQUIRED_FIELDS = ['school_name', 'department']

    def __str__(self):
        return f"{self.school_name} - {self.department} - {self.student_id}"
