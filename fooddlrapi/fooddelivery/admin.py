from django.contrib import admin
from django.template.response import TemplateResponse

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

admin_site.register(User)
admin_site.register(Store)
admin_site.register(Menu)
admin_site.register(Order)
admin_site.register(Food)
admin_site.register(Review)
