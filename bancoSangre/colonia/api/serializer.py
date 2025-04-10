from rest_framework import serializers
from colonia.models import Colonia

class ColoniaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Colonia
        fields = '__all__'
