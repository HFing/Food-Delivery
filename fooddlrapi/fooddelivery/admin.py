from django.contrib import admin
from django.template.response import TemplateResponse
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.hashers import make_password
from .models import User, Store, Menu, Order, Food, Review
from django.urls import path, include
from django.http import HttpResponse


class FoodDeliveryAdminSite(admin.AdminSite):
    site_header = 'Food Delivery Admin'
    site_title = 'Food Delivery Admin'
    index_title = 'Welcome to Food Delivery Admin'

    def get_urls(self):
        return [path('statistics-report/', self.stats_view)] + super().get_urls()

    def stats_view(self, request):
        return TemplateResponse(request, 'admin/statistics.html')



admin_site = FoodDeliveryAdminSite(name='fooddeliveryadmin')

class UserAdmin(BaseUserAdmin):
    def save_model(self, request, obj, form, change):
        if form.cleaned_data['password']:
            obj.password = make_password(form.cleaned_data['password'])
        super().save_model(request, obj, form, change)

admin_site.register(User, UserAdmin)
admin_site.register(Store)
admin_site.register(Menu)
admin_site.register(Order)
admin_site.register(Food)
admin_site.register(Review)
