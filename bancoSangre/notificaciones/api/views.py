from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
from notificaciones.models import Notificacion,NotificacionDonador

from donador.models import Donador

@api_view(['POST'])
def crear_notificacion(request):
    tipo_sangre = request.data.get('tipo_sangre')
    litros = float(request.data.get('litros'))
    titulo = request.data.get('titulo')
    mensaje = request.data.get('mensaje')
    ids_donadores = request.data.get('donadores_ids')  # lista opcional de IDs

    if not titulo or not mensaje or not tipo_sangre or not litros:
        return Response({'error': 'Faltan datos requeridos'}, status=400)

    notificacion = Notificacion.objects.create(
        titulo=titulo,
        mensaje=mensaje,
        tipo_sangre=tipo_sangre,
        litros_requeridos=litros,
    )

    if ids_donadores:
        donadores = Donador.objects.filter(id__in=ids_donadores)
    else:
        cantidad_necesaria = int((litros * 2))
        donadores = Donador.objects.filter(tipoSangre=tipo_sangre).order_by('ultimaDonacion')[:cantidad_necesaria]

    for d in donadores:
        NotificacionDonador.objects.create(
            notificacion=notificacion,
            donador=d
        )

    return Response({
        'mensaje': f'Se ha enviado la solicitud a {donadores.count()} donadores.',
        'notificacion_id': notificacion.id
    })


@api_view(['PATCH']) # Cambiado a PATCH
def responder_notificacion(request, notificacion_id): # Eliminado donador_id de aquí
    estado = request.data.get('estado')
    hora_llegada = request.data.get('hora_llegada')

    if estado not in ['aceptada', 'rechazada']:
        return Response({'error': 'Estado inválido'}, status=400)

    try:
        donador = Donador.objects.get(usuario=request.user) # Obtiene el donador del usuario autenticado
    except Donador.DoesNotExist:
        return Response({'error': 'Donador no encontrado para el usuario actual.'}, status=404)

    try:
        respuesta = NotificacionDonador.objects.get(
            notificacion_id=notificacion_id,
            donador=donador # Filtra por el donador obtenido
        )
    except NotificacionDonador.DoesNotExist:
        return Response({'error': 'No se encontró la notificación para este donador.'}, status=404)

    if respuesta.estado != 'pendiente': # Evita responder múltiples veces
        return Response({'error': 'Ya has respondido a esta notificación.'}, status=400)

    respuesta.estado = estado
    respuesta.fecha_respuesta = timezone.now()
    if estado == 'aceptada' and hora_llegada:
        respuesta.hora_llegada = hora_llegada
    else:
        respuesta.hora_llegada = None # Limpia si se rechaza
    respuesta.save()

    return Response({'mensaje': f'Se ha registrado la respuesta: {estado}'})


@api_view(['GET'])
def ver_estado_notificacion(request, notificacion_id):
    try:
        notificacion = Notificacion.objects.get(id=notificacion_id)
    except Notificacion.DoesNotExist:
        return Response({'error': 'No existe esa notificación'}, status=404)

    respuestas = NotificacionDonador.objects.filter(notificacion=notificacion).select_related('donador')
    data = []
    for r in respuestas:
        data.append({
            'donador': r.donador.nombre,
            'estado': r.estado,
            'hora_llegada': r.hora_llegada,
            'fecha_respuesta': r.fecha_respuesta,
        })

    return Response({
        'titulo': notificacion.titulo,
        'mensaje': notificacion.mensaje,
        'tipo_sangre': notificacion.tipo_sangre,
        'litros_requeridos': notificacion.litros_requeridos,
        'fecha_creacion': notificacion.fecha_creacion,
        'respuestas': data
    })
@api_view(['GET'])
def historial_notificaciones(request):
    notificaciones = Notificacion.objects.all().prefetch_related('respuestas', 'respuestas__donador')

    data = []
    for notificacion in notificaciones:
        respuestas = [
            {
                'donador': str(respuesta.donador),
                'estado': respuesta.estado,
                'hora_llegada': respuesta.hora_llegada,
                'fecha_respuesta': respuesta.fecha_respuesta
            }
            for respuesta in notificacion.respuestas.all()
        ]
        data.append({
            'titulo': notificacion.titulo,
            'mensaje': notificacion.mensaje,
            'tipo_sangre': notificacion.tipo_sangre,
            'litros_requeridos': notificacion.litros_requeridos,
            'fecha_creacion': notificacion.fecha_creacion,
            'respuestas': respuestas
        })

    return Response(data)
@api_view(['GET'])
def mis_notificaciones(request):
    try:
        donador = Donador.objects.get(usuario=request.user)
    except Donador.DoesNotExist:
        return Response({'error': 'Donador no encontrado para el usuario actual.'}, status=404)

    notificaciones_donador = NotificacionDonador.objects.filter(donador=donador).select_related('notificacion')

    data = []
    for nd in notificaciones_donador:
        is_aceptada = None # Por defecto es null (pendiente)
        tiempo_llegada_val = None

        if nd.estado == 'aceptada':
            is_aceptada = True
            tiempo_llegada_val = nd.hora_llegada
        elif nd.estado == 'rechazada':
            is_aceptada = False
        # Si nd.estado es 'pendiente', is_aceptada se mantiene como None

        data.append({
            'id': nd.notificacion.id,
            'titulo': nd.notificacion.titulo, # Añadido
            'mensaje': nd.notificacion.mensaje, # Añadido
            'tipo_sangre': nd.notificacion.tipo_sangre,
            'litros': nd.notificacion.litros_requeridos,
            'aceptada': is_aceptada,
            'tiempo_llegada': tiempo_llegada_val,
        })

    return Response(data)