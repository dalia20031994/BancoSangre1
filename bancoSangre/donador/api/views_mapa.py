# para las peticiones al mapa
from django.utils import timezone
from datetime import timedelta
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from donador.models import Donador
import logging

logger = logging.getLogger(__name__)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def donadores_para_mapa(request):
    try:
        # Filtro para gtener solo los donadores qye estan activos y que tiene almenos 2 meses que donaron
        fecha_limite = timezone.now().date() - timedelta(days=60)
        queryset = Donador.objects.filter(
            estado=True,
            ultimaDonacion__lte=fecha_limite,
            direccion__coordenadas__isnull=False
        ).select_related('direccion', 'direccion__coordenadas', 'usuario')
        # Filtros opcionales
        tipo_sangre = request.query_params.get('tipo_sangre')
        if tipo_sangre:
            queryset = queryset.filter(tipoSangre=tipo_sangre)
        
        sexo = request.query_params.get('sexo')
        if sexo:
            queryset = queryset.filter(usuario__sexo=sexo)
        
        edad_min = request.query_params.get('edad_min')
        if edad_min:
            queryset = queryset.filter(edad__gte=edad_min)
        
        edad_max = request.query_params.get('edad_max')
        if edad_max:
            queryset = queryset.filter(edad__lte=edad_max)

        # Serialización
        data = [{
            'id': d.id,
            'nombre': f"{d.nombre} {d.apellidoP} {d.apellidoM}",
            'edad': d.edad,
            'tipoSangre': d.tipoSangre,
            'sexo': d.usuario.sexo,
            'primeraDonacion': d.primeraDonacion.strftime('%Y-%m-%d'),
            'ultimaDonacion': d.ultimaDonacion.strftime('%Y-%m-%d'),
            'telefono': d.telefonoUno,
            'correo': d.usuario.correo,
            'direccion': {
                'municipio': (d.direccion.colonia.municipio.nombre),
                'colonia': (d.direccion.colonia.nombre),
                'calle': (d.direccion.calle),
                'numExterior': (d.direccion.numExterior),
                'numInterior': (d.direccion.numInterior)

            },
            'coordenadas': {
                'lat': float(d.direccion.coordenadas.latitud),
                'lng': float(d.direccion.coordenadas.longitud)
            }
        } for d in queryset]

        return Response(data)
    
    except Exception as e:
        logger.error(f"Error en donadores_para_mapa: {str(e)}", exc_info=True)
        return Response(
            {'error': 'Error interno del servidor'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )