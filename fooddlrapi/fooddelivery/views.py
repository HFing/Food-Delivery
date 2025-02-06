from django.utils.decorators import method_decorator
from rest_framework import viewsets, generics, parsers, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from fooddelivery.models import Store, Menu, Order, Food, Review, User
from fooddelivery import serializers
from django.http import HttpResponseForbidden
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.views import View
from django.contrib.auth import login
from fooddelivery.forms import StoreRegistrationForm, StoreUpdateForm
from django.contrib import messages
from django.views.generic.edit import CreateView, UpdateView
from .models import Menu, Food
from .forms import MenuForm, FoodForm
from django.contrib.auth import logout
import random
from django.http import JsonResponse, HttpResponseNotFound
from django.utils import timezone
from fooddelivery.serializers import OrderSerializer
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
import json
from .dao import get_monthly_revenue, get_quarterly_revenue, get_yearly_revenue, get_best_selling_foods


class UserViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = serializers.UserSerializer

    @action(methods=['get'], url_path='current-user', detail=False, permission_classes=[permissions.IsAuthenticated])
    def get_user(self, request):
        return Response(serializers.UserSerializer(request.user).data)

    @action(methods=['put'], url_path='update', detail=False, permission_classes=[permissions.IsAuthenticated])
    def update_user(self, request):
        user = request.user
        serializer = serializers.UserSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(methods=['post'], detail=False, url_path='follow-store', permission_classes=[permissions.IsAuthenticated])
    def follow_store(self, request):
        store_id = request.data.get('store_id')
        if not store_id:
            return Response({'error': 'Store ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            store = Store.objects.get(id=store_id)
        except Store.DoesNotExist:
            return Response({'error': 'Store not found'}, status=status.HTTP_404_NOT_FOUND)

        request.user.followed_stores.add(store)
        return Response({'success': 'Store followed successfully'})

class StoreViewSet(viewsets.ModelViewSet):
    queryset = Store.objects.filter(is_active=True)
    serializer_class = serializers.StoreSerializer

    @action(methods=['get'], detail=False, url_path='list', permission_classes=[permissions.AllowAny])
    def get_stores(self, request):
        stores = self.paginate_queryset(self.get_queryset())  # Sử dụng pagination
        serializer = self.get_serializer(stores, many=True)
        return self.get_paginated_response(serializer.data)

    @action(methods=['get'], detail=True, url_path='foods', permission_classes=[permissions.AllowAny])
    def get_foods(self, request, pk=None):
        store = self.get_object()
        foods = Food.objects.filter(store=store).select_related('menu')

        if not foods.exists():
            return Response({"detail": "Cửa hàng này không có món ăn nào."}, status=status.HTTP_404_NOT_FOUND)

        serializer = serializers.FoodSerializer(foods, many=True)
        return Response(serializer.data)

    @action(methods=['get'], detail=True, url_path='menus/(?P<menu_id>[^/.]+)/foods',
            permission_classes=[permissions.AllowAny])
    def get_menu_foods(self, request, pk=None, menu_id=None):
        store = self.get_object()
        time_slot = request.query_params.get('time_slot', 'morning')
        foods = Food.objects.filter(store=store, menu_id=menu_id, menu__time_slot=time_slot)

        if not foods.exists():
            return Response({"detail": "Menu này không có món ăn nào."}, status=status.HTTP_404_NOT_FOUND)

        serializer = serializers.FoodSerializer(foods, many=True)
        return Response(serializer.data)

class MenuViewSet(viewsets.ModelViewSet):
    queryset = Menu.objects.all()
    serializer_class = serializers.MenuSerializer

class FoodViewSet(viewsets.ModelViewSet):
    queryset = Food.objects.all()
    serializer_class = serializers.FoodSerializer

    @action(methods=['get'], detail=False, url_path='search', permission_classes=[permissions.AllowAny])
    def search_foods(self, request):
        name = request.query_params.get('name', None)
        store = request.query_params.get('store', None)
        foods = Food.objects.filter(is_available=True)
        if name:
            foods = foods.filter(name__icontains=name)
        if store:
            foods = foods.filter(store__name__icontains=store)

        serializer = serializers.FoodSerializer(foods, many=True)
        return Response(serializer.data)

    @action(methods=['get'], detail=False, url_path='random-foods', permission_classes=[permissions.AllowAny])
    def get_random_foods(self, request):
        active_stores = Store.objects.filter(is_active=True)
        foods = Food.objects.filter(store__in=active_stores)
        random_foods = random.sample(list(foods), min(len(foods), 5))
        serializer = self.get_serializer(random_foods, many=True)
        return Response(serializer.data)

class BestSellingFoodsChartView(View):
    def get(self, request):
        store_id = request.user.store.id
        data = get_best_selling_foods(store_id)
        labels = [entry['food_item__name'] for entry in data]
        sold = [entry['total_sold'] for entry in data]
        return JsonResponse({'labels': labels, 'sold': sold})

class ProductsPerStoreChartView(View):
    def get(self, request):
        stores = Store.objects.all()
        labels = [store.name for store in stores]
        counts = [store.foods.count() for store in stores]
        return JsonResponse({'labels': labels, 'counts': counts})

class TotalRevenueChartView(View):
    def get(self, request, period):
        if period == 'monthly':
            data = get_monthly_revenue()
        elif period == 'yearly':
            data = get_yearly_revenue()
        else:
            return JsonResponse({'error': 'Invalid period'}, status=400)

        labels = [entry['month'] if period == 'monthly' else entry['year'] for entry in data]
        revenue = [entry['total_revenue'] for entry in data]
        return JsonResponse({'labels': labels, 'revenue': revenue})

@login_required
def store_dashboard(request):
    if request.user.role != 'store':
        return HttpResponseForbidden("You are not authorized to access this page.")
    return render(request, 'store/dashboard.html')

def custom_logout_view(request):
    logout(request)
    return redirect('/login')

class CustomLoginView(View):
    def get(self, request):
        form = AuthenticationForm()
        return render(request, 'store/login.html', {'form': form})

    def post(self, request):
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            if user.role == 'store':
                return redirect('/store')
            else:
                return redirect('/')
        return render(request, 'store/login.html', {'form': form})

class StoreRegistrationView(View):
    def get(self, request):
        form = StoreRegistrationForm()
        return render(request, 'store/register.html', {'form': form})

    def post(self, request):
        form = StoreRegistrationForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            messages.success(request, 'Registration successful. Please log in.')
            print("Form is valid. Redirecting to login.")
            return redirect('login')
        else:
            messages.error(request, 'Registration failed. Please correct the errors below.')
            print("Form is not valid. Errors:", form.errors)
        return render(request, 'store/register.html', {'form': form})


@method_decorator(login_required, name='dispatch')
class StoreUpdateView(View):
    def get(self, request):
        store = Store.objects.get(owner=request.user)
        form = StoreUpdateForm(instance=store)
        return render(request, 'store/update.html', {'form': form})

    def post(self, request):
        store = Store.objects.get(owner=request.user)
        form = StoreUpdateForm(request.POST, instance=store)
        if form.is_valid():
            form.save()
            messages.success(request, 'Store information updated successfully.')
            return redirect('store_dashboard')
        return render(request, 'store/update.html', {'form': form})

@method_decorator(csrf_exempt, name='dispatch')
class ChangeOrderStatusView(View):
    def post(self, request, order_id):
        try:
            order = Order.objects.get(id=order_id, store__owner=request.user)
        except Order.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Order not found'})

        data = json.loads(request.body)
        status = data.get('status')
        if status in dict(Order.STATUS_CHOICES):
            order.status = status
            order.save()
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'error': 'Invalid status'})

class RevenueChartView(View):
    def get(self, request, period):
        store_id = request.user.store.id
        if period == 'monthly':
            data = get_monthly_revenue(store_id)
        elif period == 'quarterly':
            data = get_quarterly_revenue(store_id)
        elif period == 'yearly':
            data = get_yearly_revenue(store_id)
        else:
            return JsonResponse({'error': 'Invalid period'}, status=400)

        labels = [entry['month'] if period == 'monthly' else entry['quarter'] if period == 'quarterly' else entry['year'] for entry in data]
        revenue = [entry['total_revenue'] for entry in data]
        return JsonResponse({'labels': labels, 'revenue': revenue})

class MenuCreateView(CreateView):
    model = Menu
    form_class = MenuForm
    template_name = 'store/menu_form.html'
    success_url = '/store'

    def form_valid(self, form):
        form.instance.store = self.request.user.store
        return super().form_valid(form)

class FoodCreateView(CreateView):
    model = Food
    form_class = FoodForm
    template_name = 'store/food_form.html'
    success_url = '/store'

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['user'] = self.request.user
        return kwargs

    def form_valid(self, form):
        form.instance.store = self.request.user.store
        return super().form_valid(form)

class MenuUpdateView(UpdateView):
    model = Menu
    form_class = MenuForm
    template_name = 'store/menu_form.html'
    success_url = '/store/menu_food_management'

class FoodUpdateView(UpdateView):
    model = Food
    form_class = FoodForm
    template_name = 'store/food_form.html'
    success_url = '/store/menu_food_management'

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['user'] = self.request.user
        return kwargs

    def form_valid(self, form):
        form.instance.store = self.request.user.store
        return super().form_valid(form)

class MenuFoodManagementView(View):
    def get(self, request):
        menu_form = MenuForm()
        food_form = FoodForm(user=request.user)
        menus = Menu.objects.filter(store=request.user.store)
        foods = Food.objects.filter(store=request.user.store)
        return render(request, 'store/menu_food_management.html', {'menu_form': menu_form, 'food_form': food_form, 'menus': menus, 'foods': foods})

    def post(self, request):
        menu_form = MenuForm(request.POST)
        food_form = FoodForm(request.POST, request.FILES, user=request.user)
        if menu_form.is_valid():
            menu_form.instance.store = request.user.store
            menu_form.save()
        if food_form.is_valid():
            food_form.instance.store = request.user.store
            food_form.save()
        return redirect('menu_food_management')

class MenuFoodManagementView(View):
    def get(self, request):
        menu_form = MenuForm()
        food_form = FoodForm()
        menus = Menu.objects.filter(store=request.user.store)
        foods = Food.objects.filter(store=request.user.store)
        return render(request, 'store/menu_food_management.html', {'menu_form': menu_form, 'food_form': food_form, 'menus': menus, 'foods': foods})

    def post(self, request):
        menu_form = MenuForm(request.POST)
        food_form = FoodForm(request.POST, request.FILES)
        if menu_form.is_valid():
            menu_form.instance.store = request.user.store
            menu_form.save()
        if food_form.is_valid():
            food_form.instance.store = request.user.store
            food_form.save()
        return redirect('menu_food_management')


class OrdersByDateView(View):
    def get(self, request):
        date = request.GET.get('date', timezone.now().date())
        orders = Order.objects.filter(created_at__date=date, store__owner=request.user)
        return render(request, 'store/orders_by_date.html', {'orders': orders, 'selected_date': date})

class OrderDetailView(View):
    def get(self, request, order_id):
        try:
            order = Order.objects.get(id=order_id, store__owner=request.user)
        except Order.DoesNotExist:
            return HttpResponseNotFound("Order not found")

        items = order.order_items.all()
        data = {
            'user': order.user.username,
            'total_amount': str(order.total_amount),
            'status': order.status,
            'items': [{'menu_item': item.food_item.name, 'quantity': item.quantity} for item in items]
        }
        return JsonResponse(data)

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    @action(methods=['post'], detail=False, permission_classes=[permissions.IsAuthenticated])
    def create_order(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(methods=['get'], detail=False, permission_classes=[permissions.IsAuthenticated])
    def user_orders(self, request):
        user = request.user
        orders = Order.objects.filter(user=user)
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)