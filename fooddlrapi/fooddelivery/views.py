from django.utils.decorators import method_decorator
from rest_framework import viewsets, generics, parsers, permissions
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


class UserViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = serializers.UserSerializer
    parsers_classes = [parsers.MultiPartParser]

    def get_permissions(self):
        if self.action.__eq__('current_user'):
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    @action(methods=['get'], url_name='current_user', detail=False)
    def current_user(self, request):
        return Response(serializers.UserSerializer(request.user).data)


class StoreViewSet(viewsets.ModelViewSet):
    queryset = Store.objects.all()
    serializer_class = serializers.StoreSerializer

@login_required
def store_dashboard(request):
    if request.user.role != 'store':
        return HttpResponseForbidden("You are not authorized to access this page.")
    return render(request, 'store/dashboard.html')

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

class MenuFoodManagementView(View):
    def get(self, request):
        menu_form = MenuForm()
        food_form = FoodForm()
        menus = Menu.objects.filter(store=request.user.store)
        return render(request, 'store/menu_food_management.html', {'menu_form': menu_form, 'food_form': food_form, 'menus': menus})

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