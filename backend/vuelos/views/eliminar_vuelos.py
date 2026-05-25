from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from vuelos.models import Vuelo
from usuarios.models import Usuario
from vuelos.models import Proveedorapi

class EliminarVuelo(APIView):
    permission_classes = []
    def delete(self, request):
        vuelo_id = request.query_params.get('vuelo_id')
        usuario_id = request.query_params.get('usuario_id')
        if not vuelo_id or not usuario_id:
            return Response({"error": "Faltan parámetros"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            usuario_logueado = Usuario.objects.get(id=usuario_id)
            vuelo = Vuelo.objects.get(api_id=vuelo_id)
            id_proveedor_vuelo = vuelo.id_proveedor_id
            id_proveedor_usuario = usuario_logueado.id_proveedor_id
            print(f"--- DEBUG ELIMINAR --- Vuelo de: {id_proveedor_vuelo} | Usuario de: {id_proveedor_usuario}")
            if not id_proveedor_usuario:
                return Response({"error": "Este usuario no es una aerolínea autorizada."}, status=status.HTTP_403_FORBIDDEN)
            if str(id_proveedor_vuelo) != str(id_proveedor_usuario):
                return Response({"error": "Operación rechazada: No puedes borrar vuelos de la competencia"}, status=status.HTTP_403_FORBIDDEN)
            vuelo.delete()
            return Response({"mensaje": "Vuelo eliminado exitosamente"}, status=status.HTTP_200_OK)
        except Usuario.DoesNotExist:
            return Response({"error": "El usuario no existe"}, status=status.HTTP_404_NOT_FOUND)
        except Vuelo.DoesNotExist:
            return Response({"error": "El vuelo no existe"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"Error interno: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)