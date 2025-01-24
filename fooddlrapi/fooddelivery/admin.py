from django.contrib import admin
from .models import User, Store, Menu, Order, Food, Review
# Register your models here.

admin.site.register(User)
admin.site.register(Store)
admin.site.register(Menu)
admin.site.register(Order)
admin.site.register(Food)
admin.site.register(Review)
