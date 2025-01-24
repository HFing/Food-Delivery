
from rest_framework import viewsets, generics, parsers, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from fooddelivery.models import Store, Menu, Order, Food, Review, User
from fooddelivery import serializers

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

