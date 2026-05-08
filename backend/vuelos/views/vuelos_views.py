from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from apis_externas.services.amadeus_vuelos import buscar_vuelos

class VuelosView(APIView):
    """
        Buscar vuelos entre origen y destino.

        """
    permission_classes = [AllowAny]

    def get(self, request):
        origen = request.query_params.get("origen")
        destino = request.query_params.get("destino")
        fecha_salida = request.query_params.get("fecha_salida")

        if not all([origen, destino, fecha_salida]):
            return Response({"error": "Faltan parámetros"}, status=400)

        vuelos = buscar_vuelos(origen, destino, fecha_salida)
        return Response(vuelos)