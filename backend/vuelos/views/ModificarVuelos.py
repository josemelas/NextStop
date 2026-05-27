from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from vuelos.models import Vuelo
from usuarios.models import Usuario
from reservas.models import Reserva
from datetime import datetime
from django.utils.timezone import make_aware


class ModificarVuelos(APIView):
    permission_classes = [AllowAny]

    def put(self, request):
        api_id_vuelo = request.data.get('vuelo_id')
        id_usuario = request.data.get('usuario_id')

        nueva_fecha_salida = request.data.get('fecha_salida')
        nueva_fecha_llegada = request.data.get('fecha_llegada')
        nuevo_precio = request.data.get('precio_base')
        nuevos_asientos_bloquear = request.data.get('asientos_ocupados')

        if not api_id_vuelo or not id_usuario:
            return Response({"error": "Faltan parámetros obligatorios"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            usuario = Usuario.objects.get(id=id_usuario)
            if not usuario.id_proveedor_id:
                return Response({"error": "Acceso denegado"}, status=status.HTTP_403_FORBIDDEN)

            vuelo = Vuelo.objects.get(api_id=api_id_vuelo)
            if str(vuelo.id_proveedor_id) != str(usuario.id_proveedor_id):
                return Response({"error": "Operación rechazada"}, status=status.HTTP_403_FORBIDDEN)

            if nueva_fecha_salida:
                vuelo.fecha_salida = make_aware(datetime.strptime(nueva_fecha_salida, "%Y-%m-%d %H:%M:%S"))

            if nueva_fecha_llegada:
                vuelo.fecha_llegada = make_aware(datetime.strptime(nueva_fecha_llegada, "%Y-%m-%d %H:%M:%S"))

            if nuevo_precio is not None:
                vuelo.precio_base = round(float(nuevo_precio), 2)
                if nuevos_asientos_bloquear is not None:

                    fantasmas_viejos = [a.strip() for a in
                                        vuelo.asientos_ocupados.split(',')] if vuelo.asientos_ocupados else []
                    cantidad_vieja = len([a for a in fantasmas_viejos if a])

                    seleccionados_front = [a.strip() for a in
                                           nuevos_asientos_bloquear.split(',')] if nuevos_asientos_bloquear else []

                    lista_combinada = list(set(fantasmas_viejos + seleccionados_front))
                    cantidad_nueva = len(lista_combinada)

                    diferencia = cantidad_nueva - cantidad_vieja

                    vuelo.asientos_disponibles -= diferencia

                    if vuelo.asientos_disponibles < 0:
                        vuelo.asientos_disponibles = 0

                    capacidad_maxima = 60
                    if vuelo.asientos_disponibles > capacidad_maxima:
                        vuelo.asientos_disponibles = capacidad_maxima

                    vuelo.asientos_ocupados = ", ".join(lista_combinada)

                vuelo.save()

            return Response({
                "mensaje": f"El vuelo {vuelo.codigo_vuelo} ha sido actualizado con éxito.",
                "vuelo": {
                    "precio_base": str(vuelo.precio_base),
                    "asientos_disponibles": vuelo.asientos_disponibles,
                    "fecha_salida": vuelo.fecha_salida.strftime("%Y-%m-%d %H:%M:%S")
                }
            }, status=status.HTTP_200_OK)

        except Usuario.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        except Vuelo.DoesNotExist:
            return Response({"error": "El vuelo especificado no existe"}, status=status.HTTP_404_NOT_FOUND)
        except ValueError:
            return Response({"error": "Formato de datos incorrecto"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"Error interno: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)