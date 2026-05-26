from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import IntegrityError
from ..models import Favorito

class AgregarFavorito(APIView):
    def post(self, request):
        id_usuario = request.data.get('usuario_id')
        tipo_recurso = request.data.get('tipo_recurso')
        id_recurso = request.data.get('id_recurso')

        if not all([id_usuario, tipo_recurso, id_recurso]):
            return Response({"error": "Faltan parámetros obligatorios"}, status=status.HTTP_400_BAD_REQUEST)

        if tipo_recurso not in ['VUELO', 'PAIS', 'DESTINO']:
            return Response({"error": "Tipo de recurso inválido"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            favorito = Favorito.objects.create(
                id_usuario_id=id_usuario,
                tipo_recurso=tipo_recurso,
                id_recurso=id_recurso
            )
            return Response({
                "mensaje": f"{tipo_recurso.capitalize()} agregado a favoritos con éxito",
                "id_favorito": favorito.id_favorito
            }, status=status.HTTP_201_CREATED)

        except IntegrityError:
            return Response({"error": "Este recurso ya está en tus favoritos"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"Error interno: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)