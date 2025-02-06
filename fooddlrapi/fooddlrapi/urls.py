from django.contrib import admin
from django.urls import path, re_path
from django.urls import include, path
from debug_toolbar.toolbar import debug_toolbar_urls
from fooddelivery.admin import admin_site
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf import settings
from django.conf.urls.static import static

schema_view = get_schema_view(
    openapi.Info(
        title="Food Delivery API",
        default_version='v1',
        description="API for Food Delivery",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="thaihoangon.on@gmail.com"),
        license=openapi.License(name="HFing"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('', include('fooddelivery.urls')),
    path('admin/', admin_site.urls),
    path('accounts/', include('allauth.urls')),
    path('__debug__/', include(debug_toolbar_urls())),
    path('o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('auth/', include('dj_rest_auth.urls')),  # API login, logout
    path('auth/registration/', include('dj_rest_auth.registration.urls')),  # API đăng ký
    path('auth/social/', include('allauth.socialaccount.urls')),  # API Google OAuth
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)