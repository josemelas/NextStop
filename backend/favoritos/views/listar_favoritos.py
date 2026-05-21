from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Favorito
from vuelos.models import Vuelo

class ListarFavoritos(APIView):
    def get(self, request):
        id_usuario = request.query_params.get('usuario_id')

        if not id_usuario:
            return Response({"error": "Se requiere el usuario_id"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            favoritos = Favorito.objects.filter(id_usuario_id=id_usuario).order_by('-fecha_agregado')
            resultado = []

            for fav in favoritos:
                datos_favorito = {
                    "id_favorito": fav.id_favorito,
                    "tipo_recurso": fav.tipo_recurso,
                    "id_recurso": fav.id_recurso,
                    "fecha_agregado": fav.fecha_agregado.strftime("%d/%m/%Y %H:%M")
                }

                if fav.tipo_recurso == 'VUELO':
                    try:
                        vuelo = Vuelo.objects.get(api_id=fav.id_recurso)
                        datos_favorito["detalle"] = {
                            "aerolinea": vuelo.aerolinea,
                            "codigo_vuelo": vuelo.codigo_vuelo,
                            "origen": vuelo.origen,
                            "destino": vuelo.destino,
                            "precio_base": str(vuelo.precio_base),
                            "asientos_disponibles": vuelo.asientos_disponibles,
                            "fecha_salida": vuelo.fecha_salida.strftime("%Y-%m-%dT%H:%M:%S") if vuelo.fecha_salida else ""
                        }
                    except Vuelo.DoesNotExist:
                        datos_favorito["detalle"] = None
                        datos_favorito["error_recurso"] = "El vuelo ya no está disponible en el sistema"
                else:
                    datos_favorito["detalle"] = None

                resultado.append(datos_favorito)

            return Response(resultado, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": f"Error interno: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)