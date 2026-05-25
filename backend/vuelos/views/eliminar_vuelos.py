from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from vuelos.models import Vuelo
from usuarios.models import Usuario

class EliminarVuelo(APIView):
    def delete(self, request):
        api_id_vuelo = request.query_params.get('vuelo_id')
        id_usuario = request.query_params.get('usuario_id')

        if not api_id_vuelo or not id_usuario:
            return Response({"error": "Faltan parámetros (vuelo_id o usuario_id)"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            usuario = Usuario.objects.get(id=id_usuario)
            proveedor_del_usuario = usuario.id_proveedor

            if not proveedor_del_usuario:
                return Response({"error": "Acceso denegado: Tu cuenta no es de empresa"}, status=status.HTTP_403_FORBIDDEN)

            vuelo = Vuelo.objects.get(api_id=api_id_vuelo)

            if vuelo.id_proveedor != proveedor_del_usuario:
                return Response({"error": "Operación rechazada: No puedes borrar vuelos de la competencia"}, status=status.HTTP_403_FORBIDDEN)

            codigo_borrado = vuelo.codigo_vuelo
            vuelo.delete()

            return Response({"mensaje": f"El vuelo {codigo_borrado} ha sido retirado del catálogo exitosamente."}, status=status.HTTP_200_OK)

        except Usuario.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        except Vuelo.DoesNotExist:
            return Response({"error": "El vuelo especificado no existe o ya fue borrado"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"Error interno del servidor: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)