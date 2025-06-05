from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as filters
from django.utils.dateparse import parse_date
from django.utils import timezone
from datetime import datetime

from donacion.models import Donacion
from cita.models import Cita
from donador.models import Donador
from donacion.api.serializer import DonacionSerializer


# Filtro para Donacion
class DonacionFilter(filters.FilterSet):
    fecha_min = filters.DateFilter(field_name="cita__fecha", lookup_expr='gte')
    fecha_max = filters.DateFilter(field_name="cita__fecha", lookup_expr='lte')

    class Meta:
        model = Donacion
        fields = ['fecha_min', 'fecha_max']


# ViewSet para Donacion
class DonacionViewSet(viewsets.ModelViewSet):
    queryset = Donacion.objects.all()
    serializer_class = DonacionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = DonacionFilter

    def create(self, request, *args, **kwargs):
        data = request.data
        id_cita = data.get('cita')
        id_donador = data.get('donador')
        dono = data.get('dono', True)

        if isinstance(dono, str):
            dono = dono.lower() == 'true'

        if not id_cita or not id_donador:
            return Response({"error": "Cita y donador son requeridos"}, status=status.HTTP_400_BAD_REQUEST)

        if Donacion.objects.filter(cita_id=id_cita).exists():
            return Response({"error": "Ya existe donación registrada para esta cita"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cita = Cita.objects.get(id=id_cita)
            donador = Donador.objects.get(id=id_donador)
        except (Cita.DoesNotExist, Donador.DoesNotExist):
            return Response({"error": "Cita o donador no encontrado"}, status=status.HTTP_404_NOT_FOUND)

        cita.estado = 'asistió' if dono else 'no asistió'
        cita.save()

        if dono:
            donador.ultimaDonacion = timezone.now().date()
            donador.save()

        donacion = Donacion.objects.create(
            donador=donador,
            cita=cita,
            dono=dono,
            cantidad_litros=data.get('cantidad_litros') if dono else None,
            lugar_donacion=data.get('lugar_donacion', '') if dono else '',
            observaciones=data.get('observaciones', '') if dono else '',
        )

        serializer = DonacionSerializer(donacion)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# APIView para listar citas en rango de fechas con donaciones (o sin)
class CitasConDonacionesSemanaView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        fecha_min = request.GET.get('fecha_min')
        fecha_max = request.GET.get('fecha_max')

        if not fecha_min or not fecha_max:
            return Response({"error": "Se requiere fecha_min y fecha_max"}, status=400)

        fecha_min_parsed = parse_date(fecha_min)
        fecha_max_parsed = parse_date(fecha_max)

        if not fecha_min_parsed or not fecha_max_parsed:
            return Response({"error": "Fechas inválidas"}, status=400)

        citas = Cita.objects.filter(fecha__range=(fecha_min_parsed, fecha_max_parsed)).select_related('donador')

        resultado = []
        for cita in citas:
            donacion = Donacion.objects.filter(cita=cita).first()
            resultado.append({
                "cita": {
                    "id": cita.id,
                    "fecha": cita.fecha,
                    "hora": cita.hora,
                    "estado": cita.estado,
                },
                "donador": {
                    "id": cita.donador.id,
                    "nombre": cita.donador.nombre,
                    "apellidoP": cita.donador.apellidoP,
                    "apellidoM": cita.donador.apellidoM,
                },
                "donacion": {
                    "id": donacion.id,
                    "dono": donacion.dono,
                    "cantidad_litros": donacion.cantidad_litros,
                    "lugar_donacion": donacion.lugar_donacion,
                    "observaciones": donacion.observaciones,
                } if donacion else None
            })

        return Response(resultado)


# Función para obtener donaciones filtradas por rango de fechas
@api_view(['GET'])
def donaciones_de_semana(request):
    fecha_min = request.query_params.get('fecha_min')
    fecha_max = request.query_params.get('fecha_max')

    try:
        fecha_min = datetime.strptime(fecha_min, '%Y-%m-%d').date()
        fecha_max = datetime.strptime(fecha_max, '%Y-%m-%d').date()
    except (TypeError, ValueError):
        return Response({'error': 'Parámetros de fecha inválidos.'}, status=400)

    donaciones = Donacion.objects.filter(cita__fecha__range=(fecha_min, fecha_max))
    serializer = DonacionSerializer(donaciones, many=True)
    return Response(serializer.data)
