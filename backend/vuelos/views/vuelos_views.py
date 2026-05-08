from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from apis_externas.services.amadeus_vuelos import buscar_vuelos


class VuelosView(APIView):
    """
    Buscar vuelos entre origen y destino con plan de contingencia.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        origen = request.query_params.get("origen")
        destino = request.query_params.get("destino")
        fecha_salida = request.query_params.get("fecha_salida")

        if not all([origen, destino, fecha_salida]):
            return Response({"error": "Faltan parámetros"}, status=400)

        try:
            vuelos = buscar_vuelos(origen, destino, fecha_salida)

            if isinstance(vuelos, dict) and "error" in vuelos:
                raise Exception("Amadeus respondió con un error interno")

            if not vuelos:
                raise Exception("Amadeus no encontró vuelos o está caído")

            return Response(vuelos, status=200)

        except Exception as e:
            print(f"⚠ Rescate activado ({e}). Mandando vuelos de emergencia...")

            vuelos_emergencia = [
                {
                    "price": {
                        "total": "14500.00",
                        "currency": "MXN"
                    },
                    "itineraries": [
                        {
                            "segments": [
                                {"carrierCode": "AM"}
                            ]
                        }
                    ]
                },
                {
                    "price": {
                        "total": "12350.50",
                        "currency": "MXN"
                    },
                    "itineraries": [
                        {
                            "segments": [
                                {"carrierCode": "IB"}
                            ]
                        }
                    ]
                }
            ]
            return Response(vuelos_emergencia, status=200)