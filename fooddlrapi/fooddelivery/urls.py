from django.urls import include, path
from rest_framework import routers
from fooddelivery import views

routers = routers.DefaultRouter()
routers.register(r'stores', views.StoreViewSet, basename='store')
routers.register(r'users', views.UserViewSet, basename='user')

urlpatterns = [
    path('', include(routers.urls)),
]