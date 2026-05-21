from rest_framework.views import APIView
from rest_framework.response import Response
import uuid
import random
from datetime import datetime, date
from django.utils.timezone import make_aware
from vuelos.models import Vuelo, Proveedorapi
from reservas.models import Reserva

class GeneradorVuelos(APIView):
    def get(self, request):
        origen = request.query_params.get("origen")
        destino = request.query_params.get("destino")
        fecha_salida_str = request.query_params.get("fecha_salida")

        if not all([origen, destino, fecha_salida_str]):
            return Response({"error": "Faltan parámetros"}, status=400)

        es_internacional = origen[:2] != destino[:2]
        multiplicador_distancia = 3.5 if es_internacional else 1.0
        horas_adicionales = random.randint(7, 12) if es_internacional else 0

        fecha_vuelo = datetime.strptime(fecha_salida_str, "%Y-%m-%d").date()
        dias_antelacion = (fecha_vuelo - date.today()).days
        multiplicador_tiempo = 1.5 if dias_antelacion < 7 else (0.9 if dias_antelacion > 30 else 1.0)

        vuelos_bd = Vuelo.objects.filter(origen=origen, destino=destino, fecha_salida__date=fecha_vuelo)
        if vuelos_bd.exists():
            return self.enviar_formato_frontend(vuelos_bd)

        proveedores = Proveedorapi.objects.filter(activo=True)

        if not proveedores.exists():
            return Response({"error": "No hay aerolíneas registradas para generar vuelos"}, status=404)

        nuevos_vuelos = []

        for prov in proveedores:
            hora_salida_random = random.randint(5, 22)
            duracion_base = random.randint(2, 4)

            total_horas = duracion_base + horas_adicionales
            hora_llegada_int = (hora_salida_random + total_horas) % 24

            obj_salida = datetime.strptime(f"{fecha_salida_str} {hora_salida_random:02d}:00:00", "%Y-%m-%d %H:%M:%S")
            obj_llegada = datetime.strptime(f"{fecha_salida_str} {hora_llegada_int:02d}:00:00", "%Y-%m-%d %H:%M:%S")

            precio_simulado = random.choice([1500, 2200, 3000, 4500])
            precio_final = (precio_simulado * multiplicador_distancia * multiplicador_tiempo) + random.randint(-200,
                                                                                                               600)

            vuelo_creado = Vuelo.objects.create(
                id_proveedor=prov,
                api_id=uuid.uuid4().hex,
                aerolinea=prov.nombre,
                codigo_vuelo=f"{prov.nombre[:2].upper()}-{uuid.uuid4().hex[:4].upper()}",
                origen=origen,
                destino=destino,
                fecha_salida=make_aware(obj_salida),
                fecha_llegada=make_aware(obj_llegada),
                precio_base=round(precio_final, 2),
                asientos_disponibles=random.randint(10, 75)
            )
            nuevos_vuelos.append(vuelo_creado)

        return self.enviar_formato_frontend(nuevos_vuelos)

    def enviar_formato_frontend(self, vuelos):
        respuesta = []
        for v in vuelos:
            reservas_del_vuelo = Reserva.objects.filter(id_vuelo=v)
            lista_asientos_ocupados = []
            at_salida = v.fecha_salida.strftime("%Y-%m-%dT%H:%M:%S") if hasattr(v.fecha_salida, 'strftime') else str(
                v.fecha_salida).replace(" ", "T")
            at_llegada = v.fecha_llegada.strftime("%Y-%m-%dT%H:%M:%S") if hasattr(v.fecha_llegada, 'strftime') else str(
                v.fecha_llegada).replace(" ", "T")
            for r in reservas_del_vuelo:
                if r.asiento_asignado:
                    asientos = [asiento.strip() for asiento in r.asiento_asignado.split(',')]
                    lista_asientos_ocupados.extend(asientos)


            respuesta.append({
                "id": v.api_id,
                "numberOfBookableSeats": v.asientos_disponibles,
                "occupiedSeats": lista_asientos_ocupados,
                "itineraries": [
                    {
                        "segments": [
                            {
                                "carrierCode": v.codigo_vuelo.split("-")[0],
                                "departure": {
                                    "iataCode": v.origen,
                                    "at": at_salida
                                },
                                "arrival": {
                                    "iataCode": v.destino,
                                    "at": at_llegada
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