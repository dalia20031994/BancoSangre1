from rest_framework import serializers
from notificaciones.models import Notificacion,NotificacionDonador


class NotificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacion
        fields = '__all__'


class NotificacionDonadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificacionDonador
        fields = '__all__'