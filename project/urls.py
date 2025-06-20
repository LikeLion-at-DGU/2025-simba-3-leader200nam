from django.contrib import admin
from django.urls import path, include
from main import views
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.urls import path, re_path
from django.contrib import admin

schema_view = get_schema_view(
    openapi.Info(
        title="내 프로젝트 API 문서",
        default_version='v1',
        description="API 설명",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('accounts/', include('accounts.urls')),
    path('home/', views.mainpage, name='mainpage'),
    path('intro/', views.intropage, name='intropage'),
    path('signin/', views.signin, name='signin'),
    path('signup/', views.signup, name='signup'),
    path('intro-input/', views.introInputPage, name='introInputPage'),
    path('registeration/', views.registeration, name='registeration'),
    re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('profile-modification/', views.profileModification, name='profileModification'),   
]