from rest_framework.views import APIView
from rest_framework.response import Response
import uuid
from vuelos.models import Vuelo, Proveedorapi
from datetime import datetime, date
import random


class GeneradorVuelos(APIView):
    def get(self, request):
        origen = request.query_params.get("origen")
        destino = request.query_params.get("destino")
        fecha_salida_str = request.query_params.get("fecha_salida")

        es_internacional = origen[:2] != destino[:2]

        multiplicador_distancia = 3.5 if es_internacional else 1.0
        horas_adicionales = random.randint(7, 12) if es_internacional else 0
        fecha_vuelo = datetime.strptime(fecha_salida_str, "%Y-%m-%d").date()
        dias_antelacion = (fecha_vuelo - date.today()).days

        if dias_antelacion < 7:
            multiplicador_tiempo = 1.5
        elif dias_antelacion > 30:
            multiplicador_tiempo = 0.9
        else:
            multiplicador_tiempo = 1.0
        vuelos_bd = Vuelo.objects.filter(origen=origen, destino=destino, fecha_salida__startswith=fecha_salida_str)
        if vuelos_bd.exists():
            return self.enviar_formato_frontend(vuelos_bd)

        plantillas = [
            {"id_proveedor": 1, "aerolinea": "Aeroméxico", "codigo": "AM", "sale": 8, "duracion": 2, "precio": 2500},
            {"id_proveedor": 2, "aerolinea": "Iberia", "codigo": "IB", "sale": 14, "duracion": 3, "precio": 2800},
            {"id_proveedor": 3, "aerolinea": "Volaris", "codigo": "VO", "sale": 19, "duracion": 2, "precio": 1800}
        ]

        nuevos_vuelos = []

        for p in plantillas:
            total_horas = p["duracion"] + horas_adicionales
            hora_llegada = (p["sale"] + total_horas) % 24
            precio_final = (p["precio"] * multiplicador_distancia * multiplicador_tiempo) + random.randint(-100, 500)

            vuelo_creado = Vuelo.objects.create(
                id_proveedor_id=p["id_proveedor"],
                api_id=uuid.uuid4().hex,
                aerolinea=p["aerolinea"],
                codigo_vuelo=f"{p['codigo']}-{uuid.uuid4().hex[:4].upper()}",
                origen=origen,
                destino=destino,
                fecha_salida=f"{fecha_salida_str} {p['sale']:02d}:00:00",
                fecha_llegada=f"{fecha_salida_str} {hora_llegada:02d}:00:00",
                precio_base=round(precio_final, 2),
                asientos_disponibles=random.randint(5, 60)
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