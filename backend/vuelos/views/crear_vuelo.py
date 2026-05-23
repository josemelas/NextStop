from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from vuelos.models import Vuelo, Proveedorapi
import uuid


class CrearVueloProveedor(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        id_proveedor = request.data.get('id_proveedor')
        if not id_proveedor:
            return Response(
                {"error": "Se requiere el id_proveedor en modo abierto."},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            proveedor = Proveedorapi.objects.get(id_proveedor=id_proveedor)
        except Proveedorapi.DoesNotExist:
            return Response(
                {"error": "El proveedor especificado no existe."},
                status=status.HTTP_404_NOT_FOUND
            )
        origen = request.data.get('origen')
        destino = request.data.get('destino')
        fecha_salida = request.data.get('fecha_salida')
        fecha_llegada = request.data.get('fecha_llegada')
        precio_base = request.data.get('precio_base')
        asientos = request.data.get('asientos_disponibles', 60)
        if not all([origen, destino, fecha_salida, fecha_llegada, precio_base]):
            return Response({"error": "Faltan datos obligatorios para crear el vuelo."},
                            status=status.HTTP_400_BAD_REQUEST)
        try:
            nuevo_api_id = uuid.uuid4().hex
            prefijo_aerolinea = proveedor.nombre[:2].upper() if proveedor.nombre else "FL"
            nuevo_codigo_vuelo = f"{prefijo_aerolinea}-{uuid.uuid4().hex[:4].upper()}"
            nuevo_vuelo = Vuelo.objects.create(
                id_proveedor=proveedor,
                api_id=nuevo_api_id,
                aerolinea=proveedor.nombre,
                codigo_vuelo=nuevo_codigo_vuelo,
                origen=origen,
                destino=destino,
                fecha_salida=fecha_salida,
                fecha_llegada=fecha_llegada,
                precio_base=precio_base,
                asientos_disponibles=asientos
            )

            return Response({
                "mensaje": "Vuelo publicado exitosamente.",
                "vuelo_creado": {
                    "codigo_vuelo": nuevo_vuelo.codigo_vuelo,
                    "aerolinea": nuevo_vuelo.aerolinea
                }
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": f"Error al guardar el vuelo: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)