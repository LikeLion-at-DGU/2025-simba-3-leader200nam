from django.urls import path
from . import views

app_name = 'quest'
# URL 패턴들을 정의하는 리스트
urlpatterns = [
    # 퀘스트 목록 페이지 URL 패턴
    path('list/', views.quest_list, name='quest_list'),
    # 현재 주차의 퀘스트 목록 페이지 URL 패턴
    path('current/', views.get_current_quests, name='get_current_quests'),
    # 퀘스트 상세 페이지 URL 패턴
    path('<int:quest_id>/', views.quest_detail, name='quest_detail'),
    path('<int:quest_id>/auth/', views.quest_page, name='quest_page'),
]
