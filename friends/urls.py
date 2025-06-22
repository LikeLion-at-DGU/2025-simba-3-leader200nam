from django.urls import path
from . import views

app_name = 'friends'

urlpatterns = [
    path('', views.friend_list, name='friend_list'),
    path('search/', views.search_friends, name='search_friends'),
    path('search-by-code/', views.search_by_code, name='search_by_code'),
    path('delete/<int:friend_id>/', views.delete_friend, name='delete_friend'),
    path('add/', views.add_friend, name='add_friend'),
    path('update-memo/<int:friend_id>/', views.update_memo, name='update_memo'),
    path('profile/<int:friend_id>/', views.get_friend_profile, name='friend_profile'),
] 