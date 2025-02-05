from fooddelivery.models import User, Store, Menu, Order, Food, Review
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        data = validated_data.copy()
        user = User(**data)
        user.set_password(data['password'])
        user.save()
        return user

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            instance.set_password(validated_data.pop('password'))
        return super().update(instance, validated_data)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['avatar'] = instance.avatar.url if instance.avatar else ''
        return data

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'first_name', 'last_name', 'avatar']
        extra_kwargs = {
            'password': {'write_only': True},
        }

class StoreSerializer(serializers.ModelSerializer):
    owner_avatar = serializers.SerializerMethodField()

    class Meta:
        model = Store
        fields = '__all__'

    def get_owner_avatar(self, obj):
        return obj.owner.avatar.url if obj.owner.avatar else ''

class MenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = Menu
        fields = '__all__'

class FoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Food
        fields = '__all__'
