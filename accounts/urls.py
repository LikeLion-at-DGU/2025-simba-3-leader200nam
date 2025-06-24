from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    # 마이페이지
    path('profile/', views.profile_view, name='profile'),
    path('profile/update/', views.profile_update, name='profile_update'),
    # 닉네임 입력
    path('set-nickname/', views.set_nickname, name='set_nickname'),
    path('signin/', views.signin, name='signin'),
    path('check-username/', views.check_username, name='check_username'),
] 