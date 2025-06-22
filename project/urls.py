from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect
from django.conf import settings
from django.conf.urls.static import static
from main import views
from accounts import views as accounts_views

urlpatterns = [
    path('', lambda request: redirect('signin'), name='root'),
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')),
    path('quest/', include('quest.urls')),
    path('feed/', include('feed.urls')),
    path('home/', views.mainpage, name='mainpage'),
    path('intro/', views.intropage, name='intropage'),
    path('signin/', accounts_views.login_view, name='signin'),
    path('signup/', accounts_views.signup, name='signup'),
    path('intro-input/', views.introInputPage, name='introInputPage'),
    path('registeration/', views.registeration, name='registeration'),
    path('profile-modification/', views.profileModification, name='profileModification'),   
    path('rank/', views.rankPage, name='rankPage'),
    path('api/user-info/', views.get_user_info, name='get_user_info'),
    path('api/update-nickname/', views.update_nickname, name='update_nickname'),
]

# 미디어 파일 서빙
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

    
    


