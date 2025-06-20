from django.urls import path
from . import views

app_name = 'feed'

urlpatterns = [
    # Feed CRUD operations
    path('', views.feed_list, name='feed_list'),  # 친구들의 피드 목록
    path('my/', views.my_feed_list, name='my_feed_list'),  # 내 피드 목록
    path('create/', views.feed_create, name='feed_create'),
    path('<int:feed_id>/', views.feed_detail, name='feed_detail'),
    path('<int:feed_id>/update/', views.feed_update, name='feed_update'),
    path('<int:feed_id>/delete/', views.feed_delete, name='feed_delete'),
    
    # Privacy settings
    path('<int:feed_id>/toggle_privacy/', views.toggle_privacy, name='toggle_privacy'),
    
    # Like functionality
    path('<int:feed_id>/like/', views.feed_like, name='feed_like'),
    
    # Comment functionality
    path('<int:feed_id>/comment/', views.comment_create, name='comment_create'),
    path('<int:feed_id>/comment/<int:comment_id>/', views.comment_delete, name='comment_delete'),
    
    # Report functionality
    path('<int:feed_id>/report/', views.feed_report, name='feed_report'),

    # Quest 인증 완료 여부
    path('quest-auth-status/', views.quest_auth_status, name='quest_auth_status'),
]
