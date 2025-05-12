# rol/api/serializer.py
from rest_framework import serializers
from rol.models import Rol

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = '__all__'
