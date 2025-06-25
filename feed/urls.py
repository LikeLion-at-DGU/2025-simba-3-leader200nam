from django.urls import path
from . import views
# URL 네임스페이스: 'feed:feed_list' 식으로 사용
app_name = 'feed'
# URL 패턴 리스트
urlpatterns = [
    # 피드 목록 페이지
    path('', views.feed_list, name='feed_list'),  # 친구들의 피드 목록
    path('my/', views.my_feed_list, name='my_feed_list'),  # 내 피드 목록
    path('create/', views.feed_create, name='feed_create'),
    path('<int:feed_id>/', views.feed_detail, name='feed_detail'),
    path('<int:feed_id>/update/', views.feed_update, name='feed_update'),
    path('post/<int:feed_id>/delete/', views.feed_delete, name='feed_delete'),
    path('post/<int:feed_id>/toggle-public/', views.toggle_public, name='toggle_public'),
    path('post/<int:feed_id>/like/', views.feed_like, name='feed_like'),
    path('post/<int:feed_id>/report/', views.feed_report, name='feed_report'),
    path('<int:feed_id>/comment/', views.comment_create, name='comment_create'),
    path('<int:feed_id>/comment/<int:comment_id>/', views.comment_delete, name='comment_delete'),
    path('quest-auth-status/', views.quest_auth_status, name='quest_auth_status'),
    path('quest/<int:quest_id>/auth/', views.quest_auth_page, name='quest_auth_page'),
    path('quest/<int:quest_id>/auth/create/', views.quest_auth_feed_create, name='quest_auth_feed_create'),
    path('monthly_feeds/', views.monthly_feeds, name='monthly_feeds'),
]
