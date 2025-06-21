from django.contrib import admin
from django.urls import path, include
from main import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')),
    path('home/', views.mainpage, name='mainpage'),
    path('intro/', views.intropage, name='intropage'),
    path('signin/', views.signin, name='signin'),
    path('signup/', views.signup, name='signup'),
    path('intro-input/', views.introInputPage, name='introInputPage'),
    path('registeration/', views.registeration, name='registeration'),
    path('profile-modification/', views.profileModification, name='profileModification'),   
    path('rank/', views.rankPage, name='rankPage'),
]