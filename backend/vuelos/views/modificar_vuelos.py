from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from vuelos.models import Vuelo
from usuarios.models import Usuario
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
        nuevos_asientos = request.data.get('asientos_disponibles')

        if not api_id_vuelo or not id_usuario:
            return Response({"error": "Faltan parámetros obligatorios (vuelo_id o usuario_id)"},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            usuario = Usuario.objects.get(id=id_usuario)

            id_proveedor_usuario = usuario.id_proveedor_id

            if not id_proveedor_usuario:
                return Response({"error": "Acceso denegado: Tu cuenta no es de empresa"},
                                status=status.HTTP_403_FORBIDDEN)
            vuelo = Vuelo.objects.get(api_id=api_id_vuelo)
            id_proveedor_vuelo = vuelo.id_proveedor_id
            if str(id_proveedor_vuelo) != str(id_proveedor_usuario):
                return Response({"error": "Operación rechazada: No puedes modificar vuelos de otra aerolínea"},
                                status=status.HTTP_403_FORBIDDEN)

            if nueva_fecha_salida:
                obj_salida = datetime.strptime(nueva_fecha_salida, "%Y-%m-%d %H:%M:%S")
                vuelo.fecha_salida = make_aware(obj_salida)

            if nueva_fecha_llegada:
                obj_llegada = datetime.strptime(nueva_fecha_llegada, "%Y-%m-%d %H:%M:%S")
                vuelo.fecha_llegada = make_aware(obj_llegada)

            if nuevo_precio is not None:
                vuelo.precio_base = round(float(nuevo_precio), 2)

            if nuevos_asientos is not None:
                vuelo.asientos_disponibles = int(nuevos_asientos)

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
            return Response({"error": "Formato de datos incorrecto (revisa las fechas o números)"},
                            status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"Error interno: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)