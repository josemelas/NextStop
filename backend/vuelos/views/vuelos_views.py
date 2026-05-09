from rest_framework.views import APIView
from rest_framework.response import Response
import uuid
from vuelos.models import Vuelo, Proveedorapi

class GeneradorVuelos(APIView):
    def get(self, request):
        origen = request.query_params.get("origen")
        destino = request.query_params.get("destino")
        fecha_salida = request.query_params.get("fecha_salida")

        vuelos_bd = Vuelo.objects.filter(
            origen=origen,
            destino=destino,
            fecha_salida__startswith=fecha_salida
        )

        if vuelos_bd.exists():
            return self.enviar_formato_frontend(vuelos_bd)

        plantillas = [
            {
                "id_proveedor": 1,
                "aerolinea": "Aeroméxico",
                "codigo": "AM",
                "sale": "08:30:00",
                "llega": "10:45:00",
                "precio": 4500.00
            },
            {
                "id_proveedor": 2,
                "aerolinea": "Iberia",
                "codigo": "IB",
                "sale": "14:15:00",
                "llega": "20:30:00",
                "precio": 1350.50
            },
            {
                "id_proveedor": 3,
                "aerolinea": "Volaris",
                "codigo": "VO",
                "sale": "14:15:00",
                "llega": "17:30:00",
                "precio": 6350.50
            }
        ]

        nuevos_vuelos = []

        for p in plantillas:
            vuelo_creado = Vuelo.objects.create(
                id_proveedor_id=p["id_proveedor"],
                api_id=uuid.uuid4().hex,
                aerolinea=p["aerolinea"],
                codigo_vuelo=f"{p['codigo']}-{uuid.uuid4().hex[:4].upper()}",
                origen=origen,
                destino=destino,
                fecha_salida=f"{fecha_salida} {p['sale']}",
                fecha_llegada=f"{fecha_salida} {p['llega']}",
                precio_base=p["precio"],
                asientos_disponibles=50
            )
            nuevos_vuelos.append(vuelo_creado)

        return self.enviar_formato_frontend(nuevos_vuelos)

    def enviar_formato_frontend(self, vuelos):
        respuesta = []
        for v in vuelos:
            respuesta.append({
                "id": v.api_id,
                "itineraries": [
                    {
                        "segments": [
                            {
                                "carrierCode": v.codigo_vuelo.split("-")[0],
                                "departure": {
                                    "iataCode": v.origen,
                                    "at": v.fecha_salida.strftime("%Y-%m-%dT%H:%M:%S")
                                },
                                "arrival": {
                                    "iataCode": v.destino,
                                    "at": v.fecha_llegada.strftime("%Y-%m-%dT%H:%M:%S")
                                }
                            }
                        ]
                    }
                ],
                "price": {
                    "total": str(v.precio_base),
                    "currency": "MXN"
                }
            })
        return Response(respuesta, status=200)