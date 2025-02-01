from django.urls import include, path
from rest_framework import routers
from fooddelivery import views
from .views import store_dashboard, CustomLoginView, StoreRegistrationView, StoreUpdateView, MenuCreateView, MenuFoodManagementView, FoodCreateView, MenuUpdateView, FoodUpdateView
from django.contrib.auth import views as auth_views

routers = routers.DefaultRouter()
routers.register(r'stores', views.StoreViewSet, basename='store')
routers.register(r'users', views.UserViewSet, basename='user')

urlpatterns = [
    path('', include(routers.urls)),
    path('store/', store_dashboard, name='store/store_dashboard'),
    path('login/', CustomLoginView.as_view(), name='login'),
    path('register/', StoreRegistrationView.as_view(), name='register'),
    path('store/update/', StoreUpdateView.as_view(), name='store_update'),
    path('store/menu/', MenuCreateView.as_view(), name='menumanagement'),
    path('store/food/', FoodCreateView.as_view(), name='food_management'),
    path('store/menu_food_management/', MenuFoodManagementView.as_view(), name='menu_food_management'),
    path('store/menu/<int:pk>/update/', MenuUpdateView.as_view(), name='menu_update'),
    path('store/food/<int:pk>/update/', FoodUpdateView.as_view(), name='food_update'),
]