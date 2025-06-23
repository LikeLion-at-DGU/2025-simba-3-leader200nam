from django.contrib import admin
from .models import Feed, Comment, Like, Report

# Register your models here.
admin.site.register(Feed)
admin.site.register(Comment)
admin.site.register(Like)
admin.site.register(Report)
