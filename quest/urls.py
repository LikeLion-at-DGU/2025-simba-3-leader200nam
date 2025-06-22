from django.urls import path
from . import views

app_name = 'quest'

urlpatterns = [
    path('list/', views.quest_list, name='quest_list'),
    path('current/', views.get_current_quests, name='get_current_quests'),
    path('<int:quest_id>/', views.quest_detail, name='quest_detail'),
    path('<int:quest_id>/auth/', views.quest_page, name='quest_page'),
]
