from django.contrib.auth.models import AbstractUser
from django.db import models
from cloudinary.models import CloudinaryField

# Create your models here.

class Base(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        abstract = True

# User model (Thông tin người dùng)
class User(AbstractUser, Base):
    avatar = models.ImageField(upload_to='avatars/',blank=True, null=True)
    is_store_owner = models.BooleanField(default=False)
    ROLE_CHOICES = [
        ('admin', 'Administrator'),
        ('personal', 'Personal User'),
        ('store', 'Store User')
    ]
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='personal')
    followed_stores = models.ManyToManyField('Store', related_name='followers', blank=True)



# Store model (Thông tin cửa hàng)
class Store(Base):
    owner = models.OneToOneField(User, on_delete=models.CASCADE, related_name='store')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    address = models.CharField(max_length=255)
    location = models.CharField(max_length=255)  # Store Google Map link or coordinates
    is_active = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class Menu(Base):
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='menus')
    name = models.CharField(max_length=255)
    TIME_SLOT_CHOICES = [
        ('morning', 'Morning'),
        ('afternoon', 'Afternoon'),
        ('evening', 'Evening')
    ]
    time_slot = models.CharField(max_length=50, choices=TIME_SLOT_CHOICES, default='morning')
    def __str__(self):
        return f"{self.name} ({self.time_slot}) - {self.store.name}"

# Food model (Thông tin món ăn)
class Food(Base):
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='foods')
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='food_images/', blank=True, null=True)
    # image = CloudinaryField('image', blank=True, null=True)
    is_available = models.BooleanField(default=True)
    menu = models.ForeignKey(Menu, on_delete=models.SET_NULL, related_name='foods', null=True, blank=True)
    def __str__(self):
        return f"{self.name} ({self.time_slot})"

# Order model (Thông tin đơn hàng)
class Order(Base):
    PAYMENT_CHOICES = [
        ('paypal', 'PayPal'),
        ('stripe', 'Stripe'),
        ('momo', 'MoMo'),
        ('zalo_pay', 'Zalo Pay'),
        ('cash', 'Cash')
    ]

    STATUS_CHOICES = [
        ('pending', 'Chưa xác nhận'),
        ('confirmed', 'Đã xác nhận'),
        ('shipped', 'Đã vận chuyển')
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='orders')
    menu_items = models.ManyToManyField(Menu, through='OrderItem')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50, choices=PAYMENT_CHOICES)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')  # Add this line
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"Order #{self.id} by {self.user.username}"

# OrderItem model (Thông tin món ăn trong đơn hàng)
class OrderItem(Base):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='order_items')
    menu_item = models.ForeignKey(Menu, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

# Review model (Thông tin đánh giá)
class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='reviews')
    food = models.ForeignKey(Food, on_delete=models.CASCADE, blank=True, null=True)
    rating = models.PositiveIntegerField()  # Scale: 1-5
    comment = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Review by {self.user.username} for {self.store.name}"

