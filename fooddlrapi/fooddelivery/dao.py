from fooddelivery.models import User, Store, Menu, Order, Food, Review, OrderItem
from django.db.models import Sum, Count
from django.db.models.functions import TruncMonth, TruncQuarter, TruncYear

def get_user_by_id(user_id):
    return User.objects.get(id=user_id)

def get_monthly_revenue(store_id=None):
    queryset = Order.objects.all() if store_id is None else Order.objects.filter(store_id=store_id)
    return queryset.annotate(month=TruncMonth('created_at')).values('month').annotate(total_revenue=Sum('total_amount')).order_by('month')

def get_yearly_revenue(store_id=None):
    queryset = Order.objects.all() if store_id is None else Order.objects.filter(store_id=store_id)
    return queryset.annotate(year=TruncYear('created_at')).values('year').annotate(total_revenue=Sum('total_amount')).order_by('year')

def get_quarterly_revenue(store_id):
    return Order.objects.filter(store_id=store_id).annotate(quarter=TruncQuarter('created_at')).values('quarter').annotate(total_revenue=Sum('total_amount')).order_by('quarter')


def get_best_selling_foods(store_id):
    return OrderItem.objects.filter(order__store_id=store_id).values('food_item__name').annotate(total_sold=Count('food_item')).order_by('-total_sold')[:10]