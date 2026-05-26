from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from vuelos.models import Vuelo
from usuarios.models import Usuario


class ActualizarEstadoVuelo(APIView):
    permission_classes = []
    def patch(self, request, api_id_vuelo):
        nuevo_estado = request.data.get('estado_vuelo')
        usuario_id = request.data.get('usuario_id')

        if not nuevo_estado or not usuario_id:
            return Response(
                {"error": "Faltan datos obligatorios: se requiere estado_vuelo y usuario_id."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            usuario_logueado = Usuario.objects.get(id=usuario_id)
            vuelo = Vuelo.objects.get(api_id=api_id_vuelo)

            id_proveedor_vuelo = vuelo.id_proveedor_id
            id_proveedor_usuario = usuario_logueado.id_proveedor_id
            if not id_proveedor_usuario:
                return Response(
                    {"error": "Este usuario no es una aerolínea autorizada."},
                    status=status.HTTP_403_FORBIDDEN
                )

            if str(id_proveedor_vuelo) != str(id_proveedor_usuario):
                return Response(
                    {"error": "Operación rechazada: No puedes modificar los estados de vuelos de la competencia."},
                    status=status.HTTP_403_FORBIDDEN
                )

            vuelo.estado_vuelo = nuevo_estado

            vuelo.full_clean()
            vuelo.save()

            return Response({
                "mensaje": "Estado del vuelo actualizado exitosamente.",
                "nuevo_estado": vuelo.estado_vuelo
            }, status=status.HTTP_200_OK)

        except Usuario.DoesNotExist:
            return Response({"error": "El usuario no existe."}, status=status.HTTP_404_NOT_FOUND)
        except Vuelo.DoesNotExist:
            return Response({"error": "Vuelo no encontrado."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"Estado no válido o error interno: {str(e)}"},
                            status=status.HTTP_400_BAD_REQUEST)