from django.urls import include, path
from rest_framework import routers
from fooddelivery import views
from .views import store_dashboard, CustomLoginView, StoreRegistrationView, StoreUpdateView, MenuCreateView, MenuFoodManagementView, FoodCreateView, MenuUpdateView, FoodUpdateView,custom_logout_view, OrdersByDateView, OrderDetailView, OrderViewSet, ChangeOrderStatusView
from django.contrib.auth import views as auth_views

routers = routers.DefaultRouter()
routers.register(r'stores', views.StoreViewSet, basename='store')
routers.register(r'users', views.UserViewSet, basename='user')
routers.register(r'menus', views.MenuViewSet, basename='menu')
routers.register(r'foods', views.FoodViewSet, basename='food')
routers.register(r'orders', OrderViewSet, basename='order')



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
    path('logout/', custom_logout_view, name='logout'),
path('store/orders/', OrdersByDateView.as_view(), name='orders_by_date'),
    path('store/order/<int:order_id>/details/', OrderDetailView.as_view(), name='order_details'),
    path('store/order/<int:order_id>/change_status/', ChangeOrderStatusView.as_view(), name='change_order_status'),
    path('store/order/<int:order_id>/details/', OrderDetailView.as_view(), name='order_details'),

]