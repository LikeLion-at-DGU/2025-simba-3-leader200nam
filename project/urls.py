from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect
from main import views
from accounts import views as accounts_views

urlpatterns = [
    path('', lambda request: redirect('signin'), name='root'),
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')),
    path('home/', views.mainpage, name='mainpage'),
    path('intro/', views.intropage, name='intropage'),
    path('signin/', accounts_views.login_view, name='signin'),
    path('signup/', accounts_views.signup, name='signup'),
    path('intro-input/', views.introInputPage, name='introInputPage'),
    path('registeration/', views.registeration, name='registeration'),
    path('profile-modification/', views.profileModification, name='profileModification'),   
    path('rank/', views.rankPage, name='rankPage'),
]