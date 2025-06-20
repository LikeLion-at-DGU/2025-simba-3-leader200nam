from django.urls import path
from .views import quest_list

urlpatterns = [
    path('', quest_list, name='quest_list'),
]
