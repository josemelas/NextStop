from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Favorito


class EliminarFavorito(APIView):
    def delete(self, request):
        id_favorito = request.query_params.get('id_favorito')

        id_usuario = request.query_params.get('usuario_id')
        id_recurso = request.query_params.get('id_recurso')
        tipo_recurso = request.query_params.get('tipo_recurso', 'VUELO')

        try:
            if id_favorito:
                favorito = Favorito.objects.get(id_favorito=id_favorito)
            elif id_usuario and id_recurso:
                favorito = Favorito.objects.get(
                    id_usuario_id=id_usuario,
                    id_recurso=id_recurso,
                    tipo_recurso=tipo_recurso
                )
            else:
                return Response({"error": "Debes enviar id_favorito O usuario_id + id_recurso"},
                                status=status.HTTP_400_BAD_REQUEST)

            favorito.delete()
            return Response({"mensaje": "Eliminado de favoritos correctamente"}, status=status.HTTP_200_OK)

        except Favorito.DoesNotExist:
            return Response({"error": "El recurso no estaba en tus favoritos o ya fue eliminado"},
                            status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"Error interno: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)